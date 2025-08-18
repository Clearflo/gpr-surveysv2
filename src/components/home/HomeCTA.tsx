import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '../../lib/utils';

const HomeCTA = () => {
  return (
    <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
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
          className="relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-wider">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a consultation and discover how our GPR services can benefit your project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="btn-industrial group w-full sm:w-auto"
            >
              Get in Touch
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </Link>
            <Link
              to="/book"
              className="btn-secondary group w-full sm:w-auto"
            >
              Book a Job
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeCTA;