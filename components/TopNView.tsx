// components/TopNView.tsx
interface Props {
  data: any;
}

interface TopItem {
  name: string;
  cost: number;
}

export default function TopNView({ data }: Props) {
  const groups = data?.costData?.ResultsByTime?.[0]?.Groups || [];
  const topServices: TopItem[] = groups
    ?.sort((a: any, b: any) => parseFloat(b.Metrics?.BlendedCost?.Amount || '0') - parseFloat(a.Metrics?.BlendedCost?.Amount || '0'))
    .slice(0, 5)
    .map((g: any) => ({ name: g.Keys[0], cost: parseFloat(g.Metrics?.BlendedCost?.Amount || '0') })) || [];

  return (
    <div className="bg-white p-4 rounded-lg shadow col-span-full">
      <h3 className="font-semibold mb-2">Top 5 Services by Cost</h3>
      {topServices.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Service</th>
              <th className="border p-2">Cost ($)</th>
            </tr>
          </thead>
          <tbody>
            {topServices.map((item: TopItem, i: number) => (
              <tr key={i}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">${item.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}