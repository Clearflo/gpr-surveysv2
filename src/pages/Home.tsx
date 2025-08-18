import React from 'react';
import {
  HeroSection,
  ServicesOverview,
  PropertyTypes,
  FeaturedProjects,
  AboutSection,
  Testimonials,
  BusinessHours,
  ServiceAreas,
  HomeCTA
} from '../components/home';

const Home = () => {
  return (
    <div className="bg-gray-50">
      <HeroSection />
      <ServicesOverview />
      <PropertyTypes />
      <FeaturedProjects />
      <AboutSection />
      <Testimonials />
      <BusinessHours />
      <ServiceAreas />
      <HomeCTA />
    </div>
  );
};

export default Home;