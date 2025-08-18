import React from 'react';
import { Shield, Users, PenTool as Tool } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  {
    icon: Shield,
    title: "Accuracy",
    description: "We prioritize precision in every scan and report, ensuring reliable data you can build on"
  },
  {
    icon: Users,
    title: "People Helping People",
    description: "We're grounded in service — real people helping real people, with integrity, care, and a hands-on approach"
  },
  {
    icon: Tool,
    title: "Continued Excellence",
    description: "We strive for excellence through continuous improvement — always evolving our technology, methods, and mindset"
  }
];

const CompanyValues = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The principles that guide our work and relationships with clients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="industrial-card p-8 text-center"
            >
              <value.icon className="w-12 h-12 text-blue-900 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyValues;