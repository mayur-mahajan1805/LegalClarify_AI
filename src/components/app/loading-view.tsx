'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const loadingSteps = [
    "Parsing your document...",
    "Identifying key clauses...",
    "Scanning for risky terms...",
    "Generating simplified summary...",
    "Finalizing analysis...",
];

export function LoadingView() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
      <h2 className="text-2xl font-semibold mb-2">Analyzing Your Document</h2>
      <p className="text-muted-foreground text-lg w-full transition-opacity duration-500">
        {loadingSteps[currentStep]}
      </p>
    </div>
  );
}
