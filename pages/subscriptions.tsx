import React from 'react';
import { HeaderSection } from "@/components/screens/Body/sections/HeaderSection/HeaderSection";
import { SubscriptionPlansSection } from "@/components/screens/Body/sections/SubscriptionPlansSection/SubscriptionPlansSection";
import { FooterSection } from "@/components/screens/Body/sections/FooterSection/FooterSection";
import Link from "next/link";

export default function SubscriptionPlansPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f9fafa]">
      <HeaderSection />
      <nav className="flex gap-4 px-8 py-4">
        <Link href="/analysis" className="text-blue-600 font-semibold">Analysis</Link>
        <Link href="/subscriptions" className="text-blue-600 font-semibold">Subscriptions</Link>
      </nav>
      <main className="flex justify-center w-full px-4 md:px-20">
        <div className="flex flex-col w-full max-w-screen-xl relative">
          <SubscriptionPlansSection />
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
