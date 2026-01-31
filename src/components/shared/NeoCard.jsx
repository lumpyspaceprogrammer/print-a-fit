import React from 'react';
import { motion } from 'framer-motion';

export default function NeoCard({ children, className = '', animate = true }) {
  const Wrapper = animate ? motion.div : 'div';
  
  return (
    <Wrapper
      initial={animate ? { y: 20, opacity: 0 } : undefined}
      animate={animate ? { y: 0, opacity: 1 } : undefined}
      className={`
        bg-white/90 backdrop-blur-sm rounded-2xl border-4 border-black
        shadow-[8px_8px_0_0_#000]
        ${className}
      `}
    >
      {children}
    </Wrapper>
  );
}