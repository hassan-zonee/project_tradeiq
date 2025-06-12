'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AboutUsSection = (): JSX.Element => {
  return (
    <motion.section
      id="about-us"
      className="w-full py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
              About Us
            </h2>
            
            <div className="space-y-6 mb-12">
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                TradeIQ is a premier <span className="font-semibold text-blue-700">Australian financial technology company</span> based in 
                <span className="font-semibold text-blue-700"> Sydney's financial district</span>. We stand at the forefront of innovation, 
                bringing institutional-grade trading technology to traders worldwide.
              </p>
              
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
              
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Our foundation rests on three pillars: advanced mathematical modeling, extensive market expertise, and cutting-edge 
                technology infrastructure. This unique combination allows us to deliver sophisticated yet accessible trading solutions 
                that meet the highest standards of precision and reliability.
              </p>
            </div>

            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-base text-gray-600 italic">
                "Our mission is to bridge the gap between institutional and retail trading by providing professional-grade tools 
                and analysis, backed by <span className="font-semibold text-blue-700">Australian</span> innovation and excellence 
                in financial technology."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}; 