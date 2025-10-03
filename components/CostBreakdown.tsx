// components/CostBreakdown.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useState } from 'react';

interface Props {
  data: any;
  onDrillDown: (category: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function CostBreakdown({ data, onDrillDown }: Props) {
  const [view, setView] = useState('service'); // 'service', 'region', etc.

  const groups = data?.costData?.ResultsByTime?.[0]?.Groups || [];
  const chartData = groups.map((g: any) => ({
    name: g.Keys[0],
    value: parseFloat(g.Metrics?.BlendedCost?.Amount || '0'),
  })).filter((d: any) => d.value > 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Cost Breakdown ({view})</h3>
      <button onClick={() => setView(view === 'service' ? 'region' : 'service')} className="mb-2 px-2 py-1 bg-gray-200 rounded">
        Toggle {view === 'service' ? 'Region' : 'Service'}
      </button>
      <PieChart width={400} height={300}>
        <Pie data={chartData} cx={120} cy={150} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" onClick={(e) => onDrillDown(e.name)}>
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}