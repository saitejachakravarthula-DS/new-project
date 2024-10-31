import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface StockFormProps {
  onSubmit: (symbol: string, days: number, interval: string) => void;
  isLoading: boolean;
}

export default function StockForm({ onSubmit, isLoading }: StockFormProps) {
  const [symbol, setSymbol] = useState('');
  const [days, setDays] = useState(7);
  const [interval, setInterval] = useState('1d');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol) {
      onSubmit(symbol.toUpperCase(), days, interval);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
          Stock Symbol
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="block w-full pr-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            placeholder="AAPL"
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="days" className="block text-sm font-medium text-gray-700">
          Prediction Days
        </label>
        <select
          id="days"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
        >
          <option value={7}>7 Days</option>
          <option value={14}>14 Days</option>
          <option value={30}>30 Days</option>
        </select>
      </div>

      <div>
        <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
          Data Interval
        </label>
        <select
          id="interval"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
        >
          <option value="1d">Daily</option>
          <option value="1wk">Weekly</option>
          <option value="1mo">Monthly</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Predicting...' : 'Predict Stock Price'}
      </button>
    </form>
  );
}