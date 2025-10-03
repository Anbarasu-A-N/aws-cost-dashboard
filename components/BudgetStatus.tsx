// components/BudgetStatus.tsx
interface Props {
  data: any;
}

export default function BudgetStatus({ data }: Props) {
  const groups = data?.costData?.ResultsByTime?.[0]?.Groups || [];
  const totalCost = groups.reduce((sum: number, g: any) => {
    const amount = g?.Metrics?.BlendedCost?.Amount;
    return sum + (amount ? parseFloat(amount) : 0);
  }, 0);
  const budget = 1000; // Placeholder; fetch from AWS Budgets
  const used = (totalCost / budget * 100);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Budget Status</h3>
      <p className="text-xl">Used: {used.toFixed(1)}%</p>
      <p>Remaining: ${(budget - totalCost).toFixed(2)}</p>
      {used > 80 && <div className="bg-red-100 p-2 mt-2 rounded">Alert: Nearing threshold!</div>}
    </div>
  );
}