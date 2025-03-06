"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";

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

export default function LatestNews() {
  const { companyId } = useParams();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY; // Store API key securely (see below)

        const response = await fetch(
          `https://api.polygon.io/v2/reference/news?ticker=${companyId}&limit=10&apiKey=${apiKey}`);
        
          console.log(response);
        if (!response.ok) {
          throw new Error(`Error fetching news: ${response.statusText}`);
        }

        const data = await response.json();
        setNews(data.results);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [companyId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="mr-2" size={20} />
        <span>Back to Dashboard</span>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Latest News for {companyId}</h1>
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
  );
}