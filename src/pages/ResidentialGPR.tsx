import React from 'react';
import { ArrowRight, Home, Target, Search, Shield, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GridPattern } from '../components/ui/grid-pattern';
import { cn } from '../lib/utils';

const PropertyTypeNav = () => (
  <div className="bg-blue-50 py-4 border-b border-blue-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <span className="text-blue-900 font-medium">Property Type:</span>
        <div className="flex gap-4">
          <Link
            to="/services/commercial-gpr"
            className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-md font-medium border border-blue-200"
          >
            Commercial
          </Link>
          <Link
            to="/services/residential-gpr"
            className="px-4 py-2 bg-blue-900 text-white rounded-md font-medium"
          >
            Residential
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const ResidentialGPR = () => {
  return (
    <div className="bg-gray-50">
      <PropertyTypeNav />
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center bg-center bg-cover" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Residential GPR Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in animation-delay-200">
              Protect your property with precise underground utility detection and mapping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-200">
              <Link to="/book" className="btn-primary group">
                Schedule Inspection
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <div className="flex items-center gap-8 mt-8 sm:mt-0 sm:ml-8 text-gray-200">
                <div>
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-sm">Homes Protected</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-sm">Safety Record</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Applications */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Common Applications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: "Home Renovations",
                description: "Safe planning for additions and landscaping projects",
                features: [
                  "Foundation planning",
                  "Garden safety",
                  "Patio installations"
                ]
              },
              {
                icon: Target,
                title: "Utility Location",
                description: "Precise mapping of residential utility lines",
                features: [
                  "Water lines",
                  "Electrical cables",
                  "Gas pipes"
                ]
              },
              {
                icon: Shield,
                title: "Property Protection",
                description: "Prevent damage during home improvements",
                features: [
                  "Damage prevention",
                  "Cost savings",
                  "Peace of mind"
                ]
              }
            ].map((application, index) => (
              <div key={index} className="industrial-card p-8">
                <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <application.icon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{application.title}</h3>
                <p className="text-gray-600 mb-6">{application.description}</p>
                <ul className="space-y-2">
                  {application.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <ArrowRight className="w-4 h-4 text-blue-900 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Process Overview */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Initial Consultation",
                description: "Discuss your project needs and concerns"
              },
              {
                number: "2",
                title: "Site Survey",
                description: "Complete property scan using GPR technology"
              },
              {
                number: "3",
                title: "Data Analysis",
                description: "Process and interpret scan results"
              },
              {
                number: "4",
                title: "Documentation",
                description: "Provide detailed maps and recommendations"
              }
            ].map((step, index) => (
              <div key={index} className="industrial-card p-6 text-center">
                <div className="w-16 h-16 bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 rounded-full">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 py-24 relative overflow-hidden">
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
          <h2 className="text-4xl font-bold text-white mb-6 relative z-10">
            Protect Your Home Investment
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Schedule a residential GPR survey today and ensure safe, informed property improvements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-industrial">
              Get in Touch
              <ArrowRight className="ml-3" size={24} />
            </Link>
            <Link to="/book" className="btn-secondary">
              Book a Job
              <ArrowRight className="ml-3" size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentialGPR;