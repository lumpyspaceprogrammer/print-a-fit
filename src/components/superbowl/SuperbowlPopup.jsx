import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Shirt, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlowButton from '../ui/GlowButton';
import { createPageUrl } from '@/utils';

export default function SuperbowlPopup({ isOpen, onClose, onJoin }) {
  const [selectedTeam, setSelectedTeam] = useState(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            {/* Field lines decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white" />
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-white rounded-full" />
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="relative p-6 text-center">
              {/* Trophy animation */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
                🏈 SUPERBOWL
              </h2>
              <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent mb-4">
                FASHION CHALLENGE
              </h3>

              <p className="text-white/90 mb-6 text-lg">
                Create a FREE game day outfit & pick your winner!
              </p>

              {/* Team Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTeam('patriots')}
                  className={`p-4 rounded-xl border-4 transition-all ${
                    selectedTeam === 'patriots'
                      ? 'bg-blue-600 border-red-400 shadow-[4px_4px_0px_0px_rgba(248,113,113,1)]'
                      : 'bg-blue-700/50 border-black hover:bg-blue-600/70'
                  }`}
                >
                  <div className="text-4xl mb-2">🔵</div>
                  <p className="text-white font-black text-lg">PATRIOTS</p>
                  <p className="text-white/70 text-sm">New England</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTeam('seahawks')}
                  className={`p-4 rounded-xl border-4 transition-all ${
                    selectedTeam === 'seahawks'
                      ? 'bg-blue-800 border-green-400 shadow-[4px_4px_0px_0px_rgba(74,222,128,1)]'
                      : 'bg-blue-900/50 border-black hover:bg-blue-800/70'
                  }`}
                >
                  <div className="text-4xl mb-2">🦅</div>
                  <p className="text-white font-black text-lg">SEAHAWKS</p>
                  <p className="text-white/70 text-sm">Seattle</p>
                </motion.button>
              </div>

              {/* Benefits */}
              <div className="flex justify-center gap-4 mb-6 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <Shirt className="w-4 h-4" /> Free Pattern
                </span>
                <span className="flex items-center gap-1">
                  <PartyPopper className="w-4 h-4" /> Win Prizes
                </span>
              </div>

              {/* CTA */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border-3 border-white/30 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  Maybe Later
                </button>
                <Link to={createPageUrl('SuperbowlChallenge') + (selectedTeam ? `?team=${selectedTeam}` : '')}>
                  <GlowButton
                    variant="success"
                    onClick={() => onJoin?.(selectedTeam)}
                    disabled={!selectedTeam}
                    className={!selectedTeam ? 'opacity-50' : ''}
                  >
                    <Trophy className="w-5 h-5 mr-2 inline" />
                    Join Challenge
                  </GlowButton>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}