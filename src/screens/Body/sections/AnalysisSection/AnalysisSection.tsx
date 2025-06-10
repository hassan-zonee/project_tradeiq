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
import { CandleChart, type IndicatorType } from "../../../../components/CandleChart";
import type { CandlestickData, Time, UTCTimestamp } from "lightweight-charts";
import { analyzeConfluences } from "../../../../lib/TechnicalAnalysis";



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
  const [showIndicators, setShowIndicators] = useState(false);
  const [visibleIndicators, setVisibleIndicators] = useState<IndicatorType[]>([]);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [signal, setSignal] = useState<'Buy' | 'Sell' | 'None'>("None");
  const [stopLoss, setStopLoss] = useState<string | null>(null);
  const [takeProfit, setTakeProfit] = useState<string | null>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
    const [signalStrength, setSignalStrength] = useState<number | null>(null);
  const [confluences, setConfluences] = useState<string[]>([]);
  const [keyLevels, setKeyLevels] = useState<{ support: number | null; resistance: number | null; }>({ support: null, resistance: null });

  // State for displaying real-time pair data
  const [currentPriceDisplay, setCurrentPriceDisplay] = useState<string>("-");
  const [priceChangeDisplay, setPriceChangeDisplay] = useState<string>("-");
  const [priceChangeDirection, setPriceChangeDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [lastUpdateTimestampDisplay, setLastUpdateTimestampDisplay] = useState<string>("-");

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
          if (processedData && processedData.length > 0) {
            const latestCandle = processedData[processedData.length - 1];
            setCurrentPriceDisplay(latestCandle.close.toFixed(4));

            // Format date like "Month Day, Year"
            const date = new Date(latestCandle.time as number * 1000); // Assuming time is UNIX timestamp in seconds
            setLastUpdateTimestampDisplay(date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }));

            let percentChange = 0;
            if (processedData.length > 1) {
              const previousCandle = processedData[processedData.length - 2];
              if (previousCandle.close !== 0) {
                 percentChange = ((latestCandle.close - previousCandle.close) / previousCandle.close) * 100;
              }
            } else if (latestCandle.open !== 0) { // Use open if only one candle
              percentChange = ((latestCandle.close - latestCandle.open) / latestCandle.open) * 100;
            }

            setPriceChangeDisplay(`${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`);
            if (percentChange > 0) setPriceChangeDirection('up');
            else if (percentChange < 0) setPriceChangeDirection('down');
            else setPriceChangeDirection('neutral');

          } else {
            setCurrentPriceDisplay("-");
            setPriceChangeDisplay("-");
            setPriceChangeDirection('neutral');
            setLastUpdateTimestampDisplay("-");
          }
        } else {
          setChartData([]); // Set to empty array if data is not as expected
          console.warn("Received non-array data from getChartData", rawData);
          setCurrentPriceDisplay("-");
          setPriceChangeDisplay("-");
          setPriceChangeDirection('neutral');
          setLastUpdateTimestampDisplay("-");
        }
      } catch (err: any) {
        console.error(`Error fetching chart data for ${selectedPair} (${selectedTimeframe}):`, err);
        setChartError(`Failed to fetch chart data for ${selectedPair}.`);
        setChartData([]); // Clear data on error
        setCurrentPriceDisplay("-");
        setPriceChangeDisplay("-");
        setPriceChangeDirection('neutral');
        setLastUpdateTimestampDisplay("-");
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
    }, 10000);

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount or when dependencies change
      console.log(`Interval cleared for ${selectedPair} ${selectedTimeframe} at ${new Date().toLocaleTimeString()}`);
    };
  }, [selectedPair, selectedTimeframe]);

  const allIndicators: IndicatorType[] = ['rsi', 'macd', 'bollinger', 'psar', 'ema21', 'ema50', 'ema200'];

  const getStrengthColor = (strength: number): string => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 50) return 'bg-yellow-400';
    if (strength < 75) return 'bg-green-400';
    return 'bg-green-600';
  };

  const handleAnalyzeClick = () => {
    setIsAnalysisLoading(true);
    setShowIndicators(false);
    setVisibleIndicators([]);
    setSignal("None");
    setSignalStrength(null);
    setStopLoss(null);
    setTakeProfit(null);
    setKeyLevels({ support: null, resistance: null });

    // Initial delay to show loading and generate signal
    setTimeout(async () => {
      let support: number | null = null;
      let resistance: number | null = null;
      try {
        const { getChartData } = await import("../../../../lib/chartsData");
        const oneHourData = await getChartData(selectedPair, '1h');
        if (oneHourData && oneHourData.length > 0) {
          const recentData = oneHourData.slice(-50);
          if (recentData.length > 0) {
            resistance = Math.max(...recentData.map(c => c.high));
            support = Math.min(...recentData.map(c => c.low));
          }
        }
      } catch (error) {
        console.error("Failed to fetch 1h data for S/R analysis:", error);
      }

      const analysis = await analyzeConfluences(selectedPair);

      setSignal(analysis.signal);
      setStopLoss(analysis.stopLoss ? `${analysis.stopLoss.toFixed(5)}` : null);
      setTakeProfit(analysis.takeProfit ? `${analysis.takeProfit.toFixed(5)}` : null);
      setSignalStrength(analysis.strength);
      setEntryPrice(analysis.entryPrice || null);
      setConfluences(analysis.confluences);
      setKeyLevels({ support, resistance });

      setShowIndicators(true); // Enable indicator drawing on the chart

      // Sequentially add indicators to the visible list
      allIndicators.forEach((indicator, index) => {
        setTimeout(() => {
          setVisibleIndicators(prev => [...prev, indicator]);
          // Turn off loading spinner after the last indicator is revealed
          if (index === allIndicators.length - 1) {
            setIsAnalysisLoading(false);
          }
        }, (index + 1) * 1000); // Stagger each indicator by 1 second
      });
    }, 1000); // 1-second delay before analysis results appear
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

              <div className="flex flex-col min-w-[180px]">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 text-2xl mr-2">
                    {currentPriceDisplay}
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-medium px-2 py-1 rounded-lg ${ 
                      priceChangeDirection === 'up' ? 'bg-green-100 text-green-700' : 
                      priceChangeDirection === 'down' ? 'bg-red-100 text-red-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {priceChangeDisplay}
                  </Badge>
                </div>
                <span className="text-[#6a7280] text-sm truncate">
                  {selectedPair || "N/A"} • {lastUpdateTimestampDisplay}
                </span>
              </div>
            </div>

            <Separator className="bg-[#f2f4f5]" />

            <div className="relative">
              {isAnalysisLoading && (
                <div 
                  className="absolute inset-0 bg-white bg-opacity-20 flex flex-col items-center justify-center z-10 rounded-2xl"
                  style={{ backdropFilter: 'blur(2px)' }}
                >
                  <svg className="animate-spin h-10 w-10 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg font-semibold text-gray-700">Loading Analysis...</span>
                  <span className="text-sm text-gray-500">Please wait a moment.</span>
                </div>
              )}
              <div className="rounded-2xl overflow-hidden h-[400px] mb-2 h-g flex items-center justify-center">
                {chartLoading ? (
                  <span className="text-gray-500">Loading chart data...</span>
                ) : chartError ? (
                  <span className="text-red-500">{chartError}</span>
                ) : chartData.length === 0 ? (
                  <span className="text-gray-500">No data</span>
                ) : (
                                    <CandleChart data={chartData} showIndicators={showIndicators} visibleIndicators={visibleIndicators} keyLevels={keyLevels} />
                )}
              </div>
            </div>
            {/* The relative div for overlay should close here if it was meant to only cover the chart area */}
            {/* If the overlay was meant to cover more, adjust its position in the JSX tree */}
          </CardContent>
        </Card>
      </div>
      {/* Right column (Analysis, Signals, etc.) */}
      <div className="w-full lg:flex-[0_0_30%] lg:min-w-0 space-y-6">
        {/* AI Analysis Card with Inner Cards */}
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h3 className="font-semibold text-gray-800 text-xl">AI Analysis</h3>
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

            {/* Sections: Signal, Stoploss, Take Profit */}
            <div className="flex flex-col gap-4">
              {/* Signal */}
              <div className="flex-1 bg-gray-50 border rounded-md p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 text-lg mb-1">Signal</h4>
                                {isAnalysisLoading ? (
                  <div className="h-5 w-3/4 bg-gray-300 rounded animate-pulse mt-1"></div>
                 ) : (
                   <>
                     <p className={`font-semibold text-lg ${signal === 'Buy' ? 'text-green-500' : signal === 'Sell' ? 'text-red-500' : 'text-gray-600'}`}>
                       {signal}
                       {entryPrice && (
                         <span className="text-xs ${signal === 'Buy' ? 'text-green-500' : signal === 'Sell' ? 'text-red-500' : 'text-gray-600'}` ml-2">({entryPrice.toFixed(5)})</span>
                       )}
                     </p>
                    {signal && signalStrength !== null && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-500">Signal Strength</span>
                          <span className="text-sm font-bold text-gray-800">{signalStrength}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getStrengthColor(signalStrength)}`}
                            style={{ width: `${signalStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Stoploss */}
              <div className="flex-1 bg-gray-50 border rounded-md p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 text-lg mb-1">Stop Loss</h4>
                {isAnalysisLoading ? (
                  <div className="h-5 w-1/2 bg-gray-300 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-red-500 font-bold">{stopLoss || 'N/A'}</p>
                )}
              </div>

              {/* Take Profit */}
              <div className="flex-1 bg-gray-50 border rounded-md p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 text-lg mb-1">Take Profit</h4>
                {isAnalysisLoading ? (
                  <div className="h-5 w-1/2 bg-gray-300 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-green-600 font-bold">{takeProfit || 'N/A'}</p>
                )}
              </div>
            </div>
            {confluences.length > 0 && (
              <Card className="mt-4">
                <CardContent className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {confluences.map((reason, index) => (
                      <li key={index} className="text-sm text-gray-400">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
    </>
  );
};
