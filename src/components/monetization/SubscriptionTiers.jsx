import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Star, Crown, Zap } from 'lucide-react';
import GlowButton from '../ui/GlowButton';

// Tier data without React components for importing elsewhere
export const tierData = {
  free: { patternsPerDay: 0 },
  hobbyist: { patternsPerDay: 3 },
  influencer: { patternsPerDay: 10 },
  boss: { patternsPerDay: -1 }
};

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    patternsPerDay: 0,
    firstPatternFree: true,
    icon: Sparkles,
    color: 'from-gray-400 to-gray-500',
    bgColor: 'from-gray-50 to-gray-100',
    features: [
      '1 free pattern to start',
      'Basic pattern generation',
      'Community access',
      'Share your creations'
    ]
  },
  {
    id: 'hobbyist',
    name: 'Hobbyist',
    price: 9.99,
    patternsPerDay: 3,
    icon: Star,
    color: 'from-pink-400 to-rose-500',
    bgColor: 'from-pink-50 to-rose-50',
    features: [
      '3 patterns per day',
      'All customization options',
      'Priority generation',
      'Download in all formats',
      'Community features'
    ]
  },
  {
    id: 'influencer',
    name: 'Influencer',
    price: 24.99,
    patternsPerDay: 10,
    icon: Zap,
    color: 'from-purple-400 to-violet-500',
    bgColor: 'from-purple-50 to-violet-50',
    popular: true,
    features: [
      '10 patterns per day',
      'All Hobbyist features',
      'AI style suggestions',
      '3D preview exports',
      'Early access to features',
      'Creator badge'
    ]
  },
  {
    id: 'boss',
    name: 'Boss',
    price: 49.99,
    patternsPerDay: -1, // unlimited
    icon: Crown,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'from-amber-50 to-orange-50',
    features: [
      'Unlimited patterns',
      'All Influencer features',
      'Commercial use license',
      'Priority support',
      'Custom branding',
      'API access',
      'Boss badge'
    ]
  }
];

export default function SubscriptionTiers({ currentTier = 'free', onSelectTier }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiers.map((tier, index) => {
        const Icon = tier.icon;
        const isCurrentTier = currentTier === tier.id;
        
        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full border-2 border-black z-10">
                MOST POPULAR
              </div>
            )}
            
            <div className={`h-full p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br ${tier.bgColor} ${tier.popular ? 'ring-4 ring-purple-400' : ''}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} border-3 border-black flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-black">{tier.name}</h3>
              
              <div className="mt-2 mb-4">
                <span className="text-3xl font-black">${tier.price}</span>
                {tier.price > 0 && <span className="text-gray-500">/mo</span>}
              </div>
              
              <div className="text-sm font-bold text-gray-600 mb-4">
                {tier.patternsPerDay === -1 
                  ? '♾️ Unlimited patterns' 
                  : tier.patternsPerDay === 0 
                    ? '1 free pattern to try'
                    : `${tier.patternsPerDay} patterns/day`
                }
              </div>
              
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.popular ? 'text-purple-500' : 'text-green-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {isCurrentTier ? (
                <div className="w-full py-3 rounded-xl border-3 border-black bg-gray-200 text-center font-bold">
                  Current Plan
                </div>
              ) : (
                <GlowButton
                  onClick={() => onSelectTier?.(tier)}
                  variant={tier.popular ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {tier.price === 0 ? 'Get Started' : 'Upgrade'}
                </GlowButton>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}