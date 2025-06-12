import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export const ClientsSection = (): JSX.Element => {
  // Company logos data with additional information
  const companyLogos = [
    { 
      id: 1, 
      logo: "/img-70.png", 
      name: "Financial Congm",
      description: "Investment Banking",
      stat: "10+ years partnership"
    },
    { 
      id: 2, 
      logo: "/img-72.png", 
      name: "Investment Fin",
      description: "Financial Services",
      stat: "$2B+ managed assets"
    },
    { 
      id: 3, 
      logo: "/img-74.png", 
      name: "Pading Coalin",
      description: "Global Banking",
      stat: "30+ countries served"
    },
    { 
      id: 4, 
      logo: "/img-76.png", 
      name: "Fintech",
      description: "Investment Management",
      stat: "500K+ transactions"
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow">
              Our Partners
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Empowering Global Financial Leaders
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Join the world's top financial institutions leveraging our AI-powered trading intelligence platform for unprecedented market insights
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {companyLogos.map((client) => (
            <motion.div
              key={client.id}
              variants={itemVariants}
              className="relative group"
            >
              <Card className="p-4 h-full bg-white/70 backdrop-blur-sm border border-gray-100 hover:border-blue-100 transition-colors duration-300">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-full h-16 flex items-center justify-center">
                    <motion.img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {client.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {client.description}
                    </p>
                    <div className="mt-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full inline-block">
                      {client.stat}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-gray-600">
            Trusted by leading financial institutions across 6 continents
          </p>
        </motion.div>
      </div>
    </section>
  );
};
