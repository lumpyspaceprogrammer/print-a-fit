import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, Sparkles, Scissors, Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import GlowCard from '../ui/GlowCard';

const fabricTypes = [
  { value: 'woven', label: '🧵 Woven (Cotton, Linen)', description: 'Standard seam allowances, press seams open' },
  { value: 'knit', label: '🧶 Knit (Jersey, Interlock)', description: 'Use stretch stitches, narrower seam allowances' },
  { value: 'stretch', label: '💫 Stretchy (Spandex, Lycra)', description: 'Use ballpoint needles, stretch-specific techniques' },
  { value: 'denim', label: '👖 Denim/Heavy', description: 'Wider seam allowances, topstitching recommended' },
  { value: 'silk', label: '✨ Delicate (Silk, Chiffon)', description: 'French seams, careful handling required' },
  { value: 'leather', label: '🖤 Leather/Faux Leather', description: 'No pinning, use clips, special needles' },
];

const styleModifiers = [
  { value: 'classic', label: 'Classic', emoji: '👔', color: 'from-gray-400 to-gray-500' },
  { value: 'vintage', label: 'Vintage', emoji: '🎀', color: 'from-rose-400 to-pink-500' },
  { value: 'modern', label: 'Modern', emoji: '⚡', color: 'from-cyan-400 to-blue-500' },
  { value: 'oversized', label: 'Oversized', emoji: '🧸', color: 'from-purple-400 to-violet-500' },
  { value: 'fitted', label: 'Fitted', emoji: '💃', color: 'from-pink-400 to-rose-500' },
  { value: 'minimalist', label: 'Minimalist', emoji: '◻️', color: 'from-slate-400 to-gray-500' },
];

const seamFinishes = [
  { value: 'serged', label: 'Serged/Overlocked', description: 'Professional finish, prevents fraying' },
  { value: 'french', label: 'French Seams', description: 'Enclosed seams, elegant for sheer fabrics' },
  { value: 'bias', label: 'Bias Binding', description: 'Decorative finish, great for curves' },
  { value: 'zigzag', label: 'Zigzag Stitch', description: 'Simple finish, good for beginners' },
  { value: 'hong_kong', label: 'Hong Kong Finish', description: 'Couture technique, very neat' },
  { value: 'flat_felled', label: 'Flat Felled', description: 'Strong, visible topstitching, great for denim' },
];

export default function PatternCustomizer({ options, onOptionsChange }) {
  const handleChange = (key, value) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <GlowCard glowColor="rainbow" className="p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          Customize Your Pattern
        </span>
      </h3>

      <div className="space-y-6">
        {/* Fabric Type */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Shirt className="w-4 h-4 text-pink-500" />
            Fabric Type
          </Label>
          <Select value={options.fabricType} onValueChange={(v) => handleChange('fabricType', v)}>
            <SelectTrigger className="border-3 border-black rounded-xl h-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <SelectValue placeholder="Select fabric type..." />
            </SelectTrigger>
            <SelectContent className="border-3 border-black">
              {fabricTypes.map(fabric => (
                <SelectItem key={fabric.value} value={fabric.value} className="py-3">
                  <div>
                    <p className="font-bold">{fabric.label}</p>
                    <p className="text-xs text-gray-500">{fabric.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Style Modifier */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-500" />
            Style Modifier
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {styleModifiers.map(style => (
              <button
                key={style.value}
                onClick={() => handleChange('styleModifier', style.value)}
                className={`
                  p-3 rounded-xl border-3 border-black transition-all duration-200
                  ${options.styleModifier === style.value
                    ? `bg-gradient-to-br ${style.color} text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105`
                    : 'bg-white hover:bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  }
                `}
              >
                <span className="text-2xl block mb-1">{style.emoji}</span>
                <span className="text-xs font-bold">{style.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Seam Finishing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-cyan-500" />
            Seam Finishing Technique
          </Label>
          <RadioGroup
            value={options.seamFinish}
            onValueChange={(v) => handleChange('seamFinish', v)}
            className="space-y-2"
          >
            {seamFinishes.map(finish => (
              <div
                key={finish.value}
                className={`
                  flex items-center p-3 rounded-xl border-3 border-black cursor-pointer transition-all
                  ${options.seamFinish === finish.value
                    ? 'bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }
                `}
                onClick={() => handleChange('seamFinish', finish.value)}
              >
                <RadioGroupItem value={finish.value} id={finish.value} className="mr-3" />
                <div className="flex-1">
                  <label htmlFor={finish.value} className="font-bold cursor-pointer">
                    {finish.label}
                  </label>
                  <p className="text-xs text-gray-500">{finish.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </motion.div>
      </div>
    </GlowCard>
  );
}

export { fabricTypes, styleModifiers, seamFinishes };