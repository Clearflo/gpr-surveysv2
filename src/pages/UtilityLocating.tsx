import React from 'react';
import { ArrowRight, CheckCircle, MapPin, Clock, Shield, Search, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GridPattern } from '../components/ui/grid-pattern';
import { cn } from '../lib/utils';

const UtilityLocating = () => {
  return (
    <div className="bg-gray-50">
      <div className="relative min-h-[600px] flex items-center bg-center bg-cover" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Precision Underground Mapping Experts
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in animation-delay-200">
              Advanced GPR technology and certified expertise to prevent costly utility strikes and project delays.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-200">
              <Link
                to="/book"
                className="btn-primary group"
              >
                Schedule Utility Locate
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/0"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(30deg,#f0f7ff_33%,transparent_33%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(150deg,#f0f7ff_33%,transparent_33%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6">
                <div className="bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-xl border border-blue-100">
                <h2 className="text-4xl font-bold text-blue-900 mb-6">
                  Comprehensive Utility Detection
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  At GPR SURVEYS Inc., we provide precision utility locating for both commercial 
                  and residential properties, ensuring safe excavation, construction, and renovation projects.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg shadow-md border border-blue-50">
                    <div className="text-3xl font-bold text-blue-900 mb-1">99%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-md border border-blue-50">
                    <div className="text-3xl font-bold text-blue-900 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                    <Shield className="w-6 h-6 text-blue-900" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Certified Expertise</h3>
                    <p className="text-gray-600">Our team of certified professionals ensures accurate detection and mapping of all underground utilities.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                    <Target className="w-6 h-6 text-blue-900" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Technology</h3>
                    <p className="text-gray-600">State-of-the-art GPR equipment for precise underground mapping and visualization.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                    <Clock className="w-6 h-6 text-blue-900" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Turnaround</h3>
                    <p className="text-gray-600">Same-day reporting and documentation to keep your project moving forward.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Property Types We Serve</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="industrial-card p-8">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Commercial Properties</h3>
              <p className="text-lg text-gray-600">
                Our expertise ensures safe excavation, precise utility mapping, and efficient project planning, helping developers, contractors, and property managers mitigate risks, avoid costly delays, and maintain compliance with industry standards.
              </p>
            </div>
            <div className="industrial-card p-8">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Residential Properties</h3>
              <p className="text-lg text-gray-600">
                Begin your project with confidence through precise subsurface utility scanning and locating. GPR Surveys Inc. supports homeowners and contractors in the due diligence process for all types of residential properties, including single-family homes, multi-unit developments, and housing communities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: "1", title: "Initial Assessment", desc: "Thorough desktop and/or in-person evaluation of record drawings and project requirements." },
              { number: "2", title: "Proposed Solution", desc: "Customized services tailored to your project's scope, requirements, and budget." },
              { number: "3", title: "GPR Scanning", desc: "Certified professionals utilizing advanced GPR and electromagnetic equipment" },
              { number: "4", title: "Documentation", desc: "Same-day data interpretation with detailed digital drawings and comprehensive reporting." }
            ].map((step, index) => (
              <div key={index} className="industrial-card p-6 text-center">
                <div className="w-16 h-16 bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why Choose Our Service</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="industrial-card p-8 text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Coverage</h3>
              <p className="text-gray-600">Backed by professional liability insurance, we provide reliable and precise subsurface scanning services.</p>
            </div>
            <div className="industrial-card p-8 text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Locally Owned and Operated</h3>
              <p className="text-gray-600">We proudly provide expert subsurface solutions with a deep understanding of our community's needs.</p>
            </div>
            <div className="industrial-card p-8 text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">We provide clear, honest, and detailed reporting, ensuring you have the information needed to make informed decisions.</p>
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
          <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Contact us today to schedule your utility locating service or request a quote.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="btn-industrial"
            >
              Get in Touch
              <ArrowRight className="ml-3" size={24} />
            </Link>
            <Link
              to="/book"
              className="btn-secondary"
            >
              Book a Job
              <ArrowRight className="ml-3" size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityLocating;