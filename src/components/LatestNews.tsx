import { NewsArticle } from '@/types/NewsArticle';
import React from 'react';

interface LatestNewsProps {
  news: NewsArticle[];
  companyName: string;
}

const LatestNews: React.FC<LatestNewsProps> = ({ news, companyName }) => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Latest News for {companyName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((article) => (
          <div
            key={article.id}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{article.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {article.description}
              </p>
              <div className="flex items-center mb-4">
                <img
                  src={article.publisher.logo_url}
                  alt={article.publisher.name}
                  className="w-8 h-8 mr-2"
                />
                <span className="text-gray-600 dark:text-gray-400">
                  {article.publisher.name}
                </span>
              </div>
              <a
                href={article.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;