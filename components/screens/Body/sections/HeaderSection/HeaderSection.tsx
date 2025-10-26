import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signInWithGoogle, signOutUser } from '@/services/AuthService';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LineChart, BookOpen, Users, Crown, Home, Info } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from 'next/router';

export const HeaderSection = (): JSX.Element => {
  const { user, subscription, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You've successfully signed in."
      });
    } catch (error: any) {
      // Handle specific error cases
      let errorMessage = "An error occurred during sign in.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in cancelled. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Pop-up blocked. Please allow pop-ups and try again.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: errorMessage
      });
      console.error('Error signing in:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      await signOutUser();
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again."
      });
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleNavigation = (href: string) => {
    // If we're on the analysis page and the link is a hash link
    if (router.pathname === '/analysis' && href.startsWith('#')) {
      router.push(`/${href}`);
    }
  };

  const navItems = [
    { label: 'Analysis', href: '/analysis' },
    { label: 'Clients', href: '#testimonals' },
    { label: 'About Us', href: '#about-us' },
    { label: 'Pricing', href: '#subscription-plans' },
  ];

  // Update the Sign In button in the desktop view
  const SignInButton = () => (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="text-sm btn-outline relative overflow-hidden group min-w-[80px]"
    >
      {isSigningIn ? (
        <div className="flex items-center space-x-2">
          <Spinner size="sm" />
          <span>Signing in...</span>
        </div>
      ) : (
        <>
          <span className="relative z-10 group-hover:text-white transition-colors">Sign In</span>
          <motion.div
            className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
        </>
      )}
    </Button>
  );

  // Update the Sign Out button in the desktop view
  const SignOutButton = () => (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="text-sm btn-outline relative overflow-hidden group min-w-[80px]"
    >
      {isSigningOut ? (
        <div className="flex items-center space-x-2">
          <Spinner size="sm" />
          <span>Signing out...</span>
        </div>
      ) : (
        <>
          <span className="relative z-10 group-hover:text-white transition-colors">Sign Out</span>
          <motion.div
            className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
        </>
      )}
    </Button>
  );

  return (
    <header 
      className={`w-full h-[66px] sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      
    </header>
  );
};
