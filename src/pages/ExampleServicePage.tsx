import React from 'react';
import { Target } from 'lucide-react';
import { 
  ServicePageBuilder,
  createServiceFeature,
  createProcessSteps,
  CommonProcessSteps,
  CommonFAQs,
  HeroButtons,
  StandardCTAs
} from '../components/services';

/**
 * Example Service Page - Demonstrates how to create a new service page
 * using the reusable utilities created in Phase 7
 * 
 * This example shows how much simpler it is to create consistent,
 * well-structured service pages with minimal boilerplate code.
 */
const ExampleServicePage = () => {
  const pageData = {
    hero: {
      image: "/path/to/hero-image.jpg",
      title: "Example Service Page",
      subtitle: "This demonstrates the simplified service page creation",
      ...HeroButtons.standard
    },
    
    overview: {
      icon: Target,
      title: "Service Overview",
      description: "A brief description of what this service offers and why it's important."
    },
    
    serviceFeatures: {
      title: "What We Offer",
      subtitle: "Our comprehensive service features",
      features: [
        createServiceFeature(
          Target,
          'Feature One',
          'Description of the first feature',
          ['Benefit 1', 'Benefit 2', 'Benefit 3']
        ),
        // Add more features as needed
      ],
      columns: 3
    },
    
    process: {
      title: "Our Process",
      subtitle: "How we deliver results",
      steps: createProcessSteps([
        CommonProcessSteps.siteAssessment,
        CommonProcessSteps.scanning,
        CommonProcessSteps.dataAnalysis,
        CommonProcessSteps.documentation
      ])
    },
    
    faqs: {
      title: "Frequently Asked Questions",
      items: [
        CommonFAQs.accuracy,
        CommonFAQs.documentation,
        CommonFAQs.timing
      ]
    },
    
    cta: StandardCTAs.construction
  };

  return <ServicePageBuilder data={pageData} />;
};

export default ExampleServicePage;

/**
 * With these utilities, creating a new service page now requires:
 * 1. Import the utilities
 * 2. Define your page data structure
 * 3. Return ServicePageBuilder with your data
 * 
 * Benefits:
 * - Consistent structure across all service pages
 * - Reusable content (common FAQs, process steps, etc.)
 * - Type-safe with TypeScript
 * - Minimal boilerplate code
 * - Easy to maintain and update
 * 
 * Compare this to the original 20KB+ service pages!
 */
