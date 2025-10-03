'use client';

import { useState } from 'react';
import { subDays, startOfMonth, endOfMonth, startOfYear, startOfDay, endOfDay, format } from 'date-fns';
import { Timeline } from '../lib/types';

interface Props {
  onChange: (timeline: Timeline) => void;
}

const now = new Date();
const predefinedTimelines: Timeline[] = [
  { label: 'Today', start: startOfDay(now), end: endOfDay(now) },
  { label: 'Last 7 days', start: subDays(now, 7), end: now },
  { label: 'Last 30 days', start: subDays(now, 30), end: now },
  { label: 'This Month', start: startOfMonth(now), end: endOfDay(now) },
  { label: 'Last Month', start: startOfMonth(subDays(now, 30)), end: endOfMonth(subDays(now, 30)) },
  { label: 'Year-to-Date', start: startOfYear(now), end: endOfDay(now) },
];

export default function TimelineControls({ onChange }: Props) {
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handlePredefined = (tl: Timeline) => {
    onChange(tl);
  };

  const handleCustom = () => {
    onChange({ label: 'Custom', start: new Date(customStart), end: new Date(customEnd) });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Timeline</h3>
      <div className="space-y-2">
        {predefinedTimelines.map((tl) => (
          <button key={tl.label} onClick={() => handlePredefined(tl)} className="block w-full text-left text-sm hover:bg-gray-100 p-1 rounded">
            {tl.label}
          </button>
        ))}
        <div className="flex space-x-2 mt-4">
          <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="border p-1 rounded" />
          <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="border p-1 rounded" />
          <button onClick={handleCustom} className="bg-blue-500 text-white px-2 py-1 rounded">Apply Custom</button>
        </div>
      </div>
    </div>
  );
}