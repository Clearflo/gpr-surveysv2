import React from 'react';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

interface ProcessStep {
  number: string;
  title: string;
  desc: string;
}

interface ProcessStepsProps {
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
  columns?: 3 | 4;
  className?: string;
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({
  title,
  subtitle,
  steps,
  columns = 4,
  className = ''
}) => {
  const gridCols = {
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

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
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="industrial-card p-6 text-center"
            >
              <div className="w-16 h-16 bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessSteps;
