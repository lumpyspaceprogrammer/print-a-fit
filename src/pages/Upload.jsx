import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import ProgressSteps from '../components/ui/ProgressSteps';
import ImageUploader from '../components/upload/ImageUploader';
import { createPageUrl } from '@/utils';

export default function Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageSelect = async (file) => {
    setIsUploading(true);
    try {
      // Upload the image
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Create a new project
      const project = await base44.entities.Project.create({
        original_image_url: file_url,
        status: 'uploaded'
      });
      
      // Navigate to refine page with project ID
      navigate(createPageUrl('Refine') + `?projectId=${project.id}`);
    } catch (error) {
      console.error('Error uploading:', error);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
            ✨ Print Your Fit ✨
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            Transform any clothing photo into a custom sewing pattern
          </p>
        </motion.div>

        <ProgressSteps currentStep={1} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-6 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              <p className="mt-4 text-xl font-bold text-purple-600">Uploading your fit...</p>
            </div>
          ) : (
            <ImageUploader onImageSelect={handleImageSelect} />
          )}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/30 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}