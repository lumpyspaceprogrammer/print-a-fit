import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Check, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import StepIndicator from '@/components/shared/StepIndicator';
import GlowButton from '@/components/shared/GlowButton';
import NeoCard from '@/components/shared/NeoCard';
import SparkleDecoration from '@/components/shared/SparkleDecoration';
import { createPageUrl } from '@/utils';

export default function RefinePage() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imageUrl = params.get('image');
    if (imageUrl) {
      setOriginalImage(imageUrl);
      processImage(imageUrl);
    }
  }, []);

  const processImage = async (imageUrl) => {
    setIsProcessing(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Remove the background from this clothing item image completely. Keep ONLY the clothing item itself with a pure transparent/white background. Maintain all details, colors, and textures of the garment. The result should be a clean cutout of just the clothing piece, ready for pattern-making reference.`,
        existing_image_urls: [imageUrl]
      });
      setProcessedImage(result.url);
    } catch (error) {
      console.error('Processing failed:', error);
    }
    setIsProcessing(false);
  };

  const handleRefine = () => {
    if (originalImage) {
      processImage(originalImage);
    }
  };

  const handleContinue = () => {
    const imageToUse = processedImage || originalImage;
    navigate(createPageUrl('Measurements') + `?image=${encodeURIComponent(imageToUse)}`);
  };

  const handleBack = () => {
    navigate(createPageUrl('Upload'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D0F4FF] via-[#E8D5FF] to-[#FFD6E8] p-4 md:p-8 relative overflow-hidden">
      <SparkleDecoration />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#9B5DE5] via-[#00F5D4] to-[#B8F83A] mb-2"
              style={{ WebkitTextStroke: '1px black' }}>
            ✨ Refine Your Image ✨
          </h1>
        </motion.div>

        <StepIndicator currentStep={2} />

        <NeoCard className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9B5DE5] to-[#00F5D4] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000]">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-black">AI Background Removal</h2>
              <p className="text-sm font-semibold text-[#9B5DE5]">Magic happening! ✨</p>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-square max-w-md mx-auto rounded-2xl border-4 border-black bg-gradient-to-br from-[#FFD6E8] to-[#E8D5FF] flex flex-col items-center justify-center shadow-[8px_8px_0_0_#000]"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="w-24 h-24 rounded-full border-8 border-[#9B5DE5] border-t-[#00F5D4] mb-4"
                  />
                  <motion.p
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-xl font-black text-[#9B5DE5]"
                  >
                    Removing background...
                  </motion.p>
                  <div className="flex gap-1 mt-2">
                    {['#FF6B9D', '#9B5DE5', '#00F5D4', '#FEE440'].map((color, i) => (
                      <motion.div
                        key={color}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  {/* Image comparison */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div className="relative">
                      <p className="text-center font-black text-[#9B5DE5] mb-2">Original</p>
                      <div className="rounded-2xl border-4 border-black overflow-hidden shadow-[6px_6px_0_0_#000] bg-white">
                        {originalImage && (
                          <img 
                            src={originalImage} 
                            alt="Original" 
                            className="w-full aspect-square object-contain"
                          />
                        )}
                      </div>
                    </div>

                    {/* Processed */}
                    <div className="relative">
                      <p className="text-center font-black text-[#00F5D4] mb-2">✨ Refined ✨</p>
                      <div className="rounded-2xl border-4 border-black overflow-hidden shadow-[6px_6px_0_0_#000] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E')]">
                        {processedImage ? (
                          <img 
                            src={processedImage} 
                            alt="Processed" 
                            className="w-full aspect-square object-contain"
                          />
                        ) : (
                          <div className="w-full aspect-square flex items-center justify-center">
                            <p className="font-bold text-gray-400">Processing...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
            >
              <GlowButton onClick={handleBack} variant="secondary">
                <ArrowLeft className="w-5 h-5" />
                Back
              </GlowButton>
              
              <GlowButton onClick={handleRefine} variant="secondary">
                <RefreshCw className="w-5 h-5" />
                Refine Again
              </GlowButton>
              
              <GlowButton onClick={handleContinue}>
                <Check className="w-5 h-5" />
                Accept & Continue
                <ArrowRight className="w-5 h-5" />
              </GlowButton>
            </motion.div>
          )}
        </NeoCard>
      </div>
    </div>
  );
}