import { HeaderSection } from "@/components/screens/Body/sections/HeaderSection/HeaderSection";
import { AnalysisSection } from "@/components/screens/Body/sections/AnalysisSection/AnalysisSection";
import { FooterSection } from "@/components/screens/Body/sections/FooterSection/FooterSection";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AnalysisPage() {
  const { user, subscription, loading, checkingSubscription } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication and subscription check is complete
    if (!loading && !checkingSubscription) {
      // If user is not logged in or not subscribed, redirect to homepage
      if (!user || !subscription.isSubscribed) {
        router.push('/#subscription-plans');
      }
    }
  }, [user, subscription, loading, checkingSubscription, router]);

  // Show loading state while checking authentication and subscription
  if (loading || checkingSubscription) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#f9fafa] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b81f5]"></div>
        <p className="mt-4 text-gray-600">Verifying subscription...</p>
      </div>
    );
  }

  // If user is not subscribed (and redirect hasn't happened yet), don't render content
  if (!user || !subscription.isSubscribed) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#f9fafa] items-center justify-center">
        <p className="text-gray-600">Redirecting to subscription page...</p>
      </div>
    );
  }

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
