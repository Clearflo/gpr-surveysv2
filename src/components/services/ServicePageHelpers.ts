import { LucideIcon } from 'lucide-react';
import { ServiceFeature, ProcessStep, CaseStudy, FAQ, Stat } from '../common/ServicePageTemplate';

// Common icon styles used across service pages
export const ServiceIconStyles = {
  blue: {
    iconColor: 'text-blue-900',
    iconBgColor: 'bg-blue-50'
  },
  red: {
    iconColor: 'text-red-600',
    iconBgColor: 'bg-red-50'
  },
  yellow: {
    iconColor: 'text-yellow-600',
    iconBgColor: 'bg-yellow-50'
  },
  green: {
    iconColor: 'text-green-600',
    iconBgColor: 'bg-white'
  }
} as const;

// Service page data structure
export interface ServicePageData {
  hero: {
    image: string;
    title: string;
    subtitle: string;
    primaryButton?: string;
    primaryLink?: string;
    secondaryButton?: string;
    secondaryLink?: string;
  };
  overview: {
    icon?: LucideIcon;
    title: string;
    description: string;
  };
  serviceFeatures?: {
    title?: string;
    subtitle?: string;
    features: ServiceFeature[];
    columns?: 2 | 3 | 4;
  };
  process?: {
    title?: string;
    subtitle?: string;
    steps: ProcessStep[];
  };
  benefits?: {
    title?: string;
    subtitle?: string;
    items: any[]; // Using 'any' as benefits can vary
    columns?: 2 | 3 | 4;
  };
  stats?: {
    title?: string;
    subtitle?: string;
    items: Stat[];
  };
  caseStudies?: {
    title?: string;
    items: CaseStudy[];
  };
  faqs?: {
    title?: string;
    items: FAQ[];
  };
  cta: {
    title: string;
    subtitle?: string;
    primaryButton?: string;
    primaryLink?: string;
    secondaryButton?: string;
    secondaryLink?: string;
  };
}

// Default CTA configuration
export const DefaultCTA = {
  primaryButton: 'Get in Touch',
  primaryLink: '/contact',
  secondaryButton: 'Book a Job',
  secondaryLink: '/book'
};

// Helper to create standard 4-step process
export function createProcessSteps(steps: Array<{title: string; desc: string}>): ProcessStep[] {
  return steps.map((step, index) => ({
    number: String(index + 1),
    title: step.title,
    desc: step.desc
  }));
}

// Helper to create service features with default styling
export function createServiceFeature(
  icon: LucideIcon,
  title: string,
  description: string,
  features: string[],
  style: keyof typeof ServiceIconStyles = 'blue'
): ServiceFeature {
  return {
    icon,
    ...ServiceIconStyles[style],
    title,
    description,
    features
  };
}

// Helper to create case study
export function createCaseStudy(
  image: string,
  alt: string,
  title: string,
  description: string
): CaseStudy {
  return {
    image,
    alt,
    title,
    description
  };
}

// Helper to create FAQ
export function createFAQ(question: string, answer: string): FAQ {
  return {
    question,
    answer
  };
}

// Helper to create stat
export function createStat(value: string, description: string): Stat {
  return {
    value,
    description
  };
}
