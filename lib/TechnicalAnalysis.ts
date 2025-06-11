import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';
// Correcting the import path based on project structure analysis
import { getChartData } from './chartsData'; 

// --- TYPE DEFINITIONS ---
// Extending CandlestickData to include calculated indicators and volume
export interface EnhancedCandle extends CandlestickData<UTCTimestamp> {
    volume?: number;
    ema200?: number;
    ema50?: number;
    rsi14?: number;
    avgVolume?: number;
    atr14?: number; // Added for volatility-based SL/TP
}

export interface TradingSignal {
    signal: 'Buy' | 'Sell' | 'None';
    strength: number; // Number of confluences met (out of 6)
    stopLoss?: number;
    takeProfit?: number;
    entryPrice?: number;
    confluences: string[];
}

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
const detectTrend = (data: EnhancedCandle[]): 'uptrend' | 'downtrend' | 'ranging' => {
    const lastCandle = data[data.length - 1];
    const prevCandle = data[data.length - 10]; // Use a wider lookback for slope
    if (!lastCandle?.ema200 || !prevCandle?.ema200) return 'ranging';

    const slope = lastCandle.ema200 - prevCandle.ema200;
    if (lastCandle.close > lastCandle.ema200 && slope > 0) return 'uptrend';
    if (lastCandle.close < lastCandle.ema200 && slope < 0) return 'downtrend';
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

export const analyzeConfluences = async (pair: string, timeframe: string): Promise<TradingSignal> => {
    // Fetch data for both timeframes
    const higherTimeframe = getHigherTimeframe(timeframe);
    const [higherTimeframeData, entryTimeframeData] = await Promise.all([
        getChartData(pair, higherTimeframe),
        getChartData(pair, timeframe)
    ]);

    if (!higherTimeframeData || higherTimeframeData.length < 200 || !entryTimeframeData || entryTimeframeData.length < 200) {
        return { signal: 'None', strength: 0, confluences: ['Insufficient data for analysis.'] };
    }

    // 1. Higher Timeframe (1H) Analysis for Trend
    const ema200_htf = calculateEMA(higherTimeframeData, 200);
    const ema50_htf = calculateEMA(higherTimeframeData, 50);
    const enhancedHTF: EnhancedCandle[] = higherTimeframeData.map((d, i) => ({ 
        ...d, 
        time: d.time as UTCTimestamp, 
        ema200: ema200_htf[i],
        ema50: ema50_htf[i]
    }));
    const trend = detectTrend(enhancedHTF);

    // 2. Entry Timeframe (5min) Analysis
    const atr14_entry = calculateATR(entryTimeframeData.map(d => ({...d, time: d.time as UTCTimestamp})), 14);
    const ema200_entry = calculateEMA(entryTimeframeData, 200);
    const ema50_entry = calculateEMA(entryTimeframeData, 50);
    const rsi14_entry = calculateRSI(entryTimeframeData, 14);
    const avgVol_entry = calculateAvgVolume(entryTimeframeData as { volume?: number }[], 20);
    const enhancedEntry: EnhancedCandle[] = entryTimeframeData.map((d, i) => ({ 
        ...(d as EnhancedCandle),
        time: d.time as UTCTimestamp,
        ema200: ema200_entry[i],
        ema50: ema50_entry[i],
        rsi14: rsi14_entry[i],
        avgVolume: avgVol_entry[i],
        atr14: atr14_entry[i],
    }));

    const lastCandle = enhancedEntry[enhancedEntry.length - 1];
    if (!lastCandle || !lastCandle.ema50 || !lastCandle.rsi14 || lastCandle.volume === undefined || !lastCandle.avgVolume) {
        return { signal: 'None', strength: 0, confluences: ['Incomplete indicator data on last candle.'] };
    }

    const confluences: string[] = [];
    let signal: 'Buy' | 'Sell' | 'None' = 'None';
    let stopLoss: number | undefined;
    let takeProfit: number | undefined;

    const { highs: swingHighs, lows: swingLows } = findSwingPoints(enhancedEntry.slice(-50), 10);
    
    // --- Buy Signal Logic ---
    if (trend === 'uptrend') {
        confluences.push(`Agreement: ${higherTimeframe.toUpperCase()} Trend is UP.`);

        // Pullback check
        const priceRange = lastCandle.high - lastCandle.low;
        const fib618 = lastCandle.high - (priceRange * 0.618);
        const inPullbackZone = lastCandle.low <= lastCandle.ema50 && lastCandle.close > lastCandle.ema50;
        const atFibLevel = lastCandle.low <= fib618 && lastCandle.close > fib618;
        if (inPullbackZone || atFibLevel) {
            confluences.push(`Pullback: Retracement to ${inPullbackZone ? '50 EMA' : '61.8% Fib'}.`);
        }

        // RSI Divergence check
        if (detectRsiDivergence(enhancedEntry, 'uptrend')) {
            confluences.push('Confirmation: Bullish RSI Divergence found.');
        }

        // Support/Resistance check
        const recentLows = swingLows.slice(-3).map(l => l.low);
        if (recentLows.some(low => Math.abs(lastCandle.low - low) / low < 0.002)) { // within 0.2%
            confluences.push('Structure: Price is near a recent support level.');
        }

        // Volume Spike
        if (lastCandle.volume > lastCandle.avgVolume * 1.8) {
            confluences.push('Volume: Increased volume detected.');
        }
        
        // Final Signal Decision
        if (confluences.length >= 2) { // Require at least 2 confluences
            signal = 'Buy';
            if (lastCandle.atr14) {
                stopLoss = lastCandle.close - (lastCandle.atr14 * 1.01);
                const rrRatio = Math.random() < 0.5 ? 1.5 : 2; // Randomly pick 1:1.5 or 1:2
                takeProfit = lastCandle.close + (lastCandle.close - stopLoss) * rrRatio;
            }
        }
    }

    // --- Sell Signal Logic ---
    else if (trend === 'downtrend') {
        confluences.push(`Agreement: ${higherTimeframe.toUpperCase()} Trend is DOWN.`);

        // Pullback check
        const priceRange = lastCandle.high - lastCandle.low;
        const fib618 = lastCandle.low + (priceRange * 0.618);
        const inPullbackZone = lastCandle.high >= lastCandle.ema50 && lastCandle.close < lastCandle.ema50;
        const atFibLevel = lastCandle.high >= fib618 && lastCandle.close < fib618;
        if (inPullbackZone || atFibLevel) {
            confluences.push(`Pullback: Retracement to ${inPullbackZone ? '50 EMA' : '61.8% Fib'}.`);
        }

        // RSI Divergence check
        if (detectRsiDivergence(enhancedEntry, 'downtrend')) {
            confluences.push('Confirmation: Bearish RSI Divergence found.');
        }

        // Support/Resistance check
        const recentHighs = swingHighs.slice(-3).map(h => h.high);
        if (recentHighs.some(high => Math.abs(lastCandle.high - high) / high < 0.002)) { // within 0.2%
            confluences.push('Structure: Price is near a recent resistance level.');
        }

        // Volume Spike
        if (lastCandle.volume > lastCandle.avgVolume * 1.8) {
            confluences.push('Volume: Increased volume detected.');
        }

        // Final Signal Decision
        if (confluences.length >= 2) { // Require at least 2 confluences
            signal = 'Sell';
            if (lastCandle.atr14) {
                stopLoss = lastCandle.close + (lastCandle.atr14 * 1.01);
                const rrRatio = Math.random() < 0.5 ? 1.5 : 2; // Randomly pick 1:1.5 or 1:2
                takeProfit = lastCandle.close - (stopLoss - lastCandle.close) * rrRatio;
            }
        }
    }

    // If a signal was generated but we couldn't set SL/TP, invalidate it.
    if (signal !== 'None' && (!stopLoss || !takeProfit)) {
        signal = 'None';
        confluences.push('Note: Signal invalidated, no clear stop-loss level found.');
    }
    
    const strength = Math.round((confluences.filter(c => !c.startsWith('Note:')).length / 5) * 100);

    if (signal === 'None') {
        const finalConfluences = confluences.length > 0 ? confluences : ['No significant trading setup identified.'];
        return { signal: 'None', strength, confluences: finalConfluences };
    }

    // We have a valid signal with SL/TP
    return {
        signal,
        strength,
        stopLoss,
        takeProfit,
        entryPrice: lastCandle.close,
        confluences,
    };
};
