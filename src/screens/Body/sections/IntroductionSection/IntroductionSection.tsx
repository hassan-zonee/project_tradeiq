import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const IntroductionSection = (): JSX.Element => {
  // Stats data for mapping
  const stats = [
    { value: "98%", label: "Accuracy Rate" },
    { value: "50K+", label: "Active Traders" },
    { value: "24/7", label: "Market Analysis" },
  ];

  // User images for the overlay card
  const userImages = [
    { src: "/img-591.png", alt: "User 1" },
    { src: "/img-592.png", alt: "User 2" },
    { src: "/img-593.png", alt: "User 3" },
  ];

  return (
    <section className="py-24 px-0 flex justify-center">
      <div className="px-12 max-w-6xl w-full">
        <div className="flex flex-wrap gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col w-full lg:w-[calc(50%-24px)]">
            <div className="pb-6">
              <h2 className="font-bold text-5xl leading-[48px] text-gray-800 font-['Roboto',Helvetica]">
                Transform Your Trading with AI-Powered Market Intelligence
              </h2>
            </div>

            <div className="pb-8">
              <p className="text-xl leading-7 text-[#4a5462] font-['Roboto',Helvetica]">
                Experience the future of trading with TradeIQ&#39;s advanced
                artificial intelligence. Get real-time analysis, precise
                signals, and data-driven insights to make smarter trading
                decisions.
              </p>
            </div>

            <div className="flex gap-4">
              <Button className="bg-[#3b81f5] hover:bg-[#3b81f5]/90 text-white font-medium px-8 py-3 h-[50px] rounded-lg font-['Roboto',Helvetica]">
                Start Free Trial
              </Button>

              <Button
                variant="outline"
                className="border-[#3b81f5] text-[#3b81f5] font-medium px-8 py-3 h-[50px] rounded-lg font-['Roboto',Helvetica]"
              >
                Watch Demo
              </Button>
            </div>

            <div className="pt-8">
              <div className="flex flex-wrap gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="pb-1">
                      <span className="font-bold text-2xl text-[#3b81f5] font-['Roboto',Helvetica]">
                        {stat.value}
                      </span>
                    </div>
                    <div>
                      <span className="text-base text-[#4a5462] font-['Roboto',Helvetica]">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Image with overlay card */}
          <div className="w-full lg:w-[calc(50%-24px)]">
            <div className="relative">
              <img
                className="w-full h-auto object-cover rounded-xl"
                alt="Trading dashboard visualization"
                src="/img-58.png"
              />
              {/* Overlay Card */}
              <Card className="flex flex-col w-80 absolute -bottom-6 -right-6 lg:-right-6 shadow-[0px_10px_15px_-3px_#0000001a,0px_4px_6px_-4px_#0000001a] rounded-2xl overflow-hidden z-10 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="flex items-start">
                      {userImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-8 h-8"
                          style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                        >
                          <img
                            className="w-8 h-8 object-cover rounded-full"
                            alt={img.alt}
                            src={img.src}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="pl-4">
                      <p className="font-normal text-sm text-[#4a5462] line-clamp-2">
                        Join 50,000+ traders worldwide
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
