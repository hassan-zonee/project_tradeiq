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

export const MainContentSection = (): JSX.Element => {
  return (
    <div id="main-content-section" className="flex flex-wrap gap-8">
      {/* Left column */}
      <div className="flex-1 min-w-0">
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-[#374050] mb-1">
                    Currency Pair
                  </label>
                  <Select defaultValue="EUR/USD">
                    <SelectTrigger className="w-40 h-[42px] border-[#d0d5da]">
                      <SelectValue placeholder="EUR/USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                      <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                      <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                    </SelectContent>
                  </Select>
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
                  className="bg-[#f2f4f5] text-[#374050] font-medium px-3 py-1 rounded-lg"
                >
                  Line
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-[#3b81f5] text-white font-medium px-3 py-1 rounded-lg"
                >
                  Candlestick
                </Badge>
              </div>

              <div className="rounded-2xl overflow-hidden mb-2">
                <img
                  className="w-full h-96 object-cover"
                  alt="Price chart"
                  src="/img-200.png"
                />
              </div>

              <div className="rounded-2xl overflow-hidden">
                <img
                  className="w-full h-24 object-cover"
                  alt="Volume chart"
                  src="/img-203.png"
                />
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

      {/* Right column */}
      <div className="w-full md:w-[394px]">
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 text-xl mb-4">
              Market Overview
            </h3>

            <div className="space-y-4">
              {marketOverviewData.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center ${item.bgColor} rounded-full mr-3`}
                    >
                      {item.iconImg ? (
                        <img
                          className="w-[13px] h-[13px]"
                          alt={`${item.symbol} icon`}
                          src={item.iconImg}
                        />
                      ) : (
                        <span
                          className={`${item.textColor} font-medium text-base`}
                        >
                          {item.icon}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-black text-base">
                        {item.symbol}
                      </div>
                      <div className="text-[#6a7280] text-xs">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-black text-base">
                      {item.value}
                    </div>
                    <div
                      className={`text-xs ${item.isPositive ? "text-[#16a24a]" : "text-[#db2525]"}`}
                    >
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 text-xl mb-2">
              Recent Signals
            </h3>
            <p className="text-[#6a7280] text-sm mb-4">
              Latest AI-generated trading signals
            </p>

            <div className="space-y-4">
              {recentSignalsData.map((signal) => (
                <div
                  key={signal.id}
                  className={`pl-4 py-1 border-l-4 ${signal.isPositive ? "border-[#21c45d]" : "border-red-500"}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-black text-base">
                      {signal.symbol}
                    </div>
                    <div
                      className={`font-medium ${signal.isPositive ? "text-[#16a24a]" : "text-[#db2525]"} text-base`}
                    >
                      {signal.action}
                    </div>
                  </div>
                  <div className="text-[#6a7280] text-xs">{signal.date}</div>
                  <div className="text-black text-sm mt-1">{signal.pips}</div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-6 border-[#3b81f5] text-[#3b81f5] font-medium"
            >
              View All Signals
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
