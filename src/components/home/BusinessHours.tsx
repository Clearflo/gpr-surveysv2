import React from 'react';
import { Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

const BusinessHours = () => {
  return (
    <div className="py-16 bg-blue-900 relative overflow-hidden">
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
        <div className="text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-display font-bold mb-6 uppercase tracking-wider">Business Hours</h2>
            <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <div className="flex items-start justify-center mb-6">
                <Clock className="w-8 h-8 text-white mr-4 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xl font-bold mb-2">Regular Business Hours</p>
                  <p className="text-lg">Monday - Friday: 8:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-start justify-center">
                <Phone className="w-8 h-8 text-white mr-4 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xl font-bold mb-2">After Hours & Weekends</p>
                  <p className="text-lg">Contact us to schedule</p>
                  <p className="text-lg font-bold mt-2">250-896-7576</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHours;