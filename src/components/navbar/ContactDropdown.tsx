import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, Mail, Calendar } from 'lucide-react';

interface ContactDropdownProps {
  showContact: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ContactDropdown: React.FC<ContactDropdownProps> = ({
  showContact,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div className="relative">
      <button
        className="btn-primary flex items-center rounded-none"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span>Contact Us</span>
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-500 ${showContact ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute right-0 mt-2 w-[220px] bg-white shadow-xl z-50 transition-all duration-500 ease-in-out origin-top ${
          showContact 
            ? 'opacity-100 transform scale-100' 
            : 'opacity-0 transform scale-95 pointer-events-none'
        } border border-gray-200`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <a
          href="tel:+12508967576"
          className="flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-300"
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Us
        </a>
        <Link
          to="/contact"
          className="flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-300"
        >
          <Mail className="w-4 h-4 mr-2" />
          Get a Quote
        </Link>
        <Link 
          to="/book" 
          className="flex items-center px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-300"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Your Job
        </Link>
      </div>
    </div>
  );
};

export default ContactDropdown;
