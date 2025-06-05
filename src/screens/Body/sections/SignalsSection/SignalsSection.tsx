import { StarIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../components/ui/card";

// Testimonial data for mapping
const testimonials = [
  {
    id: 1,
    name: "Michael Chen",
    role: "Professional Trader",
    image: "/img-89.png",
    quote:
      '"TradeIQ\'s AI analysis has completely transformed my trading strategy. The accuracy of signals and real-time insights have significantly improved my win rate."',
  },
  {
    id: 2,
    name: "Sarah Anderson",
    role: "Institutional Trader",
    image: "/img-113.png",
    quote:
      '"The platform\'s ability to analyze multiple markets simultaneously and provide actionable insights has given me a significant edge in my trading decisions."',
  },
  {
    id: 3,
    name: "David Okonjo",
    role: "Crypto Trader",
    image: "/img-137.png",
    quote:
      '"The AI-powered risk management features have helped me maintain consistent profits while protecting my capital. Best trading tool I\'ve used."',
  },
];

export const SignalsSection = (): JSX.Element => {
  return (
    <section className="py-16 flex flex-col w-full items-center">
      <div className="max-w-6xl w-full px-4">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Roboto',Helvetica]">
            What Our Traders Say
          </h2>
          <p className="text-base text-[#4a5462] font-['Roboto',Helvetica]">
            Join thousands of satisfied traders who have transformed their
            trading with TradeIQ
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border border-solid border-[#f2f4f5] shadow-[0px_1px_2px_#0000000d] rounded-2xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={testimonial.image}
                      alt={`${testimonial.name}'s profile`}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-800 text-base font-['Roboto',Helvetica]">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-[#6a7280] font-['Roboto',Helvetica]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <p className="text-base text-[#4a5462] mb-4 h-24 overflow-hidden line-clamp-4 font-['Roboto',Helvetica]">
                  {testimonial.quote}
                </p>

                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      size={16}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
