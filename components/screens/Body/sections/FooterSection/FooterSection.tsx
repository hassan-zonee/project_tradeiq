import React from "react";

export const FooterSection = (): JSX.Element => {
  const disclaimerText = [
    "Trading forex and cryptocurrencies involves significant risk and may not be suitable for all investors. The high degree of",
    "leverage can work against you as well as for you. Before deciding to trade foreign exchange or cryptocurrencies you should carefully consider",
    "your investment objectives, level of experience, and risk appetite.",
  ];

  return (
    <footer className="w-full bg-gray-800 py-6">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-4xl text-center">
            <p className="text-sm text-gray-400 leading-5">
              <span className="font-bold">Risk Disclaimer:</span>
              {disclaimerText.map((text, index) => (
                <span key={index}> {text}</span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
