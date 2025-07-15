import React from 'react';
import { StockDetails } from '@/types/StockDataResponse';

interface CompanyInfoProps {
  results: StockDetails;
  recentClosePrice?: number;
}

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

const CompanyInfo: React.FC<CompanyInfoProps> = ({ results, recentClosePrice }) => {
  return (
    <>
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
    </>
  );
};

export default CompanyInfo;