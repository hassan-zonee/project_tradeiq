import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signInWithGoogle, signOutUser } from '@/services/AuthService';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const HeaderSection = (): JSX.Element => {
  const { user, subscription, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="w-full h-[66px] bg-white shadow-[0px_1px_2px_#0000000d]">
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Link href="/" className="[font-family:'Pacifico',Helvetica] font-normal text-[#3b81f5] text-2xl leading-8 whitespace-nowrap">
            TradeIQ
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {subscription.isSubscribed && (
            <Link href="/analysis" className="px-4 py-1 text-sm bg-green-100 text-green-800 rounded-full">
              {subscription.plan === 'premium' ? 'Premium' : subscription.plan === 'pro' ? 'Pro' : 'Basic'} Plan
            </Link>
          )}
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">{user.displayName || 'User'}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Not Logged In</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignIn}
                className="text-sm border-[#3b81f5] text-[#3b81f5] hover:bg-[#3b81f5] hover:text-white"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
