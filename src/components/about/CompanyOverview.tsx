import React from 'react';
import { motion } from 'framer-motion';

const CompanyOverview = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <div className="inline-block">
              <h2 className="text-3xl font-bold text-gray-900 relative">
                Our Story
                <div className="absolute left-0 bottom-0 w-3/4 h-1 bg-blue-900"></div>
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              With over 25 years of experience in the industry, we bring a well-rounded understanding of how projects evolve from the ground up. Our background spans a wide range of sectors within the resource and construction industries, giving us a deep appreciation for what clients need at every stage of development.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Over the years, we've specialized in using Ground Penetrating Radar (GPR) and Electromagnetic (EM) technology to deliver accurate and reliable subsurface data. Combined with our accreditation through ASTTBC (Applied Science Technologists and Technicians of British Columbia), we approach every project with a consultative mindset and a strong commitment to professionalism and industry standards.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-6">
              Clients choose GPR Surveys Inc. because they know they're getting trustworthy results, clear communication, and a partner who understands the importance of precision, planning, and peace of mind.
            </p>
            <div className="mt-6 py-4 px-6 bg-blue-50 border-l-4 border-blue-900 rounded">
              <p className="text-blue-900 font-medium italic">
                "We approach every project with respect, humility, and professionalism, striving to deliver accurate and reliable results."
              </p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="GPR Survey in action"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-[#fd8800] text-blue-900 p-4 rounded shadow-lg">
              <p className="font-bold">Experienced Team</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyOverview;