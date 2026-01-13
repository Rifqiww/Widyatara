"use client"
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 z-20 bg-white/30 backdrop-blur-md px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-white/50 shadow-sm">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center gap-1.5 md:gap-2">
          <div 
            className={`w-2.5 h-2.5 md:w-4 md:h-4 rounded-full transition-all duration-500 ${
              currentStep > step 
                ? "bg-green-500 scale-100 md:scale-110" 
                : currentStep === step 
                ? "bg-[color:var(--accent-strong)] scale-110 md:scale-125 animate-pulse ring-[2px] md:ring-4 ring-[color:var(--accent-strong)]/20" 
                : "bg-[color:var(--secondary)]/20"
            }`}
          />
          {step < 4 && <div className="w-4 md:w-8 h-0.5 bg-[color:var(--secondary)]/10" />}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
