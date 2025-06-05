// No card imports needed

export const ClientsSection = (): JSX.Element => {
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

        {/* Animated logo carousel */}
        <div className="relative w-full overflow-x-hidden py-4">
          <div
            className="flex gap-16 animate-logo-scroll hover:[animation-play-state:paused]"
            style={{ animationDuration: '35s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
          >
            {companyLogos.concat(companyLogos).map((logo, idx) => (
              <div
                key={logo.id + '-' + idx}
                className="flex items-center justify-center opacity-70 transition-transform duration-300 hover:scale-110 hover:opacity-100"
              >
                <img
                  className="max-w-[127.5px] h-12 object-contain mx-6 bg-transparent"
                  alt={logo.alt}
                  src={logo.src}
                  />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
