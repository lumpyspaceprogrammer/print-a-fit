import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, RefreshCw, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import GlowCard from '../ui/GlowCard';
import { Button } from '@/components/ui/button';

export default function AISuggestions({ userProjects, browsingHistory, sharedProjects }) {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateSuggestions();
  }, []);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      // Analyze user's patterns
      const userClothingTypes = userProjects?.map(p => p.clothing_type).filter(Boolean) || [];
      const userStyles = userProjects?.map(p => p.style_modifier).filter(Boolean) || [];
      const userFabrics = userProjects?.map(p => p.fabric_type).filter(Boolean) || [];

      // Get popular items from community
      const popularTypes = {};
      const popularStyles = {};
      sharedProjects?.forEach(p => {
        if (p.clothing_type) popularTypes[p.clothing_type] = (popularTypes[p.clothing_type] || 0) + (p.likes_count || 1);
        if (p.style_modifier) popularStyles[p.style_modifier] = (popularStyles[p.style_modifier] || 0) + (p.likes_count || 1);
      });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a fashion AI assistant for a sewing pattern app. Based on the user's history and community trends, suggest patterns they might like.

USER'S COMPLETED PROJECTS:
- Clothing types: ${userClothingTypes.join(', ') || 'None yet'}
- Styles used: ${userStyles.join(', ') || 'None yet'}
- Fabrics used: ${userFabrics.join(', ') || 'None yet'}

COMMUNITY TRENDS:
- Popular clothing types: ${Object.entries(popularTypes).sort((a,b) => b[1] - a[1]).slice(0,3).map(([k]) => k).join(', ') || 'Various'}
- Trending styles: ${Object.entries(popularStyles).sort((a,b) => b[1] - a[1]).slice(0,3).map(([k]) => k).join(', ') || 'Various'}

Generate personalized suggestions including:
1. A "try next" pattern recommendation
2. A style they haven't explored yet
3. A trending item from the community
4. A skill-building challenge

Be encouraging, specific, and creative!`,
        response_json_schema: {
          type: "object",
          properties: {
            try_next: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                clothing_type: { type: "string" },
                style: { type: "string" }
              }
            },
            explore_style: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                style: { type: "string" },
                why: { type: "string" }
              }
            },
            trending: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                clothing_type: { type: "string" }
              }
            },
            challenge: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                skill: { type: "string" }
              }
            },
            personalized_message: { type: "string" }
          }
        }
      });

      setSuggestions(result);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <GlowCard glowColor="rainbow" className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Wand2 className="w-10 h-10 text-purple-500" />
          </motion.div>
          <p className="mt-3 text-gray-600 font-medium">AI is analyzing your style...</p>
        </div>
      </GlowCard>
    );
  }

  if (!suggestions) return null;

  const suggestionCards = [
    {
      key: 'try_next',
      data: suggestions.try_next,
      emoji: '🎯',
      gradient: 'from-pink-400 to-rose-400',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      key: 'explore_style',
      data: suggestions.explore_style,
      emoji: '✨',
      gradient: 'from-purple-400 to-violet-400',
      bgGradient: 'from-purple-50 to-violet-50'
    },
    {
      key: 'trending',
      data: suggestions.trending,
      emoji: '🔥',
      gradient: 'from-orange-400 to-red-400',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      key: 'challenge',
      data: suggestions.challenge,
      emoji: '💪',
      gradient: 'from-cyan-400 to-blue-400',
      bgGradient: 'from-cyan-50 to-blue-50'
    }
  ];

  return (
    <GlowCard glowColor="pink" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            AI Suggestions For You
          </span>
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={generateSuggestions}
          className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {suggestions.personalized_message && (
        <p className="text-sm text-gray-600 mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-black">
          💬 {suggestions.personalized_message}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {suggestionCards.map((card, index) => card.data && (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border-3 border-black bg-gradient-to-br ${card.bgGradient} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer`}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${card.gradient} border-2 border-black flex items-center justify-center text-xl mb-3`}>
              {card.emoji}
            </div>
            <h4 className="font-bold text-sm mb-1 line-clamp-1">{card.data.title}</h4>
            <p className="text-xs text-gray-600 line-clamp-2">{card.data.description}</p>
            {card.data.style && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-white rounded-full border border-black text-xs font-bold">
                {card.data.style}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </GlowCard>
  );
}