import { useEffect, useState } from "react";
import { getTopSymbols, type SymbolInfo } from "../../../../lib/chartsData";
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
import { CandleChart } from "../../../../components/CandleChart";
import type { CandlestickData, Time, UTCTimestamp } from "lightweight-charts";

// Simple Loading Overlay Component
const LoadingOverlay = () => {
  const spinnerStyle: React.CSSProperties = {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginRight: '20px',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      flexDirection: 'row', // Align spinner and text horizontally
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      color: 'white',
      fontSize: '2rem',
    }}>
      <style>{keyframes}</style> {/* Inject keyframes into the document */}
      <div style={spinnerStyle}></div>
      Analyzing...
    </div>
  );
};

export const AnalysisSection = (): JSX.Element => {
  const [currencyPairs, setCurrencyPairs] = useState<SymbolInfo[]>([]);
  const [selectedPair, setSelectedPair] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");
  const [loadingPairs, setLoadingPairs] = useState<boolean>(true);
  const [pairsError, setPairsError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Chart data state
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState<boolean>(false);

  const filteredPairs = currencyPairs
    .filter(
      pair =>
        pair.symbol.toLowerCase().includes(search.toLowerCase()) ||
        pair.description.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 10);

  // Effect to fetch chart data when selectedPair or selectedTimeframe changes, and update periodically
  useEffect(() => {
    if (!selectedPair || !selectedTimeframe) {
      setChartData([]); // Clear chart data if no pair/timeframe is selected
      return;
    }

    const fetchAndSetChartData = async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setChartLoading(true); // Show loader only on initial load or pair/timeframe change
      }
      setChartError(null);
      try {
        // Dynamic import for getChartData
        const { getChartData } = await import("../../../../lib/chartsData");
        const rawData = await getChartData(selectedPair, selectedTimeframe);

        if (Array.isArray(rawData)) {
          const processedData: CandlestickData<Time>[] = rawData.map(d => ({
            time: d.time as UTCTimestamp, // Explicitly cast time
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }));
          setChartData(processedData);
        } else {
          setChartData([]); // Set to empty array if data is not as expected
          console.warn("Received non-array data from getChartData", rawData);
        }
      } catch (err: any) {
        console.error(`Error fetching chart data for ${selectedPair} (${selectedTimeframe}):`, err);
        setChartError(`Failed to fetch chart data for ${selectedPair}.`);
        setChartData([]); // Clear data on error
      } finally {
        if (isInitialLoad) {
          setChartLoading(false);
        }
      }
    };

    fetchAndSetChartData(true); // Initial fetch

    const intervalId = setInterval(() => {
      console.log(`Interval: Fetching chart data for ${selectedPair} ${selectedTimeframe} at ${new Date().toLocaleTimeString()}`);
      fetchAndSetChartData(false); // Subsequent fetches are background updates
    }, 5000);

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount or when dependencies change
      console.log(`Interval cleared for ${selectedPair} ${selectedTimeframe} at ${new Date().toLocaleTimeString()}`);
    };
  }, [selectedPair, selectedTimeframe]);

  const handleAnalyzeClick = () => {
    setShowLoadingOverlay(true);
    setTimeout(() => {
      setShowLoadingOverlay(false);
    }, 5000); // Overlay disappears after 5 seconds
  };

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
        console.error("Error fetching currency pairs (getTopSymbols):", error);
        setPairsError("Failed to fetch currency pairs.");
      } finally {
        setLoadingPairs(false);
      }
    };
    fetchPairs();
  }, []);

  return (
    <>
      {showLoadingOverlay && <LoadingOverlay />}
      <div id="main-content-section" className="flex flex-col lg:flex-row w-full gap-4">
      {/* Left column */}
      <div className="w-full lg:flex-[0_0_70%] lg:min-w-0">
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col">
                  {/* Only render the label/title once, not duplicated */}
                  <label className="text-sm font-medium text-[#374050] mb-1">
                    Currency Pair
                  </label>
                  <div className="flex flex-col relative">
                  <input
                    type="text"
                    className="w-full sm:w-40 h-[42px] border border-[#d0d5da] rounded px-2"
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
                    <div className="absolute z-10 bg-white border border-gray-200 rounded shadow w-full sm:w-40 max-h-60 overflow-y-auto mt-11">
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
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-full sm:w-28 h-[42px] border-[#d0d5da]">
                      <SelectValue placeholder="1h" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30m">30m</SelectItem>
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

            <div className="">
              <div className="rounded-2xl overflow-hidden h-[350px] mb-2 h-g flex items-center justify-center">
                {chartLoading ? (
                  <span className="text-gray-500">Loading chart data...</span>
                ) : chartError ? (
                  <span className="text-red-500">{chartError}</span>
                ) : chartData.length === 0 ? (
                  <span className="text-gray-500">No data</span>
                ) : (
                  <CandleChart data={chartData} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Right column (Analysis, Signals, etc.) */}
      <div className="w-full lg:flex-[0_0_30%] lg:min-w-0 space-y-6">
        
        {/* Market Overview Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h3 className="font-semibold text-gray-800 text-xl">
                AI Analysis
              </h3>
              <Button 
                onClick={handleAnalyzeClick} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-[42px] px-6 rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105 active:scale-95"
              >
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
    </>
  );
};
