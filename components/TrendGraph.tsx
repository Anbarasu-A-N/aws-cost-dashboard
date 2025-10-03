// components/TrendGraph.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: any;
}

export default function TrendGraph({ data }: Props) {
  const resultsByTime = data?.costData?.ResultsByTime || [];
  const trendData = resultsByTime.flatMap((rt: any) =>
    rt.Groups.map((g: any, i: number) => ({
      date: rt.TimePeriod.Start,
      cost: parseFloat(g.Metrics?.BlendedCost?.Amount || '0'),
    }))
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow h-96">
      <h3 className="font-semibold mb-2">Cost Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cost" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}