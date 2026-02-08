import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import ProgressSteps from '../components/ui/ProgressSteps';
import ImageRefiner from '../components/refine/ImageRefiner';
import { createPageUrl } from '@/utils';
import { Loader2 } from 'lucide-react';

export default function Refine() {
  const [project, setProject] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) {
      base44.auth.redirectToLogin(createPageUrl('Refine'));
      return;
    }
    loadProject();
  };

  const loadProject = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    
    if (!projectId) {
      navigate(createPageUrl('Upload'));
      return;
    }

    try {
      // List all projects and find the one with matching ID
      const projects = await base44.entities.Project.list();
      const foundProject = projects.find(p => p.id === projectId);
      
      if (foundProject && foundProject.original_image_url) {
        setProject(foundProject);
        
        // Fetch the original image as a file
        const response = await fetch(foundProject.original_image_url);
        const blob = await response.blob();
        const file = new File([blob], 'original.jpg', { type: blob.type });
        setOriginalFile(file);
      } else {
        console.error('Project not found or missing image');
        navigate(createPageUrl('Upload'));
      }
    } catch (error) {
      console.error('Error loading project:', error);
      navigate(createPageUrl('Upload'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinementComplete = async (refinedImageUrl) => {
    try {
      await base44.entities.Project.update(project.id, {
        refined_image_url: refinedImageUrl,
        status: 'refined'
      });
      
      navigate(createPageUrl('Measurements') + `?projectId=${project.id}`);
    } catch (error) {
      console.error('Error saving refinement:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-purple-500" />
        </motion.div>
      </div>
    );
  }

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
            ✨ Print A Fit ✨
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            AI is refining your image
          </p>
        </motion.div>

        <ProgressSteps currentStep={2} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          {originalFile && (
            <ImageRefiner 
              originalImage={originalFile}
              onRefinementComplete={handleRefinementComplete}
            />
          )}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-pink-400/30 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}