import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

const serviceAreas = [
  {
    title: "Vancouver Island",
    description: "Complete coverage of Vancouver Island including Victoria, Nanaimo, and remote locations",
    features: ["Victoria", "Nanaimo", "Port Alberni", "Campbell River", "Remote Areas"]
  },
  {
    title: "Gulf Islands",
    description: "Servicing all Gulf Islands with specialized equipment transport capabilities",
    features: ["Salt Spring Island", "Pender Islands", "Galiano Island", "Mayne Island", "Saturna Island"]
  },
  {
    title: "British Columbia",
    description: "Supporting projects throughout British Columbia's diverse regions",
    features: ["Lower Mainland", "Interior BC", "Northern Communities", "Remote Locations", "Resource Roads"]
  }
];

const transportMethods = [
  {
    title: "Helicopter Access",
    description: "Reach remote mountain sites and offshore locations"
  },
  {
    title: "Aircraft Transport",
    description: "Quick deployment to distant communities"
  },
  {
    title: "Marine Vessels",
    description: "Access coastal and island locations"
  },
  {
    title: "UTV/ATV",
    description: "Navigate challenging terrain and resource roads"
  }
];

const ServiceAreas = () => {
  return (
    <div className="py-20 bg-gray-50 relative overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 fill-blue-900/5 stroke-blue-900/5",
          "[mask-image:linear-gradient(to_bottom,white,transparent)]"
        )}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-blue-900 mb-4 uppercase tracking-wider">Service Areas</h2>
          <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Providing comprehensive GPR services across Vancouver Island and British Columbia
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="industrial-card p-8"
            >
              <h3 className="text-2xl font-display font-bold text-blue-900 mb-4 tracking-wide">{area.title}</h3>
              <p className="text-gray-600 mb-6">{area.description}</p>
              <ul className="space-y-2">
                {area.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <ArrowRight className="w-4 h-4 text-blue-900 mr-2 flex-shrink-0" />
                    <span className="hover:text-blue-900 transition-colors duration-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-blue-900 rounded-lg p-8 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 blueprint-grid opacity-10"></div>
          <h3 className="text-2xl font-display font-semibold mb-4 tracking-wide relative z-10">No Location Too Remote</h3>
          <p className="text-lg text-gray-200 mb-6">
            Our collapsible equipment is designed for transport by helicopter, plane, watercraft, and UTVs,
            ensuring we can reach even the most challenging project locations.
          </p>
          <Link to="/contact" className="btn-industrial">
            Request Service for Your Location
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </motion.div>
        
        <div className="mt-12 grid md:grid-cols-4 gap-8">
          {transportMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="industrial-card p-6"
            >
              <h4 className="text-lg font-display font-bold text-blue-900 mb-2">{method.title}</h4>
              <p className="text-gray-600">{method.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceAreas;