import React from "react";

import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { IntroductionSection } from "./sections/IntroductionSection/IntroductionSection";
import { TestimonalsSections } from "./sections/TestimonalsSections/TestimonalsSections";
import { ClientsSection } from "./sections/ClientsSection/ClientsSection";
import { SubscriptionPlansSection } from "./sections/SubscriptionPlansSection/SubscriptionPlansSection";

export const Body = (): JSX.Element => {

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f9fafa]">
      <HeaderSection />

      <main className="flex justify-center w-full px-4 md:px-20">
        <div className="flex flex-col w-full max-w-screen-xl relative">
          <IntroductionSection />

          {/* User count card - positioned with relative/absolute */}


          <ClientsSection />
          <TestimonalsSections />
          <SubscriptionPlansSection />
        </div>
      </main>

      <FooterSection />
    </div>
  );
};
