import React from 'react';
import { motion } from 'framer-motion';

export default function ClothingTypeSelector({ types, selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {types.map((type, index) => (
        <motion.button
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(type.id)}
          className={`
            relative p-4 rounded-xl border-4 border-black transition-all duration-200
            ${selected === type.id 
              ? 'bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5] shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]' 
              : 'bg-white shadow-[6px_6px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px]'}
          `}
        >
          <span className="text-3xl mb-2 block">{type.emoji}</span>
          <span className={`font-bold text-sm ${selected === type.id ? 'text-white' : 'text-black'}`}>
            {type.label}
          </span>
          
          {selected === type.id && (
            <motion.div
              layoutId="selector"
              className="absolute -top-2 -right-2 w-6 h-6 bg-[#00F5D4] border-2 border-black rounded-full flex items-center justify-center"
            >
              <span className="text-xs">✓</span>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}