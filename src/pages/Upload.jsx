import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, ImagePlus, X, ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import StepIndicator from '@/components/shared/StepIndicator';
import GlowButton from '@/components/shared/GlowButton';
import NeoCard from '@/components/shared/NeoCard';
import SparkleDecoration from '@/components/shared/SparkleDecoration';
import { createPageUrl } from '@/utils';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      processFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleContinue = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      navigate(createPageUrl('Refine') + `?image=${encodeURIComponent(file_url)}`);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8D5FF] via-[#FFD6E8] to-[#D0F4FF] p-4 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <SparkleDecoration />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] via-[#9B5DE5] to-[#00F5D4] mb-2 drop-shadow-lg"
              style={{ WebkitTextStroke: '1px black' }}>
            Print Your Fit ✨
          </h1>
          <p className="text-lg font-bold text-[#9B5DE5]">Turn any outfit into a sewing pattern!</p>
        </motion.div>

        <StepIndicator currentStep={1} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <NeoCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000]">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black">Upload Your Fit</h2>
                <p className="text-sm font-semibold text-[#9B5DE5]">Drop a pic of your fave clothing item</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`
                    relative border-4 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300 cursor-pointer
                    ${isDragging 
                      ? 'border-[#00F5D4] bg-[#00F5D4]/20 scale-[1.02]' 
                      : 'border-[#9B5DE5] bg-white/50 hover:bg-[#FFD6E8]/50'}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: isDragging ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ 
                        y: { repeat: Infinity, duration: 2 },
                        rotate: { repeat: Infinity, duration: 0.5 }
                      }}
                      className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FEE440] via-[#FF6B9D] to-[#9B5DE5] border-4 border-black flex items-center justify-center shadow-[6px_6px_0_0_#000]"
                    >
                      <ImagePlus className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    <p className="text-xl font-black text-black mb-2">
                      {isDragging ? '✨ Drop it like it\'s hot! ✨' : 'Drag & Drop or Click'}
                    </p>
                    <p className="text-sm font-semibold text-[#9B5DE5]">
                      PNG, JPG up to 10MB
                    </p>
                  </div>

                  {/* Decorative corners */}
                  <Star className="absolute top-4 left-4 w-6 h-6 text-[#FEE440] fill-[#FEE440]" />
                  <Star className="absolute top-4 right-4 w-6 h-6 text-[#FF6B9D] fill-[#FF6B9D]" />
                  <Star className="absolute bottom-4 left-4 w-6 h-6 text-[#00F5D4] fill-[#00F5D4]" />
                  <Star className="absolute bottom-4 right-4 w-6 h-6 text-[#9B5DE5] fill-[#9B5DE5]" />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  <div className="relative rounded-2xl border-4 border-black overflow-hidden shadow-[8px_8px_0_0_#000] bg-white">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full max-h-[400px] object-contain"
                    />
                    <button
                      onClick={clearFile}
                      className="absolute top-3 right-3 w-10 h-10 bg-[#FF6B9D] border-3 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#000] transition-all"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  <p className="mt-4 text-center font-bold text-[#9B5DE5] flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {file?.name}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-center"
              >
                <GlowButton 
                  onClick={handleContinue} 
                  disabled={isUploading}
                  className="min-w-[200px]"
                >
                  {isUploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </GlowButton>
              </motion.div>
            )}
          </NeoCard>
        </motion.div>
      </div>
    </div>
  );
}