import React from 'react';
import { motion } from 'framer-motion';

interface CaseStudy {
  image: string;
  alt: string;
  title: string;
  description: string;
}

interface CaseStudiesProps {
  title: string;
  caseStudies: CaseStudy[];
  className?: string;
}

const CaseStudies: React.FC<CaseStudiesProps> = ({
  title,
  caseStudies,
  className = ''
}) => {
  return (
    <div className={`bg-white py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <img 
                src={study.image} 
                alt={study.alt} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{study.title}</h3>
                <p className="text-gray-600">{study.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
