import { ProcessStep, FAQ } from '../common/ServicePageTemplate';

// Common process step templates
export const CommonProcessSteps = {
  siteAssessment: {
    title: "Site Assessment",
    desc: "Comprehensive evaluation of site conditions and requirements"
  },
  scanning: {
    title: "Underground Scanning",
    desc: "Advanced GPR and electromagnetic technology deployment"
  },
  dataAnalysis: {
    title: "Data Analysis",
    desc: "Expert interpretation of scan results"
  },
  documentation: {
    title: "Documentation",
    desc: "Detailed reporting and mapping for project teams"
  },
  siteReview: {
    title: "Site Review",
    desc: "Comprehensive evaluation of site history and conditions"
  },
  utilityMapping: {
    title: "Utility Mapping",
    desc: "Advanced technology deployment for thorough subsurface scanning"
  },
  verification: {
    title: "Verification",
    desc: "Confirmation of findings and safe zones"
  }
};

// Common FAQ templates
export const CommonFAQs = {
  accuracy: {
    question: "How accurate is your utility locating?",
    answer: "Our advanced GPR and electromagnetic equipment provides highly accurate results, though factors such as soil conditions, depth, and material type can affect detection capabilities. We clearly communicate our confidence levels for each utility detected and provide comprehensive documentation of all findings."
  },
  documentation: {
    question: "What documentation will I receive?",
    answer: "We provide comprehensive digital reports including detailed maps of detected utilities, depth estimations, photographs, and site-specific limitations. This documentation can be shared with contractors, engineers, and other stakeholders to ensure everyone working on the project has access to critical subsurface information."
  },
  timing: {
    question: "When should I schedule utility locating?",
    answer: "We recommend scheduling utility locating as early as possible in your project planning process. This allows any detected utilities to be incorporated into the design phase, helping to prevent costly changes later."
  },
  depth: {
    question: "How deep can your GPR services detect utilities?",
    answer: "Detection depth varies based on soil conditions, moisture content, and equipment used. In ideal conditions, our GPR equipment can detect utilities up to 15-18 feet deep, though 5-8 feet is more typical in average conditions. We also employ electromagnetic locating equipment that can detect metallic utilities at greater depths."
  }
};

// Standard CTA configurations
export const StandardCTAs = {
  construction: {
    title: "Ready to Start Your Construction Project?",
    subtitle: "Contact us today to ensure your excavation work proceeds safely and efficiently.",
    primaryButton: "Get in Touch",
    primaryLink: "/contact",
    secondaryButton: "Book a Job",
    secondaryLink: "/book"
  },
  emergency: {
    title: "Need Emergency Utility Locating?",
    subtitle: "Contact our emergency response team immediately for rapid deployment and expert support.",
    primaryButton: "Get in Touch",
    primaryLink: "/contact",
    secondaryButton: "Book Emergency Service",
    secondaryLink: "/book"
  },
  investigation: {
    title: "Ready to Start Your Investigation?",
    subtitle: "Contact us today to ensure your project proceeds safely and efficiently.",
    primaryButton: "Get in Touch",
    primaryLink: "/contact",
    secondaryButton: "Book a Job",
    secondaryLink: "/book"
  }
};

// Common hero button configurations
export const HeroButtons = {
  standard: {
    primaryButton: "Book a Job",
    primaryLink: "/book",
    secondaryButton: "Get in Touch",
    secondaryLink: "/contact"
  },
  emergency: {
    primaryButton: "Book Emergency Service",
    primaryLink: "/book",
    secondaryButton: "Get in Touch",
    secondaryLink: "/contact"
  }
};

// Common service benefit templates
export const CommonBenefits = {
  safety: {
    title: "Enhanced Safety",
    description: "Reduces risks to workers and the public during operations"
  },
  compliance: {
    title: "Regulatory Compliance",
    description: "Meets all regulatory requirements and industry standards"
  },
  costSavings: {
    title: "Cost Efficiency",
    description: "Avoid costly damages and project delays"
  },
  riskMitigation: {
    title: "Risk Mitigation",
    description: "Prevent utility strikes and potential hazards"
  }
};
