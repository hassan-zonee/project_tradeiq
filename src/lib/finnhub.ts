const API_KEY = "d12mkapr01qmhi3jjthgd12mkapr01qmhi3jjti0";

export type SymbolInfo = { symbol: string; description: string };

export async function getTopSymbols(): Promise<SymbolInfo[]> {
  const forexRes = await fetch(`https://finnhub.io/api/v1/forex/symbol?exchange=oanda&token=${API_KEY}`);

  const forexData = await forexRes.json();

  const forexPairs: SymbolInfo[] = forexData
    .map((item: any) => ({
      symbol: item.displaySymbol,
      description: item.description.replace("Oanda", "")
    }));

  return [...forexPairs];
}

export async function getChartData(symbol: string, timeframe: string) {
  const now = Math.floor(Date.now() / 1000);
  const from = now - 60 * 60 * 24; // last 24h — adjust as needed

  const endpoint = symbol.startsWith("BINANCE") || symbol.startsWith("COINBASE")
    ? "crypto"
    : "forex";

  const url = `https://finnhub.io/api/v1/${endpoint}/candle?symbol=${symbol}&resolution=${timeframe}&from=${from}&to=${now}&token=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.s !== "ok") throw new Error("Failed to fetch chart data");

  return data.t.map((timestamp: number, i: number) => ({
    time: timestamp,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
  }));
}
