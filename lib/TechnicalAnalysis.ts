import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';
// Correcting the import path based on project structure analysis
import { getChartData } from './chartsData'; 

// --- TYPE DEFINITIONS ---
// Extending CandlestickData to include calculated indicators and volume
export interface EnhancedCandle extends CandlestickData<UTCTimestamp> {
    volume?: number;
    ema200?: number;
    ema50?: number;
    ema21?: number;  // Added for short-term trend
    rsi14?: number;
    avgVolume?: number;
    atr14?: number; // Added for volatility-based SL/TP
    vwap?: number;   // Added for institutional interest
    obv?: number;    // Added for volume trend
    macd?: {         // Added for trend momentum
        line: number;
        signal: number;
        histogram: number;
    };
}

export interface TradingSignal {
    signal: 'Buy' | 'Sell' | 'None';
    strength: number;        // Integer 0-80
    stopLoss: number;       // Will be 0 when no signal
    takeProfit: number;     // Will be 0 when no signal
    entryPrice: number;     // Will be 0 when no signal
    confluences: string[];
    riskRewardRatio: number; // Will be 0 when no signal
}

// Add configuration interface at the top after imports
export interface TradingConfig {
    minConfluences: number;      // Minimum confluences required for trade entry
    atrMultiplier: number;       // Multiplier for ATR-based stop loss
    riskRewardRatio: number;     // Target risk-reward ratio
    volumeThreshold: number;     // Volume spike threshold multiplier
    priceDeviation: number;      // Maximum price deviation for level testing (%)
}

// Default configuration
export const defaultTradingConfig: TradingConfig = {
    minConfluences: 2,
    atrMultiplier: 1.5,
    riskRewardRatio: 2,
    volumeThreshold: 1.8,
    priceDeviation: 0.003
};

// --- INDICATOR CALCULATIONS ---

/**
 * Calculates Exponential Moving Average (EMA).
 */
const calculateEMA = (data: { close: number }[], period: number): (number | undefined)[] => {
    if (data.length < period) return new Array(data.length).fill(undefined);
    const ema: (number | undefined)[] = new Array(data.length).fill(undefined);
    const k = 2 / (period + 1);
    
    // First EMA is a simple moving average
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += data[i].close;
    }
    ema[period - 1] = sum / period;

    // Subsequent EMAs
    for (let i = period; i < data.length; i++) {
        ema[i] = (data[i].close * k) + (ema[i - 1]! * (1 - k));
    }
    return ema;
};

/**
 * Calculates Relative Strength Index (RSI).
 */
const calculateRSI = (data: { close: number }[], period: number = 14): (number | undefined)[] => {
    if (data.length <= period) return new Array(data.length).fill(undefined);
    
    const rsi: (number | undefined)[] = new Array(data.length).fill(undefined);
    const changes = data.map((d, i) => i > 0 ? d.close - data[i-1].close : 0);
    
    let gain = 0;
    let loss = 0;

    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
        if (changes[i] > 0) {
            gain += changes[i];
        } else {
            loss += Math.abs(changes[i]);
        }
    }

    let avgGain = gain / period;
    let avgLoss = loss / period;

    for (let i = period; i < data.length; i++) {
        if (i > period) {
            const currentChange = changes[i];
            const currentGain = currentChange > 0 ? currentChange : 0;
            const currentLoss = currentChange < 0 ? Math.abs(currentChange) : 0;
            avgGain = (avgGain * (period - 1) + currentGain) / period;
            avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
        }

        if (avgLoss === 0) {
            rsi[i] = 100;
        } else {
            const rs = avgGain / avgLoss;
            rsi[i] = 100 - (100 / (1 + rs));
        }
    }
    return rsi;
};

/**
 * Calculates the average volume over a period.
 */
const calculateAvgVolume = (data: { volume?: number }[], period: number = 20): (number | undefined)[] => {
    if (data.length < period) return new Array(data.length).fill(undefined);
    const avgVolume: (number | undefined)[] = new Array(data.length).fill(undefined);
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        let count = 0;
        for (let j = 0; j < period; j++) {
            if(data[i-j].volume !== undefined) {
                sum += data[i - j].volume!;
                count++;
            }
        }
        if (count > 0) {
            avgVolume[i] = sum / count;
        }
    }
    return avgVolume;
}

