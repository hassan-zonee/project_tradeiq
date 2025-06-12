import React from "react";
import { motion } from "framer-motion";

export const FooterSection = (): JSX.Element => {
  const disclaimerText = [
    "Trading forex and cryptocurrencies involves significant risk and may not be suitable for all investors. The high degree of",
    "leverage can work against you as well as for you. Before deciding to trade foreign exchange or cryptocurrencies you should carefully consider",
    "your investment objectives, level of experience, and risk appetite.",
  ];

  const footerLinks = [
    { name: "Terms", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Support", href: "#" },
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <motion.div 
        className="mx-auto max-w-screen-xl px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <span className="[font-family:'Pacifico',Helvetica] font-normal text-[#3b81f5] text-2xl leading-8 whitespace-nowrap shine">
              TradeIQ
            </span>
          </motion.div>

          {/* Links */}
          <motion.div 
            className="flex gap-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </motion.div>

          {/* Disclaimer */}
          <motion.div 
            className="max-w-4xl text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-gray-400 leading-6">
              <span className="font-bold text-gray-300">Risk Disclaimer: </span>
              {disclaimerText.map((text, index) => (
                <span key={index} className="inline-block"> {text}</span>
              ))}
            </p>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm text-gray-500"
          >
            © {new Date().getFullYear()} TradeIQ. All rights reserved.
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};
