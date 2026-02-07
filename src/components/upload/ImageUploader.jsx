import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, Sparkles } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';
import { cn } from "@/lib/utils";

export default function ImageUploader({ onImageSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleContinue = () => {
    if (selectedFile) {
      onImageSelect(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlowCard glowColor="rainbow" className="p-8">
              <div
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "relative border-4 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300",
                  "flex flex-col items-center justify-center gap-4 min-h-[300px]",
                  isDragging 
                    ? "border-purple-500 bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100" 
                    : "border-gray-300 hover:border-pink-400 bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-cyan-50/50"
                )}
              >
                <motion.div
                  animate={{ 
                    y: isDragging ? -10 : 0,
                    scale: isDragging ? 1.1 : 1
                  }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Upload className="w-12 h-12 text-white" />
                </motion.div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    Drop your fit here!
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Drag & drop or tap to upload a photo of clothing
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full border-2 border-black">
                    <Image className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-medium">JPG, PNG</span>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <GlowCard glowColor="cyan" className="p-6">
              <div className="relative">
                <button
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 z-10 p-2 bg-red-500 rounded-full border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="rounded-xl overflow-hidden border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[400px] object-contain bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <GlowButton onClick={handleContinue} variant="success">
                  <Sparkles className="w-5 h-5 mr-2 inline" />
                  Continue to Refine
                </GlowButton>
              </div>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}