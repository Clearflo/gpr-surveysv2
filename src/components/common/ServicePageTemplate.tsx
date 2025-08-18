import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import ServiceFeatures from './ServiceFeatures';
import ServiceBenefits from './ServiceBenefits';
import CTASection from './CTASection';
import ProcessSteps from './ProcessSteps';
import OverviewSection from './OverviewSection';
import CaseStudies from './CaseStudies';
import FAQSection from './FAQSection';
import StatsSection from './StatsSection';

// Type definitions for component props
export interface ServiceFeature {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
  features: string[];
}

export interface Benefit {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  desc: string;
}

export interface CaseStudy {
  image: string;
  alt: string;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  description: string;
}

interface ServicePageTemplateProps {
  // Hero Section
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryButton?: string;
  heroPrimaryLink?: string;
  heroSecondaryButton?: string;
  heroSecondaryLink?: string;
  
  // Overview Section
  overviewIcon?: LucideIcon;
  overviewTitle: string;
  overviewDescription: string;
  
  // Service Features
  serviceFeaturesTitle?: string;
  serviceFeaturesSubtitle?: string;
  serviceFeatures?: ServiceFeature[];
  serviceFeaturesColumns?: 2 | 3 | 4;
  
  // Process Section
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: ProcessStep[];
  
  // Benefits Section
  benefitsTitle?: string;
  benefitsSubtitle?: string;
  benefits?: Benefit[];
  benefitsColumns?: 2 | 3 | 4;
  
  // Stats Section
  statsTitle?: string;
  statsSubtitle?: string;
  stats?: Stat[];
  
  // Case Studies
  caseStudiesTitle?: string;
  caseStudies?: CaseStudy[];
  
  // FAQ Section
  faqTitle?: string;
  faqs?: FAQ[];
  
  // CTA Section
  ctaTitle: string;
  ctaSubtitle?: string;
  ctaPrimaryButton?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryButton?: string;
  ctaSecondaryLink?: string;
}

const ServicePageTemplate: React.FC<ServicePageTemplateProps> = ({
  // Hero
  heroImage,
  heroTitle,
  heroSubtitle,
  heroPrimaryButton,
  heroPrimaryLink,
  heroSecondaryButton,
  heroSecondaryLink,
  
  // Overview
  overviewIcon,
  overviewTitle,
  overviewDescription,
  
  // Service Features
  serviceFeaturesTitle = 'Our Services',
  serviceFeaturesSubtitle,
  serviceFeatures,
  serviceFeaturesColumns = 3,
  
  // Process
  processTitle = 'Our Process',
  processSubtitle,
  processSteps,
  
  // Benefits
  benefitsTitle = 'Key Benefits',
  benefitsSubtitle,
  benefits,
  benefitsColumns = 3,
  
  // Stats
  statsTitle,
  statsSubtitle,
  stats,
  
  // Case Studies
  caseStudiesTitle = 'Success Stories',
  caseStudies,
  
  // FAQ
  faqTitle = 'Frequently Asked Questions',
  faqs,
  
  // CTA
  ctaTitle,
  ctaSubtitle,
  ctaPrimaryButton,
  ctaPrimaryLink,
  ctaSecondaryButton,
  ctaSecondaryLink
}) => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <Hero
        backgroundImage={heroImage}
        title={heroTitle}
        subtitle={heroSubtitle}
        primaryButtonText={heroPrimaryButton}
        primaryButtonLink={heroPrimaryLink}
        secondaryButtonText={heroSecondaryButton}
        secondaryButtonLink={heroSecondaryLink}
      />
      
      {/* Overview Section */}
      <OverviewSection
        icon={overviewIcon}
        title={overviewTitle}
        description={overviewDescription}
      />
      
      {/* Service Features */}
      {serviceFeatures && serviceFeatures.length > 0 && (
        <ServiceFeatures
          title={serviceFeaturesTitle}
          subtitle={serviceFeaturesSubtitle}
          features={serviceFeatures}
          columns={serviceFeaturesColumns}
        />
      )}
      
      {/* Process Section */}
      {processSteps && processSteps.length > 0 && (
        <ProcessSteps
          title={processTitle}
          subtitle={processSubtitle}
          steps={processSteps}
        />
      )}
      
      {/* Benefits Section */}
      {benefits && benefits.length > 0 && (
        <ServiceBenefits
          title={benefitsTitle}
          subtitle={benefitsSubtitle}
          benefits={benefits}
          columns={benefitsColumns}
        />
      )}
      
      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <StatsSection
          title={statsTitle}
          subtitle={statsSubtitle}
          stats={stats}
        />
      )}
      
      {/* Case Studies */}
      {caseStudies && caseStudies.length > 0 && (
        <CaseStudies
          title={caseStudiesTitle}
          caseStudies={caseStudies}
        />
      )}
      
      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <FAQSection
          title={faqTitle}
          faqs={faqs}
        />
      )}
      
      {/* CTA Section */}
      <CTASection
        title={ctaTitle}
        subtitle={ctaSubtitle}
        primaryButtonText={ctaPrimaryButton}
        primaryButtonLink={ctaPrimaryLink}
        secondaryButtonText={ctaSecondaryButton}
        secondaryButtonLink={ctaSecondaryLink}
      />
    </div>
  );
};

export default ServicePageTemplate;
