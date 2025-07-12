'use client';

import { StockChart } from '@/components/StockChart';
import { fetchStockChartData } from '@/pages/api/fetchStockChartData';
// import { mockStockChartData } from '@/mockStockChartData';
import React, { useEffect, useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const HistoricalChartPage = () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
    const [data, setData] = useState<any[]>([]); // State to store fetched data
    const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const chartData = await fetchStockChartData(); // Fetch data using the utility function
          setData(chartData); // Update state with fetched data
        } catch (error) {
          console.error('Error fetching stock chart data:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) {
      return <p>Loading...</p>; // Display loading indicator while data is being fetched
    }
  
    return (
      <div>
        <StockChart data={data} /> {/* Pass the fetched data to the StockChart component */}
      </div>
    );
  };
export default HistoricalChartPage;
