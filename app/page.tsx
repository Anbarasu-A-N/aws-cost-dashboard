// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { subDays } from 'date-fns';
import TimelineControls from '../components/TimelineControls';
import Filters from '../components/Filters';
import CostMonitor from '../components/CostMonitor';
import BudgetStatus from '../components/BudgetStatus';
import CostBreakdown from '../components/CostBreakdown';
import TrendGraph from '../components/TrendGraph';
import TopNView from '../components/TopNView';
import SearchBar from '../components/SearchBar';
import ExportButton from '../components/ExportButton';
import DrillDown from '../components/DrillDown';
import { Timeline, FilterOptions } from '../lib/types';

export default function Dashboard() {
  // Use recent dates within 13 months to avoid validation errors
  const recentDate = new Date('2025-09-03');
  const [timeline, setTimeline] = useState<Timeline>({ label: 'Last 30 days', start: subDays(recentDate, 30), end: recentDate });
  const [filters, setFilters] = useState<FilterOptions>({ services: [], regions: [], subcategories: [], breakdownByRegion: false });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [drillDown, setDrillDown] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [timeline, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cost-data?start=${timeline.start.toISOString()}&end=${timeline.end.toISOString()}&groupBy=SERVICE&filters=${JSON.stringify(filters)}`);
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      const result = await res.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setData(result);
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      setData({ error: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    // TODO: Update filters based on search query
    console.log('Search query:', query);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (data?.error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {data.error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">AWS Cost Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SearchBar onSearch={handleSearch} />
        <TimelineControls onChange={setTimeline} />
        <Filters onChange={setFilters} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <CostMonitor data={data} />
        <BudgetStatus data={data} />
        <ExportButton data={data} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CostBreakdown data={data} onDrillDown={setDrillDown} />
        <TrendGraph data={data} />
      </div>
      <TopNView data={data} />
      {drillDown && <DrillDown category={drillDown} onClose={() => setDrillDown(null)} />}
    </div>
  );
}