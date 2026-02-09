import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import GlowButton from '../ui/GlowButton';

export default function TutorialOverlay({ steps, onComplete, tutorialKey }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem(`tutorial_${tutorialKey}_completed`);
    if (!hasCompleted) {
      setIsVisible(true);
    }
  }, [tutorialKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`tutorial_${tutorialKey}_completed`, 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(`tutorial_${tutorialKey}_completed`, 'true');
    setIsVisible(false);
  };

  if (!isVisible || !steps || steps.length === 0) return null;

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={handleSkip}
        />

        {/* Spotlight effect on target element */}
        {step.target && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute pointer-events-none"
            style={{
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
              borderRadius: '12px',
              ...step.spotlightStyle
            }}
          />
        )}

        {/* Tutorial card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="absolute pointer-events-auto"
          style={{
            left: step.position?.left || '50%',
            top: step.position?.top || '50%',
            transform: step.position?.transform || 'translate(-50%, -50%)',
            maxWidth: '90vw',
            width: '400px'
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6">
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute -top-3 -right-3 p-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            {/* Icon */}
            {step.icon && (
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-purple-900 dark:to-pink-900 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] inline-flex">
                <step.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold mb-2 dark:text-white">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {step.description}
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-1">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStep
                        ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-500'
                        : 'w-2 bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-2 rounded-lg border-3 border-black dark:border-white bg-white dark:bg-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-6 py-2 rounded-lg border-3 border-black dark:border-white bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold hover:from-pink-500 hover:to-purple-500 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
                  {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}