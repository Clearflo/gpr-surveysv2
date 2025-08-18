import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Calendar } from 'lucide-react';
import { services } from './ServicesDropdown';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-lg border-t border-construction-200">
        <Link 
          to="/" 
          className="block px-3 py-2 text-gray-700 hover:text-blue-900"
          onClick={onClose}
        >
          Home
        </Link>
        <div className="px-3 py-2">
          <Link 
            to="/services" 
            className="block text-gray-700 hover:text-blue-900 font-medium"
            onClick={onClose}
          >
            Services
          </Link>
          <div className="pl-4 mt-2 space-y-1">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.path}
                className="block py-1 text-gray-600 hover:text-blue-900 text-sm"
                onClick={onClose}
              >
                {service.name}
              </Link>
            ))}
          </div>
        </div>
        <Link 
          to="/about" 
          className="block px-3 py-2 text-gray-700 hover:text-blue-900"
          onClick={onClose}
        >
          About
        </Link>
        <Link 
          to="/projects" 
          className="block px-3 py-2 text-gray-700 hover:text-blue-900"
          onClick={onClose}
        >
          Projects
        </Link>
        <div className="px-3 py-2 space-y-2">
          <a
            href="tel:+12508967576"
            className="flex items-center text-gray-700 hover:text-blue-900"
            onClick={onClose}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Us
          </a>
          <Link
            to="/contact"
            className="flex items-center text-gray-700 hover:text-blue-900"
            onClick={onClose}
          >
            <Mail className="w-4 h-4 mr-2" />
            Get a Quote
          </Link>
          <Link 
            to="/book" 
            className="flex items-center text-gray-700 hover:text-blue-900"
            onClick={onClose}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Your Job
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
