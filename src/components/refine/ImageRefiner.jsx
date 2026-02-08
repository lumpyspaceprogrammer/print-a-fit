import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, RotateCcw, Check, Loader2, Sparkles } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';
import CircleSelector from './CircleSelector';
import { base44 } from '@/api/base44Client';

export default function ImageRefiner({ originalImage, onRefinementComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [refinedImage, setRefinedImage] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectionCircle, setSelectionCircle] = useState(null);
  const [showCircleSelector, setShowCircleSelector] = useState(true);

  const handleCircleSelection = (circle) => {
    setSelectionCircle(circle);
    setShowCircleSelector(false);
    removeBackground(circle);
  };

  const removeBackground = async (circle) => {
    setIsProcessing(true);
    try {
      // Upload original image first
      const { file_url: originalUrl } = await base44.integrations.Core.UploadFile({ file: originalImage });
      
      const circleInfo = circle 
        ? `Focus on the area within a circle centered at coordinates (${Math.round(circle.x)}, ${Math.round(circle.y)}) with radius ${Math.round(circle.radius)} pixels. This circle indicates the main clothing item to isolate.`
        : '';
      
      // Use AI to generate background-removed version
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this clothing image and describe it in detail for background removal purposes. 
        ${circleInfo}
        Describe: the type of clothing, its colors, patterns, shape, and any distinctive features within the selection area.
        This will help create a clean cutout of just the clothing item.`,
        file_urls: [originalUrl],
        response_json_schema: {
          type: "object",
          properties: {
            clothing_type: { type: "string" },
            colors: { type: "array", items: { type: "string" } },
            description: { type: "string" },
            distinctive_features: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Generate a clean version with transparent background concept
      const cleanImage = await base44.integrations.Core.GenerateImage({
        prompt: `Create a clean, isolated image of a ${result.clothing_type} with these details: ${result.description}. 
        Colors: ${result.colors?.join(', ')}. 
        Features: ${result.distinctive_features?.join(', ')}.
        Style: Product photography, white/transparent background, centered, high quality, detailed fabric texture.
        The clothing should be displayed flat lay style, professional product shot.`,
        existing_image_urls: [originalUrl]
      });

      setRefinedImage(cleanImage.url);
      setShowComparison(true);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccept = () => {
    onRefinementComplete(refinedImage);
  };

  const handleRetry = () => {
    setRefinedImage(null);
    setShowComparison(false);
    setShowCircleSelector(true);
    setSelectionCircle(null);
  };

  const originalPreview = URL.createObjectURL(originalImage);

  if (showCircleSelector) {
    return <CircleSelector image={originalImage} onSelectionComplete={handleCircleSelection} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <GlowCard glowColor="pink" className="p-6">
        {isProcessing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Wand2 className="w-12 h-12 text-white" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                ✨ Magic in Progress ✨
              </h3>
              <p className="text-gray-600 mt-2">Removing background & enhancing your fit...</p>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                />
              ))}
            </div>
          </motion.div>
        ) : showComparison ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Before & After ✨
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-2 text-center">ORIGINAL</p>
                <div className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-100">
                  <img 
                    src={originalPreview} 
                    alt="Original" 
                    className="w-full h-64 object-contain"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-purple-500 mb-2 text-center">✨ REFINED ✨</p>
                <div className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100">
                  <img 
                    src={refinedImage} 
                    alt="Refined" 
                    className="w-full h-64 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <GlowButton onClick={handleRetry} variant="secondary">
                <RotateCcw className="w-5 h-5 mr-2 inline" />
                Try Again
              </GlowButton>
              <GlowButton onClick={handleAccept} variant="success">
                <Check className="w-5 h-5 mr-2 inline" />
                Accept & Continue
              </GlowButton>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="mt-4 text-gray-600">Initializing...</p>
          </div>
        )}
      </GlowCard>
    </div>
  );
}