"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useParams } from 'next/navigation';
import CompanyInfo from '@/components/CompanyInfo';
import { StockDataResponse } from '@/types/StockDataResponse';
import { NewsArticle } from '@/types/NewsArticle';
import LatestNews from '@/components/LatestNews';
  
export default function Page() {
  const params = useParams<{ companyId: string }>();
  const companyId = params?.companyId;
  
  const [stockDataResponse, setStockDataResponse] = useState<StockDataResponse | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY; // Store API key securely (see below)
      const date = new Date();

      // Adjusting date to fetch data startingfrom 4 days ago due to API restrictions on current day's data
      date.setDate(date.getDate() - 4); 
      const stockDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

      try {
        const response = await fetch(
          `https://api.polygon.io/v3/reference/tickers/${companyId}?data=${stockDate}&apiKey=${apiKey}`); // Adjust API endpoint

        if (!response.ok) {
          const errorData = await response.json(); // Try to get error details from the API
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const latestNews = await fetch(
          `https://api.polygon.io/v2/reference/news?ticker=${companyId}&limit=10&apiKey=${apiKey}`);
        
        if (!latestNews.ok) {
          throw new Error(`Error fetching news: ${latestNews.statusText}`);
        }

        const latestNewsData = await latestNews.json();
        setNews(latestNewsData.results);

        const data: StockDataResponse = await response.json();
        setStockDataResponse(data);
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stockDataResponse) {
    return <div>No data available. Please try again.</div>; // Handle the case where data is still null after loading
  }

  const { results } = stockDataResponse;

  // Calculate recent close price
  const recentClosePrice = results.market_cap / results.weighted_shares_outstanding;

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="mr-2" size={20} />
        <span>Back to Dashboard</span>
      </Link>
      <Card className="bg-white dark:bg-gray-800 max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-100 dark:bg-gray-900 p-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{results.name}</h2>
        </CardHeader>
        <CardBody className="p-6 text-gray-800 dark:text-gray-100">
          <CompanyInfo results={results} recentClosePrice={recentClosePrice} />
        </CardBody>
        <CardBody className="p-6 text-gray-800 dark:text-gray-100">
          <LatestNews news={news} companyName={results.name} />
        </CardBody>
      </Card>
    </div>
  ); 
};