const API_KEY = "d12mkapr01qmhi3jjthgd12mkapr01qmhi3jjti0";

export async function getTopSymbols(): Promise<string[]> {
  const forexRes = await fetch(`https://finnhub.io/api/v1/forex/symbol?exchange=oanda&token=${API_KEY}`);
  const cryptoRes = await fetch(`https://finnhub.io/api/v1/crypto/symbol?exchange=binance&token=${API_KEY}`);

  const forexData = await forexRes.json();
  const cryptoData = await cryptoRes.json();

  const forexPairs = forexData
    .filter((item: any) => item.displaySymbol)
    .slice(0, 10)
    .map((item: any) => item.symbol);

  const cryptoPairs = cryptoData
    .filter((item: any) => item.displaySymbol)
    .slice(0, 10)
    .map((item: any) => item.symbol);

  return [...forexPairs, ...cryptoPairs];
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
