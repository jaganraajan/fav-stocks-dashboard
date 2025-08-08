'use client';

import { StockChart } from '@/components/StockChart';
import { fetchStockChartData } from '@/pages/api/fetchStockChartData';
import { useUser } from "@stackframe/stack";
import React, { useEffect, useState } from 'react';

const HistoricalChartPage = () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
    const [data, setData] = useState<any[]>([]); // State to store fetched data
    const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
    const [error, setError] = useState<string | null>(null); // State to manage error messages
    
    const user = useUser(); // Get user information for favorites
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setError(null);
          console.log('Fetching chart data for user:', user?.id || 'guest');
          
          // Pass user ID to fetchStockChartData if user is logged in
          const chartData = await fetchStockChartData(user?.id || null);
          
          if (chartData.length === 0) {
            setError('No historical data available. This might be due to missing data in the database or API limitations.');
          } else {
            setData(chartData);
          }
        } catch (error) {
          console.error('Error fetching stock chart data:', error);
          setError('Failed to fetch historical data. Please try again later.');
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      };
  
      fetchData();
    }, [user?.id]); // Re-fetch data when user changes
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Loading historical data...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-2">⚠️ {error}</div>
            <div className="text-gray-600">
              {user?.id 
                ? 'Showing data for your favorite companies. If you have no favorites, default companies will be used.'
                : 'Showing data for default companies. Sign in to see your favorite companies.'}
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Historical Chart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.id 
              ? `Showing historical data for your favorite companies (${data.length} companies)`
              : `Showing historical data for default companies (${data.length} companies)`}
          </p>
        </div>
        <StockChart data={data} />
      </div>
    );
  };
export default HistoricalChartPage;
