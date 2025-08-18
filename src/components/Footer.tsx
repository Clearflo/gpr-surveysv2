import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div>
            <img src="/Assests/Copy of Ingoude.png" alt="GPR SURVEYS Inc." className="h-24 mb-4" />
            <p className="text-gray-400">
              Leading provider of ground penetrating radar services for precise underground mapping and detection.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Services</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-white">Projects</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 tracking-wide">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services/utility-locating" className="text-gray-300 hover:text-white">Commercial & Residential Utility Locating</Link></li>
              <li><Link to="/services/ust-detection" className="text-gray-300 hover:text-white">Underground Storage Tank Detection</Link></li>
              <li><Link to="/services/environmental-remediation" className="text-gray-300 hover:text-white">Environmental Drilling Support</Link></li>
              <li><Link to="/services/pre-construction" className="text-gray-300 hover:text-white">Pre-Construction Locating</Link></li>
              <li><Link to="/services/sensitive-sites" className="text-gray-300 hover:text-white">3D Mapping & Asset Management</Link></li>
              <li><Link to="/services/emergency-locates" className="text-gray-300 hover:text-white">Emergency Locate Services</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 tracking-wide">Contact Us</h3>
            <div className="space-y-4">
              <p className="flex items-start text-gray-400">
                <Phone size={20} className="mr-2" />
                250-896-7576
              </p>
              <p className="flex items-start text-gray-400">
                <MapPin size={20} className="mr-2 mt-1" />
                <span>
                  550-2950 Douglas St<br />
                  Victoria BC V8T 4N4<br />
                  <span className="text-sm font-condensed">(Mailing address only)</span>
                </span>
              </p>
              <p className="flex items-start text-gray-400">
                <Mail size={20} className="mr-2" />
                info@gprsurveys.ca
              </p>
              <p className="flex items-start text-gray-400">
                <Clock size={20} className="mr-2 mt-1" />
                <span>
                  Regular Business Hours<br />
                  Monday - Friday: 8:00 AM - 5:00 PM<br />
                  <span className="text-sm font-condensed">After Hours & Weekends: Contact us to schedule</span>
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 relative">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} GPR SURVEYS Inc. All rights reserved.</p>
            <Link 
              to="/admin" 
              className="flex items-center text-gray-500 hover:text-gray-300 text-sm transition-colors duration-300"
            >
              <Lock size={14} className="mr-1" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;