import React from 'react';
import { AlertTriangle, Shield, Zap, Clock } from 'lucide-react';
import ServicePageTemplate from '../components/common/ServicePageTemplate';
import EmergencyContact from '../components/emergency/EmergencyContact';

const EmergencyLocates = () => {
  // Service Features Data
  const serviceFeatures = [
    {
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-50',
      title: 'Emergency Utility Strike Response',
      description: 'Fast and accurate locating to mitigate further damage',
      features: [
        'Immediate damage assessment',
        'Risk mitigation planning',
        'Rapid deployment team'
      ]
    },
    {
      icon: Shield,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Disaster Recovery Support',
      description: 'Post-disaster utility mapping for safe restoration efforts',
      features: [
        'Natural disaster assessment',
        'Infrastructure mapping',
        'Recovery planning support'
      ]
    },
    {
      icon: Zap,
      iconColor: 'text-yellow-600',
      iconBgColor: 'bg-yellow-50',
      title: 'Critical Infrastructure Repairs',
      description: 'Locating damaged or disrupted utilities for immediate action',
      features: [
        'Pipeline emergency response',
        'Power line repair support',
        'Communication line restoration'
      ]
    },
    {
      icon: Clock,
      iconColor: 'text-blue-900',
      iconBgColor: 'bg-blue-50',
      title: 'Rapid Response Team',
      description: 'Available for urgent locates in high-risk situations',
      features: [
        'Short Notice / Emergency Service Available',
        'Quick mobilization',
        'Expert emergency team'
      ]
    }
  ];

  // Process Steps
  const processSteps = [
    {
      number: "1",
      title: "Initial Contact",
      desc: "Call our emergency line for immediate response"
    },
    {
      number: "2",
      title: "Rapid Deployment",
      desc: "Quick mobilization of specialized emergency team"
    },
    {
      number: "3",
      title: "Site Assessment",
      desc: "Immediate evaluation of damage and risks"
    },
    {
      number: "4",
      title: "Action Plan",
      desc: "Swift implementation of mitigation strategies"
    }
  ];

  // Stats
  const stats = [
    {
      value: "2 Hours",
      description: "Average response time for emergency locate requests"
    },
    {
      value: "Short Notice",
      description: "Emergency Service Available including weekends and holidays"
    },
    {
      value: "100%",
      description: "Safety record for emergency locate operations"
    }
  ];

  // Case Studies
  const caseStudies = [
    {
      image: "https://images.unsplash.com/photo-1582557173517-1debb121bd22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Construction emergency",
      title: "Construction Site Emergency",
      description: "When an excavator struck an unmarked utility line at a major construction site, our team responded within 90 minutes, quickly mapped the surrounding area, and helped prevent additional damage while enabling safe repair operations."
    },
    {
      image: "https://images.unsplash.com/photo-1572633419083-dd9fce1a54b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Flood response",
      title: "Storm Damage Recovery",
      description: "Following severe flooding, our emergency team provided crucial utility mapping for a municipal recovery effort, enabling safe restoration of essential services while preventing additional infrastructure damage."
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "What is considered an emergency locate situation?",
      answer: "Emergency locates are required when there's an immediate threat to life, property, or essential services. This includes accidental utility strikes, natural disasters affecting infrastructure, or situations where utilities must be quickly identified to restore critical services like water, power, or communications."
    },
    {
      question: "What is your response time for emergency situations?",
      answer: "We prioritize emergency locates and typically respond within 1-3 hours, depending on your location on Vancouver Island and current conditions. Our team is available on short notice for genuine emergency situations."
    },
    {
      question: "How do I contact GPR SURVEYS for an emergency locate?",
      answer: "For emergency utility locating services, call our emergency response line directly at 250-896-7576. Have information about the location, nature of the emergency, and any known utilities in the area ready to help us respond as effectively as possible."
    }
  ];

  return (
    <div className="emergency-locates-wrapper">
      <ServicePageTemplate
        // Hero Section
        heroImage="/Assests/Emergency.jpg"
        heroTitle="Emergency Locate Services"
        heroSubtitle="Short Notice / Emergency Service Available for critical situations"
        heroPrimaryButton="Book Emergency Service"
        heroPrimaryLink="/book"
        heroSecondaryButton="Get in Touch"
        heroSecondaryLink="/contact"
        
        // Overview Section
        overviewIcon={Zap}
        overviewTitle="Emergency Response Services"
        overviewDescription="At GPR SURVEYS Inc., we provide rapid-response emergency utility locating services for utility strikes, natural disasters, and infrastructure damage. When unexpected incidents occur—such as accidental utility hits, floods, or extreme weather events—our team is ready to deploy to assess underground infrastructure and prevent further risks."
        
        // Service Features
        serviceFeaturesTitle="Emergency Services We Provide"
        serviceFeaturesSubtitle="Our comprehensive emergency support for critical situations"
        serviceFeatures={serviceFeatures}
        serviceFeaturesColumns={2}
        
        // Process Section
        processTitle="Our Emergency Response Process"
        processSubtitle="A systematic approach to handling emergency situations efficiently"
        processSteps={processSteps}
        
        // Stats Section
        statsTitle="Emergency Response Metrics"
        statsSubtitle="Our commitment to rapid and effective emergency services"
        stats={stats}
        
        // Case Studies
        caseStudiesTitle="Success Stories"
        caseStudies={caseStudies}
        
        // FAQ Section
        faqTitle="Frequently Asked Questions"
        faqs={faqs}
        
        // CTA Section - disabled since we'll add it manually
        ctaTitle=""
      />
      
      {/* Emergency Contact section */}
      <EmergencyContact />
      
      {/* CTA Section */}
      <div className="bg-blue-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Need Emergency Utility Locating?</h2>
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Contact our emergency response team immediately for rapid deployment and expert support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contact" className="btn-industrial">
                Get in Touch
              </a>
              <a href="/book" className="btn-secondary">
                Book Emergency Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyLocates;
