import React from 'react';
import { ArrowRight, Building2, Target, Search, Shield, Map, Building, FileCheck } from 'lucide-react';
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
            className="px-4 py-2 bg-blue-900 text-white rounded-md font-medium"
          >
            Commercial
          </Link>
          <Link
            to="/services/residential-gpr"
            className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-md font-medium border border-blue-200"
          >
            Residential
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const CommercialGPR = () => {
  return (
    <div className="bg-gray-50">
      <PropertyTypeNav />
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center bg-center bg-cover" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Commercial GPR Solutions
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in animation-delay-200">
              Comprehensive underground mapping for large-scale commercial and industrial projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-200">
              <Link to="/book" className="btn-primary group">
                Schedule Survey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <div className="flex items-center gap-8 mt-8 sm:mt-0 sm:ml-8 text-gray-200">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm">Commercial Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">99%</div>
                  <div className="text-sm">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Key Applications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Construction Planning",
                description: "Pre-construction utility mapping for large developments and infrastructure projects",
                features: [
                  "Foundation planning",
                  "Excavation safety",
                  "Utility conflict prevention"
                ]
              },
              {
                icon: Target,
                title: "Infrastructure Management",
                description: "Comprehensive mapping of existing underground infrastructure",
                features: [
                  "Asset documentation",
                  "Maintenance planning",
                  "System upgrades"
                ]
              },
              {
                icon: Shield,
                title: "Risk Mitigation",
                description: "Prevent costly utility strikes and project delays",
                features: [
                  "Damage prevention",
                  "Safety compliance",
                  "Insurance requirements"
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


      {/* Technical Capabilities */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Technology</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our commercial GPR surveys utilize state-of-the-art equipment and advanced processing 
                software to deliver accurate, comprehensive underground mapping.
              </p>
              <ul className="space-y-4">
                {[
                  "Multi-frequency GPR systems for deep penetration",
                  "3D visualization capabilities",
                  "GPS integration for precise mapping",
                  "Advanced signal processing",
                  "Real-time data collection"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-900 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="GPR Equipment"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-900 text-white p-6 rounded-lg shadow-xl">
                <p className="text-xl font-bold">Industry-Leading</p>
                <p className="text-sm">Equipment & Expertise</p>
              </div>
            </div>
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
            Ready to Start Your Commercial Project?
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Contact us today for a consultation and detailed quote for your commercial GPR needs.
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

export default CommercialGPR;