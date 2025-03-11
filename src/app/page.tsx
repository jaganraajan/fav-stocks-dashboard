"use client"

import { Link } from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  price: string;
  volume: string;
}

const companyNames: { [symbol: string]: string } = {
  AAPL: 'Apple Inc.',
  NKE: 'Nike Inc.',
  BA: 'Boeing Co.',
  TSLA: 'Tesla Inc.',
  GOOG: 'Alphabet Inc.',
  NFLX: 'Netflix Inc.',
  LMT: 'Lockheed Martin Corp.',
  AMZN: 'Amazon.com Inc.',
  NVDA: 'NVIDIA Corp.',
  MSFT: 'Microsoft Corp.',
};

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const formatVolume = (volume: number) => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)} Billion`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)} Million`;
  }
  return volume.toString();
};

export default function Home() {
  const [stockData, setStockData] = useState<{ [symbol: string]: StockData }>({});
  const date = new Date();
  date.setDate(date.getDate()-4);
  const stockDate =  date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');


  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      date.setDate(date.getDate()-4);

      try {
          const response = await fetch(`/api/getStockData?date=${stockDate}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const results: { [symbol: string]: StockData } = {};

          data.forEach((item: StockData) => {
            results[item.symbol] = item;
          });

          setStockData(results);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchData();
  }, []);


  const rows = Object.entries(stockData).map(([symbol, data]) => ({
    key: symbol,
    name: companyNames[symbol],
    symbol: symbol,
    price: formatPrice(Number(data.price)),
    volume: formatVolume(Number(data.volume)),
  }));

  const columns = [
    { key: "name", label: "Company Name" },
    { key: "symbol", label: "Symbol" },
    { key: "price", label: "Share Price (USD)" },
    { key: "volume", label: "Volume" },
  ];


  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">Favourite Stocks Dashboard</h1>
            
            <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex justify-between items-center">
                <h2 className="px-4 text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
                Stocks
                </h2>
                <div className="px-4 flex items-center space-x-2">
                  <span className="text-m text-gray-600 dark:text-gray-200"><strong>Date:</strong></span>
                  <span className="text-m text-gray-600 dark:text-gray-200">{stockDate}</span>
                </div>
            </CardHeader>
            <CardBody className="p-6 pt-0 text-gray-800 dark:text-gray-100">
          <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-xs">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {columns.map((column) => (
                  <th key={column.key} className="p-3 px-4 border-b border-gray-200 dark:border-gray-700">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {rows.map((row) => (
                <tr key={row.key}>
                  {columns.map((column) => (
                    <td key={column.key} className="p-3 text-gray-800 dark:text-gray-200 px-4 border-b border-gray-200 dark:border-gray-700">
                      {column.key === 'symbol' ? (
                        <Link href={`/details/${row.symbol}`}>
                          {row[column.key as keyof StockData]}
                        </Link>
                      ) : (
                        row[column.key as keyof StockData]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
            </Card>
      </div>
  );
}
