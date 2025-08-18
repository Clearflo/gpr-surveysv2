import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrollPosition } from '../hooks/useScrollPosition';
import NavbarLogo from './navbar/NavbarLogo';
import ServicesDropdown from './navbar/ServicesDropdown';
import ContactDropdown from './navbar/ContactDropdown';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 0;
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleMouseEnter = (menu: 'services' | 'contact') => {
    if (timeoutId) clearTimeout(timeoutId);
    if (menu === 'services') setShowServices(true);
    if (menu === 'contact') setShowContact(true);
  };

  const handleMouseLeave = (menu: 'services' | 'contact') => {
    const id = setTimeout(() => {
      if (menu === 'services') setShowServices(false);
      if (menu === 'contact') setShowContact(false);
    }, 600); // Increased from 300ms to 600ms for longer persistence
    setTimeoutId(id);
  };

  const handleMobileNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <NavbarLogo isScrolled={isScrolled} />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`transition-colors duration-300 ${
              isScrolled ? 'text-gray-700' : 'text-gray-800'
            } hover:text-primary`}>Home</Link>
            
            <ServicesDropdown
              isScrolled={isScrolled}
              showServices={showServices}
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={() => handleMouseLeave('services')}
            />
            
            <Link to="/about" className={`transition-colors duration-300 ${
              isScrolled ? 'text-gray-700' : 'text-gray-800'
            } hover:text-blue-900`}>About</Link>
            
            <Link to="/projects" className={`transition-colors duration-300 ${
              isScrolled ? 'text-gray-700' : 'text-gray-800'
            } hover:text-blue-900`}>Projects</Link>
            
            <ContactDropdown
              showContact={showContact}
              onMouseEnter={() => handleMouseEnter('contact')}
              onMouseLeave={() => handleMouseLeave('contact')}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-900"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu isOpen={isOpen} onClose={handleMobileNavClick} />
    </nav>
  );
};

export default Navbar;
