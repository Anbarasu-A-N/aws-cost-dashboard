// lib/types.ts
export interface CostData {
  ResultsByTime?: Array<{
    TimePeriod?: { Start: string; End: string };
    Groups?: Array<{
      Keys: string[];
      Metrics: { BlendedCost?: { Amount: string; Unit: string } };
    }>;
    Total?: { BlendedCost?: { Amount: string; Unit: string } };
  }>;
}

export interface ForecastData {
  Total?: { Amount: string; Unit: string };
  TimePeriod?: { Start: string; End: string };
}

export interface FilterOptions {
  services: string[];
  regions: string[];
  subcategories: string[];
  breakdownByRegion: boolean;
}

export interface Timeline {
  label: string;
  start: Date;
  end: Date;
}