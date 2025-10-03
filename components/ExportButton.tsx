// components/ExportButton.tsx
'use client';

import Papa from 'papaparse';
import jsPDF from 'jspdf';

interface Props {
  data: any;
}

type Row = [string, string];

export default function ExportButton({ data }: Props) {
  const groups = data?.costData?.ResultsByTime?.[0]?.Groups || [];
  const rows: Row[] = groups.map((g: any) => [g.Keys[0], g.Metrics?.BlendedCost?.Amount || '0']);

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'costs.csv';
      a.click();
    } else {
      const doc = new jsPDF();
      doc.text('AWS Costs Report', 10, 10);
      rows.forEach(([name, cost]: Row, i: number) => doc.text(`${name}: $${cost}`, 10, 20 + i * 10));
      doc.save('costs.pdf');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Export</h3>
      <button onClick={() => handleExport('csv')} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">CSV</button>
      <button onClick={() => handleExport('pdf')} className="bg-red-500 text-white px-2 py-1 rounded">PDF</button>
    </div>
  );
}