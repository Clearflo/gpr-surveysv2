import React from 'react';
import { Phone, Clock, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const EmergencyContact = () => {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Contact Information</h2>
          <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-red-50 p-8 rounded-lg border-l-4 border-red-600 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-20 h-20 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
              <Phone className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Emergency Response</h3>
              <p className="text-lg text-gray-700 mb-6">
                For urgent utility locating needs, contact our emergency response team immediately:
              </p>
              <div className="text-2xl font-bold text-red-600 mb-4">250-896-7576</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-red-600" />
                    Response Time
                  </h4>
                  <p className="text-gray-600">1-3 hours for most locations</p>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FileCheck className="w-5 h-5 mr-2 text-red-600" />
                    Available Services
                  </h4>
                  <p className="text-gray-600">Utility locating, damage assessment, safety clearance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
