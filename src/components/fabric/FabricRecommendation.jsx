import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ExternalLink, Info } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { base44 } from '@/api/base44Client';
import FabricStoreLinks from './FabricStoreLinks';

export default function FabricRecommendation({ clothingType, measurements, styleModifier, project }) {
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFabric, setSelectedFabric] = useState(null);

  useEffect(() => {
    generateRecommendations();
  }, [clothingType, measurements]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      const prompt = `
You are an expert fabric consultant and pattern maker. Analyze the following garment specifications and recommend suitable fabrics.

Garment Type: ${clothingType}
Style: ${styleModifier || 'standard'}
Measurements: ${JSON.stringify(measurements)}

Provide 4-5 fabric recommendations, considering:
- Drape characteristics (how fabric hangs and flows)
- Weight (lightweight, medium, heavyweight)
- Stretch properties (no stretch, 2-way, 4-way)
- Suitability for the garment type
- Ease of sewing for different skill levels

For each fabric, provide:
1. Fabric name and common types
2. Drape characteristics (scale 1-5: 1=stiff, 5=very drapey)
3. Weight category
4. Stretch properties
5. Why it's suitable for this garment
6. Skill level required (beginner/intermediate/advanced)
7. Care instructions
8. Approximate yardage needed based on measurements

Format as JSON with this schema.
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  common_types: { type: "array", items: { type: "string" } },
                  drape_rating: { type: "number" },
                  weight: { type: "string" },
                  stretch: { type: "string" },
                  suitability: { type: "string" },
                  skill_level: { type: "string" },
                  care: { type: "string" },
                  yardage: { type: "string" },
                  search_terms: { type: "array", items: { type: "string" } }
                }
              }
            },
            general_tips: { type: "array", items: { type: "string" } }
          }
        }
      });

      setRecommendations(response);
    } catch (error) {
      console.error('Error generating fabric recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDrapeStars = (rating) => {
    return '⭐'.repeat(Math.min(5, Math.max(1, Math.round(rating))));
  };

  const getWeightColor = (weight) => {
    const colors = {
      'lightweight': 'bg-blue-100 text-blue-800 border-blue-300',
      'medium': 'bg-purple-100 text-purple-800 border-purple-300',
      'heavyweight': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[weight.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getSkillColor = (skill) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colors[skill.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <GlowCard glowColor="rainbow" className="p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Sparkles className="w-12 h-12 text-purple-500" />
          </motion.div>
          <p className="text-lg font-bold text-gray-700">Analyzing fabric options...</p>
          <p className="text-sm text-gray-500 mt-2">Finding perfect fabrics for your project</p>
        </div>
      </GlowCard>
    );
  }

  return (
    <div className="space-y-6">
      <GlowCard glowColor="rainbow" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-3 border-black">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              AI Fabric Recommendations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expertly matched fabrics for your {clothingType}
            </p>
          </div>
        </div>

        {/* General Tips */}
        {recommendations?.general_tips && recommendations.general_tips.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border-2 border-cyan-200 dark:border-cyan-700">
            <h3 className="font-bold text-sm text-cyan-800 dark:text-cyan-300 mb-2">💡 Pro Tips</h3>
            <ul className="space-y-1">
              {recommendations.general_tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fabric Recommendations */}
        <div className="grid gap-4">
          {recommendations?.recommendations?.map((fabric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border-3 transition-all ${
                selectedFabric === i
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)]'
                  : 'border-black dark:border-white bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {fabric.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {fabric.common_types?.slice(0, 3).map((type, j) => (
                      <Badge key={j} variant="outline" className="text-xs border-2 border-black dark:border-white">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedFabric(selectedFabric === i ? null : i)}
                  variant={selectedFabric === i ? "default" : "outline"}
                  size="sm"
                  className="border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                >
                  {selectedFabric === i ? 'Selected ✓' : 'Select'}
                </Button>
              </div>

              {/* Properties */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Drape</span>
                        <span className="text-sm">{getDrapeStars(fabric.drape_rating)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>1=Stiff, 5=Very Drapey</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">Weight</span>
                  <Badge className={`text-xs mt-1 ${getWeightColor(fabric.weight)} border-2`}>
                    {fabric.weight}
                  </Badge>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">Stretch</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{fabric.stretch}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">Skill Level</span>
                  <Badge className={`text-xs mt-1 ${getSkillColor(fabric.skill_level)}`}>
                    {fabric.skill_level}
                  </Badge>
                </div>
              </div>

              {/* Suitability */}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-bold">Why it works:</span> {fabric.suitability}
              </p>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-bold">Yardage:</span> {fabric.yardage}
                </div>
                <div>
                  <span className="font-bold">Care:</span> {fabric.care}
                </div>
              </div>

              {/* Store Links */}
              {selectedFabric === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700"
                >
                  <FabricStoreLinks searchTerms={fabric.search_terms || [fabric.name]} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={generateRecommendations}
            variant="outline"
            className="border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get More Suggestions
          </Button>
        </div>
      </GlowCard>
    </div>
  );
}