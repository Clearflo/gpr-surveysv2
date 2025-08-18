/**
 * Main barrel export for all components
 * This file provides a central import point for all components in the application
 */

// About page components
export * from './about';

// Booking components
export * from './booking';

// Booking calendar components
export * from './booking-calendar';

// Calendar components
export * from './calendar';

// Common/shared components
export * from './common';

// Contact page components
export * from './contact';

// Emergency page components
export * from './emergency';

// Home page components
export * from './home';

// Navbar components
export * from './navbar';

// Service page components
export * from './services';

// Top-level components (that haven't been moved to subdirectories yet)
export { default as BookingCalendar } from './BookingCalendar';
export { default as BookingDetailsModal } from './BookingDetailsModal';
export { default as Footer } from './Footer';
export { default as HeroCarousel } from './HeroCarousel';
export { default as Navbar } from './Navbar';
export { default as ProjectCarousel } from './ProjectCarousel';

// UI components are typically imported directly from their specific paths
// to maintain tree-shaking and avoid circular dependencies
// export * from './ui'; // Uncomment if needed
