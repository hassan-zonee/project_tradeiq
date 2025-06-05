import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const TestimonialsSection = (): JSX.Element => {
  // Company logos data for easy mapping
  const companyLogos = [
    { id: 1, src: "/img-70.png", alt: "Company logo 1" },
    { id: 2, src: "/img-72.png", alt: "Company logo 2" },
    { id: 3, src: "/img-74.png", alt: "Company logo 3" },
    { id: 4, src: "/img-76.png", alt: "Company logo 4" },
  ];

  return (
    <section className="w-full py-16 bg-[#f9fafa]">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="font-bold text-3xl text-gray-800 text-center mb-4 font-['Roboto',Helvetica]">
            Trusted by Leading Companies
          </h2>
          <p className="text-base text-[#4a5462] text-center font-['Roboto',Helvetica]">
            Industry leaders who rely on our AI-powered trading intelligence
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {companyLogos.map((logo) => (
            <Card
              key={logo.id}
              className="border-none bg-transparent shadow-none"
            >
              <CardContent className="flex items-center justify-center p-0">
                <div className="w-64 h-12 flex items-center justify-center opacity-60">
                  <img
                    className="max-w-[127.5px] h-12 object-cover"
                    alt={logo.alt}
                    src={logo.src}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
