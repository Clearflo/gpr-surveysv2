import React from 'react';
import { Target, Ruler, Hammer, HardHat, Shield } from 'lucide-react';
import { 
  ServicePageBuilder,
  createServiceFeature,
  createProcessSteps,
  createCaseStudy,
  createFAQ,
  CommonProcessSteps,
  HeroButtons,
  StandardCTAs
} from '../components/services';

const PreConstruction = () => {
  const pageData = {
    hero: {
      image: "/Assests/Best_Utility_Locating_Equipment_2-1555103.png",
      title: "CIVIL CONSTRUCTION & DESIGN PHASE UTILITY LOCATING",
      subtitle: "Ensuring safe excavation and trenching through precise utility detection",
      ...HeroButtons.standard
    },
    
    overview: {
      icon: Target,
      title: "Comprehensive Pre-construction Services",
      description: "Before any excavation or trenching project, it is critical to perform precise utility locating to prevent accidental damage, costly repairs, and safety hazards. At GPR SURVEYS Inc., we accurately detect underground utilities, pipes, conduits, and subsurface structures before work begins."
    },
    
    serviceFeatures: {
      title: "Our Pre-construction Services",
      subtitle: "Comprehensive utility detection for safe and efficient construction projects",
      features: [
        createServiceFeature(
          HardHat,
          'Pre-Excavation Utility Locating',
          'Ensures safe digging for foundations, grading, and site development.',
          ['Foundation excavations', 'Site grading projects', 'Development preparation']
        ),
        createServiceFeature(
          Ruler,
          'Linear Trenching Utility Locating',
          'Essential for installing or upgrading infrastructure along roadways and construction sites.',
          ['Water line installations', 'Gas line routing', 'Telecommunications conduits']
        ),
        createServiceFeature(
          Hammer,
          'Infrastructure Mapping',
          'Helps plan efficient utility routing and avoid costly disruptions.',
          ['Comprehensive mapping', 'Route optimization', 'Conflict prevention']
        )
      ],
      columns: 3
    },
    
    process: {
      title: "Our Process",
      subtitle: "A comprehensive approach to ensure construction safety and efficiency",
      steps: createProcessSteps([
        { title: "Initial Assessment", desc: "Site evaluation and review of project plans" },
        CommonProcessSteps.scanning,
        CommonProcessSteps.dataAnalysis,
        { title: "Documentation", desc: "Detailed mapping and reporting for construction teams" }
      ])
    },
    
    benefits: {
      title: "Why Utility Locating is Essential",
      subtitle: "The benefits of comprehensive utility detection before construction",
      items: [
        createServiceFeature(
          Target,
          'Prevents Utility Strikes',
          'Avoid costly damage to buried infrastructure and minimize project disruptions'
        ),
        createServiceFeature(
          HardHat,
          'Enhances Safety',
          'Reduces risks to workers and the public during construction activities'
        ),
        createServiceFeature(
          Shield,
          'Ensures Compliance',
          'Meets regulatory requirements and industry standards for safe excavation'
        )
      ],
      columns: 3
    },
    
    caseStudies: {
      title: "Success Stories",
      items: [
        createCaseStudy(
          "https://images.unsplash.com/photo-1503594384566-461fe158e797?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
          "Commercial construction site",
          "Commercial Development Project",
          "Comprehensive utility mapping for a large commercial development identified previously undocumented water and electrical lines, preventing costly strikes and construction delays."
        ),
        createCaseStudy(
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
          "Infrastructure project",
          "Municipal Infrastructure Upgrade",
          "Pre-construction utility locating for a municipal water main replacement project identified multiple crossing utilities, allowing for adjustments to the installation plan and preventing service disruptions."
        )
      ]
    },
    
    faqs: {
      title: "Frequently Asked Questions",
      items: [
        createFAQ(
          "When should I schedule pre-construction utility locating?",
          "We recommend scheduling pre-construction utility locating as early as possible in your project planning process. Ideally, this should be done before finalizing construction plans so that any detected utilities can be incorporated into the design phase, helping to prevent costly changes later."
        ),
        createFAQ(
          "How accurate is utility locating before construction?",
          "Our advanced GPR and electromagnetic equipment provides highly accurate results, though factors such as soil conditions, depth, and material type can affect detection capabilities. We clearly communicate our confidence levels for each utility detected and provide comprehensive documentation of all findings."
        ),
        createFAQ(
          "What documentation will I receive?",
          "We provide comprehensive digital reports including detailed maps of detected utilities, depth estimations, photographs, and site-specific limitations. This documentation can be shared with contractors, engineers, and other stakeholders to ensure everyone working on the project has access to critical subsurface information."
        )
      ]
    },
    
    cta: StandardCTAs.construction
  };

  return <ServicePageBuilder data={pageData} />;
};

export default PreConstruction;
