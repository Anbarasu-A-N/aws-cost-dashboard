// components/Filters.tsx
'use client';

import { useState, useEffect } from 'react';
import { FilterOptions } from '../lib/types';

interface Props {
  onChange: (filters: FilterOptions) => void;
}

export default function Filters({ onChange }: Props) {
  const [services, setServices] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selected, setSelected] = useState<FilterOptions>({ services: [], regions: [], subcategories: [], breakdownByRegion: false });

  useEffect(() => {
    // Fetch available filters from API with error handling
    fetch('/api/cost-data?start=2024-01-01&end=2024-12-31') // Past dates for historical data
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setServices(data.availableFilters?.services || []);
        setRegions(data.availableFilters?.regions || []);
      })
      .catch((error) => {
        console.error('Failed to fetch filters:', error);
        setServices([]); // Fallback to empty
        setRegions([]);
      });
  }, []);

  const handleChange = (key: keyof FilterOptions, value: any) => {
    const newSelected = { ...selected, [key]: value };
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Filters</h3>
      <div className="space-y-2 text-sm">
        <select multiple value={selected.services} onChange={(e) => handleChange('services', Array.from(e.target.selectedOptions, (o) => o.value))} className="w-full border p-2 rounded">
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select multiple value={selected.regions} onChange={(e) => handleChange('regions', Array.from(e.target.selectedOptions, (o) => o.value))} className="w-full border p-2 rounded">
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <label className="flex items-center">
          <input type="checkbox" checked={selected.breakdownByRegion} onChange={(e) => handleChange('breakdownByRegion', e.target.checked)} className="mr-2" />
          Breakdown by Region
        </label>
      </div>
    </div>
  );
}