const calculateATR = (data: EnhancedCandle[], period: number = 14): (number | undefined)[] => {
    if (data.length < period) return new Array(data.length).fill(undefined);

    const atr: (number | undefined)[] = new Array(data.length).fill(undefined);
    let previousAtr: number | undefined = undefined;

    for (let i = 0; i < data.length; i++) {
        const candle = data[i];
        const prevCandle = i > 0 ? data[i - 1] : null;

        if (!prevCandle) continue;

        const tr1 = candle.high - candle.low;
        const tr2 = Math.abs(candle.high - prevCandle.close);
        const tr3 = Math.abs(candle.low - prevCandle.close);
        const trueRange = Math.max(tr1, tr2, tr3);

        if (i < period) {
            if (atr[period - 1] === undefined) atr[period - 1] = 0;
            atr[period - 1]! += trueRange;
            if (i === period - 1) {
                atr[period - 1]! /= period;
                previousAtr = atr[period - 1];
            }
        } else {
            const currentAtr = (previousAtr! * (period - 1) + trueRange) / period;
            atr[i] = currentAtr;
            previousAtr = currentAtr;
        }
    }
    return atr;
};

// --- CONFLUENCE ANALYSIS ---

// 1. Trend Detection (1H)
const detectTrend = (data: EnhancedCandle[]): 'strong_uptrend' | 'weak_uptrend' | 'strong_downtrend' | 'weak_downtrend' | 'ranging' => {
    const lastCandle = data[data.length - 1];
    const prevCandle = data[data.length - 10];
    
    if (!lastCandle?.ema200 || !lastCandle?.ema50 || !lastCandle?.ema21 || 
        !prevCandle?.ema200 || !prevCandle?.ema50 || !prevCandle?.ema21) {
        return 'ranging';
    }

    const ema200Slope = lastCandle.ema200 - prevCandle.ema200;
    const ema50Slope = lastCandle.ema50 - prevCandle.ema50;
    const ema21Slope = lastCandle.ema21 - prevCandle.ema21;

    // Strong uptrend conditions
    if (lastCandle.ema21 > lastCandle.ema50 && 
        lastCandle.ema50 > lastCandle.ema200 && 
        ema200Slope > 0 && ema50Slope > 0 && ema21Slope > 0) {
        return 'strong_uptrend';
    }

    // Weak uptrend conditions
    if (lastCandle.close > lastCandle.ema200 && ema50Slope > 0) {
        return 'weak_uptrend';
    }

    // Strong downtrend conditions
    if (lastCandle.ema21 < lastCandle.ema50 && 
        lastCandle.ema50 < lastCandle.ema200 && 
        ema200Slope < 0 && ema50Slope < 0 && ema21Slope < 0) {
        return 'strong_downtrend';
    }

    // Weak downtrend conditions
    if (lastCandle.close < lastCandle.ema200 && ema50Slope < 0) {
        return 'weak_downtrend';
    }

    return 'ranging';
};

// 2. Find Swing Points for S/R and SL
const findSwingPoints = (data: EnhancedCandle[], lookback: number): { highs: EnhancedCandle[], lows: EnhancedCandle[] } => {
    const swingHighs: EnhancedCandle[] = [];
    const swingLows: EnhancedCandle[] = [];
    for (let i = lookback; i < data.length - lookback; i++) {
        const window = data.slice(i - lookback, i + lookback + 1);
        const currentCandle = data[i];
        
        const isSwingHigh = window.every(c => currentCandle.high >= c.high);
        if (isSwingHigh) swingHighs.push(currentCandle);

        const isSwingLow = window.every(c => currentCandle.low <= c.low);
        if (isSwingLow) swingLows.push(currentCandle);
    }
    return { highs: swingHighs, lows: swingLows };
};

