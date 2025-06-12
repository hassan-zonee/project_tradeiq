import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  LineSeries,
  CandlestickData,
  LineData,
  Time,
  HistogramSeries,
  HistogramData,
  LineStyle} from "lightweight-charts";

// Helper function to calculate Exponential Moving Average (EMA)
const calculateEMA = (data: CandlestickData<Time>[], period: number): LineData<Time>[] => {
  const emaData: LineData<Time>[] = [];
  if (data.length < period) return emaData;

  const k = 2 / (period + 1);
  // First EMA is an SMA
  let sumForSma = 0;
  for (let i = 0; i < period; i++) {
    sumForSma += data[i].close;
  }
  let prevEma = sumForSma / period;
  emaData.push({ time: data[period - 1].time, value: prevEma });

  for (let i = period; i < data.length; i++) {
    const currentEma = (data[i].close * k) + (prevEma * (1 - k));
    emaData.push({ time: data[i].time, value: currentEma });
    prevEma = currentEma;
  }
  return emaData;
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

// Helper function to calculate Parabolic SAR (PSAR)
const calculateParabolicSAR = (
  data: CandlestickData<Time>[],
  initialAf: number = 0.02,
  incrementAf: number = 0.02,
  maxAf: number = 0.20
): LineData<Time>[] => {
  const psarData: LineData<Time>[] = [];
  if (data.length < 2) return psarData;

  let isLong = data[1].close > data[0].close; // Initial trend guess
  let af = initialAf;
  let extremePoint = isLong ? Math.max(data[0].high, data[1].high) : Math.min(data[0].low, data[1].low);
  let sar = isLong ? data[0].low : data[0].high;

  // First point (or first calculable point)
  // The first SAR point is typically the prior EP (high for short, low for long)
  // For simplicity, we start calculating SAR from the second bar, using the first bar's data for initial EP/SAR.
  // Some implementations might skip the first few bars or use different initialization.
  psarData.push({ time: data[0].time, value: sar }); 

  for (let i = 1; i < data.length; i++) {
    const prevSar = sar;
    const prevAf = af;
    const prevExtremePoint = extremePoint;

    if (isLong) {
      sar = prevSar + prevAf * (prevExtremePoint - prevSar);
      if (data[i].low < sar) { // Switch to short
        isLong = false;
        sar = prevExtremePoint; // SAR becomes the highest point of the previous uptrend
        extremePoint = data[i].low;
        af = initialAf;
      } else {
        if (data[i].high > prevExtremePoint) {
          extremePoint = data[i].high;
          af = Math.min(maxAf, prevAf + incrementAf);
        }
      }
    } else { // isShort
      sar = prevSar - prevAf * (prevSar - prevExtremePoint);
      if (data[i].high > sar) { // Switch to long
        isLong = true;
        sar = prevExtremePoint; // SAR becomes the lowest point of the previous downtrend
        extremePoint = data[i].high;
        af = initialAf;
      } else {
        if (data[i].low < prevExtremePoint) {
          extremePoint = data[i].low;
          af = Math.min(maxAf, prevAf + incrementAf);
        }
      }
    }
    // Ensure SAR does not cross the previous or current period's high/low too aggressively
    if (isLong) {
        sar = Math.min(sar, data[i-1].low, (i > 1 ? data[i-2].low : data[i-1].low));
        if (data[i].low < sar) sar = data[i].low; // Additional check if SAR is broken intraday
    } else {
        sar = Math.max(sar, data[i-1].high, (i > 1 ? data[i-2].high : data[i-1].high));
        if (data[i].high > sar) sar = data[i].high; // Additional check
    }

    psarData.push({ time: data[i].time, value: sar });
  }
  return psarData;
};


// Helper function to calculate MACD
interface MACDOutput {
  macdLine: LineData<Time>[];
  signalLine: LineData<Time>[];
  histogram: HistogramData<Time>[];
}

const calculateMACD = (
  data: CandlestickData<Time>[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDOutput => {
  const macdLine: LineData<Time>[] = [];
  const signalLine: LineData<Time>[] = [];
  const histogram: HistogramData<Time>[] = [];

  if (data.length < slowPeriod) return { macdLine, signalLine, histogram };

  const fastEMACalc = calculateEMA(data, fastPeriod);
  const slowEMACalc = calculateEMA(data, slowPeriod);

  // Align EMAs and calculate MACD line
  // EMAs might have different starting points, so we need to align them by time
  const alignedMacdValues: { time: Time; value: number }[] = [];
  let slowIdx = 0;
  for (let i = 0; i < fastEMACalc.length; i++) {
    const fastPoint = fastEMACalc[i];
    while (slowIdx < slowEMACalc.length && slowEMACalc[slowIdx].time < fastPoint.time) {
      slowIdx++;
    }
    if (slowIdx < slowEMACalc.length && slowEMACalc[slowIdx].time === fastPoint.time) {
      const macdValue = fastPoint.value - slowEMACalc[slowIdx].value;
      macdLine.push({ time: fastPoint.time, value: macdValue });
      alignedMacdValues.push({ time: fastPoint.time, value: macdValue });
    }
  }

  if (alignedMacdValues.length < signalPeriod) return { macdLine, signalLine, histogram };

  // Calculate Signal line (EMA of MACD line)
  // We need to convert MACD values to CandlestickData-like structure for calculateEMA
  const macdForSignalEMA: CandlestickData<Time>[] = alignedMacdValues.map(p => ({ time: p.time, open: p.value, high: p.value, low: p.value, close: p.value }));
  const signalLineCalc = calculateEMA(macdForSignalEMA, signalPeriod);
  signalLine.push(...signalLineCalc);
  
  // Align MACD and Signal lines and calculate Histogram
  let signalIdx = 0;
  for (let i = 0; i < macdLine.length; i++) {
    const macdPoint = macdLine[i];
    while (signalIdx < signalLine.length && signalLine[signalIdx].time < macdPoint.time) {
      signalIdx++;
    }
    if (signalIdx < signalLine.length && signalLine[signalIdx].time === macdPoint.time) {
      const histValue = macdPoint.value - signalLine[signalIdx].value;
      histogram.push({ time: macdPoint.time, value: histValue, color: histValue >= 0 ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255, 82, 82, 0.8)' });
    }
  }

  return { macdLine, signalLine, histogram };
};



// Helper function to calculate Bollinger Bands
function calculateBollingerBands(
  data: CandlestickData<Time>[],
  period = 20,
  k = 2 // Standard deviations
): {
  upper: LineData<Time>[];
  middle: LineData<Time>[];
  lower: LineData<Time>[];
} {
  const upperData: LineData<Time>[] = [];
  const middleData: LineData<Time>[] = [];
  const lowerData: LineData<Time>[] = [];

  if (data.length < period) {
    return { upper: upperData, middle: middleData, lower: lowerData };
  }

  for (let i = period - 1; i < data.length; i++) {
    const currentSlice = data.slice(i - period + 1, i + 1);
    const closes = currentSlice.map(d => d.close);
    const currentTime = data[i].time;

    const sma = closes.reduce((acc, val) => acc + val, 0) / period;
    if (isNaN(sma)) continue; // Skip if SMA is not a number

    middleData.push({ time: currentTime, value: sma });

    let variance = 0;
    for (const close of closes) {
      variance += Math.pow(close - sma, 2);
    }
    const stdDev = Math.sqrt(variance / period);

    const upperBandValue = sma + k * stdDev;
    if (!isNaN(upperBandValue)) {
      upperData.push({ time: currentTime, value: upperBandValue });
    }

    const lowerBandValue = sma - k * stdDev;
    if (!isNaN(lowerBandValue)) {
      lowerData.push({ time: currentTime, value: lowerBandValue });
    }
  }
  return { upper: upperData, middle: middleData, lower: lowerData };
}

export type IndicatorType = 'rsi' | 'macd' | 'ema21' | 'ema50' | 'ema200' | 'psar' | 'bollinger';

interface KeyLevels {
  support: number | null;
  resistance: number | null;
}

interface CandleChartProps {
  data: CandlestickData<Time>[];
  showIndicators?: boolean;
  visibleIndicators?: IndicatorType[];
  keyLevels?: KeyLevels;
}

export const CandleChart: React.FC<CandleChartProps> = ({ data, showIndicators = false, visibleIndicators = [], keyLevels }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const macdLineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const macdSignalSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const macdHistogramSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const ema21SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const ema50SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const ema200SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const parabolicSARSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const bbUpperRef = useRef<ISeriesApi<'Line'> | null>(null);
  const bbMiddleRef = useRef<ISeriesApi<'Line'> | null>(null);
  const bbLowerRef = useRef<ISeriesApi<'Line'> | null>(null);
  const supportLineRef = useRef<any | null>(null);
  const resistanceLineRef = useRef<any | null>(null);

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
          rightOffset: 15, // Number of bars for padding
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
    if (chartRef.current && candlestickSeriesRef.current && data.length > 0) {
      candlestickSeriesRef.current.setData(data);

      // Set a default visible range to show the last 70 candles with padding
      const dataLength = data.length;
      if (dataLength > 0) {
        const PADDING_BARS = 5 // Match this with timeScale.rightOffset if desired
        const logicalFrom = Math.max(0, dataLength - 50); // Show latest 70 data points
        const logicalTo = (dataLength - 1) + PADDING_BARS; // Extend range by PADDING_BARS beyond the last data point
        chartRef.current.timeScale().setVisibleLogicalRange({ from: logicalFrom, to: logicalTo });
      }
    } else if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData([]); // Clear data if `data` prop is empty
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
    if (!chartRef.current || !candlestickSeriesRef.current || !data || data.length < 20) {
      return;
    }

    const chart = chartRef.current;
    const series = candlestickSeriesRef.current;

    // Clear and draw key level lines
    if (supportLineRef.current) {
      series.removePriceLine(supportLineRef.current);
      supportLineRef.current = null;
    }
    if (resistanceLineRef.current) {
      series.removePriceLine(resistanceLineRef.current);
      resistanceLineRef.current = null;
    }

    if (keyLevels?.support) {
      supportLineRef.current = series.createPriceLine({
        price: keyLevels.support,
        color: '#ef4444', // red-500
        lineWidth: 3,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: '',
      });
    }

    if (keyLevels?.resistance) {
      resistanceLineRef.current = series.createPriceLine({
        price: keyLevels.resistance,
        color: '#ef4444', // red-500
        lineWidth: 3,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: '',
      });
    }

    const removeSeries = (seriesRef: React.MutableRefObject<ISeriesApi<any> | null>) => {
      if (seriesRef.current) {
        try {
          chart.removeSeries(seriesRef.current);
        } catch (e) {
          console.warn("Failed to remove series:", e);
        }
        seriesRef.current = null;
      }
    };

    // Clear all indicators before redrawing
    removeSeries(rsiSeriesRef);
    removeSeries(macdLineSeriesRef);
    removeSeries(macdSignalSeriesRef);
    removeSeries(macdHistogramSeriesRef);
    removeSeries(ema21SeriesRef);
    removeSeries(ema50SeriesRef);
    removeSeries(ema200SeriesRef);
    removeSeries(parabolicSARSeriesRef);
    removeSeries(bbUpperRef);
    removeSeries(bbMiddleRef);
    removeSeries(bbLowerRef);

    if (showIndicators) {
      if (visibleIndicators.includes('rsi')) {
        const rsiData = calculateRSI(data, 14);
        if (rsiData.length > 0) {
          rsiSeriesRef.current = chart.addSeries(LineSeries, {
            color: 'rgba(128, 0, 128, 0.8)',
            lineWidth: 2,
            priceScaleId: '', // New pane
            autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }),
            lastValueVisible: true,
            priceLineVisible: true,
          });
          rsiSeriesRef.current.setData(rsiData);
          chart.priceScale('').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
        }
      }

      if (visibleIndicators.includes('macd')) {
        const { macdLine, signalLine, histogram } = calculateMACD(data);
        const macdPaneId = 'macdPane';
        if (macdLine.length > 0) {
          macdLineSeriesRef.current = chart.addSeries(LineSeries, {
            color: 'rgba(0, 120, 255, 0.8)',
            lineWidth: 2,
            priceScaleId: macdPaneId,
          });
          macdLineSeriesRef.current.setData(macdLine);
        }
        if (signalLine.length > 0) {
          macdSignalSeriesRef.current = chart.addSeries(LineSeries, {
            color: 'rgba(255, 100, 0, 0.8)',
            lineWidth: 2,
            priceScaleId: macdPaneId,
          });
          macdSignalSeriesRef.current.setData(signalLine);
        }
        if (histogram.length > 0) {
          macdHistogramSeriesRef.current = chart.addSeries(HistogramSeries, {
            priceScaleId: macdPaneId,
          });
          macdHistogramSeriesRef.current.setData(histogram);
        }
        if (macdLine.length > 0 || signalLine.length > 0 || histogram.length > 0) {
          chart.priceScale(macdPaneId).applyOptions({ scaleMargins: { top: 0.7, bottom: 0 } });
        }
      }

      if (visibleIndicators.includes('ema21')) {
        const emaData = calculateEMA(data, 21);
        if (emaData.length > 0) {
          ema21SeriesRef.current = chart.addSeries(LineSeries, {
            color: 'rgba(255, 215, 0, 0.8)',
            lineWidth: 1,
          });
          ema21SeriesRef.current.setData(emaData);
        }
      }

      if (visibleIndicators.includes('ema50')) {
        const emaData = calculateEMA(data, 50);
        if (emaData.length > 0) {
          ema50SeriesRef.current = chart.addSeries(LineSeries, {
            color: 'rgba(30, 144, 255, 0.8)',
            lineWidth: 1,
          });
          ema50SeriesRef.current.setData(emaData);
        }
      }

      if (visibleIndicators.includes('ema200')) {
        const emaData = calculateEMA(data, 200);
        if (emaData.length > 0) {
          ema200SeriesRef.current = chart.addSeries(LineSeries, {
            color: 'rgba(138, 43, 226, 0.8)',
            lineWidth: 2,
          });
          ema200SeriesRef.current.setData(emaData);
        }
      }

      if (visibleIndicators.includes('psar')) {
        const psarData = calculateParabolicSAR(data);
        if (psarData.length > 0) {
          parabolicSARSeriesRef.current = chart.addSeries(LineSeries, {
            color: 'rgba(255, 165, 0, 0.8)',
            lineWidth: 2,
            lineStyle: LineStyle.Dotted,
            crosshairMarkerVisible: false,
          });
          parabolicSARSeriesRef.current.setData(psarData);
        }
      }

      if (visibleIndicators.includes('bollinger')) {
        const { upper, middle, lower } = calculateBollingerBands(data);
                const commonBBLineOptions = { lineWidth: 1, lastValueVisible: false, priceLineVisible: false } as const;
        if (upper.length > 0) {
          bbUpperRef.current = chart.addSeries(LineSeries, { ...commonBBLineOptions, color: 'rgba(33, 150, 243, 0.5)' });
          bbUpperRef.current.setData(upper);
        }
        if (middle.length > 0) {
          bbMiddleRef.current = chart.addSeries(LineSeries, { ...commonBBLineOptions, color: 'rgba(255, 152, 0, 0.7)', lineStyle: LineStyle.Dotted });
          bbMiddleRef.current.setData(middle);
        }
        if (lower.length > 0) {
          bbLowerRef.current = chart.addSeries(LineSeries, { ...commonBBLineOptions, color: 'rgba(33, 150, 243, 0.5)' });
          bbLowerRef.current.setData(lower);
        }
      }
    }
  }, [data, showIndicators, visibleIndicators, keyLevels]); // Re-run when data or showIndicators changes

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
