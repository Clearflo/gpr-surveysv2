/**
 * Main barrel export for all custom hooks
 * This file provides a central import point for all hooks in the application
 */

// Booking-related hooks
export * from './booking';

// Individual hooks
export { useBookings } from './useBookings';
export { useFileUpload } from './useFileUpload';
export { useParallax } from './useParallax';
export { useScrollPosition } from './useScrollPosition';

// There's also a useCalendar hook that might be in a subdirectory
// TODO: Check if there are any other hooks in subdirectories
