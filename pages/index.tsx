import { motion } from "framer-motion";
import { FooterSection } from "@/components/screens/Body/sections/FooterSection/FooterSection";
import { HeaderSection } from "@/components/screens/Body/sections/HeaderSection/HeaderSection";
import { IntroductionSection } from "@/components/screens/Body/sections/IntroductionSection/IntroductionSection";
import { TestimonalsSections } from "@/components/screens/Body/sections/TestimonalsSections/TestimonalsSection";
import { ClientsSection } from "@/components/screens/Body/sections/ClientsSection/ClientsSection";
import { SubscriptionPlansSection } from "@/components/screens/Body/sections/SubscriptionPlansSection/SubscriptionPlansSection";
import { AboutUsSection } from "@/components/screens/Body/sections/AboutUsSection/AboutUsSection";

// Animation variants for sections
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HomePage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="flex flex-col min-h-screen w-full bg-[#f9fafa] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-light -z-10" />
      
      {/* Animated background shapes */}
      <div className="fixed inset-0 -z-5 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [-50, 50, -50],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4,
          }}
        />
      </div>

      <motion.div variants={sectionVariants}>
        <HeaderSection />
      </motion.div>

      <main className="flex justify-center w-full">
        <div className="flex flex-col w-full max-w-screen-xl relative -mt-10 px-4 md:px-6">
          {/*
          <motion.div variants={sectionVariants}>
            <IntroductionSection />
          </motion.div>

          <motion.div 
            variants={sectionVariants}
            className="mt-16"
          >
            <ClientsSection />
          </motion.div>

          <motion.div 
            variants={sectionVariants}
            className="mt-16"
          >
            <TestimonalsSections />
          </motion.div>

          
          <motion.div 
            id="about-us"
            variants={sectionVariants}
            className="mt-16"
          >
            <AboutUsSection />
          </motion.div>

          <motion.div 
            id="subscription-plans"
            variants={sectionVariants}
            className="mt-16"
          >
            <SubscriptionPlansSection />
          </motion.div>
          */}
        </div>
      </main>

      <motion.div variants={sectionVariants}>
        <FooterSection />
      </motion.div>
    </motion.div>
  );
}
