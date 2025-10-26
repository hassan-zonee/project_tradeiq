import { useEffect, useState } from "react";
import { getTopSymbols, type SymbolInfo } from "@/lib/chartsData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CandleChart, type IndicatorType } from "@/components/CandleChart";
import type { CandlestickData, Time, UTCTimestamp } from "lightweight-charts";
import { analyzeConfluences, getHigherTimeframe, type TradingSignal } from "@/lib/TechnicalAnalysis";

const ANALYSIS_MIN_LOADING_TIME_MS = 1000;



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
        const { getChartData } = await import("@/lib/chartsData");
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
    }, 1000);

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

  const handleAnalyzeClick = async () => {
    // 1. Set loading state and reset previous results
    setIsAnalysisLoading(true);
    setShowIndicators(false);
    setVisibleIndicators([]);
    setSignal("None");
    setSignalStrength(null);
    setStopLoss(null);
    setTakeProfit(null);
    setKeyLevels({ support: null, resistance: null });

    const startTime = Date.now();

    // 2. Perform all async analysis
    let support: number | null = null;
    let resistance: number | null = null;
    let analysis: TradingSignal;
    try {
        const { getChartData } = await import("@/lib/chartsData");
        const supportResistanceData = await getChartData(selectedPair, getHigherTimeframe(selectedTimeframe));
        if (supportResistanceData && supportResistanceData.length > 0) {
            const recentData = supportResistanceData.slice(-30);
            if (recentData.length > 0) {
                resistance = Math.max(...recentData.map(c => c.high));
                support = Math.min(...recentData.map(c => c.low));
            }
        }
        analysis = await analyzeConfluences(selectedPair, selectedTimeframe);
    } catch (error) {
        console.error("Analysis failed:", error);
        analysis = { 
            signal: 'None', 
            strength: 0, 
            confluences: ['Error during analysis.'], 
            entryPrice: 0,
            riskRewardRatio: 0,
            stopLoss: 0, 
            takeProfit: 0 
        };
    }

    // 3. Set the analysis results to state
    setSignal(analysis.signal);
    setStopLoss(analysis.stopLoss ? `${analysis.stopLoss.toFixed(5)}` : null);
    setTakeProfit(analysis.takeProfit ? `${analysis.takeProfit.toFixed(5)}` : null);
    setSignalStrength(analysis.strength);
    setEntryPrice(analysis.entryPrice || null);
    setConfluences(analysis.confluences);
    setKeyLevels({ support, resistance });
    setShowIndicators(true);

    // 4. Calculate total loading time and indicator animation timing
    const elapsedTime = Date.now() - startTime;
    const totalLoadingTime = Math.max(elapsedTime, ANALYSIS_MIN_LOADING_TIME_MS);
    const indicatorAnimationDuration = totalLoadingTime * 0.8; // Use 80% of loading time for animation
    const indicatorStaggerTime = indicatorAnimationDuration / allIndicators.length;

    // 5. Start indicator animation
    allIndicators.forEach((indicator, index) => {
        setTimeout(() => {
            setVisibleIndicators(prev => [...prev, indicator]);
        }, index * indicatorStaggerTime);
    });

    // 6. Set a timer to hide the loading spinner
    setTimeout(() => {
        setIsAnalysisLoading(false);
    }, totalLoadingTime);
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
      <div id="main-content-section" className="flex flex-col lg:flex-row w-full gap-6">
      {/* Left column */}
      <div className="w-full lg:flex-[0_0_70%] lg:min-w-0">
        <Card className="mb-6 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#374050] mb-1.5">
                    Currency Pair
                  </label>
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-[130px] h-[32px] border border-[#d0d5da] rounded-lg px-2.5 font-medium bg-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[13px] font-mono"
                        placeholder="Search pair..."
                        value={search}
                        onChange={e => {
                          setSearch(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      />
                      
                      {showSuggestions && (
                        <div className="absolute z-10 bg-white border border-[#d0d5da] rounded-lg shadow-lg w-[130px] max-h-[260px] overflow-y-auto mt-1">
                          {loadingPairs ? (
                            <div className="px-3 py-2.5 text-gray-400 text-[13px] select-none flex items-center gap-2">
                              <div className="w-2.5 h-2.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                              Loading...
                            </div>
                          ) : pairsError ? (
                            <div className="px-3 py-2.5 text-red-500 text-[13px] select-none">{pairsError}</div>
                          ) : filteredPairs.length === 0 ? (
                            <div className="px-3 py-2.5 text-gray-400 text-[13px] select-none">No pairs found</div>
                          ) : (
                            filteredPairs.map((pair, idx) => (
                              <div
                                key={idx}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                                  selectedPair === pair.symbol ? "bg-gray-50" : ""
                                }`}
                                onMouseDown={() => {
                                  setSelectedPair(pair.symbol);
                                  setSearch(pair.symbol);
                                  setShowSuggestions(false);
                                }}
                              >
                                <div className="font-medium text-[13px] text-[#374050] tracking-wide font-mono">{pair.symbol}</div>
                                <div className="text-[11px] text-gray-400 mt-0.5 font-normal">{pair.description}</div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#374050] mb-1.5">
                    Timeframe
                  </label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-[90px] h-[32px] border-[#d0d5da] rounded-lg font-medium bg-white/50 text-[13px] font-mono">
                      <SelectValue placeholder="1h" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15m" className="font-mono">15m</SelectItem>
                      <SelectItem value="30m" className="font-mono">30m</SelectItem>
                      <SelectItem value="1h" className="font-mono">1h</SelectItem>
                      <SelectItem value="4h" className="font-mono">4h</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col min-w-[140px] bg-gray-50/80 rounded-lg p-2.5 border border-[#d0d5da]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#374050] text-lg tracking-tight font-mono leading-none tabular-nums">
                    {currentPriceDisplay}
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-medium px-1.5 py-0.5 text-[10px] rounded font-mono tabular-nums ${
                      priceChangeDirection === 'up' ? 'bg-green-50 text-green-700 border-green-200' :
                      priceChangeDirection === 'down' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {priceChangeDisplay}
                  </Badge>
                </div>
                <div className="flex items-center text-[10px] text-gray-500 mt-1">
                  <span className="font-medium font-mono">{selectedPair || "N/A"}</span>
                  <span className="mx-1 text-gray-300">•</span>
                  <span className="text-gray-400 truncate font-normal">{lastUpdateTimestampDisplay}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-[#f2f4f5] mb-4" />

            <div className="relative">
              {isAnalysisLoading && (
                <div 
                  className="absolute inset-0 bg-white/30 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 rounded-xl"
                >
                  <div className="flex items-center space-x-1.5 mb-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-base font-semibold text-[#374050] tracking-wide">Analyzing Market Data...</span>
                  <span className="text-xs text-gray-500 mt-1 font-normal">This may take a moment</span>
                </div>
              )}
              <div className="h-[450px] w-full bg-[#f8fafc] rounded-xl overflow-hidden border border-[#d0d5da]">
                {chartLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500 text-[13px] font-normal">Loading chart data...</span>
                  </div>
                ) : chartError ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <span className="text-red-500 text-[13px] font-normal">{chartError}</span>
                    <button 
                      onClick={() => {/* Add retry function */}} 
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Try again
                    </button>
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-1.5">
                    <span className="text-gray-500 text-sm">No data available</span>
                    <span className="text-xs text-gray-400">Try selecting a different timeframe</span>
                  </div>
                ) : (
                  <CandleChart 
                    data={chartData} 
                    showIndicators={showIndicators} 
                    visibleIndicators={visibleIndicators} 
                    keyLevels={keyLevels} 
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Right column */}
      <div className="w-full lg:flex-[0_0_30%] lg:min-w-0">
        <Card className="shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-[#374050] uppercase tracking-wide">AI Analysis</h3>
              <Button 
                onClick={handleAnalyzeClick} 
                disabled={isAnalysisLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium h-[38px] px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {isAnalysisLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4V2M12 22v-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Analyze</span>
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50/80 border border-[#d0d5da] rounded-lg p-4">
                <h4 className="text-sm font-bold text-[#374050] uppercase tracking-wide mb-3">Signal</h4>
                {isAnalysisLoading ? (
                  <div className="space-y-2">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <p className={`font-semibold text-lg font-mono ${
                        signal === 'Buy' ? 'text-green-500' :
                        signal === 'Sell' ? 'text-red-500' :
                        'text-gray-600'
                      }`}>
                        {signal}
                      </p>
                      {entryPrice && (
                        <span className="text-xs text-gray-500 font-mono ">@ {entryPrice.toFixed(5)}</span>
                      )}
                    </div>
                    {signal && signalStrength !== null && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-[#374050]">Signal Strength</span>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${
                              signalStrength >= 70 ? 'bg-green-500' :
                              signalStrength >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            <span className="text-[13px] font-bold text-[#374050] font-mono tabular-nums">{signalStrength}%</span>
                          </div>
                        </div>
                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`absolute left-0 top-0 h-full transition-all duration-500 rounded-full ${
                              signalStrength >= 70 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                              signalStrength >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                              'bg-gradient-to-r from-red-500 to-red-400'
                            }`}
                            style={{ 
                              width: `${signalStrength}%`,
                              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                          ></div>
                          <div className="absolute inset-0 grid grid-cols-4">
                            {[25, 50, 75].map((threshold) => (
                              <div
                                key={threshold}
                                className="relative h-full"
                                style={{ left: 'calc(100% - 1px)' }}
                              >
                                <div className="absolute top-0 w-px h-full bg-white/50"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
                          <span>Weak</span>
                          <span>Moderate</span>
                          <span>Strong</span>
                          <span>Very Strong</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/80 border border-[#d0d5da] rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#374050] uppercase tracking-wide mb-3">SL</h4>
                  {isAnalysisLoading ? (
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-red-500 text-sm font-bold text-lg">{stopLoss || 'N/A'}</p>
                  )}
                </div>

                <div className="bg-gray-50 border border-[#d0d5da] rounded-lg p-4">
                  <h4 className="text-sm font-bold text-[#374050] mb-3">TP</h4>
                  {isAnalysisLoading ? (
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-green-500 text-sm font-bold text-lg">{takeProfit || 'N/A'}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border border-[#d0d5da] rounded-lg p-4">
                <h4 className="text-sm font-bold text-[#374050] mb-3">Analysis</h4>
                {isAnalysisLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <ul className="list-disc pl-5 space-y-2">
                    {confluences.map((reason, index) => (
                      <li key={index} className="text-gray-600 text-sm leading-relaxed">
                        {reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};
