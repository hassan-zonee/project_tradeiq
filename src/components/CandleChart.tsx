import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, CandlestickSeries, CandlestickData } from "lightweight-charts";

type CandleChartProps = {
  data: CandlestickData[];
};

export const CandleChart: React.FC<CandleChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      const candlestickSeries = chartRef.current.addSeries(CandlestickSeries);
      candlestickSeries.setData(data);

      if (chartRef.current) {
        chartRef.current.timeScale().scrollToRealTime();
      }
    }

    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />;
};
