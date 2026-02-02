import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import SubscriptionTiers from './SubscriptionTiers';

export default function UpgradeModal({ isOpen, onClose, currentTier, reason }) {
  if (!isOpen) return null;

  const handleSelectTier = (tier) => {
    // In production, this would open Stripe checkout
    alert(`Upgrade to ${tier.name} would open payment flow. This is a demo.`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl my-8"
        >
          <GlowCard glowColor="rainbow" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 border-3 border-black">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    Upgrade Your Plan
                  </h2>
                  {reason && (
                    <p className="text-gray-600 text-sm">{reason}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SubscriptionTiers 
              currentTier={currentTier} 
              onSelectTier={handleSelectTier}
            />
          </GlowCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}