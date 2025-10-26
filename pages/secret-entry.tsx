import { HeaderSection } from "@/components/screens/Body/sections/HeaderSection/HeaderSection";
import { AnalysisSection } from "@/components/screens/Body/sections/AnalysisSection/AnalysisSection";
import { FooterSection } from "@/components/screens/Body/sections/FooterSection/FooterSection";

export default function SecretEntryPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f9fafa]">
      <HeaderSection />
      <br />
      <main className="flex justify-center w-full mb-7 px-4 md:px-20">
        <div className="flex flex-col w-full max-w-screen-xl relative">
          <AnalysisSection />
        </div>
      </main>
      <FooterSection />
    </div>
  );
} 