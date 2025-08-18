import React from 'react';
import { Shield, Award, Users, PenTool as Tool } from 'lucide-react';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

const features = [
  {
    icon: Shield,
    title: "Expert Team",
    description: "Certified professionals with years of experience in GPR technology"
  },
  {
    icon: Tool,
    title: "Advanced Technology",
    description: "State-of-the-art GPR equipment for precise results"
  },
  {
    icon: Award,
    title: "Proven Track Record",
    description: "Successfully completed thousands of surveys across diverse projects"
  },
  {
    icon: Users,
    title: "Client-Focused",
    description: "Dedicated to exceeding client expectations with quality service"
  }
];

const WhyChooseUs = () => {
  return (
    <div className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent"></div>
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GPR Surveys</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the advantages that set us apart in the industry
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="industrial-card p-6 text-center"
            >
              <feature.icon className="w-12 h-12 text-blue-900 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;