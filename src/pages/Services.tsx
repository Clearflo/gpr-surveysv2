import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Map, Target, Search, Radio, Check, CheckCircle } from 'lucide-react';
import { GridPattern } from '../components/ui/grid-pattern';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

// Define the services with detailed information
const services = [
  {
    icon: Search,
    title: "Underground Utility Detection",
    description: "Comprehensive utility detection for commercial and residential properties, ensuring accurate mapping of all underground infrastructure.",
    image: "/Assests/pexels-willbillurban-30668000.jpg",
    features: ["Commercial properties", "Residential properties", "Non-destructive detection", "Detailed documentation"],
    path: "/services/utility-locating",
    color: "bg-blue-100",
    iconColor: "text-blue-900"
  },
  {
    icon: Shield,
    title: "Underground Storage Tank Detection",
    description: "Specialized detection services for locating underground storage tanks (USTs) in both commercial and residential settings.",
    image: "/Assests/Underground-tank-removal-768x511 (1).jpg",
    features: ["Tank location mapping", "Depth assessment", "Size estimation", "Material identification"],
    path: "/services/ust-detection",
    color: "bg-green-100",
    iconColor: "text-green-700"
  },
  {
    icon: Map,
    title: "Environmental Drilling Support",
    description: "Precise utility locating services before environmental drilling operations, ensuring safe and efficient project execution for both indoor and outdoor locations.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    features: ["Indoor utility mapping", "Outdoor infrastructure detection", "Pre-drill safety clearance", "Site assessment"],
    path: "/services/environmental-remediation",
    color: "bg-amber-100",
    iconColor: "text-amber-700"
  },
  {
    icon: Target,
    title: "Pre-Construction Utility Locating",
    description: "Thorough utility detection services prior to breaking ground or starting linear trenching projects, ensuring safe and efficient construction operations.",
    image: "/Assests/UtiliSource.DPV_.4-1-768x575.jpg",
    features: ["Pre-excavation scanning", "Linear project mapping", "Depth profiling", "Construction planning support"],
    path: "/services/pre-construction",
    color: "bg-red-100",
    iconColor: "text-red-700"
  },
  {
    icon: Map,
    title: "3D Mapping & Asset Management",
    description: "Advanced 3D mapping services for capital assets management and project planning, including sensitive site investigations with reliability clearance.",
    image: "/Assests/mapping-photo-2 (1).jpg",
    features: ["3D infrastructure mapping", "Asset documentation", "Project planning support", "Reliability clearance"],
    path: "/services/sensitive-sites",
    color: "bg-indigo-100",
    iconColor: "text-indigo-700"
  },
  {
    icon: Radio,
    title: "Emergency Locate Services",
    description: "Rapid response services for utility strikes and natural disaster damage assessment, providing critical support when time is of the essence.",
    image: "/Assests/Emergency.jpg",
    features: ["24/7 emergency response", "Damage assessment", "Utility strike investigation", "Natural disaster support"],
    path: "/services/emergency-locates",
    color: "bg-yellow-100",
    iconColor: "text-yellow-700"
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Services = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-24 bg-blue-900 overflow-hidden">
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1 
              variants={fadeIn} 
              className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-wider"
            >
              Our Comprehensive Services
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-200 max-w-3xl mx-auto mb-10"
            >
              Cutting-edge ground penetrating radar solutions delivered with precision and expertise
            </motion.p>
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/contact" className="btn-primary group">
                Get a Quote
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link to="/book" className="btn-secondary group">
                Book a Job
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Our Services</h2>
            <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized ground penetrating radar services tailored to your specific project needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="industrial-card overflow-hidden relative group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className={`${service.color} p-3 rounded-xl`}>
                      <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <Link
                        to={service.path}
                        className="learn-more-btn flex items-center text-blue-900 font-medium group-hover:text-[#fd8800] transition-colors duration-300"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Orange line element that appears on hover */}
                <div className="absolute top-0 left-0 w-0 h-1 bg-[#fd8800] transition-all duration-300 group-hover:w-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Our Services */}
      <div className="py-20 bg-gray-50 relative overflow-hidden">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose GPR SURVEYS</h2>
            <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert ground penetrating radar solutions with a commitment to accuracy and customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Technology",
                description: "State-of-the-art GPR equipment for precise results",
                icon: Target,
                color: "bg-blue-100",
                iconColor: "text-blue-900"
              },
              {
                title: "Expert Team",
                description: "Certified professionals with extensive experience",
                icon: Shield,
                color: "bg-green-100",
                iconColor: "text-green-700"
              },
              {
                title: "Comprehensive Reports",
                description: "Detailed documentation delivered same-day",
                icon: CheckCircle,
                color: "bg-amber-100",
                iconColor: "text-amber-700"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="industrial-card p-8 rounded-xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 group relative overflow-hidden"
              >
                <div className={`${feature.color} p-4 rounded-xl inline-block mb-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                
                {/* Orange line element that appears on hover */}
                <div className="absolute top-0 left-0 w-0 h-1 bg-[#fd8800] transition-all duration-300 group-hover:w-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Deliverables Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 bg-blue-200 rounded-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 -ml-16 -mb-16 bg-blue-200 rounded-full opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Comprehensive Documentation & Reporting</h2>
              <div className="max-w-3xl">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Every service we provide includes a standard invoice comprehensive digital report 
                  and locate drawings, outlining findings and site-specific limitations. Our reports ensure accurate 
                  documentation and are delivered the same day, keeping your project on schedule with clear and reliable 
                  deliverables.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { title: "Digital Reports", description: "Comprehensive documentation of all detected utilities" },
                  { title: "Same-Day Delivery", description: "Quick turnaround to keep your project on schedule" },
                  { title: "Site-Specific Details", description: "Customized information relevant to your project" }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow group hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    
                    {/* Orange line element that appears on hover */}
                    <div className="absolute top-0 left-0 w-0 h-1 bg-[#fd8800] transition-all duration-300 group-hover:w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Industries We Serve */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
            <div className="h-1 w-24 bg-blue-900 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized GPR solutions for diverse sectors and project types
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Construction", "Environmental", "Civil Engineering",
              "Municipal", "Residential", "Commercial",
              "Transportation", "Utilities", "Government"
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 hover:bg-blue-50 relative overflow-hidden group"
              >
                <h3 className="font-semibold text-gray-900">{industry}</h3>
                
                {/* Orange line element that appears on hover */}
                <div className="absolute top-0 left-0 w-0 h-1 bg-[#fd8800] transition-all duration-300 group-hover:w-full"></div>
              </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss how our GPR services can benefit your project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="btn-industrial"
              >
                Get in Touch
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/book"
                className="btn-secondary"
              >
                Book a Job
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Services;