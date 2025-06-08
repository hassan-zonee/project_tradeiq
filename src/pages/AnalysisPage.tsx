import { HeaderSection } from "../screens/Body/sections/HeaderSection";
import { AnalysisSection } from "../screens/Body/sections/AnalysisSection/AnalysisSection";
import { FooterSection } from "../screens/Body/sections/FooterSection/FooterSection";

export const AnalysisPage = () => (
  <div className="flex flex-col min-h-screen w-full bg-[#f9fafa]">
    <HeaderSection />
    <br />
    <main className="flex justify-center w-full px-4 md:px-20">
      <div className="flex flex-col w-full max-w-screen-xl relative">
        <AnalysisSection />
      </div>
    </main>
    <FooterSection />
  </div>
);
