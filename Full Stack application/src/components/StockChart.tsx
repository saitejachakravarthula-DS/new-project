import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StockChartProps {
  data: Array<{
    date: string;
    actual: number;
    predicted?: number;
  }>;
}

export default function StockChart({ data }: StockChartProps) {
  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" stroke="#2563eb" name="Actual Price" />
          {data[0]?.predicted && (
            <Line type="monotone" dataKey="predicted" stroke="#dc2626" name="Predicted Price" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}