import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewSectionProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
  icon: Icon,
  title,
  description,
  className = ''
}) => {
  return (
    <div className={`py-24 bg-white relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center mb-16"
        >
          {Icon && (
            <Icon className="w-20 h-20 text-blue-900 mb-8" />
          )}
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewSection;
