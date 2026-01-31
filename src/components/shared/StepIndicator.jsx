import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Ruler, FileText } from 'lucide-react';

const steps = [
  { icon: Upload, label: 'Upload' },
  { icon: Sparkles, label: 'Refine' },
  { icon: Ruler, label: 'Measure' },
  { icon: FileText, label: 'Pattern' }
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex justify-center items-center gap-2 md:gap-4 mb-8">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;
        
        return (
          <React.Fragment key={step.label}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex flex-col items-center gap-1
              `}
            >
              <div 
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-black flex items-center justify-center
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] shadow-[4px_4px_0_0_#000] scale-110' 
                    : isCompleted 
                      ? 'bg-[#00F5D4] shadow-[2px_2px_0_0_#000]'
                      : 'bg-white shadow-[2px_2px_0_0_#000]'}
                `}
              >
                <StepIcon 
                  className={`w-5 h-5 md:w-6 md:h-6 ${isActive || isCompleted ? 'text-white' : 'text-[#9B5DE5]'}`} 
                />
              </div>
              <span 
                className={`
                  text-xs font-bold hidden md:block
                  ${isActive ? 'text-[#FF6B9D]' : 'text-[#9B5DE5]'}
                `}
              >
                {step.label}
              </span>
            </motion.div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-8 md:w-16 h-1 rounded-full border-2 border-black
                  ${index + 1 < currentStep ? 'bg-[#00F5D4]' : 'bg-white'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}