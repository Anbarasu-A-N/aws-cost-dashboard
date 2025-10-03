// lib/fetch-cost-data.ts
import { GetCostAndUsageCommand, GetCostForecastCommand, GetDimensionValuesCommand, Dimension } from '@aws-sdk/client-cost-explorer';
import client from './aws-client';
import { CostData, ForecastData } from './types';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, startOfYear, format, addMonths } from 'date-fns';

export async function getCostData(timePeriod: { start: string; end: string }, groupBy: Dimension = 'SERVICE', filters?: any): Promise<CostData> {
  const startDate = new Date(timePeriod.start);
  const endDate = new Date(timePeriod.end);
  // For MONTHLY granularity, Start/End must align with full months: Start=1st of start month, End=1st of month after end month
  const adjustedStart = format(startOfMonth(startDate), 'yyyy-MM-dd');
  const adjustedEndMonth = addMonths(endDate, 1);
  const adjustedEnd = format(startOfMonth(adjustedEndMonth), 'yyyy-MM-dd');

  // Build valid Filter only if there are actual filter values
  let filter: any = undefined;
  if (filters && (filters.services?.length > 0 || filters.regions?.length > 0 || filters.subcategories?.length > 0)) {
    const expressions: any[] = [];
    if (filters.services?.length > 0) {
      expressions.push({
        Dimensions: {
          Key: 'SERVICE',
          Values: filters.services
        }
      });
    }
    if (filters.regions?.length > 0) {
      expressions.push({
        Dimensions: {
          Key: 'REGION',
          Values: filters.regions
        }
      });
    }
    if (filters.subcategories?.length > 0) {
      expressions.push({
        Dimensions: {
          Key: 'USAGE_TYPE', // Adjust as needed for subcategories
          Values: filters.subcategories
        }
      });
    }
    if (expressions.length > 1) {
      filter = { And: expressions };
    } else if (expressions.length === 1) {
      filter = expressions[0];
    }
  }

  const command = new GetCostAndUsageCommand({
    TimePeriod: { Start: adjustedStart, End: adjustedEnd },
    Granularity: 'MONTHLY',
    Metrics: ['BlendedCost'],
    GroupBy: [{ Type: 'DIMENSION', Key: groupBy }],
    ...(filter && { Filter: filter }),
  });
  const response = await client.send(command);
  // Transform to match types exactly
  return {
    ResultsByTime: response.ResultsByTime?.map((rt) => ({
      TimePeriod: rt.TimePeriod || { Start: '', End: '' },
      Groups: rt.Groups?.map((g) => ({
        Keys: g.Keys || [],
        Metrics: { BlendedCost: g.Metrics?.BlendedCost || { Amount: '0', Unit: 'USD' } },
      })) || [],
      Total: rt.Total ? { BlendedCost: rt.Total.BlendedCost || { Amount: '0', Unit: 'USD' } } : undefined,
    })) || [],
  } as CostData;
}

export async function getCostForecast(timePeriod: { start: string; end: string }): Promise<ForecastData> {
  // For forecast, start must be today; ignore input and use current month forecast to next month
  const now = new Date();
  const forecastStart = format(now, 'yyyy-MM-dd');
  const forecastEnd = format(endOfMonth(addMonths(now, 1)), 'yyyy-MM-dd');
  const command = new GetCostForecastCommand({
    TimePeriod: { Start: forecastStart, End: forecastEnd },
    Metric: 'BLENDED_COST',
    Granularity: 'MONTHLY',
  });
  const response = await client.send(command);
  // Transform to match types exactly
  const timePeriodFallback = { Start: forecastStart, End: forecastEnd };
  return {
    Total: response.Total || { Amount: '0', Unit: 'USD' },
    TimePeriod: response.ForecastResultsByTime?.[0]?.TimePeriod || timePeriodFallback,
  } as ForecastData;
}

export async function getDimensionValues(dimension: Dimension): Promise<string[]> {
  const now = new Date();
  const command = new GetDimensionValuesCommand({
    TimePeriod: { Start: format(startOfMonth(now), 'yyyy-MM-dd'), End: format(endOfDay(now), 'yyyy-MM-dd') },
    Dimension: dimension,
    SearchString: '',
  });
  const response = await client.send(command);
  return response.DimensionValues?.map((v) => v.Value || '') || [];
}

// Example for regions, services
export async function getAvailableFilters(): Promise<{ services: string[]; regions: string[] }> {
  const services = await getDimensionValues('SERVICE');
  const regions = await getDimensionValues('REGION');
  return { services, regions };
}