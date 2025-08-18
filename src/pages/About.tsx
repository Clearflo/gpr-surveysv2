import React from 'react';
import {
  AboutHero,
  CompanyOverview,
  CompanyValues,
  CommitmentSection,
  WhyChooseUs,
  TechnologyEquipment,
  ServiceAreasMission
} from '../components/about';

const About = () => {
  return (
    <div className="bg-gray-50">
      <AboutHero />
      <CompanyOverview />
      <CompanyValues />
      <CommitmentSection />
      <WhyChooseUs />
      <TechnologyEquipment />
      <ServiceAreasMission />
    </div>
  );
};

export default About;