// 3. RSI Divergence
const detectRsiDivergence = (data: EnhancedCandle[], trend: 'uptrend' | 'downtrend'): boolean => {
    const lookback = 30;
    const recentData = data.slice(-lookback);
    if (recentData.length < lookback) return false;

    const { lows, highs } = findSwingPoints(recentData, 5);

    if (trend === 'uptrend' && lows.length >= 2) { // Bullish divergence
        const lastLow = lows[lows.length - 1];
        const prevLow = lows[lows.length - 2];
        if (lastLow.low < prevLow.low && lastLow.rsi14! > prevLow.rsi14!) {
            return true;
        }
    }
    
    if (trend === 'downtrend' && highs.length >= 2) { // Bearish divergence
        const lastHigh = highs[highs.length - 1];
        const prevHigh = highs[highs.length - 2];
        if (lastHigh.high > prevHigh.high && lastHigh.rsi14! < prevHigh.rsi14!) {
            return true;
        }
    }

    return false;
};

// --- MAIN ANALYSIS FUNCTION ---
export const getHigherTimeframe = (timeframe: string): string => {
    switch (timeframe) {
        case '1m':
            return '5m';
        case '5m':
            return '15m';
        case '15m':
            return '1h';
        case '30m':
            return '1h';
        case '1h':
            return '4h';
        case '4h':
            return '1d';    
        default:
            return '4h'; // For '4h' and any other case
    }
};

