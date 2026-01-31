import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Sparkles } from 'lucide-react';

export default function FloatingShapes() {
  const shapes = [
    { Icon: Star, color: "text-pink-400", size: 24, x: "10%", y: "20%", delay: 0 },
    { Icon: Heart, color: "text-purple-400", size: 20, x: "85%", y: "15%", delay: 0.5 },
    { Icon: Sparkles, color: "text-cyan-400", size: 28, x: "75%", y: "70%", delay: 1 },
    { Icon: Star, color: "text-orange-400", size: 16, x: "15%", y: "75%", delay: 1.5 },
    { Icon: Heart, color: "text-lime-400", size: 22, x: "90%", y: "45%", delay: 2 },
    { Icon: Sparkles, color: "text-pink-300", size: 18, x: "5%", y: "50%", delay: 0.8 },
    { Icon: Star, color: "text-purple-300", size: 26, x: "50%", y: "10%", delay: 1.2 },
    { Icon: Heart, color: "text-cyan-300", size: 14, x: "30%", y: "85%", delay: 0.3 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute ${shape.color} opacity-60`}
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <shape.Icon size={shape.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}