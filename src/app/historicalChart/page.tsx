'use client';

import { StockChart } from '@/components/StockChart';
import { fetchStockChartData } from '@/pages/api/fetchStockChartData';
import React, { useEffect, useState } from 'react';
import { useUser } from "@stackframe/stack";
import axios from 'axios';

const HistoricalChartPage = () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
    const [data, setData] = useState<any[]>([]); // State to store fetched data
    const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
    const [favorites, setFavorites] = useState<string[]>([]); // State to store user favorites
    const user = useUser(); // Get the user object using the useUser hook
    const email = user?.primaryEmail; // Extract the user's email
  
    // Fetch user favorites
    useEffect(() => {
      const fetchFavorites = async () => {
        if (!user) {
          console.log('No user logged in, skipping favorites fetch');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get(`/api/favorites`, {
            params: { userId: email },
          });
          console.log('Fetched favorites for historical chart:', response.data);
          const userFavorites = response.data.map((favorite: { symbol: string }) => favorite.symbol);
          setFavorites(userFavorites);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setFavorites([]); // Set empty array on error
        }
      };

      fetchFavorites();
    }, [user, email]);

    // Fetch chart data when favorites are available
    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log('Fetching chart data for favorites:', favorites);
          const chartData = await fetchStockChartData(favorites); // Pass user favorites to the function
          setData(chartData); // Update state with fetched data
        } catch (error) {
          console.error('Error fetching stock chart data:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      };

      // Only fetch data if we have processed the user (either logged in with favorites, or not logged in)
      if (!user || favorites.length > 0) {
        fetchData();
      }
    }, [favorites, user]);
  
    if (loading) {
      return <div className="p-4 text-center">Loading historical data...</div>; // Display loading indicator while data is being fetched
    }

    if (!user) {
      return (
        <div className="p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to view historical analysis for your favorite stocks.
          </p>
        </div>
      );
    }

    if (favorites.length === 0) {
      return (
        <div className="p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No favorite stocks selected. Add some stocks to your favorites to see their historical analysis.
          </p>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No historical data available for your selected stocks.
          </p>
        </div>
      );
    }
  
    return (
      <div>
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Showing historical analysis for your {favorites.length} favorite stocks: {favorites.join(', ')}
          </p>
        </div>
        <StockChart data={data} /> {/* Pass the fetched data to the StockChart component */}
      </div>
    );
  };
export default HistoricalChartPage;
