import React from 'react';
import ServicePageTemplate from '../common/ServicePageTemplate';
import { ServicePageData } from './ServicePageHelpers';

interface ServicePageBuilderProps {
  data: ServicePageData;
  children?: React.ReactNode;
}

/**
 * ServicePageBuilder - A component that simplifies creating service pages
 * by wrapping ServicePageTemplate with a more convenient data structure
 */
const ServicePageBuilder: React.FC<ServicePageBuilderProps> = ({ data, children }) => {
  const {
    hero,
    overview,
    serviceFeatures,
    process,
    benefits,
    stats,
    caseStudies,
    faqs,
    cta
  } = data;

  return (
    <>
      <ServicePageTemplate
        // Hero Section
        heroImage={hero.image}
        heroTitle={hero.title}
        heroSubtitle={hero.subtitle}
        heroPrimaryButton={hero.primaryButton}
        heroPrimaryLink={hero.primaryLink}
        heroSecondaryButton={hero.secondaryButton}
        heroSecondaryLink={hero.secondaryLink}
        
        // Overview Section
        overviewIcon={overview.icon}
        overviewTitle={overview.title}
        overviewDescription={overview.description}
        
        // Service Features
        serviceFeaturesTitle={serviceFeatures?.title}
        serviceFeaturesSubtitle={serviceFeatures?.subtitle}
        serviceFeatures={serviceFeatures?.features}
        serviceFeaturesColumns={serviceFeatures?.columns}
        
        // Process Section
        processTitle={process?.title}
        processSubtitle={process?.subtitle}
        processSteps={process?.steps}
        
        // Benefits Section
        benefitsTitle={benefits?.title}
        benefitsSubtitle={benefits?.subtitle}
        benefits={benefits?.items}
        benefitsColumns={benefits?.columns}
        
        // Stats Section
        statsTitle={stats?.title}
        statsSubtitle={stats?.subtitle}
        stats={stats?.items}
        
        // Case Studies
        caseStudiesTitle={caseStudies?.title}
        caseStudies={caseStudies?.items}
        
        // FAQ Section
        faqTitle={faqs?.title}
        faqs={faqs?.items}
        
        // CTA Section
        ctaTitle={cta.title}
        ctaSubtitle={cta.subtitle}
        ctaPrimaryButton={cta.primaryButton}
        ctaPrimaryLink={cta.primaryLink}
        ctaSecondaryButton={cta.secondaryButton}
        ctaSecondaryLink={cta.secondaryLink}
      />
      {children}
    </>
  );
};

export default ServicePageBuilder;
