import React from 'react';
import { Droplet, Target, Map, FlaskRound as Flask, CheckCircle } from 'lucide-react';
import ServicePageTemplate from '../components/common/ServicePageTemplate';

const EnvironmentalRemediation = () => {
  // Service Features (Investigation Types) Data
  const serviceFeatures = [
    {
      icon: Target,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Geotechnical Boreholes',
      description: 'Used for soil classification, strength testing, and foundation design',
      features: []
    },
    {
      icon: Flask,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Environmental Boreholes',
      description: 'Installed for soil and groundwater sampling to assess contamination',
      features: []
    },
    {
      icon: Map,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Test Pits & Trenches',
      description: 'Excavated for subsurface investigation of soil composition and buried utilities',
      features: []
    },
    {
      icon: Droplet,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Monitoring Wells',
      description: 'Installed for long-term groundwater quality and contamination tracking',
      features: []
    },
    {
      icon: Target,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Dewatering Wells',
      description: 'Used to control groundwater levels at construction sites',
      features: []
    },
    {
      icon: Flask,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Soil Vapour Probes',
      description: 'Deployed to assess volatile organic compounds (VOCs) in subsurface soil',
      features: []
    }
  ];

  // Process Steps
  const processSteps = [
    {
      number: "1",
      title: "Site Review",
      desc: "Comprehensive evaluation of site history and planned investigation points"
    },
    {
      number: "2",
      title: "Utility Mapping",
      desc: "Advanced GPR and EM technology deployment for thorough subsurface scanning"
    },
    {
      number: "3",
      title: "Clearance Verification",
      desc: "Confirmation of safe drilling locations and depths"
    },
    {
      number: "4",
      title: "Documentation",
      desc: "Detailed utility maps and clearance reports for drilling contractors"
    }
  ];

  // Benefits
  const benefits = [
    {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-white',
      title: 'Risk Mitigation',
      description: 'Prevent utility strikes and environmental contamination during investigation work'
    },
    {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-white',
      title: 'Cost Efficiency',
      description: 'Avoid costly project delays and damage to underground infrastructure'
    },
    {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-white',
      title: 'Compliance',
      description: 'Meet regulatory requirements for environmental site investigations'
    }
  ];

  // Case Studies
  const caseStudies = [
    {
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Environmental drilling project",
      title: "Brownfield Redevelopment Project",
      description: "Our precision utility locating services allowed environmental engineers to safely complete over 25 borehole investigations without a single utility strike, resulting in significant time and cost savings."
    },
    {
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Environmental monitoring",
      title: "Industrial Site Remediation",
      description: "GPR mapping identified critical subsurface infrastructure, enabling the remediation team to safely install monitoring wells and recovery systems without interrupting essential operations."
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "Why is utility locating essential for environmental drilling?",
      answer: "Utility locating is critical before any drilling to prevent accidental strikes that could damage infrastructure, cause environmental contamination, create safety hazards, and result in costly delays. Most environmental regulations also require proper utility clearance before invasive work."
    },
    {
      question: "How deep can your GPR services detect utilities?",
      answer: "Detection depth varies based on soil conditions, moisture content, and equipment used. In ideal conditions, our GPR equipment can detect utilities up to 15-18 feet deep, though 5-8 feet is more typical in average conditions. We also employ electromagnetic locating equipment that can detect metallic utilities at greater depths."
    },
    {
      question: "What documentation do you provide for drilling contractors?",
      answer: "We provide comprehensive utility clearance reports including detailed utility maps, depth estimations, and site photos. Our documentation meets or exceeds industry standards and regulatory requirements to support safe drilling operations and proper record-keeping."
    }
  ];

  return (
    <ServicePageTemplate
      // Hero Section
      heroImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      heroTitle="Environmental Remediation Support"
      heroSubtitle="Precision utility locating for environmental site investigations"
      heroPrimaryButton="Book a Job"
      heroPrimaryLink="/book"
      heroSecondaryButton="Get in Touch"
      heroSecondaryLink="/contact"
      
      // Overview Section
      overviewIcon={Flask}
      overviewTitle="Environmental Site Investigation Support"
      overviewDescription="Before conducting environmental site investigations, it is critical to perform accurate utility locating to prevent accidental strikes, environmental contamination, and costly project delays."
      
      // Service Features (Investigation Types)
      serviceFeaturesTitle="Investigation Types We Support"
      serviceFeaturesSubtitle="Our GPR services ensure safe and efficient environmental investigations"
      serviceFeatures={serviceFeatures}
      serviceFeaturesColumns={3}
      
      // Process Section
      processTitle="Our Investigation Process"
      processSubtitle="A comprehensive approach to ensure safety and accuracy"
      processSteps={processSteps}
      
      // Benefits Section
      benefitsTitle="Key Benefits"
      benefitsSubtitle="Why environmental professionals choose our services"
      benefits={benefits}
      benefitsColumns={3}
      
      // Case Studies
      caseStudiesTitle="Success Stories"
      caseStudies={caseStudies}
      
      // FAQ Section
      faqTitle="Frequently Asked Questions"
      faqs={faqs}
      
      // CTA Section
      ctaTitle="Ready to Start Your Environmental Investigation?"
      ctaSubtitle="Contact us today to ensure your environmental drilling program proceeds safely and efficiently."
      ctaPrimaryButton="Get in Touch"
      ctaPrimaryLink="/contact"
      ctaSecondaryButton="Book a Job"
      ctaSecondaryLink="/book"
    />
  );
};

export default EnvironmentalRemediation;
