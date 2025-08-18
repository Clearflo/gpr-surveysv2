import React from 'react';
import { Shield, AlertTriangle, Droplet, FileCheck, Target, Search } from 'lucide-react';
import ServicePageTemplate from '../components/common/ServicePageTemplate';

const USTDetection = () => {
  // Service Features (Property Types) Data
  const serviceFeatures = [
    {
      icon: Target,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Commercial UST Detection',
      description: 'Gas stations, industrial sites, commercial buildings, and former fuel storage locations',
      features: [
        'Tank removal verification',
        'Property transaction assessments',
        'Environmental compliance'
      ]
    },
    {
      icon: Search,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Residential UST Detection',
      description: 'Older homes with decommissioned heating oil tanks, buried fuel tanks, or unknown subsurface structures',
      features: [
        'Home buyer inspections',
        'Renovation planning',
        'Insurance requirements'
      ]
    }
  ];

  // Process Steps
  const processSteps = [
    {
      number: "1",
      title: "Site Assessment",
      desc: "Comprehensive evaluation of property history and potential tank locations"
    },
    {
      number: "2",
      title: "GPR Scanning",
      desc: "Advanced radar technology to identify subsurface anomalies"
    },
    {
      number: "3",
      title: "Tank Verification",
      desc: "Precise mapping of tank location, size, and depth"
    },
    {
      number: "4",
      title: "Documentation",
      desc: "Detailed reports with findings and recommendations"
    }
  ];

  // Benefits (Why It Matters)
  const benefits = [
    {
      icon: Droplet,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-white',
      title: 'Environmental Protection',
      description: 'Prevents soil and groundwater contamination from leaking tanks'
    },
    {
      icon: FileCheck,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-white',
      title: 'Property Compliance',
      description: 'Ensures compliance with local regulations before property transactions or development'
    },
    {
      icon: AlertTriangle,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-white',
      title: 'Safe Excavation',
      description: 'Avoids costly damage and hazardous material exposure during work'
    }
  ];

  // Case Studies
  const caseStudies = [
    {
      image: "/Assests/Underground-tank-removal-768x511 (1).jpg",
      alt: "Underground storage tank detection",
      title: "Commercial Property Assessment",
      description: "Successful detection of two decommissioned storage tanks at a former gas station site, preventing expensive surprises during redevelopment."
    },
    {
      image: "https://images.unsplash.com/photo-1523353836303-b36d30f4fa65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Residential property scan",
      title: "Residential Pre-Sale Inspection",
      description: "Detection and documentation of a residential heating oil tank, allowing homeowners to address the issue before property sale."
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "How do you detect underground storage tanks?",
      answer: "We use a combination of ground penetrating radar (GPR), electromagnetic (EM) technology, and historical property research to accurately locate and identify underground storage tanks."
    },
    {
      question: "What should I do if a UST is found on my property?",
      answer: "If we detect a UST on your property, we'll provide detailed documentation and recommend appropriate next steps, which may include professional tank removal, environmental assessment, or proper decommissioning based on local regulations."
    },
    {
      question: "How accurate is UST detection?",
      answer: "Our advanced GPR and EM technologies provide highly accurate results, though accuracy can be affected by soil conditions, tank material, and depth. We clearly communicate any limitations in our findings and provide confidence levels with our reports."
    }
  ];

  return (
    <ServicePageTemplate
      // Hero Section
      heroImage="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      heroTitle="Underground Storage Tank Detection"
      heroSubtitle="Expert UST detection services for environmental compliance and safety"
      heroPrimaryButton="Book a Job"
      heroPrimaryLink="/book"
      heroSecondaryButton="Get in Touch"
      heroSecondaryLink="/contact"
      
      // Overview Section
      overviewIcon={Shield}
      overviewTitle="Specialized UST Detection Services"
      overviewDescription="At GPR SURVEYS Inc., we specialize in Underground Storage Tank (UST) detection for both commercial and residential properties. We accurately identify buried fuel tanks, heating oil tanks, and other underground storage tanks that may pose environmental and safety risks."
      
      // Service Features (Property Types)
      serviceFeaturesTitle="Property Types We Serve"
      serviceFeaturesSubtitle="Our UST detection services are tailored for different property types and needs"
      serviceFeatures={serviceFeatures}
      serviceFeaturesColumns={2}
      
      // Process Section
      processTitle="Our UST Detection Process"
      processSubtitle="Our comprehensive approach ensures accurate detection and documentation"
      processSteps={processSteps}
      
      // Benefits Section (Why It Matters)
      benefitsTitle="Why UST Detection Matters"
      benefitsSubtitle="Undetected underground tanks can pose significant risks to property and the environment"
      benefits={benefits}
      benefitsColumns={3}
      
      // Case Studies
      caseStudiesTitle="UST Detection Case Studies"
      caseStudies={caseStudies}
      
      // FAQ Section
      faqTitle="Frequently Asked Questions"
      faqs={faqs}
      
      // CTA Section
      ctaTitle="Don't Let a Hidden Tank Become a Costly Problem!"
      ctaSubtitle="Contact GPR SURVEYS Inc. for accurate and reliable UST locating services today."
      ctaPrimaryButton="Get in Touch"
      ctaPrimaryLink="/contact"
      ctaSecondaryButton="Book a Job"
      ctaSecondaryLink="/book"
    />
  );
};

export default USTDetection;
