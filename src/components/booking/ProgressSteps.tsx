import React from 'react';

interface Step {
  number: number;
  title: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { number: 1, title: "Service" },
  { number: 2, title: "Site" },
  { number: 3, title: "Billing" }
];

/**
 * Progress indicator component that shows the current step in a multi-step form
 * @param currentStep - The current active step number
 * @param steps - Optional array of step objects to override default steps
 */
const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  currentStep, 
  steps = defaultSteps 
}) => {
  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-20 rounded-full"></div>
        
        {/* Animated progress bar */}
        <div 
          className="absolute left-0 top-1/2 h-1 bg-green-500 -z-10 rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${progressPercentage}%`,
            transform: 'translateY(-50%)'
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isReached = currentStep >= step.number;

          return (
            <div
              key={step.number}
              className={`flex flex-col items-center ${
                isCurrent
                  ? 'text-blue-900'
                  : isCompleted
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'border-blue-900 bg-blue-50 scale-110'
                    : isCompleted
                    ? 'border-green-500 bg-green-500 text-white'
                    : isReached
                    ? 'border-green-500 bg-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              <div className="mt-2 text-sm font-medium whitespace-nowrap">{step.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
