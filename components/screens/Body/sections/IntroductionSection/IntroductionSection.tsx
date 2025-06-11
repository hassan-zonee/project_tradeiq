import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { onAuthChange, signInWithGoogle } from "@/services/AuthService";
import { User } from "firebase/auth";

export const IntroductionSection = (): JSX.Element => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return () => unsubscribe();
  }, []);

  const handleGetStartedClick = async () => {
    if (user) {
      router.push('/analysis');
    } else {
      try {
        await signInWithGoogle();
        router.push('/analysis');
      } catch (error) {
        console.error("Error signing in with Google: ", error);
      }
    }
  };
  // Stats data for mapping
  const stats = [
    { value: "91%", label: "Accuracy Rate" },
    { value: "50K+", label: "Active Traders" },
    { value: "24/7", label: "Market Analysis" },
  ];

  // User images for the overlay card
  const userImages = [
    { src: "/img-591.png", alt: "User 1" },
    { src: "/img-592.png", alt: "User 2" },
    { src: "/img-593.png", alt: "User 3" },
  ];

  return (
    <section className="py-24 px-0 flex justify-center">
      <div className="px-12 max-w-6xl w-full">
        <div className="flex flex-wrap gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div 
            className="flex flex-col w-full lg:w-[calc(50%-24px)]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-bold text-4xl leading-[48px] text-gray-800 font-['Roboto',Helvetica]">
                Transform Your Trading with AI-Powered Market Intelligence
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
                className="bg-[#3b81f5] text-white font-medium px-8 py-3 h-[50px] rounded-lg font-['Roboto',Helvetica]"
                whileHover={{ scale: 1.05, backgroundColor: "#3273dc" }}
                whileTap={{ scale: 0.95 }}
              >
                Getting Started
              </motion.button>
            </motion.div>

            <motion.div 
              className="pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex flex-wrap gap-5 justify-center">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                  >
                    <Card className="bg-white rounded-2xl shadow-lg px-6 py-4 flex flex-col items-center w-full sm:min-w-[100px] sm:w-auto h-full">
                    <span className="font-bold text-xl text-[#3b81f5] font-['Roboto',Helvetica] mb-1">
                      {stat.value}
                    </span>
                    <span className="text-sm text-[#4a5462] font-['Roboto',Helvetica] font-medium">
                      {stat.label}
                    </span>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with overlay card */}
          <motion.div 
            className="w-full lg:w-[calc(50%-24px)]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <img
                className="w-full h-auto object-cover rounded-xl lg:-mt-20"
                alt="Trading dashboard visualization"
                src="/img-58.png"
              />
              {/* Overlay Card */}
              <Card className="flex flex-col w-[calc(100%-2rem)] sm:w-80 absolute -bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-6 lg:-right-6 shadow-[0px_10px_15px_-3px_#0000001a,0px_4px_6px_-4px_#0000001a] rounded-2xl overflow-hidden z-10 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="flex items-start">
                      {userImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-8 h-8"
                          style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                        >
                          <img
                            className="w-8 h-8 object-cover rounded-full"
                            alt={img.alt}
                            src={img.src}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="pl-4">
                      <p className="font-normal text-sm text-[#4a5462] line-clamp-2">
                        Join 50,000+ traders worldwide
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
