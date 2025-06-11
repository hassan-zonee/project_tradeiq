

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '@/services/AuthService';

export const HeaderSection = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return () => unsubscribe();
  }, []);
  return (
    <header className="w-full h-[66px] bg-white shadow-[0px_1px_2px_#0000000d]">
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className="[font-family:'Pacifico',Helvetica] font-normal text-[#3b81f5] text-2xl leading-8 whitespace-nowrap">
            TradeIQ
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <span className="text-gray-700 font-medium">{user.displayName || 'User'}</span>
          ) : (
            <span className="text-gray-500">Not Logged In</span>
          )}
        </div>
      </div>
    </header>
  );
};
