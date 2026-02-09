import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Gift } from 'lucide-react';
import GlowButton from '../ui/GlowButton';

export default function ValentinesPopup({ isOpen, onClose, onJoin }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full p-8 relative overflow-hidden"
        >
          {/* Floating hearts decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-300 opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              >
                <Heart size={32} fill="currentColor" />
              </motion.div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="p-6 rounded-full bg-gradient-to-br from-pink-400 via-red-400 to-purple-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Gift className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 bg-clip-text text-transparent">
              💝 Valentine's Day Special 💝
            </h2>

            <p className="text-center text-gray-700 text-lg mb-6 font-medium">
              Make a gift for someone you love<br />
              <span className="text-pink-600">(even if that someone is you!)</span>
            </p>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border-3 border-black mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Create a Heartfelt Gift</h3>
                  <p className="text-gray-700">
                    Design a custom outfit pattern for someone special. Whether it's for your partner, 
                    best friend, family member, or a little self-love - create something unique and meaningful!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" fill="currentColor" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Share the Love</h3>
                  <p className="text-gray-700">
                    Tag your creation with who it's for and share it in our community gallery. 
                    Inspire others with your thoughtful handmade gifts!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <GlowButton onClick={onJoin} variant="primary">
                <Heart className="w-5 h-5 mr-2 inline" fill="currentColor" />
                Start Creating My Gift
              </GlowButton>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Available for all users through February 14th
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}