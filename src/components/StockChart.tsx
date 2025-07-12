'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface StockResult {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number; // ms timestamp
  n: number;
  date?: string; // ISO string (YYYY-MM-DD)
}

interface ChartProps {
  data: Array<{
    ticker: string;
    results: StockResult[];
  }>;
}

const PARAM_OPTIONS = [
  { key: 'v', label: 'Volume' },
  { key: 'o', label: 'Opening Price' },
  { key: 'c', label: 'Closing Price' },
  { key: 'h', label: 'High Price' },
  { key: 'l', label: 'Low Price' },
  { key: 'vw', label: 'VWAP' },
];

const getDateString = (t: number) => {
  const d = new Date(t);
  return d.toISOString().split('T')[0];
};

export const StockChart: React.FC<ChartProps> = ({ data }) => {
  // Flatten all dates for global range
  const allDates = useMemo(() => {
    const dates: string[] = [];
    data.forEach(stock =>
      stock.results.forEach(r =>
        dates.push(r.date ?? getDateString(r.t))
      )
    );
    return Array.from(new Set(dates)).sort();
  }, [data]);

  const [param, setParam] = useState('v');
  const [startDate, setStartDate] = useState(allDates[0]);
  const [endDate, setEndDate] = useState(allDates[allDates.length - 1]);

  // Filter results by selected date range
  const filteredData = useMemo(() => {
    return data.map(stock => ({
      ticker: stock.ticker,
      results: stock.results.filter(r => {
        const dateStr = r.date ?? getDateString(r.t);
        return dateStr >= startDate && dateStr <= endDate;
      }).map(r => ({
        ...r,
        date: r.date ?? getDateString(r.t)
      })),
    }));
  }, [data, startDate, endDate]);

  // Prepare chart data: [{date, [AAPL]: value, [NKE]: value}]
  const chartRows: Array<{ date: string; [key: string]: number | string }> = [];
  const dateSet = new Set<string>();
  filteredData.forEach(stock => {
    stock.results.forEach(r => dateSet.add(r.date!));
  });
  Array.from(dateSet).sort().forEach(date => {
    const row: { date: string; [key: string]: number | string } = { date };
    filteredData.forEach(stock => {
      const found = stock.results.find(r => r.date === date);
      row[stock.ticker] = found ? found[param as keyof StockResult] : '';
    });
    chartRows.push(row);
  });

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label>
          Parameter:&nbsp;
          <select value={param} onChange={e => setParam(e.target.value)}>
            {PARAM_OPTIONS.map(p => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
        </label>
        <label>
          Start Date:&nbsp;
          <input
            type="date"
            value={startDate}
            min={allDates[0]}
            max={endDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:&nbsp;
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={allDates[allDates.length - 1]}
            onChange={e => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartRows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {filteredData.map(stock => (
            <Line
              key={stock.ticker}
              type="monotone"
              dataKey={stock.ticker}
              stroke={stock.ticker === 'AAPL' ? "#8884d8" : "#82ca9d"}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};