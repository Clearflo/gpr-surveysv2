import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

const ServiceAreasMission = () => {
  return (
    <div className="py-20 bg-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50"></div>
      <GridPattern
        width={20}
        height={20}
        className={cn(
          "absolute inset-0 fill-white/10 stroke-white/10",
          "[mask-image:linear-gradient(to_bottom,white,transparent)]"
        )}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 p-8 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              Service Areas
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Covering a wide geographic area, we serve Vancouver Island, the Gulf Islands, and parts of British Columbia, 
              including remote resource road locations. No roads? No problem! Our collapsible equipment is designed for 
              transport by helicopter, commercial and private planes, watercraft, and UTVs, ensuring we can support 
              challenging project locations.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Vancouver Island</h3>
                <ul className="space-y-1 text-sm">
                  <li>Victoria</li>
                  <li>Nanaimo</li>
                  <li>Campbell River</li>
                  <li>Port Alberni</li>
                </ul>
              </div>
              <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-2">Gulf Islands</h3>
                <ul className="space-y-1 text-sm">
                  <li>Salt Spring Island</li>
                  <li>Pender Islands</li>
                  <li>Galiano Island</li>
                  <li>Mayne Island</li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 p-8 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Mission Statement</h2>
            <p className="text-gray-200 leading-relaxed">
              At GPR SURVEYS Inc., we embrace the West Coast lifestyle while taking pride in what we do. We approach 
              every project with respect, humility, and professionalism, striving to deliver accurate and reliable 
              results—and perhaps, build connections that go beyond work.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-[#fd8800] mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold">Contact Us</h3>
                  <p className="text-gray-300">250-896-7576</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-[#fd8800] mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-300">info@gprsurveys.ca</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-[#fd8800] mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold">Hours</h3>
                  <p className="text-gray-300">Monday-Friday: 8:00AM - 5:00PM</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link to="/contact" className="btn-primary w-full sm:w-auto">
                Get in Touch
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/book" className="btn-secondary w-full sm:w-auto">
                Book a Job
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreasMission;