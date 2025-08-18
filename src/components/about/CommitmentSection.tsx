import React from 'react';
import { motion } from 'framer-motion';

const CommitmentSection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="prose prose-lg mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to Excellence</h2>
            <div className="h-1 w-24 bg-blue-900 mx-auto"></div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg shadow-lg space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-blue-900/10 rounded-full blur-3xl"></div>
            <p className="text-gray-600 relative z-10">
              GPR SURVEYS Inc., proudly supports the principles of the British Columbia Common Ground Alliance (BCCGA). 
              We are committed to promoting safe excavation practices, damage prevention, and accurate subsurface utility 
              locating to protect people, property, and infrastructure.
            </p>
            <h3 className="text-2xl font-bold text-gray-900 relative z-10">Safety & Professionalism</h3>
            <p className="text-gray-600 relative z-10">
              We take accuracy, reliability, and risk management seriously. To ensure the highest level of protection 
              for our clients and projects, we carry $2.5 million in professional liability insurance.
            </p>
            <p className="text-gray-600 relative z-10">
              Our coverage provides peace of mind by protecting against potential claims related to errors, omissions, 
              or misinterpretation of subsurface utility locating data. This ensures that all work performed by our 
              highly trained professionals meets industry standards and regulatory requirements.
            </p>
            <p className="text-gray-600 relative z-10">
              GPR SURVEYS Inc., upholds the highest safety standards for our team and clients. We maintain good standing 
              with WorkSafeBC (WCB), ensuring full compliance with workplace safety regulations and industry best practices.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommitmentSection;