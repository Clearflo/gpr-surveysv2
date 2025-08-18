import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarLogoProps {
  isScrolled: boolean;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ isScrolled }) => {
  return (
    <Link to="/" className="flex items-center space-x-3 relative">
      <img 
        src="/Assests/Copy of Ingoude.png" 
        alt="GPR SURVEYS Inc."
        className={`transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`}
      />
      <span className={`font-display font-bold transition-all duration-300 tracking-wider uppercase ${
        isScrolled 
          ? 'text-xl text-blue-900' 
          : 'text-2xl text-blue-900'
      }`}>
        GPR SURVEYS Inc.
      </span>
    </Link>
  );
};

export default NavbarLogo;
