// app/api/cost-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCostData, getCostForecast, getAvailableFilters } from '@/lib/fetch-cost-data';
import { Dimension } from '@aws-sdk/client-cost-explorer';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const groupByStr = searchParams.get('groupBy') || 'SERVICE';
  const groupBy: Dimension = groupByStr as Dimension;
  const filtersStr = searchParams.get('filters');
  const filters = filtersStr ? JSON.parse(filtersStr) : {};

  if (!start || !end) {
    return NextResponse.json({ error: 'Missing start/end dates' }, { status: 400 });
  }

  const timePeriod = { start: start!, end: end! };

  try {
    // Mock for testing (commented out to use real AWS calls)
    /*
    return NextResponse.json({
      costData: {
        timePeriod,
        groups: [
          { keys: ['Amazon EC2'], metrics: { blendedCost: { amount: '150.00', unit: 'USD' } } },
          { keys: ['Amazon S3'], metrics: { blendedCost: { amount: '75.50', unit: 'USD' } } },
          { keys: ['AWS Lambda'], metrics: { blendedCost: { amount: '20.00', unit: 'USD' } } },
        ],
      },
      forecast: { total: { amount: '300.00', unit: 'USD' } },
      availableFilters: { services: ['Amazon EC2', 'Amazon S3', 'AWS Lambda'], regions: ['us-east-1', 'ap-south-1'] },
    });
    */

    const costData = await getCostData(timePeriod, groupBy, filters);
    const forecast = await getCostForecast(timePeriod);
    const availableFilters = await getAvailableFilters();

    return NextResponse.json({ costData, forecast, availableFilters });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}