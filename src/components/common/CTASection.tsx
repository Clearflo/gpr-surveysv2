import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryButtonText = 'Get in Touch',
  primaryButtonLink = '/contact',
  secondaryButtonText = 'Book a Job',
  secondaryButtonLink = '/book',
  className = ''
}) => {
  return (
    <div className={`bg-blue-900 py-24 relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 blueprint-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50"></div>
      <GridPattern
        width={20}
        height={20}
        className={cn(
          "absolute inset-0 fill-white/10 stroke-white/10",
          "[mask-image:linear-gradient(to_bottom,white,transparent)]"
        )}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-6 relative z-10">{title}</h2>
          {subtitle && (
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={primaryButtonLink}
              className="btn-industrial"
            >
              {primaryButtonText}
              <ArrowRight className="ml-3" size={24} />
            </Link>
            <Link
              to={secondaryButtonLink}
              className="btn-secondary"
            >
              {secondaryButtonText}
              <ArrowRight className="ml-3" size={24} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;
