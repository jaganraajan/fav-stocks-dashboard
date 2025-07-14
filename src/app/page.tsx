"use client"

import { Link } from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useState, useEffect } from 'react';
import HistoricalChartPage from "./historicalChart/page";
import axios from 'axios';
import { useUser } from "@stackframe/stack";

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

const mockAdditionalCompanies = [
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'BA', name: 'Boeing Co.' },
];

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const formatVolume = (volume: number) => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)} Billion`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)} Million`;
  }
  return volume.toString();
};

const handleRemoveFavorite = async (symbol: string, userId: string, setFavorites: React.Dispatch<React.SetStateAction<string[]>>) => {
  try {
    const response = await axios.post(
      '/api/favorites',
      { symbol, userId, action: 'remove' }, // Request body
    );
    
    if (response.status === 200) {
      console.log(`Successfully removed ${symbol} from favorites.`);
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav !== symbol)); // Update the favorites state instantly
    } else {
      console.error(`Failed to remove ${symbol} from favorites.`);
    }
  } catch (error) {
    console.error(`Error removing ${symbol} from favorites:`, error);
  }
};

export default function Home() {
  const [editMode, setEditMode] = useState(false); 
  const [favorites, setFavorites] = useState<string[]>([]); // State to store favorite symbols
  const [stockData, setStockData] = useState<{ [symbol: string]: StockData }>({});
  const date = new Date();
  date.setDate(date.getDate()-4);
  const stockDate =  date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  const user = useUser(); // Get the user object using the useUser hook
  const email = user?.primaryEmail; // Extract the user's email
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const handleAddCompany = (company: { symbol: string; name: string }) => {
    setFavorites((prevFavorites) => [...prevFavorites, company.symbol]); // Add company to favorites
    setShowPopup(false); // Close the popup after adding
  };

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      date.setDate(date.getDate()-4);

      try {
          const response = await fetch(`/api/getStockData`);

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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const response = await axios.get(`/api/favorites`, {
          params: { userId: email },
        });
        console.log('Fetched favorites2:', response.data);
        setFavorites(response.data.map((favorite: { symbol: string }) => favorite.symbol)); // Extract symbols from favorites
        console.log(favorites.length)
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  const rows = Object.entries(stockData)
  .filter(([symbol]) => {
    // If the user is logged in and has favorites, filter by favorites
    if (favorites.length > 0) {
      return favorites.includes(symbol);
    }
    // If the user is not logged in, display all stocks
    return true;
  }).map(([symbol, data]) => ({
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
    <>
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
                <th className="border px-4 py-2">
                {email && (
                  <button
                    className="px-2 py-1 bg-blue-500 rounded text-white"
                    onClick={() => setEditMode((prev) => !prev)} // Toggle edit mode for the table
                  >
                    {editMode ? 'Cancel Edit' : 'Edit'}
                  </button>
                )}
                </th>
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
                  <td className="px-4">
                  {editMode && (
                  <button
                    className="px-2 py-1 bg-red-500 rounded text-white"
                    onClick={() => {
                        handleRemoveFavorite(row.symbol, email || '', setFavorites); // Pass the user's email or an empty string if not available
                    }}
                  >
                    Remove
                  </button>
                  )}
                </td>
                </tr>
              ))}
            </tbody>
            {editMode && (<tfoot>
              <tr>
                <td colSpan={5} className="border px-4 py-2 text-center">
                  <button
                    className="w-full px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => setShowPopup(true)} // Show popup when clicked
                  >
                    + Add Company
                  </button>
                </td>
              </tr>
            </tfoot>)}
          </table>
          
        </CardBody>
            </Card>
            
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">Historical Analysis</h1>
            
            <HistoricalChartPage />
      </div>
      {/* Popup for adding companies */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add a Company</h2>
            <ul>
              {mockAdditionalCompanies.map((company) => (
                <li key={company.symbol} className="mb-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => handleAddCompany(company)} // Add company to favorites
                  >
                    {company.name} ({company.symbol})
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setShowPopup(false)} // Close popup
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
