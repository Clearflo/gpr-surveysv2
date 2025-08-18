import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

const propertyTypes = [
  {
    path: "/services/commercial-gpr",
    title: "Commercial Properties",
    description: "Our expertise ensures safe excavation, precise utility mapping, and efficient project planning, helping developers, contractors, and property managers mitigate risks, avoid costly delays, and maintain compliance with industry standards."
  },
  {
    path: "/services/residential-gpr",
    title: "Residential Properties",
    description: "Begin your project with confidence through precise subsurface utility scanning and locating. GPR Surveys Inc. supports homeowners and contractors in the due diligence process for all types of residential properties, including single-family homes, multi-unit developments, and housing communities."
  },
  {
    path: "/services/pre-construction",
    title: "Civil Construction & Roadway Development",
    description: "Subsurface utility improvement is a crucial aspect of civil construction. At GPR Surveys Inc., we specialize in advanced ground-penetrating radar (GPR) scanning and utility locating services to support safe and efficient infrastructure development, ensuring accurate subsurface data throughout the entire process, from design to construction."
  }
];

const PropertyTypes = () => {
  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden">
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-blue-900 mb-4 uppercase tracking-wider">
            Property Types We Serve
          </h2>
          <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Specialized GPR solutions for every property type
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {propertyTypes.map((property, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -20 : index === 2 ? 20 : 0, y: index === 1 ? 20 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                to={property.path}
                className="industrial-card p-8 block h-full group"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-blue-900 transition-colors duration-300 group-hover:text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{property.title}</h3>
                <p className="text-lg text-gray-600 mb-6">
                  {property.description}
                </p>
                <div className="learn-more-btn group inline-flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyTypes;