import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface StockPredictionRequest {
  symbol: string;
  days: number;
  interval?: string;
}

export interface StockData {
  date: string;
  actual: number;
  predicted?: number;
}

export const predictStock = async (params: StockPredictionRequest): Promise<StockData[]> => {
  try {
    const response = await axios.post(`${API_URL}/predict`, params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch prediction');
    }
    throw error;
  }
};