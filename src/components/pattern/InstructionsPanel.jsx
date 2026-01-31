import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from 'lucide-react';
import NeoCard from '@/components/shared/NeoCard';

export default function InstructionsPanel({ patternData }) {
  const [expandedStep, setExpandedStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  if (!patternData) return null;

  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? -1 : index);
  };

  const toggleComplete = (index, e) => {
    e.stopPropagation();
    setCompletedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const progressPercent = patternData.sewing_instructions 
    ? (completedSteps.length / patternData.sewing_instructions.length) * 100
    : 0;

  return (
    <NeoCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-black">Sewing Instructions</h2>
        <div className="flex items-center gap-2">
          <div className="w-32 h-4 bg-white rounded-full border-3 border-black overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#00F5D4] to-[#B8F83A]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-black text-sm text-[#9B5DE5]">
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {patternData.sewing_instructions?.map((instruction, index) => {
          const isExpanded = expandedStep === index;
          const isCompleted = completedSteps.includes(index);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                rounded-xl border-3 border-black overflow-hidden transition-all
                ${isCompleted ? 'bg-[#00F5D4]/20' : 'bg-white'}
                ${isExpanded ? 'shadow-[6px_6px_0_0_#000]' : 'shadow-[4px_4px_0_0_#000]'}
              `}
            >
              <button
                onClick={() => toggleStep(index)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => toggleComplete(index, e)}
                    className={`
                      w-8 h-8 rounded-full border-3 border-black flex items-center justify-center transition-all
                      ${isCompleted 
                        ? 'bg-[#00F5D4]' 
                        : 'bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5]'}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    ) : (
                      <span className="text-white font-black text-sm">{instruction.step}</span>
                    )}
                  </button>
                  <span className={`font-black ${isCompleted ? 'line-through text-gray-500' : 'text-black'}`}>
                    {instruction.title}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-[#9B5DE5]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#9B5DE5]" />
                )}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="p-4 bg-gradient-to-r from-[#E8D5FF]/50 to-[#FFD6E8]/50 rounded-xl">
                        <p className="font-semibold text-gray-700 leading-relaxed">
                          {instruction.description}
                        </p>
                        
                        {instruction.tips && (
                          <div className="mt-3 p-3 bg-[#FEE440]/30 rounded-lg border-2 border-[#FEE440] flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-[#FF9F68] flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-bold text-gray-700">
                              {instruction.tips}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Finishing techniques */}
      {patternData.finishing_techniques && (
        <div className="mt-6 p-4 bg-gradient-to-r from-[#9B5DE5]/20 to-[#FF6B9D]/20 rounded-xl border-3 border-black">
          <h4 className="font-black text-sm mb-3">✨ Finishing Touches</h4>
          <ul className="space-y-2">
            {patternData.finishing_techniques.map((technique, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B9D]" />
                <span className="text-sm font-semibold">{technique}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Care instructions */}
      {patternData.care_instructions && (
        <div className="mt-4 p-4 bg-white rounded-xl border-3 border-black">
          <h4 className="font-black text-sm mb-2">🧺 Care Instructions</h4>
          <p className="text-sm font-semibold text-gray-600">
            {patternData.care_instructions}
          </p>
        </div>
      )}
    </NeoCard>
  );
}