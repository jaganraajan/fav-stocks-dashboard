import { StockChart } from '@/components/StockChart';
import { mockStockChartData } from '@/mockStockChartData';
import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoricalChartPage = () => {
    return (
        <StockChart data={mockStockChartData} />
    );
};

export default HistoricalChartPage;
