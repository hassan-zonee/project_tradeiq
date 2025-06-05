// No card imports needed

export const ClientsSection = (): JSX.Element => {
  // Company logos data for easy mapping
  const companyLogos = [
    { id: 1, logo: "/img-70.png", name: "Company logo 1" },
    { id: 2, logo: "/img-72.png", name: "Company logo 2" },
    { id: 3, logo: "/img-74.png", name: "Company logo 3" },
    { id: 4, logo: "/img-76.png", name: "Company logo 4" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Trusted by Industry Leaders</h2>
        <div className="flex flex-row justify-around">
          {companyLogos.map((client, index) => (
            <div key={index} className="flex items-center justify-center h-12">
              <img 
                src={client.logo} 
                alt={client.name} 
                className="max-h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
