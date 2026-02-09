import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowCard from '../components/ui/GlowCard';
import GlowButton from '../components/ui/GlowButton';
import ProgressSteps from '../components/ui/ProgressSteps';
import MobileSelect from '../components/ui/MobileSelect';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const clothingTypes = [
  { value: 'top', label: '👕 Top / Shirt / Blouse' },
  { value: 'bottom', label: '👖 Pants / Shorts / Skirt' },
  { value: 'dress', label: '👗 Dress' },
  { value: 'outerwear', label: '🧥 Jacket / Coat / Hoodie' },
  { value: 'jumpsuit', label: '🩱 Jumpsuit / Romper' }
];

const stylePreferences = [
  { value: 'classic', label: 'Classic & Timeless' },
  { value: 'vintage', label: 'Vintage & Retro' },
  { value: 'modern', label: 'Modern & Minimal' },
  { value: 'oversized', label: 'Oversized & Relaxed' },
  { value: 'fitted', label: 'Fitted & Tailored' },
  { value: 'bohemian', label: 'Bohemian & Flowy' }
];

export default function AIPatternGenerator() {
  const [description, setDescription] = useState('');
  const [clothingType, setClothingType] = useState('');
  const [stylePreference, setStylePreference] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!description || !clothingType) return;

    setIsGenerating(true);

    try {
      const user = await base44.auth.me();
      
      // Check subscription
      const subscriptions = await base44.entities.UserSubscription.filter({ created_by: user.email });
      let subscription = subscriptions[0];

      if (!subscription) {
        subscription = await base44.entities.UserSubscription.create({
          tier: 'free',
          patterns_used_today: 0,
          total_patterns_created: 0
        });
      }

      // Generate pattern using AI
      const patternData = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a detailed sewing pattern outline based on this description:

Garment Description: ${description}
Clothing Type: ${clothingType}
Style Preference: ${stylePreference || 'versatile'}

Generate a comprehensive pattern that includes:
1. Suggested measurements for a medium adult size (in inches)
2. Seam allowances (typically 5/8" for woven, 1/4" for knits)
3. Recommended fabric type and yardage
4. Key construction steps
5. Difficulty level (beginner/intermediate/advanced)
6. Estimated time to complete
7. Special techniques or considerations

Make it practical and detailed for someone to actually sew this garment.`,
        response_json_schema: {
          type: "object",
          properties: {
            garment_title: { type: "string" },
            measurements: {
              type: "object",
              properties: {
                bust_chest: { type: "string" },
                waist: { type: "string" },
                hips: { type: "string" },
                length: { type: "string" },
                sleeve_length: { type: "string" },
                shoulder_width: { type: "string" }
              }
            },
            seam_allowances: { type: "string" },
            fabric_recommendations: {
              type: "object",
              properties: {
                type: { type: "string" },
                yardage: { type: "string" },
                notes: { type: "string" }
              }
            },
            construction_steps: {
              type: "array",
              items: { type: "string" }
            },
            difficulty_level: { type: "string" },
            estimated_time: { type: "string" },
            special_techniques: {
              type: "array",
              items: { type: "string" }
            },
            styling_tips: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Create project with AI-generated data
      const project = await base44.entities.Project.create({
        clothing_type: clothingType,
        status: 'completed',
        measurements: patternData.measurements,
        pattern_data: {
          ...patternData,
          generated_from_description: description,
          style_preference: stylePreference
        }
      });

      // Update subscription
      await base44.entities.UserSubscription.update(subscription.id, {
        patterns_used_today: (subscription.patterns_used_today || 0) + 1,
        total_patterns_created: (subscription.total_patterns_created || 0) + 1,
        last_pattern_date: new Date().toISOString().split('T')[0]
      });

      navigate(createPageUrl('Pattern') + `?projectId=${project.id}`);
    } catch (error) {
      console.error('Error generating pattern:', error);
      alert('Failed to generate pattern. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pb-20 md:pb-8">
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
            ✨ AI Pattern Generator ✨
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2 font-medium">
            Describe your dream garment and let AI create the pattern
          </p>
        </motion.div>

        <ProgressSteps currentStep={1} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-3xl mx-auto"
        >
          <GlowCard glowColor="rainbow" className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Describe Your Garment
              </h2>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  What do you want to create? *
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: A flowy summer dress with flutter sleeves, a v-neck, and a midi-length skirt with pockets..."
                  className="min-h-32 border-3 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-base resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Be as detailed as possible - mention colors, details, length, fit, and any special features you want.
                </p>
              </div>

              {/* Clothing Type */}
              <div>
                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  Clothing Type *
                </Label>
                <MobileSelect
                  value={clothingType}
                  onValueChange={setClothingType}
                  options={clothingTypes}
                  placeholder="Select clothing type..."
                  label="Choose Clothing Type"
                />
              </div>

              {/* Style Preference */}
              <div>
                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  Style Preference (Optional)
                </Label>
                <MobileSelect
                  value={stylePreference}
                  onValueChange={setStylePreference}
                  options={stylePreferences}
                  placeholder="Select style preference..."
                  label="Choose Style"
                />
              </div>

              {/* Info box */}
              <div className="p-4 rounded-xl border-3 border-black dark:border-white bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-gray-700 dark:to-purple-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-purple-600 dark:text-purple-400 mb-1">AI Magic ✨</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Our AI will analyze your description and generate suggested measurements, 
                      fabric recommendations, construction steps, and seam allowances tailored to your vision.
                    </p>
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <div className="flex justify-center pt-4">
                <GlowButton
                  onClick={handleGenerate}
                  disabled={!description || !clothingType || isGenerating}
                  variant="success"
                  className={(!description || !clothingType || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Pattern...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate My Pattern
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </GlowButton>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-pink-400/30 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}