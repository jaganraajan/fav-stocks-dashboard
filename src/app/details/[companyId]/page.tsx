"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useParams } from 'next/navigation';

interface Address {
    address1: string;
    city: string;
    state: string;
    postal_code: string;
  }
  
  interface Branding {
    logo_url: string;
    icon_url: string;
  }
  
  interface StockDetails {
    ticker: string;
    name: string;
    market: string;
    locale: string;
    primary_exchange: string;
    type: string;
    active: boolean;
    currency_name: string;
    cik: string;
    composite_figi: string;
    share_class_figi: string;
    market_cap: number;
    phone_number: string;
    address: Address;
    description: string;
    sic_code: string;
    sic_description: string;
    ticker_root: string;
    homepage_url: string;
    total_employees: number;
    list_date: string;
    branding: Branding;
    share_class_shares_outstanding: number;
    weighted_shares_outstanding: number;
    round_lot: number;
  }
  
  interface StockDataResponse {
    request_id: string;
    results: StockDetails;
    status: string;
  }

  interface NewsArticle {
    id: string;
    publisher: {
      name: string;
      homepage_url: string;
      logo_url: string;
      favicon_url: string;
    };
    title: string;
    author: string;
    published_utc: string;
    article_url: string;
    image_url: string;
    description: string;
  }
  
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
        
        console.log(latestNews);
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

  // Format market cap
  const formatMarketCap = (marketCap: number) => {
    if(!marketCap) {
      return '';
    }

    if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(2)} Billion`;
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(2)} Million`;
    }
    return marketCap.toString();
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Ticker:</strong> {results.ticker}</p>
            <p><strong>Market:</strong> {results.market}</p>
            <p><strong>Type:</strong> {results.type}</p>
            <p><strong>Active:</strong> {results.active ? 'Yes' : 'No'}</p>
            <p><strong>Currency:</strong> {results.currency_name?.toUpperCase()}</p>
            <p><strong>Market Cap:</strong> ${formatMarketCap(results.market_cap)}</p>
            <p><strong>Recent Close Price:</strong> ${recentClosePrice?.toFixed(2)}</p>
            <p><strong>Weighted Shares Outstanding:</strong> {results.weighted_shares_outstanding?.toLocaleString()}</p>
            <p><strong>Phone Number:</strong> {results.phone_number}</p>
            <p><strong>Homepage:</strong> <a href={results.homepage_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">{results.homepage_url}</a></p>
            <p><strong>Total Employees:</strong> {results.total_employees}</p>
            <p><strong>List Date:</strong> {results.list_date}</p>
          </div>
          <div className="mt-4">
            <p><strong>Description:</strong> {results.description}</p>
          </div>
        </CardBody>
        <CardBody className="p-6 text-gray-800 dark:text-gray-100">
          <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Latest News for {results.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((article) => (
              <div key={article.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{article.description}</p>
                  <div className="flex items-center mb-4">
                    <img src={article.publisher.logo_url} alt={article.publisher.name} className="w-8 h-8 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">{article.publisher.name}</span>
                  </div>
                  <a href={article.article_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        </CardBody>
      </Card>
    </div>
  ); 
};