import React from 'react';

interface Step {
  number: number;
  title: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps?: Step[];
  onStepClick?: (stepNumber: number) => void;
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
  steps = defaultSteps,
  onStepClick,
}) => {
  // Clamp and compute progress percentage between 0 and 100
  const safeStep = Math.min(Math.max(currentStep, 1), steps.length);
  const progressPercentage = steps.length > 1
    ? ((safeStep - 1) / (steps.length - 1)) * 100
    : 0;

  return (
    <div className="mb-8 px-2 sm:px-4 md:px-8">
      <div className="relative">
        {/* Steps row */}
        <ol className="relative z-10 flex items-center justify-between">
          {steps.map((step) => {
            const isCompleted = safeStep > step.number;
            const isCurrent = safeStep === step.number;
            const isUpcoming = safeStep < step.number;
            const isClickable = Boolean(onStepClick) && isCompleted; // only allow navigating back

            return (
              <li
                key={step.number}
                className="relative flex flex-col items-center"
                aria-current={isCurrent ? 'step' : undefined}
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => {
                    if (isClickable) onStepClick?.(step.number);
                  }}
                  className={
                    `relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm focus:outline-none ` +
                    (isClickable ? 'cursor-pointer hover:brightness-95 focus:ring-2 focus:ring-green-500' : 'cursor-default') + ' ' +
                    (isCurrent
                      ? 'ring-2 ring-green-600 bg-white text-green-700'
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-400 ring-1 ring-gray-300')
                  }
                  aria-label={`Step ${step.number}: ${step.title}${isClickable ? ' (click to go back)' : ''}`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm md:text-base font-semibold">{step.number}</span>
                  )}
                </button>

                <div
                  className={
                    'mt-3 text-xs md:text-sm font-medium tracking-wide whitespace-nowrap ' +
                    (isCurrent
                      ? 'text-green-900'
                      : isUpcoming
                      ? 'text-gray-400'
                      : 'text-green-700')
                  }
                >
                  {step.title}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Progress bar below the circles */}
        <div className="mt-3 h-[6px] w-full rounded-full bg-gray-200/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-green-600 transition-[width] duration-700 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;

