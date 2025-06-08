// src/app/api/symbols/route.ts
import { getTopSymbols } from "../../../lib/finnhub";

export async function GET() {
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
