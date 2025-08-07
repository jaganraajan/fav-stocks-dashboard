import axios from 'axios';

  /* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchStockChartData = async (symbols: string[] = []): Promise<any[]> => {
  console.log('fetchStockChartData called with symbols:', symbols);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const formattedData: any[] = [];

  // Return empty data if no symbols provided
  if (symbols.length === 0) {
    console.log('No symbols provided, returning empty data');
    return formattedData;
  }

  for (const symbol of symbols) {
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

  return formattedData;
};