import { StarIcon, ChevronLeftIcon, ChevronRightIcon, BadgeCheck, TrendingUp, Award } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Enhanced testimonial data with more details
const allTestimonials = [
  {
    id: 1,
    name: "David Okonjo",
    role: "Professional Crypto Trader",
    badge: "Elite Trader",
    image: "/img-137.png",
    quote: "TradeIQ's risk management and market analysis have transformed my trading. The AI signals helped me increase my win rate significantly, even during high volatility periods.",
    stats: {
      profitIncrease: "112%",
      successRate: "85%",
      monthsUsing: "6"
    },
    rating: 5,
    date: "March 2024",
    achievement: "Top Trader 2024"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Institutional Trader",
    badge: "Pro Trader",
    image: "/img-113.png",
    quote: "The platform's ability to analyze multiple trading pairs simultaneously and provide actionable signals has given us a significant edge. Our trading performance increased by 45% since adopting TradeIQ.",
    stats: {
      profitIncrease: "45%",
      successRate: "92%",
      monthsUsing: "12"
    },
    rating: 5,
    date: "February 2024",
    achievement: "Best Performance 2023"
  },
  {
    id: 3,
    name: "Michael Zhang",
    role: "Crypto Market Analyst",
    badge: "Market Expert",
    image: "/img-89.png",
    quote: "TradeIQ's AI analysis has revolutionized our trading approach. The pattern recognition and market sentiment analysis improved our success rate from 65% to 89% in just months.",
    stats: {
      profitIncrease: "156%",
      successRate: "89%",
      monthsUsing: "8"
    },
    rating: 5,
    date: "March 2024",
    achievement: "Top Analyst 2024"
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Day Trader",
    badge: "Verified Trader",
    image: "/img-138.png",
    quote: "The real-time alerts and technical analysis have been game-changers for my trading strategy. TradeIQ's AI helps me spot profitable opportunities across multiple markets efficiently.",
    stats: {
      profitIncrease: "78%",
      successRate: "88%",
      monthsUsing: "9"
    },
    rating: 5,
    date: "January 2024",
    achievement: "Trading Excellence"
  },
  {
    id: 5,
    name: "Nina Patel",
    role: "Portfolio Trader",
    badge: "Strategy Expert",
    image: "/img-139.png",
    quote: "TradeIQ's analysis and portfolio optimization tools have transformed how we manage positions. The AI predictions for market movements are remarkably accurate.",
    stats: {
      profitIncrease: "94%",
      successRate: "91%",
      monthsUsing: "7"
    },
    rating: 5,
    date: "March 2024",
    achievement: "Strategy Master"
  }
];

// All testimonials with images appear first in a fixed order
const testimonials = [
  allTestimonials[0], // David Okonjo - img-137.png
  allTestimonials[1], // Sarah Chen - img-113.png
  allTestimonials[2], // Michael Zhang - img-89.png
  allTestimonials[3], // Alex Thompson - img-138.png
  allTestimonials[4], // Nina Patel - img-139.png
];

export const TestimonalsSections = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1); // Default to mobile view
  
  useEffect(() => {
    // Update items per page based on window width
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 3 : 1);
    };
    
    // Initial setup
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section id="testimonals" className="py-24 flex flex-col w-full items-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl w-full px-4 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow">
              Testimonials
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Trusted by Leading Traders Worldwide
          </h2>
          <p className="text-base text-[#4a5462] max-w-2xl mx-auto">
            Discover how TradeIQ has transformed trading strategies and improved success rates for traders across the globe
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {testimonials
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-blue-100 transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <motion.div 
                              whileHover={{ scale: 1.1 }} 
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-500">
                                <AvatarImage
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                />
                                <AvatarFallback>
                                  {testimonial.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                            <div className="ml-3">
                              <div className="flex items-center">
                                <h3 className="font-semibold text-gray-800 text-sm">
                                  {testimonial.name}
                                </h3>
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 ml-1" />
                              </div>
                              <div className="flex items-center mt-0.5">
                                <span className="text-xs text-gray-600">
                                  {testimonial.role}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 ml-1.5">
                                  {testimonial.badge}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {testimonial.date}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="flex mb-1.5">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400"
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                            {testimonial.quote}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center p-1.5 rounded-lg bg-blue-50">
                            <div className="text-blue-600 font-semibold text-sm">
                              {testimonial.stats.profitIncrease}
                            </div>
                            <div className="text-[10px] text-gray-600">
                              Profit Increase
                            </div>
                          </div>
                          <div className="text-center p-1.5 rounded-lg bg-green-50">
                            <div className="text-green-600 font-semibold text-sm">
                              {testimonial.stats.successRate}
                            </div>
                            <div className="text-[10px] text-gray-600">
                              Success Rate
                            </div>
                          </div>
                          <div className="text-center p-1.5 rounded-lg bg-purple-50">
                            <div className="text-purple-600 font-semibold text-sm">
                              {testimonial.stats.monthsUsing}mo
                            </div>
                            <div className="text-[10px] text-gray-600">
                              Using TradeIQ
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center">
                            <Award className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                            <span className="text-xs text-gray-600">
                              {testimonial.achievement}
                            </span>
                          </div>
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
              disabled={currentPage === 0}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div className="text-sm text-gray-600">
              {currentPage + 1} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-600">
            Join thousands of successful traders who have transformed their trading journey with TradeIQ
          </p>
        </motion.div>
      </div>
    </section>
  );
};
