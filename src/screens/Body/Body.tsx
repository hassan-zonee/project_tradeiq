import React from "react";

import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { IntroductionSection } from "./sections/MarketAnalysisSection/MarketAnalysisSection";
import { SignalsSection } from "./sections/SignalsSection/SignalsSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";

export const Body = (): JSX.Element => {

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f9fafa]">
      <HeaderSection />

      <main className="flex justify-center w-full px-4 md:px-20">
        <div className="flex flex-col w-full max-w-screen-xl relative">
          <IntroductionSection />

          {/* User count card - positioned with relative/absolute */}


          <TestimonialsSection />
          <SignalsSection />
        </div>
      </main>

      <FooterSection />
    </div>
  );
};
