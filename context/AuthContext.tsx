import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '@/services/AuthService';
import { checkSubscriptionStatus } from '@/services/StripeService';
import { useRouter } from 'next/router';

interface SubscriptionStatus {
  isSubscribed: boolean;
  plan?: string;
  subscriptionId?: string;
  currentPeriodEnd?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscription: SubscriptionStatus;
  checkingSubscription: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  subscription: { isSubscribed: false },
  checkingSubscription: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus>({ isSubscribed: false });
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check subscription status when user is authenticated
    const checkUserSubscription = async () => {
      if (!user) {
        setSubscription({ isSubscribed: false });
        setCheckingSubscription(false);
        return;
      }

      try {
        setCheckingSubscription(true);
        const status = await checkSubscriptionStatus(user.uid);
        setSubscription(status);

        // Handle redirection logic
        const path = router.pathname;
        
        // If on analysis page and not subscribed, redirect to home with subscription section
        if (path === '/analysis' && !status.isSubscribed) {
          router.push('/#subscription-plans');
        }
        
        // If subscribed and on home page, offer to go to analysis page
        if (path === '/' && status.isSubscribed && !router.asPath.includes('#')) {
          router.push('/analysis');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkUserSubscription();
  }, [user, router]);

  const value = {
    user,
    loading,
    subscription,
    checkingSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
