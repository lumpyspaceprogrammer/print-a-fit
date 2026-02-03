import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader2 } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import SubscriptionTiers from './SubscriptionTiers';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function UpgradeModal({ isOpen, onClose, currentTier, reason }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen) return null;

  const handleSelectTier = async (tier) => {
    // Check if running in iframe (preview mode)
    if (window.self !== window.top) {
      toast.error('Checkout only works in your published app. Please publish and open in a new tab.');
      return;
    }

    const tierKey = tier.name.toLowerCase();
    setIsProcessing(true);
    
    try {
      const { data } = await base44.functions.invoke('createCheckout', { tier: tierKey });
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
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

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="mt-4 text-lg font-bold text-purple-600">Redirecting to checkout...</p>
              </div>
            ) : (
              <SubscriptionTiers 
                currentTier={currentTier} 
                onSelectTier={handleSelectTier}
              />
            )}
          </GlowCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}