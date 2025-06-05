import { CheckIcon, XIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

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
    price: "$20",
    features: planFeatures.basic,
    popular: false,
  },
  {
    name: "Pro Plan",
    price: "$35",
    features: planFeatures.pro,
    popular: true,
  },
  {
    name: "Premium Plan",
    price: "$50",
    features: planFeatures.premium,
    popular: false,
  },
];

export const SubscriptionPlansSection = (): JSX.Element => {
  return (
    <section className="py-12 flex flex-col w-full items-center">
      <div className="flex flex-col w-full max-w-7xl items-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
          Subscription Plans
        </h2>
        <p className="text-base text-[#4a5462] text-center max-w-2xl">
          Choose the perfect plan to elevate your trading strategy with our
          AI-powered analysis and personalized recommendations.
        </p>
      </div>

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
              <div className="flex items-end mb-6">
                <span className="font-bold text-3xl text-gray-800">
                  {plan.price}
                </span>
                <span className="text-[#6a7280] ml-1">/month</span>
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
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
