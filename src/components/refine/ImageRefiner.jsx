import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Check, Crop, ZoomIn, ZoomOut } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';
import { base44 } from '@/api/base44Client';

export default function ImageRefiner({ originalImage, onRefinementComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [refinedImage, setRefinedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const originalPreview = URL.createObjectURL(originalImage);

  const handleRemoveBackground = async () => {
    setIsProcessing(true);
    try {
      // Create cropped version
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = originalPreview;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const containerWidth = imageContainerRef.current?.offsetWidth || 400;
      const containerHeight = imageContainerRef.current?.offsetHeight || 400;
      
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      
      ctx.drawImage(
        img,
        position.x,
        position.y,
        img.width * zoom,
        img.height * zoom
      );
      
      const croppedBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      });
      
      const croppedFile = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' });
      const { file_url: croppedUrl } = await base44.integrations.Core.UploadFile({ file: croppedFile });
      setCroppedImage(croppedUrl);
      
      // Use AI to analyze and remove background
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this clothing image and describe the main clothing item in detail. 
        Describe: the type of clothing, its colors, patterns, shape, and distinctive features.`,
        file_urls: [croppedUrl],
        response_json_schema: {
          type: "object",
          properties: {
            clothing_type: { type: "string" },
            colors: { type: "array", items: { type: "string" } },
            description: { type: "string" }
          }
        }
      });

      // Generate clean version with transparent background
      const cleanImage = await base44.integrations.Core.GenerateImage({
        prompt: `Create a clean, isolated product photo of a ${result.clothing_type}: ${result.description}. 
        Colors: ${result.colors?.join(', ')}. 
        White/transparent background, centered, professional product photography, detailed fabric texture, flat lay style.`,
        existing_image_urls: [croppedUrl]
      });

      setRefinedImage(cleanImage.url);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <GlowCard glowColor="cyan" className="p-6">
        {refinedImage ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              ✨ Background Removed ✨
            </h3>
            
            <div className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 mb-6">
              <img src={refinedImage} alt="Refined" className="w-full h-96 object-contain" />
            </div>

            <div className="flex justify-center gap-4">
              <GlowButton onClick={() => setRefinedImage(null)} variant="secondary">
                Try Again
              </GlowButton>
              <GlowButton onClick={() => onRefinementComplete(refinedImage)} variant="success">
                <Check className="w-5 h-5 mr-2 inline" />
                Next Step
              </GlowButton>
            </div>
          </motion.div>
        ) : isProcessing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12 gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Wand2 className="w-12 h-12 text-white" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                ✨ Removing Background ✨
              </h3>
              <p className="text-gray-600 mt-2">AI is isolating your clothing item...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Crop & Focus on Your Item
            </h3>
            <p className="text-center text-gray-600 mb-6 flex items-center justify-center gap-2">
              <Crop className="w-4 h-4" />
              Zoom and position the image to focus on your clothing
            </p>

            <div 
              ref={imageContainerRef}
              className="relative rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white mb-6"
              style={{ height: '400px', cursor: isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={originalPreview}
                alt="Adjust"
                draggable={false}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: '0 0',
                  transition: isDragging ? 'none' : 'transform 0.1s',
                  userSelect: 'none'
                }}
                className="absolute"
              />
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-3 bg-white border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="font-bold text-gray-700">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                className="p-3 bg-white border-3 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center">
              <GlowButton onClick={handleRemoveBackground} variant="primary">
                <Wand2 className="w-5 h-5 mr-2 inline" />
                Remove Background
              </GlowButton>
            </div>
          </motion.div>
        )}
      </GlowCard>
    </div>
  );
}