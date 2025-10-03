// components/SearchBar.tsx
'use client';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <input
        type="text"
        placeholder="Search services or usage types..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}