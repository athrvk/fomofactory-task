export interface StockData {
    symbol: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    change: number,
    changePercent: number,
    timestamp: Date
}

export interface YahooFinanceResponse {
    chart: {
      result: Array<{
        meta: {
          symbol: string;
          regularMarketPrice: number;
          previousClose: number;
        };
        timestamp: number[];
        indicators: {
          quote: Array<{
            open: number[];
            high: number[];
            low: number[];
            close: number[];
            volume: number[];
          }>;
        };
      }>;
    };
  }