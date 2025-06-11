import { motion } from 'framer-motion';

export const ClientsSection = (): JSX.Element => {
  // Company logos data for easy mapping
  const companyLogos = [
    { id: 1, logo: "/img-70.png", name: "Company logo 1" },
    { id: 2, logo: "/img-72.png", name: "Company logo 2" },
    { id: 3, logo: "/img-74.png", name: "Company logo 3" },
    { id: 4, logo: "/img-76.png", name: "Company logo 4" },
  ];

  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Trusted by Industry Leaders
        </motion.h2>
        <motion.div
          className="flex flex-wrap justify-center sm:justify-around items-center gap-8 sm:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {companyLogos.map((client) => (
            <motion.div
              key={client.id}
              className="flex items-center justify-center h-12 w-1/2 sm:w-1/3 md:w-1/4 lg:w-auto px-4"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-full max-w-full object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
