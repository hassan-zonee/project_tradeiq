// src/app/api/symbols/route.ts
import { getTopSymbols, getChartData } from "../../lib/finnhub";

export async function GET(req: Request) {
  try {
    const symbols = await getTopSymbols();
    return new Response(JSON.stringify({ symbols }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch symbols" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const symbol = url.searchParams.get("symbol");
    const timeframe = url.searchParams.get("timeframe");

    if (!symbol || !timeframe) {
      return new Response(JSON.stringify({ error: "Missing symbol or timeframe" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chartData = await getChartData(symbol, timeframe);
    return new Response(JSON.stringify({ chartData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch chart data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
