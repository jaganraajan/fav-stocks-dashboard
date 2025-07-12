import axios from 'axios';

const companies = {
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

// interface StockResult {
//     v: number;
//     vw: number;
//     o: number;
//     c: number;
//     h: number;
//     l: number;
//     t: number; // ms timestamp
//     n: number;
//     date?: string; // ISO string (YYYY-MM-DD)
//   }
  
  // interface ChartProps {
  //   data: Array<{
  //     ticker: string;
  //     results: StockResult[];
  //   }>;
  // }

    /* eslint-disable @typescript-eslint/no-explicit-any */
  export const fetchStockChartData = async (): Promise<any[]> => {
    console.log('fetchStockChartData called');
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const formattedData: any[] = [];

  for (const symbol in companies) {
    try {
      const response = await axios.get(`/api/getHistoricalData`, {
        params: { symbol },
      });
      
      const data = response.data;

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
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  console.log(formattedData);

  return formattedData;
};