import React from 'react';
import { ArrowRight, Shield, Target, Search, Map, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const services = [
  {
    icon: Search,
    path: "/services/utility-locating",
    title: "Commercial & Residential Utility Locating",
    description: "Comprehensive detection of underground utilities for properties of all sizes"
  },
  {
    icon: Target,
    path: "/services/ust-detection",
    title: "Underground Storage Tank Detection",
    description: "Specialized detection of buried tanks and storage systems"
  },
  {
    icon: Shield,
    path: "/services/environmental-remediation",
    title: "Environmental Drilling Support",
    description: "Precise locating for environmental site investigations"
  },
  {
    icon: Map,
    path: "/services/pre-construction",
    title: "Pre-Construction Locating",
    description: "Thorough utility detection before breaking ground"
  },
  {
    icon: Radio,
    path: "/services/sensitive-sites",
    title: "3D Mapping & Asset Management",
    description: "Advanced mapping for infrastructure management"
  },
  {
    icon: Target,
    path: "/services/emergency-locates",
    title: "Emergency Locate Services",
    description: "Short Notice / Emergency Service Available for critical situations"
  }
];

const ServicesOverview = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="text-4xl font-display font-bold text-blue-900 mb-4 uppercase tracking-wider">
            Specialized Ground Penetrating Radar Services
          </h2>
          <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600">
            Industry-leading solutions for underground detection and mapping
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={service.path}
                className="industrial-card p-8 transition-all duration-300 group block h-full"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <div className="learn-more-btn mt-auto">
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

export default ServicesOverview;