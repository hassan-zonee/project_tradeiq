// src/app/api/symbols/route.ts
import { getTopSymbols } from "../../lib/finnhub";

import { NextApiRequest, NextApiResponse } from "next";
import { getTopSymbols } from "../../lib/finnhub";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const symbols = await getTopSymbols();
      res.status(200).json({ symbols });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch symbols" });
    }
  } else {
    res.status(405).end();
  }
}

