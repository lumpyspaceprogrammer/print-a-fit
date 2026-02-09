import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Shirt, Wand2, Loader2 } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import { base44 } from '@/api/base44Client';

export default function InspirationPanel({ imageUrl }) {
  const [isLoading, setIsLoading] = useState(true);
  const [inspiration, setInspiration] = useState(null);

  useEffect(() => {
    if (imageUrl) {
      generateInspiration();
    }
  }, [imageUrl]);

  const generateInspiration = async () => {
    setIsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this clothing image and provide style inspiration for someone wanting to recreate or complement this garment. Provide:
        1. A list of 4-5 complementary colors (with hex codes) that would pair well with this garment
        2. 3 recommended fabric types that would work for this style
        3. 3 style modifier suggestions (e.g., vintage, modern, oversized, fitted, minimalist, etc.)
        4. A brief aesthetic description of the garment's vibe
        5. 2-3 styling tips for wearing this piece`,
        file_urls: [imageUrl],
        response_json_schema: {
          type: "object",
          properties: {
            aesthetic_description: { type: "string" },
            complementary_colors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hex: { type: "string" }
                }
              }
            },
            recommended_fabrics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            style_modifiers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            styling_tips: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setInspiration(result);
    } catch (error) {
      console.error('Error generating inspiration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <GlowCard glowColor="rainbow" className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            <Wand2 className="w-12 h-12 text-white" />
          </motion.div>
          <p className="mt-4 text-lg font-bold text-purple-600 dark:text-purple-400">
            AI is analyzing your garment...
          </p>
        </div>
      </GlowCard>
    );
  }

  if (!inspiration) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Aesthetic Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlowCard glowColor="purple" className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Style Vibe
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {inspiration.aesthetic_description}
          </p>
        </GlowCard>
      </motion.div>

      {/* Complementary Colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlowCard glowColor="pink" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold dark:text-white">Complementary Colors</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {inspiration.complementary_colors?.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border-3 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
              >
                <div
                  className="w-16 h-16 rounded-full border-3 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-center">
                  <p className="font-bold text-sm dark:text-white">{color.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{color.hex}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </motion.div>

      {/* Recommended Fabrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlowCard glowColor="cyan" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg font-bold dark:text-white">Recommended Fabrics</h3>
          </div>
          <div className="space-y-3">
            {inspiration.recommended_fabrics?.map((fabric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="p-4 rounded-xl border-3 border-black dark:border-white bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
              >
                <p className="font-bold text-cyan-600 dark:text-cyan-400">{fabric.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{fabric.description}</p>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </motion.div>

      {/* Style Modifiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlowCard glowColor="rainbow" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold dark:text-white">Style Suggestions</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {inspiration.style_modifiers?.map((style, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="p-4 rounded-xl border-3 border-black dark:border-white bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
              >
                <p className="font-bold text-purple-600 dark:text-purple-400 mb-1">{style.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{style.description}</p>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </motion.div>

      {/* Styling Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlowCard glowColor="pink" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold dark:text-white">Styling Tips</h3>
          </div>
          <ul className="space-y-2">
            {inspiration.styling_tips?.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
              >
                <span className="text-pink-500 font-bold">•</span>
                <span>{tip}</span>
              </motion.li>
            ))}
          </ul>
        </GlowCard>
      </motion.div>
    </div>
  );
}