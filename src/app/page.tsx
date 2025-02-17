"use client"

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Link,
} from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useState, useEffect } from 'react';
//stock data

//"status":"OK","from":"2025-02-07","symbol":"TSLA","open":370.19,"high":380.5459,
// "low":360.34,"close":361.62,"volume":6.9940474e+07,"afterHours":357.36,"preMarket":370.5}

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

export default function Home() {
  const [stockData, setStockData] = useState<{ [symbol: string]: StockData }>({});
//  const [stockDate, setStockDate] = useState<string | null>(null);

const date = new Date();
date.setDate(date.getDate()-3);
const stockDate =  date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');


  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      date.setDate(date.getDate()-3);
      // setStockDate(date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0'));
      
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
      const symbols = ['AAPL', 'MSFT', 'NKE', 'BA', 'TSLA']; // Apple, Microsoft, Nike, Boeing, Tesla
      // const stockDate = date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
      ;
      try {
        const results: { [symbol: string]: StockData } = {};

        for (const symbol of symbols) {
          const response = await fetch(
            `https://api.polygon.io/v1/open-close/${symbol}/${stockDate}?adjusted=true&apiKey=${apiKey}`
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }

          const data: StockData = await response.json();
          results[symbol] = data;
        }

        setStockData(results);
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  console.log(stockData);

  const rows = Object.entries(stockData).map(([symbol, data]) => ({
    key: symbol,
    symbol: symbol,
    price: data.close,
    volume: data.volume,
  }));

  const columns = [
    { key: "symbol", label: "Symbol" },
    { key: "price", label: "Share Price($)" },
    { key: "volume", label: "Volume" },
  ];


  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">Favourite Stocks Dashboard</h1>
            
            <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
                Stocks
                </h2>
                <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-200">Date:</span>
                <span className="text-sm text-gray-600 dark:text-gray-200">{stockDate}</span>
                </div>
            </CardHeader>
            <CardBody>
                <Table 
                    aria-label="Wallets table"
                    classNames={{
                    base: "max-w-full",
                    table: "min-w-full border-collapse border border-gray-200 dark:border-gray-700",
                    thead: "bg-gray-100 dark:bg-gray-700",
                    tbody: "bg-white dark:bg-gray-900",
                    tr: "border-b border-gray-200 dark:border-gray-700",
                    th: "text-left p-3 text-gray-800 dark:text-gray-200 font-semibold",
                    td: "p-3 text-gray-800 dark:text-gray-200",
                    }}
                >
                    <TableHeader columns={columns}>
                {(column) => <TableColumn  key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={rows}>
                {(item) => (
                    <TableRow key={item.key}>
                    {(columnKey) => <TableCell key={columnKey}>
                      {columnKey === 'symbol' ? (
                        <Link href={`/details/${item.symbol}`}>
                          {getKeyValue(item, columnKey)}
                        </Link>
                      ) : (
                        getKeyValue(item, columnKey)
                      )}
                    </TableCell>}
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardBody>
            </Card>
      </div>
  );
}
