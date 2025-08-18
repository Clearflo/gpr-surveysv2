import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Benefit {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
}

interface ServiceBenefitsProps {
  title: string;
  subtitle?: string;
  benefits: Benefit[];
  columns?: 2 | 3 | 4;
  centered?: boolean;
  className?: string;
}

const ServiceBenefits: React.FC<ServiceBenefitsProps> = ({
  title,
  subtitle,
  benefits,
  columns = 3,
  centered = true,
  className = ''
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

  return (
    <div className={`bg-gray-50 py-24 ${className}`}>
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
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        <div className={`grid ${gridCols[columns]} gap-8`}>
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const iconBgColor = benefit.iconBgColor || 'bg-blue-50';
            const iconColor = benefit.iconColor || 'text-blue-900';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`industrial-card p-8 ${centered ? 'text-center' : ''}`}
              >
                <div className={`${iconBgColor} w-16 h-16 rounded-lg flex items-center justify-center ${centered ? 'mx-auto' : ''} mb-6`}>
                  <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceBenefits;
