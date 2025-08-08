import axios from 'axios';

// Default companies for guest users
const defaultCompanies = {
  AAPL: 'Apple Inc.',
  NKE: 'Nike Inc.',
  BA: 'Boeing Co.',
  TSLA: 'Tesla Inc.',
  GOOG: 'Alphabet Inc.',
  NFLX: 'Netflix Inc.',
  LMT: 'Lockheed Martin Corp.',
  AMZN: 'Amazon.com Inc.',
  NVDA: 'NVIDIA Corp.',
  MSFT: 'Microsoft Corp.',
};

  /* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchStockChartData = async (userId?: string | null): Promise<any[]> => {
  console.log('fetchStockChartData called with userId:', userId);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const formattedData: any[] = [];

  // Determine which companies to fetch data for
  let companiesToFetch: string[] = Object.keys(defaultCompanies);
  
  if (userId) {
    try {
      // Fetch user's favorite companies
      const favoritesResponse = await axios.get(`/api/favorites`, {
        params: { userId },
      });
      
      if (favoritesResponse.data && favoritesResponse.data.length > 0) {
        companiesToFetch = favoritesResponse.data.map((fav: any) => fav.symbol);
        console.log('Using user favorites:', companiesToFetch);
      } else {
        console.log('No user favorites found, using default companies');
      }
    } catch (error) {
      console.error('Error fetching user favorites, falling back to default companies:', error);
    }
  } else {
    console.log('No userId provided, using default companies');
  }

  // Fetch historical data for the determined companies
  for (const symbol of companiesToFetch) {
    try {
      const response = await axios.get(`/api/getHistoricalData`, {
        params: { symbol },
      });
      
      const data = response.data;

      if (data && data.length > 0) {
        // Transform the data into the desired format
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const results = data.map((item: any) => ({
          v: item.volume,
          vw: item.vwap,
          o: item.open,
          c: item.close,
          h: item.high,
          l: item.low,
          t: new Date(item.date).getTime(),
          date: item.date,
          n: 0, // Assuming `n` (number of trades) is not available in the database
        }));

        formattedData.push({
          ticker: symbol,
          results,
        });
      } else {
        console.log(`No historical data found for ${symbol}`);
      }
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  } 

  return formattedData;
};