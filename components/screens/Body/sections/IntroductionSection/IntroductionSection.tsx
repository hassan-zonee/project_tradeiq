import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { signInWithGoogle } from "@/services/AuthService";
import { useAuth } from "@/context/AuthContext";
import { TrendingUp, Users, Globe, Award } from 'lucide-react';

export const IntroductionSection = (): JSX.Element => {
  const { user, subscription } = useAuth();

  const handleGetStartedClick = async () => {
    const scrollToSubscription = () => {
      const subscriptionSection = document.getElementById("subscription-plans");
      if (subscriptionSection) {
        subscriptionSection.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (user) {
      // If user is already subscribed, navigate to analysis page
      if (subscription.isSubscribed) {
        window.location.href = '/analysis';
        return;
      }
      // Otherwise, scroll to subscription plans
      scrollToSubscription();
    } else {
      try {
        await signInWithGoogle();
        // Auth state will be managed by AuthContext
        // scrollToSubscription will be handled after sign-in via AuthContext
      } catch (error) {
        console.error("Error signing in with Google: ", error);
      }
    }
  };

  // Stats data for mapping
  const stats = [
    {
      icon: TrendingUp,
      value: "95%",
      label: "Success Rate",
      description: "Trading accuracy",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Users,
      value: "20K+",
      label: "Active Users",
      description: "Growing community",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      value: "25+",
      label: "Countries",
      description: "Global presence",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      value: "15+",
      label: "Awards",
      description: "Industry recognition",
      gradient: "from-pink-500 to-blue-500"
    }
  ];

  // User images for the overlay card
  const userImages = [
    { src: "/img-591.png", alt: "User 1" },
    { src: "/img-592.png", alt: "User 2" },
    { src: "/img-593.png", alt: "User 3" },
  ];

  return (
    <section className="py-24 px-0 flex justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="px-12 max-w-6xl w-full relative">
        <div className="flex flex-wrap gap-12">
          {/* Left Column - Text Content */}
          <motion.div 
            className="flex flex-col w-full lg:w-[calc(50%-24px)]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="pb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-fit px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-full shadow-lg transform -rotate-2"
              >
                AI-Powered Platform
              </motion.div>
              
              <h2 className="font-bold text-4xl leading-[48px] text-gray-800 font-['Roboto',Helvetica] relative">
                Transform Your Trading with
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mr-2">AI-Powered</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-[30%] bg-blue-200/30"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                </span>
                Market Intelligence
              </h2>
            </motion.div>

            <motion.div 
              className="pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-base leading-7 text-[#4a5462] font-['Roboto',Helvetica]">
                Experience the future of trading with TradeIQ&#39;s advanced
                artificial intelligence. Get real-time analysis, precise
                signals, and data-driven insights to make smarter trading
                decisions.
              </p>
            </motion.div>

            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button 
                onClick={handleGetStartedClick}
                className="bg-[#3b81f5] text-white font-medium px-8 py-3 h-[50px] rounded-lg font-['Roboto',Helvetica] relative overflow-hidden group"
                whileHover={{ scale: 1.05, backgroundColor: "#3273dc" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Getting Started</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full opacity-25 group-hover:w-[300px] group-hover:h-[300px] transition-all duration-500"
                />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with overlay card */}
          <motion.div 
            className="w-full lg:w-[calc(50%-24px)] lg:mt-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-20 blur"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.img
                src="/img-58.png"
                alt="Trading Platform Interface"
                className="w-full h-auto rounded-xl relative"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              <Card className="flex flex-col w-[calc(100%-2rem)] sm:w-80 absolute -bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-6 lg:-right-6 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden z-10 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="flex items-start">
                      {userImages.map((img, index) => (
                        <motion.div
                          key={index}
                          className="relative w-8 h-8"
                          style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <img
                            className="w-8 h-8 object-cover rounded-full ring-2 ring-white"
                            alt={img.alt}
                            src={img.src}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <div className="pl-4">
                      <p className="font-normal text-sm text-[#4a5462] line-clamp-2">
                        Join 20,000+ traders worldwide
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid - Now below both columns */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -3 }}
              className="relative group"
            >
              <Card className="p-3 bg-white/70 backdrop-blur-sm border border-gray-100 hover:border-blue-100 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${stat.gradient} mb-2`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-gray-800">
                    {stat.label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {stat.description}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
