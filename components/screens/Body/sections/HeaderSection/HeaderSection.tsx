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

export const HeaderSection = (): JSX.Element => {
  const { user, subscription, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { toast } = useToast();

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
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/" 
            className="relative group"
          >
            <span className="font-['Pacifico'] font-bold text-3xl leading-8 whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 hover:from-blue-600 hover:via-indigo-600 hover:to-violet-600 transition-all duration-300 inline-block transform hover:scale-105 hover:-rotate-2"
              style={{
                textShadow: '0 2px 10px rgba(59, 130, 246, 0.2)'
              }}
            >
              Trade
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text ml-0.5">
                IQ
              </span>
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex items-center space-x-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-600 hover:text-gray-900 transition-colors relative group"
            >
              <span>{item.label}</span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          ))}
        </motion.nav>

        {/* Auth Section */}
        <motion.div 
          className="hidden md:flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {subscription.isSubscribed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href="/analysis" 
                className="px-4 py-1 text-sm bg-gradient-primary text-white rounded-full hover-lift"
              >
                {subscription.plan === 'premium' ? 'Premium' : subscription.plan === 'pro' ? 'Pro' : 'Basic'} Plan
              </Link>
            </motion.div>
          )}
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">
                {user.displayName || 'User'}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass"
          >
            <div className="px-4 py-2 space-y-2">
              {user && (
                <div className="py-2 px-1 border-b border-gray-200 mb-2">
                  <span className="text-gray-700 text-sm">
                    Signed in as {user.displayName || 'User'}
                  </span>
                </div>
              )}
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user ? <SignOutButton /> : <SignInButton />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