export const analyzeConfluences = async (
    pair: string, 
    timeframe: string,
    config: Partial<TradingConfig> = {}
): Promise<TradingSignal> => {
    const tradingConfig: TradingConfig = {
        ...defaultTradingConfig,
        ...config
    };

    const higherTimeframe = getHigherTimeframe(timeframe);
    const [higherTimeframeData, entryTimeframeData] = await Promise.all([
        getChartData(pair, higherTimeframe),
        getChartData(pair, timeframe)
    ]);

    if (!higherTimeframeData || higherTimeframeData.length < 200 || !entryTimeframeData || entryTimeframeData.length < 200) {
        return {
            signal: 'None',
            strength: 0,
            stopLoss: 0,
            takeProfit: 0,
            entryPrice: 0,
            confluences: ['Insufficient data for analysis - Equal buy/sell pressure'],
            riskRewardRatio: 0
        };
    }

    // Calculate all indicators
    const ema200_htf = calculateEMA(higherTimeframeData, 200);
    const ema50_htf = calculateEMA(higherTimeframeData, 50);
    const ema21_htf = calculateEMA(higherTimeframeData, 21);

    const enhancedHTF: EnhancedCandle[] = higherTimeframeData.map((d, i) => ({ 
        ...d, 
        time: d.time as UTCTimestamp, 
        ema200: ema200_htf[i],
        ema50: ema50_htf[i],
        ema21: ema21_htf[i]
    }));

    // Entry timeframe indicators
    const ema200_entry = calculateEMA(entryTimeframeData, 200);
    const ema50_entry = calculateEMA(entryTimeframeData, 50);
    const ema21_entry = calculateEMA(entryTimeframeData, 21);
    const rsi14_entry = calculateRSI(entryTimeframeData, 14);
    const atr14_entry = calculateATR(entryTimeframeData.map(d => ({...d, time: d.time as UTCTimestamp})), 14);
    const vwap_entry = calculateVWAP(entryTimeframeData.map(d => ({...d, time: d.time as UTCTimestamp})));
    const obv_entry = calculateOBV(entryTimeframeData.map(d => ({...d, time: d.time as UTCTimestamp})));
    const macd_entry = calculateMACD(entryTimeframeData);

    const enhancedEntry: EnhancedCandle[] = entryTimeframeData.map((d, i) => ({ 
        ...d,
        time: d.time as UTCTimestamp,
        ema200: ema200_entry[i],
        ema50: ema50_entry[i],
        ema21: ema21_entry[i],
        rsi14: rsi14_entry[i],
        atr14: atr14_entry[i],
        vwap: vwap_entry[i],
        obv: obv_entry[i],
        macd: macd_entry.macdLine[i] !== undefined ? {
            line: macd_entry.macdLine[i]!,
            signal: macd_entry.signalLine[i]!,
            histogram: macd_entry.histogram[i]!
        } : undefined
    }));

    const lastCandle = enhancedEntry[enhancedEntry.length - 1];
    
    // Handle incomplete indicator data
    if (!lastCandle || !lastCandle.ema50 || !lastCandle.rsi14) {
        return {
            signal: 'None',
            strength: 0,
            stopLoss: 0,
            takeProfit: 0,
            entryPrice: 0,
            confluences: ['Incomplete indicator data - Equal buy/sell pressure'],
            riskRewardRatio: 0
        };
    }

    const trend = detectTrend(enhancedEntry);
    const { supports, resistances } = findKeyLevels(enhancedEntry);
    const buyConfluences: string[] = [];
    const sellConfluences: string[] = [];

    // Analyze bullish confluences
    if (lastCandle.close > lastCandle.vwap!) {
        buyConfluences.push('Price above VWAP');
    }
    if (lastCandle.rsi14 > 40 && lastCandle.rsi14 < 65) {
        buyConfluences.push('RSI in optimal buy zone');
    }
    if (lastCandle.macd && lastCandle.macd.histogram > 0) {
        buyConfluences.push('Positive MACD momentum');
    }
    if (lastCandle.close > lastCandle.open) {
        buyConfluences.push('Bullish candle');
    }

    // Analyze bearish confluences
    if (lastCandle.close < lastCandle.vwap!) {
        sellConfluences.push('Price below VWAP');
    }
    if (lastCandle.rsi14 < 60 && lastCandle.rsi14 > 35) {
        sellConfluences.push('RSI in optimal sell zone');
    }
    if (lastCandle.macd && lastCandle.macd.histogram < 0) {
        sellConfluences.push('Negative MACD momentum');
    }
    if (lastCandle.close < lastCandle.open) {
        sellConfluences.push('Bearish candle');
    }

    // Determine signal based on confluences, with None for ties
    let signal: 'Buy' | 'Sell' | 'None';
    let confluences: string[];
    
    if (buyConfluences.length > sellConfluences.length) {
        signal = 'Buy';
        confluences = [...buyConfluences];
    } else if (sellConfluences.length > buyConfluences.length) {
        signal = 'Sell';
        confluences = [...sellConfluences];
    } else {
        signal = 'None';
        confluences = [`Equal buy/sell pressure (${buyConfluences.length} confluences each)`, 
                      'Buy signals: ' + buyConfluences.join(', '),
                      'Sell signals: ' + sellConfluences.join(', ')];
    }

    // Calculate strength (capped at 80)
    const strength = signal === 'None' ? 0 : Math.min(100, Math.round((confluences.length / 5) * 100));

    // Calculate SL and TP based on signal
    if (signal === 'Buy') {
        const recentLows = entryTimeframeData.slice(-5).map(c => c.low);
        const structuralStop = Math.min(...recentLows) - (lastCandle.atr14! * 0.5);
        const atrStop = lastCandle.low - (lastCandle.atr14! * tradingConfig.atrMultiplier);
        const stopLoss = Math.max(structuralStop, atrStop);
        const riskAmount = lastCandle.close - stopLoss;
        const takeProfit = lastCandle.close + (riskAmount * (trend === 'strong_uptrend' ? 3.2 : 2.5));

        return {
            signal,
            strength,
            stopLoss,
            takeProfit,
            entryPrice: lastCandle.close,
            confluences,
            riskRewardRatio: trend === 'strong_uptrend' ? 3.2 : 2.5
        };
    } else if (signal === 'Sell') {
        const recentHighs = entryTimeframeData.slice(-5).map(c => c.high);
        const structuralStop = Math.max(...recentHighs) + (lastCandle.atr14! * 0.5);
        const atrStop = lastCandle.high + (lastCandle.atr14! * tradingConfig.atrMultiplier);
        const stopLoss = Math.min(structuralStop, atrStop);
        const riskAmount = stopLoss - lastCandle.close;
        const takeProfit = lastCandle.close - (riskAmount * (trend === 'strong_downtrend' ? 3.2 : 2.5));

        return {
            signal,
            strength,
            stopLoss,
            takeProfit,
            entryPrice: lastCandle.close,
            confluences,
            riskRewardRatio: trend === 'strong_downtrend' ? 3.2 : 2.5
        };
    } else {
        // None case - return 0 for all numerical values
        return {
            signal: 'None',
            strength: 0,
            stopLoss: 0,
            takeProfit: 0,
            entryPrice: 0,
            confluences,
            riskRewardRatio: 0
        };
    }
};

