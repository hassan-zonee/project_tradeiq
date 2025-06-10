import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';
// Correcting the import path based on project structure analysis
import { getChartData } from './chartsData'; 

// --- TYPE DEFINITIONS ---
// Extending CandlestickData to include calculated indicators and volume
export interface EnhancedCandle extends CandlestickData<UTCTimestamp> {
    volume?: number; // Assuming getChartData can provide volume
    ema200?: number;
    ema50?: number;
    rsi14?: number;
    avgVolume?: number;
}

export interface TradingSignal {
    signal: 'Buy' | 'Sell' | 'None';
    strength: number; // Number of confluences met (out of 6)
    stopLoss?: number;
    takeProfit?: number;
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
export const analyzeConfluences = async (pair: string): Promise<TradingSignal> => {
    // Fetch data for both timeframes
    const [d1h, d5m] = await Promise.all([
        getChartData(pair, '1h'), 
        getChartData(pair, '5min')
    ]);

    if (!d1h || d1h.length < 200 || !d5m || d5m.length < 200) {
        return { signal: 'None', strength: 0, confluences: ['Insufficient data for analysis.'] };
    }

    // 1. Higher Timeframe (1H) Analysis for Trend
    const ema200_1h = calculateEMA(d1h, 200);
    const enhancedD1h: EnhancedCandle[] = d1h.map((d, i) => ({ ...d, time: d.time as UTCTimestamp, ema200: ema200_1h[i] }));
    const trend = detectTrend(enhancedD1h);

    // 2. Entry Timeframe (5min) Analysis
    const ema200_5m = calculateEMA(d5m, 200);
    const ema50_5m = calculateEMA(d5m, 50);
    const rsi14_5m = calculateRSI(d5m, 14);
    const avgVol_5m = calculateAvgVolume(d5m as { volume?: number }[], 20);
    const enhancedD5m: EnhancedCandle[] = d5m.map((d, i) => ({ 
        ...(d as EnhancedCandle),
        time: d.time as UTCTimestamp,
        ema200: ema200_5m[i],
        ema50: ema50_5m[i],
        rsi14: rsi14_5m[i],
        avgVolume: avgVol_5m[i],
    }));

    const lastCandle = enhancedD5m[enhancedD5m.length - 1];
    if (!lastCandle || !lastCandle.ema50 || !lastCandle.rsi14 || lastCandle.volume === undefined || !lastCandle.avgVolume) {
        return { signal: 'None', strength: 0, confluences: ['Incomplete indicator data on last candle.'] };
    }

    const confluences: string[] = [];
    let signal: 'Buy' | 'Sell' | 'None' = 'None';
    let stopLoss: number | undefined;
    let takeProfit: number | undefined;

    const { highs: swingHighs, lows: swingLows } = findSwingPoints(enhancedD5m, 10);
    
    // --- Buy Signal Logic ---
    if (trend === 'uptrend') {
        confluences.push('Agreement: 1H Trend is UP.');

        // Pullback check
        const priceRange = lastCandle.high - lastCandle.low;
        const fib618 = lastCandle.high - (priceRange * 0.618);
        const inPullbackZone = lastCandle.low <= lastCandle.ema50 && lastCandle.close > lastCandle.ema50;
        const atFibLevel = lastCandle.low <= fib618 && lastCandle.close > fib618;
        if (inPullbackZone || atFibLevel) {
            confluences.push(`Pullback: Retracement to ${inPullbackZone ? '50 EMA' : '61.8% Fib'}.`);
        }

        // RSI Divergence check
        if (detectRsiDivergence(enhancedD5m, 'uptrend')) {
            confluences.push('Confirmation: Bullish RSI Divergence found.');
        }

        // Support/Resistance check
        const recentLows = swingLows.slice(-3).map(l => l.low);
        if (recentLows.some(low => Math.abs(lastCandle.low - low) / low < 0.001)) { // within 0.1%
            confluences.push('Structure: Price is at a recent support level.');
        }

        // Volume Spike
        if (lastCandle.volume > lastCandle.avgVolume * 2) {
            confluences.push('Volume: Significant volume spike detected.');
        }
        
        // Final Signal Decision
        if (confluences.length >= 4) { // Require at least 4 confluences
            signal = 'Buy';
            const recentSwingLow = swingLows.pop();
            if (recentSwingLow) {
                stopLoss = recentSwingLow.low * 0.9995; // Slightly below swing low
                const risk = lastCandle.close - stopLoss;
                takeProfit = lastCandle.close + (risk * 2);
            }
        }
    }

    // --- Sell Signal Logic ---
    else if (trend === 'downtrend') {
        confluences.push('Agreement: 1H Trend is DOWN.');

        // Pullback check
        const priceRange = lastCandle.high - lastCandle.low;
        const fib618 = lastCandle.low + (priceRange * 0.618);
        const inPullbackZone = lastCandle.high >= lastCandle.ema50 && lastCandle.close < lastCandle.ema50;
        const atFibLevel = lastCandle.high >= fib618 && lastCandle.close < fib618;
        if (inPullbackZone || atFibLevel) {
            confluences.push(`Pullback: Retracement to ${inPullbackZone ? '50 EMA' : '61.8% Fib'}.`);
        }

        // RSI Divergence check
        if (detectRsiDivergence(enhancedD5m, 'downtrend')) {
            confluences.push('Confirmation: Bearish RSI Divergence found.');
        }

        // Support/Resistance check
        const recentHighs = swingHighs.slice(-3).map(h => h.high);
        if (recentHighs.some(high => Math.abs(lastCandle.high - high) / high < 0.001)) {
            confluences.push('Structure: Price is at a recent resistance level.');
        }

        // Volume Spike
        if (lastCandle.volume > lastCandle.avgVolume * 2) {
            confluences.push('Volume: Significant volume spike detected.');
        }

        // Final Signal Decision
        if (confluences.length >= 4) {
            signal = 'Sell';
            const recentSwingHigh = swingHighs.pop();
            if (recentSwingHigh) {
                stopLoss = recentSwingHigh.high * 1.0005; // Slightly above swing high
                const risk = stopLoss - lastCandle.close;
                takeProfit = lastCandle.close - (risk * 2);
            }
        }
    }

    if (signal === 'None' || !stopLoss || !takeProfit) {
        return { signal: 'None', strength: 0, confluences: ['No high-probability setup found.'] };
    }

    return {
        signal,
        strength: Math.round((confluences.length / 5) * 100), // 5 potential confluences
        stopLoss,
        takeProfit,
        confluences,
    };
};
