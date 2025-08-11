import { NextResponse } from 'next/server';

// This would normally fetch from a real API like exchangerate-api.com or currencyapi.com
// For demo, we'll simulate live rates with slight variations
let lastRateUpdate = 0;
let cachedRate = 17.0; // Base rate: 1 USD = 17 MXN

async function fetchLiveExchangeRate(): Promise<number> {
  const now = Date.now();
  
  // Update rate every hour (3600000ms)
  if (now - lastRateUpdate > 3600000) {
    try {
      // In production, replace with real API call:
      // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      // const data = await response.json();
      // cachedRate = data.rates.MXN;
      
      // For demo: simulate slight rate fluctuations (±2% from base rate of 17)
      const fluctuation = (Math.random() - 0.5) * 0.68; // ±2% of 17 = ±0.34
      cachedRate = 17 + fluctuation;
      lastRateUpdate = now;
      
      console.log(`Exchange rate updated: 1 USD = ${cachedRate.toFixed(4)} MXN`);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      // Keep cached rate if API fails
    }
  }
  
  return cachedRate;
}

export async function GET() {
  try {
    const rate = await fetchLiveExchangeRate();
    
    return NextResponse.json({
      rate,
      lastUpdated: lastRateUpdate,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rate' },
      { status: 500 }
    );
  }
}