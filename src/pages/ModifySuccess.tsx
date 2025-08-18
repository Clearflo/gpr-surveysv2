import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ModifySuccess: React.FC = () => {
  const location = useLocation() as { state?: { jobNumber?: string; email?: string } };
  const jobNumber = location.state?.jobNumber;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-16 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Booking Updated</h1>
      <p className="text-gray-700 mb-6">Your booking modification was submitted successfully.</p>
      {jobNumber && (
        <p className="text-gray-600 mb-8">Job Number: <span className="font-medium">{jobNumber}</span></p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-secondary px-6">Back to Home</Link>
        <Link to="/modify" className="btn-primary px-6">Modify Another Booking</Link>
      </div>
    </div>
  );
};

export default ModifySuccess;
