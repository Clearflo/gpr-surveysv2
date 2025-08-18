import React from 'react';
import { CheckCircle, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceFeature {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
  features: string[];
}

interface ServiceFeaturesProps {
  title: string;
  subtitle?: string;
  features: ServiceFeature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const ServiceFeatures: React.FC<ServiceFeaturesProps> = ({
  title,
  subtitle,
  features,
  columns = 3,
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
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const iconBgColor = feature.iconBgColor || 'bg-blue-50';
            const iconColor = feature.iconColor || 'text-blue-900';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="industrial-card p-8"
              >
                <div className={`${iconBgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatures;
