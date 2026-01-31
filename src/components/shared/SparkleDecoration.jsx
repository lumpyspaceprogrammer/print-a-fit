import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Heart } from 'lucide-react';

const decorations = [
  { Icon: Star, color: '#FEE440', size: 24, top: '5%', left: '10%', delay: 0 },
  { Icon: Sparkles, color: '#FF6B9D', size: 32, top: '15%', right: '8%', delay: 0.2 },
  { Icon: Heart, color: '#9B5DE5', size: 20, bottom: '20%', left: '5%', delay: 0.4 },
  { Icon: Star, color: '#00F5D4', size: 28, bottom: '30%', right: '12%', delay: 0.6 },
  { Icon: Sparkles, color: '#B8F83A', size: 22, top: '40%', left: '3%', delay: 0.8 },
  { Icon: Heart, color: '#FF9F68', size: 26, top: '60%', right: '5%', delay: 1 },
  { Icon: Star, color: '#FF6B9D', size: 18, bottom: '10%', right: '20%', delay: 1.2 },
  { Icon: Sparkles, color: '#FEE440', size: 30, bottom: '5%', left: '15%', delay: 1.4 },
];

export default function SparkleDecoration() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((dec, index) => {
        const { Icon, color, size, delay, ...position } = dec;
        return (
          <motion.div
            key={index}
            className="absolute"
            style={position}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              delay,
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Icon 
              style={{ 
                width: size, 
                height: size, 
                color,
                fill: color,
                filter: `drop-shadow(0 0 8px ${color})`
              }} 
            />
          </motion.div>
        );
      })}
      
      {/* Floating circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 100 + i * 50,
            height: 100 + i * 50,
            background: `radial-gradient(circle, ${['#FF6B9D20', '#9B5DE520', '#00F5D420', '#FEE44020', '#B8F83A20', '#FF9F6820'][i]} 0%, transparent 70%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );
}