import React, { useEffect, useState } from "react";
import { getTopSymbols, type SymbolInfo } from "../../../../lib/finnhub";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Separator } from "../../../../components/ui/separator";

// Market overview data
const marketOverviewData = [
  {
    id: 1,
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    value: "1.0875",
    change: "+0.24%",
    isPositive: true,
    icon: "€/$",
    bgColor: "bg-[#dae9fe]",
    textColor: "text-[#2562eb]",
  },
  {
    id: 2,
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    value: "1.2715",
    change: "-0.12%",
    isPositive: false,
    icon: "£/$",
    bgColor: "bg-[#dae9fe]",
    textColor: "text-[#2562eb]",
  },
  {
    id: 3,
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    value: "149.85",
    change: "+0.35%",
    isPositive: true,
    icon: "$/¥",
    bgColor: "bg-[#dae9fe]",
    textColor: "text-[#2562eb]",
  },
  {
    id: 4,
    symbol: "BTC/USD",
    name: "Bitcoin / US Dollar",
    value: "65,432",
    change: "+1.87%",
    isPositive: true,
    icon: "",
    bgColor: "bg-[#ffecd5]",
    textColor: "text-[#2562eb]",
    iconImg: "/group-17.png",
  },
  {
    id: 5,
    symbol: "ETH/USD",
    name: "Ethereum / US Dollar",
    value: "3,487",
    change: "+2.45%",
    isPositive: true,
    icon: "",
    bgColor: "bg-[#f2e7ff]",
    textColor: "text-[#2562eb]",
    iconImg: "/group-18.png",
  },
];

// Recent signals data
const recentSignalsData = [
  {
    id: 1,
    symbol: "BTC/USD",
    action: "BUY",
    isPositive: true,
    date: "June 3, 2025 • 09:45 AM",
    pips: "TP: +120 pips | SL: -40 pips",
  },
  {
    id: 2,
    symbol: "USD/JPY",
    action: "SELL",
    isPositive: false,
    date: "June 3, 2025 • 08:30 AM",
    pips: "TP: +45 pips | SL: -15 pips",
  },
  {
    id: 3,
    symbol: "EUR/USD",
    action: "BUY",
    isPositive: true,
    date: "June 3, 2025 • 07:15 AM",
    pips: "TP: +65 pips | SL: -25 pips",
  },
  {
    id: 4,
    symbol: "GBP/USD",
    action: "SELL",
    isPositive: false,
    date: "June 2, 2025 • 04:50 PM",
    pips: "TP: +55 pips | SL: -20 pips",
  },
];

export const AnalysisSection = (): JSX.Element => {
  const [currencyPairs, setCurrencyPairs] = useState<SymbolInfo[]>([]);
  const [selectedPair, setSelectedPair] = useState<string>("XAU/USD");
  const [loadingPairs, setLoadingPairs] = useState<boolean>(true);
  const [pairsError, setPairsError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredPairs = currencyPairs
    .filter(
      pair =>
        pair.symbol.toLowerCase().includes(search.toLowerCase()) ||
        pair.description.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 10);

  useEffect(() => {
    const fetchPairs = async () => {
      setLoadingPairs(true);
      setPairsError(null);
      try {
        const symbols = await getTopSymbols();
        if (symbols && Array.isArray(symbols)) {
          setCurrencyPairs(symbols);
          // On initial load, select XAU/USD if present, else first available
          const xau = symbols.find(pair => pair.symbol === "XAU/USD");
          setSelectedPair(xau ? xau.symbol : (symbols[0]?.symbol || ""));
          setSearch(xau ? xau.symbol : (symbols[0]?.symbol || ""));
        } else {
          setPairsError("Invalid data format");
        }
      } catch (error: any) {
        console.error("Error fetching currency pairs:", error);
        setPairsError("Failed to fetch");
      } finally {
        setLoadingPairs(false);
      }
    };
    fetchPairs();
  }, []);

  return (
    <div id="main-content-section" className="flex flex-wrap gap-8">
      {/* Left column */}
      <div className="flex-1 min-w-0">
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  {/* Only render the label/title once, not duplicated */}
                  <label className="text-sm font-medium text-[#374050] mb-1">
                    Currency Pair
                  </label>
                  <div className="flex flex-col relative">
                  <input
                    type="text"
                    className="w-40 h-[42px] border border-[#d0d5da] rounded px-2"
                    placeholder="Search pair"
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  />
                  {showSuggestions && (
                    <div className="absolute z-10 bg-white border border-gray-200 rounded shadow w-40 max-h-60 overflow-y-auto mt-11">
                      {loadingPairs ? (
                        <div className="px-4 py-2 text-gray-400 text-sm select-none">Loading...</div>
                      ) : pairsError ? (
                        <div className="px-4 py-2 text-red-500 text-sm select-none">{pairsError}</div>
                      ) : filteredPairs.length === 0 ? (
                        <div className="px-4 py-2 text-gray-400 text-sm select-none">No pairs found</div>
                      ) : (
                        filteredPairs.map((pair, idx) => (
                          <div
                            key={idx}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedPair === pair.symbol ? "bg-gray-100" : ""}`}
                            onMouseDown={() => {
                              setSelectedPair(pair.symbol);
                              setSearch(pair.symbol); // Show selected in input
                              setShowSuggestions(false);
                            }}
                          >
                            <span className="text-base font-semibold">{pair.symbol}</span>
                            <br />
                            <span className="text-xs text-gray-400">{pair.description}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-[#374050] mb-1">
                    Timeframe
                  </label>
                  <Select defaultValue="1h">
                    <SelectTrigger className="w-28 h-[42px] border-[#d0d5da]">
                      <SelectValue placeholder="1h" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15m">15m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="4h">4h</SelectItem>
                      <SelectItem value="1d">1d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 text-2xl mr-2">
                    1.0875
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-[#dbfbe7] text-[#166533] font-medium px-2 py-1 rounded-lg"
                  >
                    +0.24%
                  </Badge>
                </div>
                <span className="text-[#6a7280] text-sm">
                  EUR/USD • June 3, 2025
                </span>
              </div>
            </div>

            <Separator className="bg-[#f2f4f5]" />

            <div className="pt-[17px]">
              <div className="flex gap-3 mb-4">
                <Badge
                  variant="outline"
                  className="bg-[#3b81f5] text-white font-medium px-3 py-1 rounded-lg"
                >
                  Candlestick
                </Badge>
              </div>

              <div className="rounded-2xl overflow-hidden mb-2 h-[300px] bg-red-300">
                
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-xl">
                AI Analysis
              </h3>
              <Button className="bg-[#3b81f5] text-white">
                <img
                  className="w-3 h-3.5 mr-2"
                  alt="AI icon"
                  src="/group-16.png"
                />
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
