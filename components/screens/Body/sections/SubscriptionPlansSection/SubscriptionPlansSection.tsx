import { CheckIcon, XIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "firebase/auth";
import { onAuthChange, signInWithGoogle } from "@/services/AuthService";
import { createCheckoutSession, STRIPE_PRODUCT_IDS } from "@/services/StripeService";

// Plan feature data
const planFeatures = {
  basic: [
    { name: "Basic market analysis", included: true },
    { name: "10 major currency pairs", included: true },
    { name: "Daily trading signals", included: true },
    { name: "Standard indicators", included: true },
    { name: "Crypto analysis", included: false },
    { name: "Priority support", included: false },
  ],
  pro: [
    { name: "Advanced market analysis", included: true },
    { name: "All major currency pairs", included: true },
    { name: "Real-time trading signals", included: true },
    { name: "Advanced indicators", included: true },
    { name: "Basic crypto analysis", included: true },
    { name: "Priority support", included: false },
  ],
  premium: [
    { name: "Expert market analysis", included: true },
    { name: "All pairs including exotics", included: true },
    { name: "Real-time trading signals", included: true },
    { name: "All premium indicators", included: true },
    { name: "Full crypto analysis", included: true },
    { name: "Priority 24/7 support", included: true },
  ],
};

// Plan data
const plans = [
  {
    name: "Basic Plan",
    originalPrice: "$99.99",
    price: "$19",
    discount: "81%",
    features: planFeatures.basic,
    popular: false,
    priceId: STRIPE_PRODUCT_IDS.basic,
  },
  {
    name: "Pro Plan",
    originalPrice: "$179",
    price: "$29",
    discount: "84%",
    features: planFeatures.pro,
    popular: true,
    priceId: STRIPE_PRODUCT_IDS.pro,
  },
  {
    name: "Premium Plan",
    originalPrice: "$299",
    price: "$49",
    discount: "84%",
    features: planFeatures.premium,
    popular: false,
    priceId: STRIPE_PRODUCT_IDS.premium,
  },
];

export const SubscriptionPlansSection = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return () => unsubscribe();
  }, []);

  const handleSubscribe = async (priceId: string, planIndex: number) => {
    try {
      setIsLoading(planIndex);
      setError(null);
      
      // If user is not logged in, prompt for login first
      if (!user) {
        await signInWithGoogle();
        // The user state will be updated by the onAuthChange listener
        return;
      }
      
      // User is logged in, proceed to checkout
      await createCheckoutSession(priceId, user.uid);
    } catch (error) {
      console.error('Error during subscription process:', error);
      setError('There was a problem processing your subscription. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section id="subscription-plans" className="py-12 flex flex-col w-full items-center">
      <div className="flex flex-col w-full max-w-7xl items-center mb-12">
        <div className="mb-6">
          <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-1.5 rounded-full">
            🔥 Limited Time Offer
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
          Special Launch Pricing
        </h2>
        <p className="text-base text-[#4a5462] text-center max-w-2xl">
          Join now and save up to 84% on your subscription. This offer won't last long!
        </p>
      </div>

      {error && (
        <div className="mb-6 w-full max-w-screen-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-8 max-w-screen-lg">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`w-80 overflow-hidden ${
              plan.popular
                ? "border-[#3b81f5] shadow-md relative"
                : "border-[#f2f4f5] shadow-sm"
            }`}
          >
            {plan.popular && (
              <div className="bg-[#3b81f5] py-2 text-center">
                <Badge className="bg-[#3b81f5] text-white border-none font-medium">
                  MOST POPULAR
                </Badge>
              </div>
            )}
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl text-gray-800 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-bold text-3xl text-gray-800">
                  {plan.price}
                </span>
                <span className="text-[#6a7280] ml-1">/month</span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-500 line-through text-sm">
                  {plan.originalPrice}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  Save {plan.discount}
                </span>
              </div>
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="mr-2">
                        {feature.included ? (
                          <CheckIcon className="h-5 w-5 text-[#3b81f5]" />
                        ) : (
                          <XIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </span>
                      <span
                        className={`text-base ${
                          feature.included ? "text-[#4a5462]" : "text-gray-400"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-[#3b81f5] text-white hover:bg-[#3b81f5]/90"
                    : "bg-white text-[#3b81f5] border border-[#3b81f5] hover:bg-gray-50"
                }`}
                onClick={() => handleSubscribe(plan.priceId, index)}
                disabled={isLoading === index}
              >
                {isLoading === index ? 'Processing...' : 'Get Started'}
              </Button>
              {plan.popular && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  🔥 Most popular choice - Limited spots!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>⚡️ Special launch pricing - Save up to 84% today!</p>
        <p className="mt-1">Offer valid for a limited time only. Regular pricing will resume soon.</p>
      </div>
    </section>
  );
};
