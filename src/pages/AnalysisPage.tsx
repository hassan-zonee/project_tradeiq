import { HeaderSection } from "../screens/Body/sections/HeaderSection";
import { MainContentSection } from "../screens/Body/sections/MainContentSection/MainContentSection";
import { FooterSection } from "../screens/Body/sections/FooterSection/FooterSection";
import { Link } from "react-router-dom";

export const AnalysisPage = () => (
  <div className="flex flex-col min-h-screen w-full bg-[#f9fafa]">
    <HeaderSection />
    <nav className="flex gap-4 px-8 py-4">
      <Link to="/analysis" className="text-blue-600 font-semibold">Analysis</Link>
      <Link to="/subscriptions" className="text-blue-600 font-semibold">Subscriptions</Link>
    </nav>
    <main className="flex justify-center w-full px-4 md:px-20">
      <div className="flex flex-col w-full max-w-screen-xl relative">
        <MainContentSection />
      </div>
    </main>
    <FooterSection />
  </div>
);
