import React from 'react';
import { motion } from 'framer-motion';

export default function GlowButton({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '' 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00F5D4]',
    secondary: 'bg-gradient-to-r from-[#FEE440] via-[#FF9F68] to-[#FF6B9D]',
    success: 'bg-gradient-to-r from-[#00F5D4] to-[#B8F83A]'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-xl border-4 border-black font-black text-white text-lg
        shadow-[6px_6px_0_0_#000] 
        hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-[2px_2px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px]
        transition-all duration-150
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        textShadow: '2px 2px 0 #000'
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm -z-10" />
      {children}
    </motion.button>
  );
}