// Added VWAP calculation
const calculateVWAP = (data: EnhancedCandle[]): number[] => {
    const vwap: number[] = [];
    let cumulativeTPV = 0;
    let cumulativeVolume = 0;

    data.forEach((candle, i) => {
        const typicalPrice = (candle.high + candle.low + candle.close) / 3;
        const volume = candle.volume || 0;
        
        cumulativeTPV += typicalPrice * volume;
        cumulativeVolume += volume;
        
        vwap[i] = cumulativeVolume > 0 ? cumulativeTPV / cumulativeVolume : typicalPrice;
    });

    return vwap;
};

// Added OBV calculation
const calculateOBV = (data: EnhancedCandle[]): number[] => {
    const obv: number[] = [0];
    
    for (let i = 1; i < data.length; i++) {
        const currentClose = data[i].close;
        const previousClose = data[i - 1].close;
        const currentVolume = data[i].volume || 0;
        
        if (currentClose > previousClose) {
            obv[i] = obv[i - 1] + currentVolume;
        } else if (currentClose < previousClose) {
            obv[i] = obv[i - 1] - currentVolume;
        } else {
            obv[i] = obv[i - 1];
        }
    }
    
    return obv;
};

// Enhanced MACD calculation
const calculateMACD = (data: { close: number }[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);
    const macdLine = fastEMA.map((fast, i) => 
        fast && slowEMA[i] ? fast - slowEMA[i] : undefined
    );
    
    const signalLine = calculateEMA(
        macdLine.map(value => ({ close: value || 0 })),
        signalPeriod
    );
    
    const histogram = macdLine.map((macd, i) => 
        macd && signalLine[i] ? macd - signalLine[i] : undefined
    );

    return { macdLine, signalLine, histogram };
};

// Enhanced support/resistance detection with volume confirmation
const findKeyLevels = (data: EnhancedCandle[], lookback: number = 100): { supports: number[], resistances: number[] } => {
    const levels = new Map<number, { count: number, volume: number }>();
    const priceRounding = 4; // Round prices to 4 decimal places for clustering

    // Analyze price levels with volume
    data.slice(-lookback).forEach(candle => {
        const highKey = Number(candle.high.toFixed(priceRounding));
        const lowKey = Number(candle.low.toFixed(priceRounding));
        const volume = candle.volume || 0;

        if (!levels.has(highKey)) {
            levels.set(highKey, { count: 0, volume: 0 });
        }
        if (!levels.has(lowKey)) {
            levels.set(lowKey, { count: 0, volume: 0 });
        }

        levels.get(highKey)!.count++;
        levels.get(highKey)!.volume += volume;
        levels.get(lowKey)!.count++;
        levels.get(lowKey)!.volume += volume;
    });

    // Filter significant levels
    const significantLevels = Array.from(levels.entries())
        .filter(([_, data]) => data.count >= 3 && data.volume > 0)
        .sort((a, b) => b[1].count - a[1].count);

    const lastPrice = data[data.length - 1].close;
    const supports = significantLevels
        .filter(([price, _]) => price < lastPrice)
        .slice(0, 3)
        .map(([price, _]) => price);
    
    const resistances = significantLevels
        .filter(([price, _]) => price > lastPrice)
        .slice(0, 3)
        .map(([price, _]) => price);

    return { supports, resistances };
};

// Enhanced divergence detection with volume confirmation
const detectDivergence = (data: EnhancedCandle[], trend: string): boolean => {
    const lookback = 30;
    const recentData = data.slice(-lookback);
    if (recentData.length < lookback) return false;

    const { lows, highs } = findSwingPoints(recentData, 5);
    const volumeThreshold = recentData.reduce((sum, candle) => sum + (candle.volume || 0), 0) / lookback * 1.5;

    if (trend.includes('uptrend') && lows.length >= 2) {
        const lastLow = lows[lows.length - 1];
        const prevLow = lows[lows.length - 2];
        if (lastLow.low < prevLow.low && 
            lastLow.rsi14! > prevLow.rsi14! && 
            (lastLow.volume || 0) > volumeThreshold) {
            return true;
        }
    }
    
    if (trend.includes('downtrend') && highs.length >= 2) {
        const lastHigh = highs[highs.length - 1];
        const prevHigh = highs[highs.length - 2];
        if (lastHigh.high > prevHigh.high && 
            lastHigh.rsi14! < prevHigh.rsi14! && 
            (lastHigh.volume || 0) > volumeThreshold) {
            return true;
        }
    }

    return false;
};
