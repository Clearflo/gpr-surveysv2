import { lazy } from 'react';

/**
 * Lazy-loaded route components for code splitting
 * This improves initial bundle size and loading performance
 */

// Page components - loaded on demand
export const Home = lazy(() => import('../pages/Home'));
export const About = lazy(() => import('../pages/About'));
export const Services = lazy(() => import('../pages/Services'));
export const Contact = lazy(() => import('../pages/Contact'));
export const Testimonials = lazy(() => import('../pages/Testimonials'));
export const Resources = lazy(() => import('../pages/Resources'));
export const BookJob = lazy(() => import('../pages/BookJob'));

// Service pages - loaded when accessed
export const CommercialGPR = lazy(() => import('../pages/services/CommercialGPR'));
export const ResidentialGPR = lazy(() => import('../pages/services/ResidentialGPR'));
export const EmergencyLocates = lazy(() => import('../pages/services/EmergencyLocates'));
export const PreConstruction = lazy(() => import('../pages/services/PreConstruction'));
export const USTDetection = lazy(() => import('../pages/services/USTDetection'));
export const EnvironmentalRemediation = lazy(() => import('../pages/services/EnvironmentalRemediation'));
export const ArchaeologicalExploration = lazy(() => import('../pages/services/ArchaeologicalExploration'));
export const SensitiveSites = lazy(() => import('../pages/services/SensitiveSites'));

// Admin pages - loaded only when admin accesses them
export const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
export const AdminBooking = lazy(() => import('../pages/admin/AdminBooking'));

/**
 * Preload critical routes for better UX
 * Call these functions to start loading components before they're needed
 */
export const preloadCriticalRoutes = () => {
  // Preload commonly accessed pages
  import('../pages/Services');
  import('../pages/Contact');
  import('../pages/BookJob');
};

/**
 * Preload admin routes when user is authenticated
 */
export const preloadAdminRoutes = () => {
  import('../pages/admin/AdminDashboard');
  import('../pages/admin/AdminBooking');
};
