import React from "react";
import { Button } from "../../../../components/ui/button";

export const HeaderSection = (): JSX.Element => {
  return (
    <header className="w-full h-[66px] bg-white shadow-[0px_1px_2px_#0000000d]">
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className="[font-family:'Pacifico',Helvetica] font-normal text-[#3b81f5] text-2xl leading-8 whitespace-nowrap">
            TradeIQ
          </div>
        </div>

        <Button
          variant="outline"
          className="h-[42px] px-[25px] py-[9px] flex items-center gap-2 rounded-lg border-[#e4e7eb]"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <img
              className="w-[13px] h-[13px]"
              alt="Google icon"
              src="/group.png"
            />
          </div>
          <span className="[font-family:'Roboto',Helvetica] font-medium text-[#374050] text-base">
            Sign in with Google
          </span>
        </Button>
      </div>
    </header>
  );
};
