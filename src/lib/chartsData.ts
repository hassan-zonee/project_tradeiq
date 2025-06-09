export type SymbolInfo = { symbol: string; description: string };

/**
 * Fetch top trading pairs from Binance.
 */
export async function getTopSymbols(): Promise<SymbolInfo[]> {
  const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const json = await res.json();

  if (!json.symbols) {
    throw new Error("Failed to fetch Binance symbols");
  }

  // Filter for commonly used quote assets like USDT
  const cryptoPairs = json.symbols
    .filter((item: any) => item.status === "TRADING" && item.quoteAsset === "USDT")
    .map((item: any) => ({
      symbol: item.symbol, // e.g., "BTCUSDT"
      description: `${item.baseAsset} / ${item.quoteAsset}`,
    }));

  return cryptoPairs;
}

/**
 * Fetch OHLC chart data from Binance for a given symbol and timeframe.
 * @param symbol e.g., "BTCUSDT"
 * @param timeframe e.g., "1m", "5m", "15m", "1h", "1d"
 */
export async function getChartData(symbol: string, timeframe: string) {
  const url = `/binance-api/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=1000`;

  const res = await fetch(url);
  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Failed to fetch chart data");
  }

  return data.map((point: any) => ({
    time: Math.floor(point[0] / 1000), // open time in UNIX seconds
    open: parseFloat(point[1]),
    high: parseFloat(point[2]),
    low: parseFloat(point[3]),
    close: parseFloat(point[4]),
  }));
}
