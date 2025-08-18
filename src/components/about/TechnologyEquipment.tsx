import React from 'react';
import { motion } from 'framer-motion';

const TechnologyEquipment = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology & Equipment</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced technology for comprehensive underground detection
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-900"
        >
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              GPR uses high-frequency non-destructive technology radar waves to penetrate the subsurface and identify 
              buried pipes, conduits, tanks, and other infrastructure—helping prevent costly damages, delays, and safety hazards. 
              Unlike traditional locating methods, GPR can detect non-metallic utilities, voids, and obstructions, providing 
              a comprehensive underground profile for safer excavation.
            </p>
            <p className="text-gray-600 leading-relaxed">
              While EM locators are ideal for detecting and tracing conductive utilities, they can also be used with 
              detectable duct rodders to locate non-conductive buried utilities.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Typically, a combination of Ground Penetrating Radar (GPR), Electromagnetic (EM) equipment, Ferromagnetic 
              technology, and other locating tools is used for each locate. However, depending on the project scope, 
              site conditions, access limitations, pipe materials, and other factors, the operator will evaluate the 
              best approach to achieve the most accurate and reliable results.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TechnologyEquipment;