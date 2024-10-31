from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import numpy as np
from datetime import datetime, timedelta
import yfinance as yf
from typing import List, Optional
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Keras model
model = tf.keras.models.load_model('model.keras')

# Initialize scaler
scaler = MinMaxScaler(feature_range=(0, 1))

class PredictionRequest(BaseModel):
    symbol: str
    days: int
    interval: Optional[str] = "1d"

class StockData(BaseModel):
    date: str
    actual: float
    predicted: Optional[float] = None

def prepare_sequence_data(data: np.ndarray, sequence_length: int = 60) -> np.ndarray:
    X = []
    for i in range(len(data) - sequence_length):
        X.append(data[i:(i + sequence_length)])
    return np.array(X)

def make_predictions(historical_data: np.ndarray, days_to_predict: int) -> np.ndarray:
    # Scale the data
    scaled_data = scaler.fit_transform(historical_data.reshape(-1, 1))
    
    # Prepare the last sequence for prediction
    last_sequence = scaled_data[-60:]  # Assuming sequence length of 60
    current_sequence = last_sequence.reshape(1, 60, 1)
    
    predictions = []
    for _ in range(days_to_predict):
        # Predict the next value
        next_pred = model.predict(current_sequence, verbose=0)
        predictions.append(next_pred[0, 0])
        
        # Update sequence for next prediction
        current_sequence = np.roll(current_sequence, -1)
        current_sequence[0, -1, 0] = next_pred[0, 0]
    
    # Inverse transform predictions
    predictions = np.array(predictions).reshape(-1, 1)
    predictions = scaler.inverse_transform(predictions)
    
    return predictions.flatten()

@app.post("/predict", response_model=List[StockData])
async def predict_stock(request: PredictionRequest):
    try:
        # Fetch historical data
        stock = yf.Ticker(request.symbol)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=request.days * 2 + 60)  # Extra days for sequence
        
        df = stock.history(start=start_date, end=end_date, interval=request.interval)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="No data found for this stock symbol")

        # Prepare data for prediction
        historical_prices = df['Close'].values
        
        # Make predictions
        predictions = make_predictions(historical_prices, request.days)
        
        # Prepare response data
        response_data = []
        
        # Add historical data
        for date, row in df.iterrows():
            response_data.append(StockData(
                date=date.strftime("%Y-%m-%d"),
                actual=float(row['Close']),
                predicted=None
            ))
        
        # Add predictions
        last_date = df.index[-1]
        for i in range(request.days):
            next_date = last_date + timedelta(days=i+1)
            if request.interval == '1wk':
                next_date += timedelta(days=7*i)
            elif request.interval == '1mo':
                next_date = last_date + pd.DateOffset(months=i+1)
                
            response_data.append(StockData(
                date=next_date.strftime("%Y-%m-%d"),
                actual=None,
                predicted=float(predictions[i])
            ))
        
        return response_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)