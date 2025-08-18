import React from 'react';
import { Shield, Lock, Building2 as Building, Landmark } from 'lucide-react';
import ServicePageTemplate from '../components/common/ServicePageTemplate';

const SensitiveSites = () => {
  // Service Features (Facilities) Data
  const serviceFeatures = [
    {
      icon: Landmark,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'DND & Military Bases',
      description: 'Accurate subsurface utility locating for defense infrastructure',
      features: [
        'Security-cleared personnel',
        'Protocol compliance',
        'Sensitive data handling'
      ]
    },
    {
      icon: Shield,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'RCMP & Law Enforcement',
      description: 'Secure and compliant services for operational sites',
      features: [
        'Restricted area expertise',
        'Confidential operations',
        'Emergency response capability'
      ]
    },
    {
      icon: Building,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Government Buildings',
      description: 'Ensuring safe excavation at high-security locations',
      features: [
        'Infrastructure protection',
        'Access management',
        'Documentation control'
      ]
    },
    {
      icon: Lock,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Critical Infrastructure',
      description: 'Precision locating for restricted-access areas',
      features: [
        'Airports & ports',
        'Correctional facilities',
        'Secure installations'
      ]
    }
  ];

  // Process Steps
  const processSteps = [
    {
      number: "1",
      title: "Security Clearance",
      desc: "Verification of required clearances and protocol briefing"
    },
    {
      number: "2",
      title: "Supervised Access",
      desc: "Controlled entry and escort in restricted areas"
    },
    {
      number: "3",
      title: "Secure Scanning",
      desc: "Sensitive data collection with protected equipment"
    },
    {
      number: "4",
      title: "Protected Reporting",
      desc: "Encrypted documentation and secure data handling"
    }
  ];

  // Benefits (Security Features)
  const benefits = [
    {
      icon: Shield,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Reliability Clearance',
      description: 'Our team holds necessary security clearances for accessing restricted facilities'
    },
    {
      icon: Lock,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Secure Operations',
      description: 'Strict adherence to security protocols and confidentiality requirements'
    },
    {
      icon: Building,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Facility Compliance',
      description: 'Full compliance with facility-specific security and operational requirements'
    }
  ];

  // Case Studies
  const caseStudies = [
    {
      image: "https://images.unsplash.com/photo-1503160865267-3f6f22ccc4b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Government facility",
      title: "Government Facility Upgrade",
      description: "Our team successfully mapped all underground utilities for a major government facility renovation, allowing for safe infrastructure upgrades while maintaining security protocols."
    },
    {
      image: "https://images.unsplash.com/photo-1569949247615-d4051d3b8c9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Secure facility",
      title: "Critical Infrastructure Protection",
      description: "We provided utility mapping services for a high-security communication facility, helping to prevent service disruptions while ensuring strict adherence to security clearance protocols."
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "What security clearances does your team hold?",
      answer: "Our technicians maintain appropriate reliability clearances to work in sensitive government and military facilities. Specific clearance levels can be discussed when planning your project to ensure we meet all security requirements."
    },
    {
      question: "How is data handled for sensitive sites?",
      answer: "All data collected at sensitive sites is treated according to appropriate security protocols. We can work with your security team to implement specific data handling procedures, including secure transfer methods, encrypted storage, and limited distribution of reports as required."
    },
    {
      question: "Can you perform emergency utility locating at sensitive sites?",
      answer: "Yes, we can provide emergency utility locating services for sensitive sites, subject to proper clearance verification. We understand that emergency situations may arise, and we have procedures in place to respond quickly while still maintaining all required security protocols."
    }
  ];

  return (
    <ServicePageTemplate
      // Hero Section
      heroImage="https://images.unsplash.com/photo-1590856029620-42d3b1fde74d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      heroTitle="Sensitive Sites & Reliability Clearance"
      heroSubtitle="Secure utility locating services for high-security facilities"
      heroPrimaryButton="Book a Job"
      heroPrimaryLink="/book"
      heroSecondaryButton="Get in Touch"
      heroSecondaryLink="/contact"
      
      // Overview Section
      overviewIcon={Shield}
      overviewTitle="Secure Facility Services"
      overviewDescription="At GPR SURVEYS Inc., we provide utility locating services for sensitive sites and high-security facilities, including Department of National Defense (DND) sites, RCMP buildings, government infrastructure, and restricted-access locations. Our team is experienced in working within secure environments and holds the necessary reliability clearances to ensure compliance with government protocols."
      
      // Service Features (Facilities)
      serviceFeaturesTitle="Facilities We Serve"
      serviceFeaturesSubtitle="Our expertise extends to a wide range of secure and sensitive facilities"
      serviceFeatures={serviceFeatures}
      serviceFeaturesColumns={2}
      
      // Process Section
      processTitle="Our Secure Process"
      processSubtitle="How we maintain security while delivering exceptional service"
      processSteps={processSteps}
      
      // Benefits Section (Security Features)
      benefitsTitle="Our Security Measures"
      benefits={benefits}
      benefitsColumns={3}
      
      // Case Studies
      caseStudiesTitle="Success Stories"
      caseStudies={caseStudies}
      
      // FAQ Section
      faqTitle="Frequently Asked Questions"
      faqs={faqs}
      
      // CTA Section
      ctaTitle="Need Secure Utility Locating Services?"
      ctaSubtitle="Contact us to discuss your secure facility requirements and clearance needs."
      ctaPrimaryButton="Get in Touch"
      ctaPrimaryLink="/contact"
      ctaSecondaryButton="Book a Job"
      ctaSecondaryLink="/book"
    />
  );
};

export default SensitiveSites;
