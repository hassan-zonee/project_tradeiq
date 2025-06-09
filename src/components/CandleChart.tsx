import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  LineSeries,
  CandlestickData,
  LineData,
  Time
} from "lightweight-charts";

// Helper function to calculate Simple Moving Average (SMA)
const calculateSMA = (data: CandlestickData<Time>[], period: number): LineData<Time>[] => {
  const smaData: LineData<Time>[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    smaData.push({ time: data[i].time, value: sum / period });
  }
  return smaData;
};

// Helper function to calculate Relative Strength Index (RSI)
const calculateRSI = (data: CandlestickData<Time>[], period: number = 14): LineData<Time>[] => {
  const rsiData: LineData<Time>[] = [];
  let gains = 0;
  let losses = 0;

  // Calculate initial average gains and losses
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) {
      gains += change;
    } else {
      losses -= change; // losses are positive
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) {
    rsiData.push({ time: data[period].time, value: 100 });
  } else {
    const rs = avgGain / avgLoss;
    rsiData.push({ time: data[period].time, value: 100 - 100 / (1 + rs) });
  }

  // Calculate subsequent RSI values
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    let currentGain = 0;
    let currentLoss = 0;

    if (change > 0) {
      currentGain = change;
    } else {
      currentLoss = -change;
    }

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    if (avgLoss === 0) {
      rsiData.push({ time: data[i].time, value: 100 });
    } else {
      const rs = avgGain / avgLoss;
      rsiData.push({ time: data[i].time, value: 100 - 100 / (1 + rs) });
    }
  }
  return rsiData;
};


interface CandleChartProps {
  data: CandlestickData<Time>[];
  showIndicators?: boolean;
}

export const CandleChart: React.FC<CandleChartProps> = ({ data, showIndicators = false }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const sma10SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const sma20SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const sma50SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#e1e1e1' },
          horzLines: { color: '#e1e1e1' },
        },
        timeScale: {
          rightOffset: 12,
          barSpacing: 8,
          borderColor: '#cccccc',
          timeVisible: true,
          secondsVisible: false,
        },
        // Define a separate price scale for RSI if needed, or let it auto-create
        // Example: leftPriceScale: { visible: true, mode: PriceScaleMode.Normal }, 
        // We will try to attach RSI to a new pane using priceScaleId: '' or 'rsi'
      });
      candlestickSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
        upColor: '#26a69a', 
        downColor: '#ef5350', 
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
    }

    // Update candlestick data
    if (candlestickSeriesRef.current && data && data.length > 0) {
      candlestickSeriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent(); // Fit content after data set
    }
    
    // Resize observer
    const resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== chartContainerRef.current) {
            return;
        }
        const { width, height } = entries[0].contentRect;
        chartRef.current?.applyOptions({ width, height });
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      // Chart removal is handled in the indicator effect's cleanup if showIndicators changes
      // Or here if the component unmounts entirely.
      // If we only remove series, the chart instance can persist.
    };
  }, [data]); // Only re-run if data changes. Chart creation is once.

  // Effect for handling indicators
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current || !data || data.length < 20) { // Need enough data for indicators
      return;
    }

    const chart = chartRef.current;

    // Helper to remove a series and its ref
    const removeSeries = (seriesRef: React.MutableRefObject<ISeriesApi<any> | null>) => {
      if (seriesRef.current) {
        try {
          chart.removeSeries(seriesRef.current);
        } catch (e) {
          console.warn("Error removing series:", e, seriesRef.current);
        }
        seriesRef.current = null;
      }
    };

    // Clear previous indicators before drawing new ones or if showIndicators is false
    removeSeries(sma10SeriesRef);
    removeSeries(sma20SeriesRef);
    removeSeries(sma50SeriesRef);
    removeSeries(rsiSeriesRef);

    if (showIndicators) {
      // Calculate and add SMAs
      const sma10Data = calculateSMA(data, 10);
      const sma20Data = calculateSMA(data, 20);
      const sma50Data = calculateSMA(data, 50);

      if (sma10Data.length > 0) {
        sma10SeriesRef.current = chart.addSeries(LineSeries, {
          color: 'rgba(255, 165, 0, 0.8)', // Orange
          lineWidth: 2,
          lastValueVisible: false,
          priceLineVisible: false,
          priceScaleId: 'right', // Attach to main price scale
        });
        if (sma10SeriesRef.current) sma10SeriesRef.current.setData(sma10Data);
      }

      if (sma20Data.length > 0) {
        sma20SeriesRef.current = chart.addSeries(LineSeries, {
          color: 'rgba(30, 144, 255, 0.8)', // DodgerBlue
          lineWidth: 2,
          lastValueVisible: false,
          priceLineVisible: false,
          priceScaleId: 'right',
        });
        if (sma20SeriesRef.current) sma20SeriesRef.current.setData(sma20Data);
      }

      if (sma50Data.length > 0) {
        sma50SeriesRef.current = chart.addSeries(LineSeries, {
          color: 'rgba(220, 20, 60, 0.8)', // Crimson
          lineWidth: 2,
          lastValueVisible: false,
          priceLineVisible: false,
          priceScaleId: 'right',
        });
        if (sma50SeriesRef.current) sma50SeriesRef.current.setData(sma50Data);
      }

      // Calculate and add RSI
      const rsiData = calculateRSI(data, 14);
      if (rsiData.length > 0) {
        // Attempt to place RSI on a new pane. 
        // This usually requires priceScaleId to be different from the main one ('right').
        // An empty string '' often works, or a unique ID.
        // The chart might need layout options for a second price scale if this doesn't auto-create a pane.
        rsiSeriesRef.current = chart.addSeries(LineSeries, {
          color: 'rgba(128, 0, 128, 0.8)', // Purple
          lineWidth: 2,
          priceScaleId: '', // Try to force to a new pane/scale
          // Forcing y-axis for RSI from 0 to 100
          autoscaleInfoProvider: () => ({
            priceRange: {
              minValue: 0,
              maxValue: 100,
            },
          }),
          lastValueVisible: true,
          priceLineVisible: true,
        });
        if (rsiSeriesRef.current) rsiSeriesRef.current.setData(rsiData);
        // Ensure the RSI pane's price scale is configured if needed
        // chart.priceScale('').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } }); // Example for RSI pane margins
      }
      chart.timeScale().fitContent(); // Fit content after adding indicators
    }

    // No specific cleanup needed here for this effect if series are managed by refs
    // The chart instance itself is cleaned up when the component unmounts (from the first useEffect)

  }, [data, showIndicators]); // Re-run when data or showIndicators changes

  // Cleanup chart instance on component unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />;
};
