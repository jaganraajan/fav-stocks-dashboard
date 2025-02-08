"use client"

import { useState, useEffect } from 'react';

interface StockData {
  status: string;
  from: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  afterHours: number;
  preMarket: number;
}

export default function Page() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY; // Store API key securely (see below)
      const date = '2025-02-05'; // Or make this dynamic
      const symbol = 'TSLA'; // Or make this dynamic

      try {
        const response = await fetch(
          `https://api.polygon.io/v1/open-close/${symbol}/${date}?adjusted=true&apiKey=${apiKey}`
        );

        if (!response.ok) {
          const errorData = await response.json(); // Try to get error details from the API
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data: StockData = await response.json();
        setStockData(data);
        /* eslint-disable @typescript-eslint/no-explicit-any */
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

  if (!stockData) {
    return <div>No data available.</div>; // Handle the case where data is still null after loading
  }

  return (
    <div>
      <h1>{stockData.symbol} - {stockData.from}</h1>
      <p>Open: {stockData.open}</p>
      <p>High: {stockData.high}</p>
      <p>Low: {stockData.low}</p>
      <p>Close: {stockData.close}</p>
      <p>Volume: {stockData.volume}</p>
      <p>After Hours: {stockData.afterHours}</p>
      <p>Pre Market: {stockData.preMarket}</p>
      {/* ... display other data as needed */}
    </div>
  );
};

// export default Dashboard;
  
//   const rows = [
//     {
//       key: "1",
//       name: "Tony Reichert",
//       role: "CEO",
//       status: "Active",
//     },
//     {
//       key: "2",
//       name: "Zoey Lang",
//       role: "Technical Lead",
//       status: "Paused",
//     },
//     {
//       key: "3",
//       name: "Jane Fisher",
//       role: "Senior Developer",
//       status: "Active",
//     },
//     {
//       key: "4",
//       name: "William Howard",
//       role: "Community Manager",
//       status: "Vacation",
//     },
//   ];
  
//   const columns = [
//     {
//       key: "name",
//       label: "NAME",
//     },
//     {
//       key: "role",
//       label: "ROLE",
//     },
//     {
//       key: "status",
//       label: "STATUS",
//     },
//   ];
  