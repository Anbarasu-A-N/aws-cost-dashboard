'use client';

interface Props {
  category: string;
  onClose: () => void;
}

export default function DrillDown({ category, onClose }: Props) {
  // Fetch sub-data here, e.g., via API with groupBy='INSTANCE_TYPE'
  const subData = [  // Placeholder
    { subcategory: 'On-Demand', cost: 100 },
    { subcategory: 'Reserved', cost: 50 },
    { subcategory: 'Spot', cost: 20 },
  ].filter((item) => item.subcategory.includes(category.toLowerCase())); // Mock filter

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="font-semibold mb-2">Drill Down: {category}</h3>
        <ul className="space-y-2">
          {subData.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>{item.subcategory}</span>
              <span>${item.cost}</span>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
}