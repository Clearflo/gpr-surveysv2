import React from 'react';
import { Clock, CalendarClock, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GridPattern } from '../components/ui/grid-pattern';
import { cn } from '../lib/utils';

const Projects = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-900 py-20 relative overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Our Projects</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Showcasing our expertise in underground mapping and utility detection
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-8">
            <CalendarClock className="w-12 h-12 text-blue-900" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Project Gallery Coming Soon</h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            We're currently assembling a showcase of our most impressive ground penetrating radar projects. 
            Check back soon to explore our portfolio of successful underground mapping and utility detection work.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <CheckCircle className="w-10 h-10 text-blue-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Commercial Projects</h3>
              <p className="text-gray-600">Office buildings, industrial sites, and large-scale developments</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <CheckCircle className="w-10 h-10 text-blue-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Infrastructure Work</h3>
              <p className="text-gray-600">Roadways, bridges, and municipal infrastructure projects</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <CheckCircle className="w-10 h-10 text-blue-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Residential Solutions</h3>
              <p className="text-gray-600">Single-family homes, multi-family developments, and property surveys</p>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            Need GPR services for your project? We're available now to discuss your requirements.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Get in Touch
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/book" className="btn-secondary">
              Book a Job
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;