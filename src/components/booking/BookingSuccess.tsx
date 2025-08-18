import React from 'react';

interface BookingSuccessProps {
  onBookAnother: () => void;
}

/**
 * Success message component displayed after a booking is successfully submitted
 * @param onBookAnother - Callback function to reset the form and start a new booking
 */
const BookingSuccess: React.FC<BookingSuccessProps> = ({ onBookAnother }) => {
  return (
    <div className="text-center">
      <div className="mb-4 text-green-600">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Submitted Successfully!</h2>
      <p className="text-gray-600 mb-8">
        Thank you for your booking. We will review your request and contact you shortly.
      </p>
      <button
        onClick={onBookAnother}
        className="btn-primary"
      >
        Book Another Job
      </button>
    </div>
  );
};

export default BookingSuccess;
