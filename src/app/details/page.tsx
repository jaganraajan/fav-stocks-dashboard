"use client"

import { useState, useEffect } from 'react';

interface Address {
    address1: string;
    city: string;
    state: string;
    postal_code: string;
  }
  
  interface Branding {
    logo_url: string;
    icon_url: string;
  }
  
  interface StockDetails {
    ticker: string;
    name: string;
    market: string;
    locale: string;
    primary_exchange: string;
    type: string;
    active: boolean;
    currency_name: string;
    cik: string;
    composite_figi: string;
    share_class_figi: string;
    market_cap: number;
    phone_number: string;
    address: Address;
    description: string;
    sic_code: string;
    sic_description: string;
    ticker_root: string;
    homepage_url: string;
    total_employees: number;
    list_date: string;
    branding: Branding;
    share_class_shares_outstanding: number;
    weighted_shares_outstanding: number;
    round_lot: number;
  }
  
  interface StockDataResponse {
    request_id: string;
    results: StockDetails;
    status: string;
  }

  

export default function Page() {
  const [stockDataResponse, setStockDataResponse] = useState<StockDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY; // Store API key securely (see below)
      const date = '2025-02-05'; // Or make this dynamic
      const symbol = 'TSLA'; // Or make this dynamic

      try {
        const response = await fetch(
          `https://api.polygon.io/v3/reference/tickers/${symbol}?data=${date}&apiKey=${apiKey}`); // Adjust API endpoint

        if (!response.ok) {
          const errorData = await response.json(); // Try to get error details from the API
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data: StockDataResponse = await response.json();
        setStockDataResponse(data);
      } catch (err: any) { // Catch potential errors (e.g., network issues, API errors)
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stockDataResponse) {
    return <div>No data available.</div>; // Handle the case where data is still null after loading
  }

  return (
    <div>
      <h1>{stockDataResponse.results.name}</h1>
      <p>Description: {stockDataResponse.results.description}</p>
    </div>
  );
};