import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { MarketAnalysisSection } from "./sections/MarketAnalysisSection/MarketAnalysisSection";
import { SignalsSection } from "./sections/SignalsSection/SignalsSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";

export const Body = (): JSX.Element => {
  // Data for the users card
  const userImages = [
    { src: "/img-591.png", alt: "User 1" },
    { src: "/img-592.png", alt: "User 2" },
    { src: "/img-593.png", alt: "User 3" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f9fafa]">
      <HeaderSection />

      <main className="flex justify-center w-full px-4 md:px-20">
        <div className="flex flex-col w-full max-w-screen-xl relative">
          <MarketAnalysisSection />

          {/* User count card - positioned with relative/absolute */}
          <Card className="flex flex-col w-80 absolute top-[60px] right-4 lg:right-0 shadow-[0px_10px_15px_-3px_#0000001a,0px_4px_6px_-4px_#0000001a] rounded-2xl overflow-hidden">
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

          <TestimonialsSection />
          <SignalsSection />
        </div>
      </main>

      <FooterSection />
    </div>
  );
};
