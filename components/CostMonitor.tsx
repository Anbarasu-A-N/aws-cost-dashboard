// components/CostMonitor.tsx
interface Props {
  data: any;
}

export default function CostMonitor({ data }: Props) {
  const groups = data?.costData?.ResultsByTime?.[0]?.Groups || [];
  const currentCost = groups.reduce((sum: number, g: any) => sum + parseFloat(g?.Metrics?.BlendedCost?.Amount || '0'), 0);
  const forecast = parseFloat(data?.forecast?.Total?.Amount || '0');

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Cost Monitor</h3>
      <p className="text-2xl font-bold">${currentCost.toFixed(2)}</p>
      <p className="text-green-600">Forecast: ${forecast.toFixed(2)}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(currentCost / (forecast || 1) * 100).toFixed(0)}%` }}></div>
      </div>
    </div>
  );
}