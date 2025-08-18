import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Shield, Map, Target, Building2, Radio, LucideIcon } from 'lucide-react';

interface Service {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface ServicesDropdownProps {
  isScrolled: boolean;
  showServices: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const services: Service[] = [
  { name: "Utility Locating", path: "/services/utility-locating", icon: Search },
  { name: "UST Detection", path: "/services/ust-detection", icon: Shield },
  { name: "Environmental Remediation", path: "/services/environmental-remediation", icon: Map },
  { name: "Pre-Construction", path: "/services/pre-construction", icon: Target },
  { name: "Sensitive Sites", path: "/services/sensitive-sites", icon: Building2 },
  { name: "Emergency Locates", path: "/services/emergency-locates", icon: Radio }
];

const ServicesDropdown: React.FC<ServicesDropdownProps> = ({
  isScrolled,
  showServices,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div className="relative group">
      <button
        className={`flex items-center transition-colors duration-300 ${
          isScrolled ? 'text-gray-700' : 'text-gray-800'
        } hover:text-primary focus:outline-none group`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span>Services</span>
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-500 ${showServices ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute left-0 mt-2 w-[280px] bg-white shadow-xl z-50 transition-all duration-500 ease-in-out origin-top ${
          showServices 
            ? 'opacity-100 transform scale-100' 
            : 'opacity-0 transform scale-95 pointer-events-none'
        } border border-gray-200`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Link
          to="/services"
          className="flex items-center px-6 py-4 text-gray-900 hover:bg-blue-50 hover:text-primary font-medium border-b border-gray-200"
        >
          All Services
        </Link>
        {services.map((service, index) => (
          <Link
            key={index}
            to={service.path}
            className="flex items-center px-6 py-4 text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-300"
          >
            <service.icon className="w-5 h-5 mr-3 text-blue-900" />
            {service.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesDropdown;
export { services }; // Export services for use in mobile menu
