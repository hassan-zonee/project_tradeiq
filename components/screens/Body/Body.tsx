
import { motion } from "framer-motion";

import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { IntroductionSection } from "./sections/IntroductionSection/IntroductionSection";
import { TestimonalsSections } from "./sections/TestimonalsSections/TestimonalsSection";
import { ClientsSection } from "./sections/ClientsSection/ClientsSection";
import { SubscriptionPlansSection } from "./sections/SubscriptionPlansSection/SubscriptionPlansSection";

export const Body = (): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen w-full bg-[#f9fafa]"
    >
      <HeaderSection />

      <main className="flex justify-center w-full">
        <div className="flex flex-col w-full max-w-screen-xl relative -mt-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <IntroductionSection />
          </motion.div>

          {/* Animated sections */}
          {[ClientsSection, TestimonalsSections, SubscriptionPlansSection].map(
            (Section, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mt-16"
              >
                <Section />
              </motion.div>
            )
          )}
        </div>
      </main>

      <FooterSection />
    </motion.div>
  );
};
