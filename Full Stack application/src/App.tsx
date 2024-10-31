import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import StockForm from './components/StockForm';
import StockChart from './components/StockChart';
import { predictStock, StockData } from './services/api';

function App() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePrediction = async (symbol: string, days: number, interval: string) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await predictStock({ symbol, days, interval });
      setStockData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prediction data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">StockAI Predictor</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <StockForm onSubmit={handlePrediction} isLoading={loading} />
          </div>
          
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center h-[400px] bg-white rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[400px] bg-white rounded-lg shadow-lg">
                <p className="text-red-600">{error}</p>
              </div>
            ) : stockData.length > 0 ? (
              <StockChart data={stockData} />
            ) : (
              <div className="flex items-center justify-center h-[400px] bg-white rounded-lg shadow-lg">
                <p className="text-gray-500">Enter a stock symbol to see predictions</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">1. Enter Stock Symbol</h3>
              <p className="text-gray-600">Input any valid stock symbol (e.g., AAPL, GOOGL) to analyze.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">2. Choose Parameters</h3>
              <p className="text-gray-600">Select prediction timeframe and data interval for analysis.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">3. AI Prediction</h3>
              <p className="text-gray-600">Our LSTM model analyzes historical data to predict future prices.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;