import React from 'react';
import { ContactHero, ContactForm, ContactInfo } from '../components/contact';

const Contact = () => {
  return (
    <div className="bg-gray-50">
      <ContactHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </div>
  );
};

export default Contact;
