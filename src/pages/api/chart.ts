// src/app/api/chart/route.ts
import { getChartData } from "../../lib/finnhub";

import { NextApiRequest, NextApiResponse } from "next";
import { getChartData } from "../../lib/finnhub";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { symbol, timeframe } = req.query;
    if (!symbol || !timeframe) {
      res.status(400).json({ error: "Missing symbol or timeframe" });
      return;
    }
    try {
      const chartData = await getChartData(symbol as string, timeframe as string);
      res.status(200).json({ chartData });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  } else {
    res.status(405).end();
  }
}

      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch chart data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
