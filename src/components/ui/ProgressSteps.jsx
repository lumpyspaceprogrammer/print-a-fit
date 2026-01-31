import React from 'react';
import { cn } from "@/lib/utils";
import { Upload, Wand2, Ruler, Scissors, Check } from 'lucide-react';

const steps = [
  { icon: Upload, label: "Upload" },
  { icon: Wand2, label: "Refine" },
  { icon: Ruler, label: "Measure" },
  { icon: Scissors, label: "Pattern" }
];

export default function ProgressSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-4 px-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center",
                  "border-3 md:border-4 border-black transition-all duration-300",
                  isActive && "bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-110",
                  isCompleted && "bg-gradient-to-br from-lime-400 to-cyan-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
                  !isActive && !isCompleted && "bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={3} />
                ) : (
                  <Icon className={cn(
                    "w-5 h-5 md:w-6 md:h-6",
                    isActive ? "text-white" : "text-gray-500"
                  )} />
                )}
              </div>
              <span className={cn(
                "text-xs md:text-sm font-bold",
                isActive ? "text-purple-600" : isCompleted ? "text-cyan-600" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 md:w-16 h-2 rounded-full border-2 border-black",
                index + 1 < currentStep 
                  ? "bg-gradient-to-r from-lime-400 to-cyan-400" 
                  : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}