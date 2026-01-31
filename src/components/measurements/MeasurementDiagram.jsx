import React from 'react';
import { motion } from 'framer-motion';
import GlowCard from '../ui/GlowCard';

const diagrams = {
  top: {
    title: "Top/Shirt Measurements",
    svg: (
      <svg viewBox="0 0 200 250" className="w-full h-full">
        {/* Shirt outline */}
        <path 
          d="M40 50 L60 30 L80 40 L100 35 L120 40 L140 30 L160 50 L150 70 L145 65 L145 200 L55 200 L55 65 L50 70 Z" 
          fill="url(#shirtGradient)" 
          stroke="black" 
          strokeWidth="3"
        />
        {/* Collar */}
        <ellipse cx="100" cy="40" rx="25" ry="10" fill="#fff" stroke="black" strokeWidth="2"/>
        
        {/* Measurement lines */}
        <line x1="55" y1="75" x2="145" y2="75" stroke="#FF1493" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="70" textAnchor="middle" fill="#FF1493" fontWeight="bold" fontSize="10">A: Chest</text>
        
        <line x1="55" y1="130" x2="145" y2="130" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="125" textAnchor="middle" fill="#8B5CF6" fontWeight="bold" fontSize="10">B: Waist</text>
        
        <line x1="100" y1="40" x2="100" y2="200" stroke="#00CED1" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="115" y="120" fill="#00CED1" fontWeight="bold" fontSize="10">C: Length</text>
        
        <line x1="55" y1="65" x2="30" y2="120" stroke="#32CD32" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="25" y="95" fill="#32CD32" fontWeight="bold" fontSize="10">D: Sleeve</text>
        
        <defs>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fce7f3"/>
            <stop offset="50%" stopColor="#e9d5ff"/>
            <stop offset="100%" stopColor="#cffafe"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    measurements: [
      { key: 'chest', label: 'A: Chest Width', color: '#FF1493', description: 'Measure across the fullest part of the chest' },
      { key: 'waist', label: 'B: Waist Width', color: '#8B5CF6', description: 'Measure at natural waistline' },
      { key: 'length', label: 'C: Total Length', color: '#00CED1', description: 'From shoulder seam to hem' },
      { key: 'sleeve', label: 'D: Sleeve Length', color: '#32CD32', description: 'From shoulder to cuff' },
    ]
  },
  bottom: {
    title: "Pants/Bottoms Measurements",
    svg: (
      <svg viewBox="0 0 200 280" className="w-full h-full">
        {/* Pants outline */}
        <path 
          d="M50 20 L150 20 L150 50 L140 50 L130 260 L110 260 L100 100 L90 260 L70 260 L60 50 L50 50 Z" 
          fill="url(#pantsGradient)" 
          stroke="black" 
          strokeWidth="3"
        />
        {/* Waistband */}
        <rect x="50" y="20" width="100" height="30" fill="#e9d5ff" stroke="black" strokeWidth="2"/>
        
        {/* Measurement lines */}
        <line x1="50" y1="35" x2="150" y2="35" stroke="#FF1493" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="15" textAnchor="middle" fill="#FF1493" fontWeight="bold" fontSize="10">A: Waist</text>
        
        <line x1="55" y1="70" x2="145" y2="70" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="85" textAnchor="middle" fill="#8B5CF6" fontWeight="bold" fontSize="10">B: Hip</text>
        
        <line x1="100" y1="50" x2="100" y2="100" stroke="#00CED1" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="120" y="80" fill="#00CED1" fontWeight="bold" fontSize="9">C: Rise</text>
        
        <line x1="95" y1="100" x2="95" y2="260" stroke="#32CD32" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="80" y="180" fill="#32CD32" fontWeight="bold" fontSize="9" transform="rotate(-90, 80, 180)">D: Inseam</text>
        
        <defs>
          <linearGradient id="pantsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fce7f3"/>
            <stop offset="50%" stopColor="#e9d5ff"/>
            <stop offset="100%" stopColor="#cffafe"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    measurements: [
      { key: 'waist', label: 'A: Waist', color: '#FF1493', description: 'Measure around waistband' },
      { key: 'hip', label: 'B: Hip', color: '#8B5CF6', description: 'Measure at fullest part of hips' },
      { key: 'rise', label: 'C: Rise', color: '#00CED1', description: 'From waist to crotch seam' },
      { key: 'inseam', label: 'D: Inseam', color: '#32CD32', description: 'From crotch to ankle' },
    ]
  },
  dress: {
    title: "Dress Measurements",
    svg: (
      <svg viewBox="0 0 200 300" className="w-full h-full">
        {/* Dress outline */}
        <path 
          d="M60 30 L75 20 L90 30 L100 25 L110 30 L125 20 L140 30 L135 50 L145 50 L160 280 L40 280 L55 50 L65 50 Z" 
          fill="url(#dressGradient)" 
          stroke="black" 
          strokeWidth="3"
        />
        {/* Neckline */}
        <ellipse cx="100" cy="30" rx="20" ry="8" fill="#fff" stroke="black" strokeWidth="2"/>
        
        {/* Measurement lines */}
        <line x1="60" y1="60" x2="140" y2="60" stroke="#FF1493" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="55" textAnchor="middle" fill="#FF1493" fontWeight="bold" fontSize="10">A: Bust</text>
        
        <line x1="65" y1="100" x2="135" y2="100" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="95" textAnchor="middle" fill="#8B5CF6" fontWeight="bold" fontSize="10">B: Waist</text>
        
        <line x1="55" y1="140" x2="145" y2="140" stroke="#FFA500" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="155" textAnchor="middle" fill="#FFA500" fontWeight="bold" fontSize="10">C: Hip</text>
        
        <line x1="100" y1="25" x2="100" y2="280" stroke="#00CED1" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="115" y="200" fill="#00CED1" fontWeight="bold" fontSize="10">D: Length</text>
        
        <defs>
          <linearGradient id="dressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fce7f3"/>
            <stop offset="50%" stopColor="#e9d5ff"/>
            <stop offset="100%" stopColor="#cffafe"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    measurements: [
      { key: 'bust', label: 'A: Bust', color: '#FF1493', description: 'Measure at fullest part of bust' },
      { key: 'waist', label: 'B: Waist', color: '#8B5CF6', description: 'Measure at natural waistline' },
      { key: 'hip', label: 'C: Hip', color: '#FFA500', description: 'Measure at fullest part of hips' },
      { key: 'length', label: 'D: Total Length', color: '#00CED1', description: 'From shoulder to hem' },
    ]
  },
  outerwear: {
    title: "Jacket/Outerwear Measurements",
    svg: (
      <svg viewBox="0 0 220 250" className="w-full h-full">
        {/* Jacket outline */}
        <path 
          d="M30 50 L55 25 L75 40 L100 30 L125 40 L145 25 L170 50 L175 70 L190 70 L190 120 L175 120 L175 200 L115 200 L115 80 L105 80 L105 200 L45 200 L45 120 L30 120 L30 70 L45 70 Z" 
          fill="url(#jacketGradient)" 
          stroke="black" 
          strokeWidth="3"
        />
        {/* Collar */}
        <path d="M75 40 L100 55 L125 40 L100 30 Z" fill="#e9d5ff" stroke="black" strokeWidth="2"/>
        
        {/* Measurement lines */}
        <line x1="45" y1="75" x2="175" y2="75" stroke="#FF1493" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="110" y="70" textAnchor="middle" fill="#FF1493" fontWeight="bold" fontSize="10">A: Chest</text>
        
        <line x1="110" y1="30" x2="110" y2="200" stroke="#00CED1" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="125" y="130" fill="#00CED1" fontWeight="bold" fontSize="10">B: Length</text>
        
        <line x1="45" y1="70" x2="30" y2="120" stroke="#32CD32" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="15" y="95" fill="#32CD32" fontWeight="bold" fontSize="9">C: Sleeve</text>
        
        <line x1="45" y1="150" x2="105" y2="150" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="75" y="165" textAnchor="middle" fill="#8B5CF6" fontWeight="bold" fontSize="9">D: Shoulder</text>
        
        <defs>
          <linearGradient id="jacketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fce7f3"/>
            <stop offset="50%" stopColor="#e9d5ff"/>
            <stop offset="100%" stopColor="#cffafe"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    measurements: [
      { key: 'chest', label: 'A: Chest', color: '#FF1493', description: 'Measure across chest at widest point' },
      { key: 'length', label: 'B: Total Length', color: '#00CED1', description: 'From collar to hem' },
      { key: 'sleeve', label: 'C: Sleeve Length', color: '#32CD32', description: 'From shoulder to cuff' },
      { key: 'shoulder', label: 'D: Shoulder Width', color: '#8B5CF6', description: 'Across back from seam to seam' },
    ]
  },
  jumpsuit: {
    title: "Jumpsuit/Romper Measurements",
    svg: (
      <svg viewBox="0 0 200 320" className="w-full h-full">
        {/* Jumpsuit outline */}
        <path 
          d="M50 30 L65 15 L85 25 L100 20 L115 25 L135 15 L150 30 L145 50 L155 50 L155 90 L145 90 L145 120 L140 300 L115 300 L100 160 L85 300 L60 300 L55 120 L55 90 L45 90 L45 50 L55 50 Z" 
          fill="url(#jumpsuitGradient)" 
          stroke="black" 
          strokeWidth="3"
        />
        {/* Neckline */}
        <ellipse cx="100" cy="25" rx="18" ry="7" fill="#fff" stroke="black" strokeWidth="2"/>
        
        {/* Measurement lines */}
        <line x1="55" y1="55" x2="145" y2="55" stroke="#FF1493" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="50" textAnchor="middle" fill="#FF1493" fontWeight="bold" fontSize="9">A: Bust</text>
        
        <line x1="58" y1="100" x2="142" y2="100" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="115" textAnchor="middle" fill="#8B5CF6" fontWeight="bold" fontSize="9">B: Waist</text>
        
        <line x1="60" y1="130" x2="140" y2="130" stroke="#FFA500" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="100" y="145" textAnchor="middle" fill="#FFA500" fontWeight="bold" fontSize="9">C: Hip</text>
        
        <line x1="100" y1="130" x2="100" y2="160" stroke="#00CED1" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="115" y="150" fill="#00CED1" fontWeight="bold" fontSize="8">D: Rise</text>
        
        <line x1="95" y1="160" x2="95" y2="300" stroke="#32CD32" strokeWidth="3" strokeDasharray="5,3"/>
        <text x="80" y="230" fill="#32CD32" fontWeight="bold" fontSize="8" transform="rotate(-90, 80, 230)">E: Inseam</text>
        
        <defs>
          <linearGradient id="jumpsuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fce7f3"/>
            <stop offset="50%" stopColor="#e9d5ff"/>
            <stop offset="100%" stopColor="#cffafe"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    measurements: [
      { key: 'bust', label: 'A: Bust', color: '#FF1493', description: 'Measure at fullest part of bust' },
      { key: 'waist', label: 'B: Waist', color: '#8B5CF6', description: 'Measure at natural waistline' },
      { key: 'hip', label: 'C: Hip', color: '#FFA500', description: 'Measure at fullest part of hips' },
      { key: 'rise', label: 'D: Rise', color: '#00CED1', description: 'From waist to crotch' },
      { key: 'inseam', label: 'E: Inseam', color: '#32CD32', description: 'From crotch to ankle' },
    ]
  }
};

export default function MeasurementDiagram({ clothingType }) {
  const diagram = diagrams[clothingType] || diagrams.top;

  return (
    <GlowCard glowColor="cyan" className="p-4">
      <h3 className="text-lg font-bold text-center mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
        {diagram.title}
      </h3>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[200px] mx-auto"
      >
        {diagram.svg}
      </motion.div>
      <div className="mt-4 space-y-2">
        {diagram.measurements.map((m, i) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 text-sm"
          >
            <div 
              className="w-4 h-4 rounded-full border-2 border-black"
              style={{ backgroundColor: m.color }}
            />
            <span className="font-bold" style={{ color: m.color }}>{m.label}</span>
          </motion.div>
        ))}
      </div>
    </GlowCard>
  );
}

export { diagrams };