// Booking-related constants

// File upload constraints
export const FILE_UPLOAD = {
  // Maximum file size in bytes (25MB)
  MAX_FILE_SIZE: 25 * 1024 * 1024,
  
  // Allowed file types
  ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  
  // File extensions for display
  ALLOWED_EXTENSIONS: ['PDF', 'JPG', 'JPEG', 'PNG'],
  
  // Maximum number of files per booking
  MAX_FILES: 10
} as const;

// Export individual constants for backward compatibility
export const MAX_FILE_SIZE = FILE_UPLOAD.MAX_FILE_SIZE;
export const ACCEPTED_FILE_TYPES = FILE_UPLOAD.ALLOWED_TYPES;

// Generate 24-hour time slots in 30-minute increments
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Create time in 24-hour format
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Convert to 12-hour format for display
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      
      slots.push({
        value: time24,
        label: displayTime
      });
    }
  }
  return slots;
};

// Booking time slots (24 hours, 30-minute intervals)
export const TIME_SLOTS = generateTimeSlots();

// Booking status values
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
} as const;

export type BookingStatusType = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// Admin-related constants
export const ADMIN_CONSTANTS = {
  // Code required for admin booking blocks
  BLOCK_CODE: 'GPR2025BLOCK',
  
  // Admin email addresses
  ADMIN_EMAILS: ['admin@gprsurveys.ca']
} as const;

// Webhook URLs
export const WEBHOOK_URLS = {
  // Make.com webhook for booking submissions
  BOOKING: 'https://hook.us2.make.com/5fevpkpj51wiujwkkp6kjpd9swv7e96a'
} as const;

// Form validation patterns
export const VALIDATION_PATTERNS = {
  // Canadian postal code pattern
  POSTAL_CODE: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  
  // Email pattern
  EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  
  // Phone number pattern (flexible)
  PHONE: /^[\d\s\-\(\)\+]+$/
} as const;
