import React from 'react';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

interface Stat {
  value: string;
  description: string;
}

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats: Stat[];
  className?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  title,
  subtitle,
  stats,
  className = ''
}) => {
  return (
    <div className={`bg-white py-24 relative overflow-hidden ${className}`}>
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 fill-blue-900/5 stroke-blue-900/5",
          "[mask-image:linear-gradient(to_bottom,white,transparent)]"
        )}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            {title && (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
                <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
              </>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="industrial-card p-8 text-center"
            >
              <h3 className="text-4xl font-bold text-blue-900 mb-3">{stat.value}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
