import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import ProgressSteps from '../components/ui/ProgressSteps';
import PatternViewer from '../components/pattern/PatternViewer';
import GlowButton from '../components/ui/GlowButton';
import UpgradeModal from '../components/monetization/UpgradeModal';
import { createPageUrl } from '@/utils';
import { Loader2, Plus } from 'lucide-react';

export default function Pattern() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) {
      base44.auth.redirectToLogin(createPageUrl('Pattern'));
      return;
    }
    loadProject();
    checkSubscription();
  };

  const checkSubscription = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const subs = await base44.entities.UserSubscription.list();
        const userSub = subs.find(s => s.created_by === user.email);
        if (userSub) {
          setSubscription(userSub);
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const loadProject = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    
    if (!projectId) {
      navigate(createPageUrl('Upload'));
      return;
    }

    try {
      const projects = await base44.entities.Project.list();
      const foundProject = projects.find(p => p.id === projectId);
      
      if (foundProject && foundProject.measurements) {
        setProject(foundProject);
      } else {
        console.error('Project not found or missing measurements');
        navigate(createPageUrl('Upload'));
      }
    } catch (error) {
      console.error('Error loading project:', error);
      navigate(createPageUrl('Upload'));
    } finally {
      setIsLoading(false);
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
            Your custom pattern is ready!
          </p>
        </motion.div>

        <ProgressSteps currentStep={4} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          {project && (
            <PatternViewer 
              refinedImage={project.refined_image_url}
              measurements={project.measurements}
              clothingType={project.clothing_type}
              project={project}
            />
          )}
        </motion.div>

        {/* Start New Project Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex justify-center"
        >
          <GlowButton 
            variant="secondary"
            onClick={() => {
              // Check if user has reached their limit
              if (subscription?.tier === 'free' && subscription?.has_used_free_pattern) {
                setShowUpgradeModal(true);
              } else {
                navigate(createPageUrl('Upload'));
              }
            }}
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            Create Another Pattern
          </GlowButton>
        </motion.div>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentTier={subscription?.tier || 'free'}
          reason="You've used your free pattern! Upgrade to create more amazing outfits."
        />

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-lime-400/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-pink-400/30 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}