import React from 'react';
import { motion } from 'framer-motion';

const diagrams = {
  top: {
    svg: (active) => (
      <svg viewBox="0 0 200 250" className="w-full h-auto max-h-[300px]">
        {/* T-shirt shape */}
        <path
          d="M50 50 L30 70 L30 90 L50 90 L50 200 L150 200 L150 90 L170 90 L170 70 L150 50 L130 50 L120 30 L80 30 L70 50 Z"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />
        {/* Neckline */}
        <ellipse cx="100" cy="35" rx="20" ry="10" fill="white" stroke="black" strokeWidth="3" />
        
        {/* Measurement lines */}
        <motion.g animate={{ opacity: active === 'shoulder' ? 1 : 0.3 }}>
          <line x1="50" y1="50" x2="150" y2="50" stroke="#FF6B9D" strokeWidth="3" strokeDasharray="5,5" />
          <circle cx="50" cy="50" r="5" fill="#FF6B9D" />
          <circle cx="150" cy="50" r="5" fill="#FF6B9D" />
          <text x="100" y="43" textAnchor="middle" fill="#FF6B9D" fontWeight="bold" fontSize="10">Shoulder</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'chest' ? 1 : 0.3 }}>
          <line x1="50" y1="100" x2="150" y2="100" stroke="#9B5DE5" strokeWidth="3" strokeDasharray="5,5" />
          <circle cx="50" cy="100" r="5" fill="#9B5DE5" />
          <circle cx="150" cy="100" r="5" fill="#9B5DE5" />
          <text x="100" y="113" textAnchor="middle" fill="#9B5DE5" fontWeight="bold" fontSize="10">Chest</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'waist' ? 1 : 0.3 }}>
          <line x1="50" y1="150" x2="150" y2="150" stroke="#00F5D4" strokeWidth="3" strokeDasharray="5,5" />
          <circle cx="50" cy="150" r="5" fill="#00F5D4" />
          <circle cx="150" cy="150" r="5" fill="#00F5D4" />
          <text x="100" y="163" textAnchor="middle" fill="#00F5D4" fontWeight="bold" fontSize="10">Waist</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'sleeve' ? 1 : 0.3 }}>
          <line x1="30" y1="70" x2="30" y2="90" stroke="#FEE440" strokeWidth="3" />
          <circle cx="30" cy="70" r="5" fill="#FEE440" />
          <circle cx="30" cy="90" r="5" fill="#FEE440" />
          <text x="15" y="82" textAnchor="middle" fill="#FEE440" fontWeight="bold" fontSize="8" transform="rotate(-90,15,82)">Sleeve</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'length' ? 1 : 0.3 }}>
          <line x1="175" y1="35" x2="175" y2="200" stroke="#B8F83A" strokeWidth="3" />
          <circle cx="175" cy="35" r="5" fill="#B8F83A" />
          <circle cx="175" cy="200" r="5" fill="#B8F83A" />
          <text x="185" y="120" fill="#B8F83A" fontWeight="bold" fontSize="8" transform="rotate(90,185,120)">Length</text>
        </motion.g>
      </svg>
    ),
  },
  dress: {
    svg: (active) => (
      <svg viewBox="0 0 200 300" className="w-full h-auto max-h-[300px]">
        {/* Dress shape */}
        <path
          d="M60 40 L40 60 L40 80 L55 80 L55 120 L30 250 L170 250 L145 120 L145 80 L160 80 L160 60 L140 40 L125 40 L115 25 L85 25 L75 40 Z"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />
        <ellipse cx="100" cy="30" rx="18" ry="8" fill="white" stroke="black" strokeWidth="3" />
        
        <motion.g animate={{ opacity: active === 'shoulder' ? 1 : 0.3 }}>
          <line x1="60" y1="40" x2="140" y2="40" stroke="#FF6B9D" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="33" textAnchor="middle" fill="#FF6B9D" fontWeight="bold" fontSize="10">Shoulder</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'bust' ? 1 : 0.3 }}>
          <line x1="55" y1="90" x2="145" y2="90" stroke="#9B5DE5" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="103" textAnchor="middle" fill="#9B5DE5" fontWeight="bold" fontSize="10">Bust</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'waist' ? 1 : 0.3 }}>
          <line x1="55" y1="130" x2="145" y2="130" stroke="#00F5D4" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="143" textAnchor="middle" fill="#00F5D4" fontWeight="bold" fontSize="10">Waist</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'hip' ? 1 : 0.3 }}>
          <line x1="45" y1="180" x2="155" y2="180" stroke="#FEE440" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="193" textAnchor="middle" fill="#FEE440" fontWeight="bold" fontSize="10">Hip</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'length' ? 1 : 0.3 }}>
          <line x1="175" y1="30" x2="175" y2="250" stroke="#B8F83A" strokeWidth="3" />
          <text x="185" y="140" fill="#B8F83A" fontWeight="bold" fontSize="8" transform="rotate(90,185,140)">Length</text>
        </motion.g>
      </svg>
    ),
  },
  pants: {
    svg: (active) => (
      <svg viewBox="0 0 200 300" className="w-full h-auto max-h-[300px]">
        {/* Pants shape */}
        <path
          d="M45 30 L45 120 L30 280 L90 280 L100 140 L110 280 L170 280 L155 120 L155 30 Z"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />
        
        <motion.g animate={{ opacity: active === 'waist' ? 1 : 0.3 }}>
          <line x1="45" y1="35" x2="155" y2="35" stroke="#FF6B9D" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="25" textAnchor="middle" fill="#FF6B9D" fontWeight="bold" fontSize="10">Waist</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'hip' ? 1 : 0.3 }}>
          <line x1="45" y1="80" x2="155" y2="80" stroke="#9B5DE5" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="93" textAnchor="middle" fill="#9B5DE5" fontWeight="bold" fontSize="10">Hip</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'thigh' ? 1 : 0.3 }}>
          <line x1="45" y1="130" x2="95" y2="130" stroke="#00F5D4" strokeWidth="3" strokeDasharray="5,5" />
          <text x="70" y="143" textAnchor="middle" fill="#00F5D4" fontWeight="bold" fontSize="10">Thigh</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'inseam' ? 1 : 0.3 }}>
          <line x1="100" y1="130" x2="100" y2="280" stroke="#FEE440" strokeWidth="3" />
          <text x="108" y="205" fill="#FEE440" fontWeight="bold" fontSize="8" transform="rotate(90,108,205)">Inseam</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'outseam' ? 1 : 0.3 }}>
          <line x1="25" y1="30" x2="25" y2="280" stroke="#B8F83A" strokeWidth="3" />
          <text x="15" y="155" fill="#B8F83A" fontWeight="bold" fontSize="8" transform="rotate(-90,15,155)">Outseam</text>
        </motion.g>
      </svg>
    ),
  },
  skirt: {
    svg: (active) => (
      <svg viewBox="0 0 200 250" className="w-full h-auto max-h-[300px]">
        {/* Skirt shape */}
        <path
          d="M55 30 L55 60 L25 220 L175 220 L145 60 L145 30 Z"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />
        
        <motion.g animate={{ opacity: active === 'waist' ? 1 : 0.3 }}>
          <line x1="55" y1="35" x2="145" y2="35" stroke="#FF6B9D" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="25" textAnchor="middle" fill="#FF6B9D" fontWeight="bold" fontSize="10">Waist</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'hip' ? 1 : 0.3 }}>
          <line x1="50" y1="80" x2="150" y2="80" stroke="#9B5DE5" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="93" textAnchor="middle" fill="#9B5DE5" fontWeight="bold" fontSize="10">Hip</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'length' ? 1 : 0.3 }}>
          <line x1="180" y1="30" x2="180" y2="220" stroke="#00F5D4" strokeWidth="3" />
          <text x="190" y="125" fill="#00F5D4" fontWeight="bold" fontSize="8" transform="rotate(90,190,125)">Length</text>
        </motion.g>
      </svg>
    ),
  },
  jacket: {
    svg: (active) => (
      <svg viewBox="0 0 200 250" className="w-full h-auto max-h-[300px]">
        {/* Jacket shape */}
        <path
          d="M50 45 L25 65 L25 200 L45 200 L45 85 L55 85 L55 200 L145 200 L145 85 L155 85 L155 200 L175 200 L175 65 L150 45 L130 45 L120 25 L80 25 L70 45 Z"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />
        <line x1="100" y1="45" x2="100" y2="200" stroke="black" strokeWidth="2" />
        <ellipse cx="100" cy="30" rx="18" ry="8" fill="white" stroke="black" strokeWidth="3" />
        
        <motion.g animate={{ opacity: active === 'shoulder' ? 1 : 0.3 }}>
          <line x1="50" y1="45" x2="150" y2="45" stroke="#FF6B9D" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="38" textAnchor="middle" fill="#FF6B9D" fontWeight="bold" fontSize="10">Shoulder</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'chest' ? 1 : 0.3 }}>
          <line x1="55" y1="100" x2="145" y2="100" stroke="#9B5DE5" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="113" textAnchor="middle" fill="#9B5DE5" fontWeight="bold" fontSize="10">Chest</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'waist' ? 1 : 0.3 }}>
          <line x1="55" y1="150" x2="145" y2="150" stroke="#00F5D4" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="163" textAnchor="middle" fill="#00F5D4" fontWeight="bold" fontSize="10">Waist</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'sleeve' ? 1 : 0.3 }}>
          <line x1="25" y1="65" x2="25" y2="200" stroke="#FEE440" strokeWidth="3" />
          <text x="15" y="130" fill="#FEE440" fontWeight="bold" fontSize="8" transform="rotate(-90,15,130)">Sleeve</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'length' ? 1 : 0.3 }}>
          <line x1="185" y1="30" x2="185" y2="200" stroke="#B8F83A" strokeWidth="3" />
          <text x="193" y="115" fill="#B8F83A" fontWeight="bold" fontSize="8" transform="rotate(90,193,115)">Length</text>
        </motion.g>
      </svg>
    ),
  },
  shorts: {
    svg: (active) => (
      <svg viewBox="0 0 200 200" className="w-full h-auto max-h-[250px]">
        {/* Shorts shape */}
        <path
          d="M45 30 L45 80 L35 160 L90 160 L100 100 L110 160 L165 160 L155 80 L155 30 Z"
          fill="white"
          stroke="black"
          strokeWidth="4"
        />
        
        <motion.g animate={{ opacity: active === 'waist' ? 1 : 0.3 }}>
          <line x1="45" y1="35" x2="155" y2="35" stroke="#FF6B9D" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="25" textAnchor="middle" fill="#FF6B9D" fontWeight="bold" fontSize="10">Waist</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'hip' ? 1 : 0.3 }}>
          <line x1="45" y1="70" x2="155" y2="70" stroke="#9B5DE5" strokeWidth="3" strokeDasharray="5,5" />
          <text x="100" y="83" textAnchor="middle" fill="#9B5DE5" fontWeight="bold" fontSize="10">Hip</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'thigh' ? 1 : 0.3 }}>
          <line x1="40" y1="110" x2="85" y2="110" stroke="#00F5D4" strokeWidth="3" strokeDasharray="5,5" />
          <text x="62" y="123" textAnchor="middle" fill="#00F5D4" fontWeight="bold" fontSize="10">Thigh</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'inseam' ? 1 : 0.3 }}>
          <line x1="100" y1="95" x2="100" y2="160" stroke="#FEE440" strokeWidth="3" />
          <text x="108" y="127" fill="#FEE440" fontWeight="bold" fontSize="8" transform="rotate(90,108,127)">Inseam</text>
        </motion.g>
        
        <motion.g animate={{ opacity: active === 'outseam' ? 1 : 0.3 }}>
          <line x1="25" y1="30" x2="25" y2="160" stroke="#B8F83A" strokeWidth="3" />
          <text x="15" y="95" fill="#B8F83A" fontWeight="bold" fontSize="8" transform="rotate(-90,15,95)">Outseam</text>
        </motion.g>
      </svg>
    ),
  },
};

export default function MeasurementDiagram({ type, activeMeasurement }) {
  const diagram = diagrams[type];
  
  if (!diagram) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center p-4 bg-gradient-to-br from-[#E8D5FF]/30 to-[#FFD6E8]/30 rounded-xl border-3 border-black"
    >
      {diagram.svg(activeMeasurement)}
    </motion.div>
  );
}