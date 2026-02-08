import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Check, Crop, Move, Maximize2 } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';
import { base44 } from '@/api/base44Client';

export default function ImageRefiner({ originalImage, onRefinementComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [refinedImage, setRefinedImage] = useState(null);
  const [cropBox, setCropBox] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const imageContainerRef = useRef(null);
  const imgRef = useRef(null);
  const originalPreview = URL.createObjectURL(originalImage);

  useEffect(() => {
    // Initialize crop box to center 70% of image
    const initBox = () => {
      if (imageContainerRef.current && imgRef.current) {
        const container = imageContainerRef.current.getBoundingClientRect();
        const size = Math.min(container.width, container.height) * 0.7;
        setCropBox({
          x: (container.width - size) / 2,
          y: (container.height - size) / 2,
          width: size,
          height: size
        });
      }
    };
    setTimeout(initBox, 100);
  }, []);

  const handleMouseDown = (e, handle) => {
    e.stopPropagation();
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (cropBox && x >= cropBox.x && x <= cropBox.x + cropBox.width &&
          y >= cropBox.y && y <= cropBox.y + cropBox.height) {
        setIsDraggingBox(true);
        setResizeHandle({ startX: x - cropBox.x, startY: y - cropBox.y });
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current || !cropBox) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isResizing && resizeHandle) {
      const newBox = { ...cropBox };
      const minSize = 50;

      if (resizeHandle.includes('e')) {
        newBox.width = Math.max(minSize, x - cropBox.x);
      }
      if (resizeHandle.includes('s')) {
        newBox.height = Math.max(minSize, y - cropBox.y);
      }
      if (resizeHandle.includes('w')) {
        const newWidth = cropBox.width + (cropBox.x - x);
        if (newWidth >= minSize) {
          newBox.x = x;
          newBox.width = newWidth;
        }
      }
      if (resizeHandle.includes('n')) {
        const newHeight = cropBox.height + (cropBox.y - y);
        if (newHeight >= minSize) {
          newBox.y = y;
          newBox.height = newHeight;
        }
      }

      newBox.x = Math.max(0, Math.min(newBox.x, rect.width - newBox.width));
      newBox.y = Math.max(0, Math.min(newBox.y, rect.height - newBox.height));
      setCropBox(newBox);
    } else if (isDraggingBox) {
      const newX = x - resizeHandle.startX;
      const newY = y - resizeHandle.startY;
      setCropBox({
        ...cropBox,
        x: Math.max(0, Math.min(newX, rect.width - cropBox.width)),
        y: Math.max(0, Math.min(newY, rect.height - cropBox.height))
      });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setIsDraggingBox(false);
    setResizeHandle(null);
  };

  const handleRemoveBackground = async () => {
    if (!cropBox) return;
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imgRef.current;
      
      const containerRect = imageContainerRef.current.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      
      const cropX = (cropBox.x - (imgRect.left - containerRect.left)) * scaleX;
      const cropY = (cropBox.y - (imgRect.top - containerRect.top)) * scaleY;
      const cropWidth = cropBox.width * scaleX;
      const cropHeight = cropBox.height * scaleY;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      ctx.drawImage(
        img,
        Math.max(0, cropX),
        Math.max(0, cropY),
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      
      const croppedBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      });
      
      const croppedFile = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' });
      const { file_url: croppedUrl } = await base44.integrations.Core.UploadFile({ file: croppedFile });
      
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
              Select Your Clothing Item
            </h3>
            <p className="text-center text-gray-600 mb-4 flex items-center justify-center gap-2">
              <Crop className="w-4 h-4" />
              Drag the box to select the area • Resize from corners and edges
            </p>

            <div 
              ref={imageContainerRef}
              className="relative rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-900 mb-6 select-none"
              style={{ height: '500px' }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                ref={imgRef}
                src={originalPreview}
                alt="Select area"
                draggable={false}
                className="w-full h-full object-contain"
              />
              
              {/* Darkened overlay */}
              <div className="absolute inset-0 bg-black/60 pointer-events-none" />
              
              {/* Crop box */}
              {cropBox && (
                <div
                  className="absolute border-4 border-purple-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-auto"
                  style={{
                    left: cropBox.x,
                    top: cropBox.y,
                    width: cropBox.width,
                    height: cropBox.height,
                    cursor: isDraggingBox ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, null)}
                >
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-purple-500/80 p-2 rounded-lg border-2 border-white">
                      <Move className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Resize handles */}
                  {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((pos) => (
                    <div
                      key={pos}
                      onMouseDown={(e) => handleMouseDown(e, pos)}
                      className="absolute w-4 h-4 bg-purple-400 border-2 border-white rounded-full hover:scale-125 transition-transform cursor-pointer"
                      style={{
                        ...((pos.includes('n') && { top: -8 }) || (pos.includes('s') && { bottom: -8 })),
                        ...((pos.includes('w') && { left: -8 }) || (pos.includes('e') && { right: -8 })),
                        ...(!pos.includes('n') && !pos.includes('s') && { top: '50%', transform: 'translateY(-50%)' }),
                        ...(!pos.includes('w') && !pos.includes('e') && { left: '50%', transform: 'translateX(-50%)' })
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Maximize2 className="w-4 h-4 text-purple-500" />
                <span>Drag corners to resize</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <div className="flex items-center gap-1">
                <Move className="w-4 h-4 text-purple-500" />
                <span>Drag center to move</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GlowButton onClick={handleRemoveBackground} variant="primary" disabled={!cropBox}>
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