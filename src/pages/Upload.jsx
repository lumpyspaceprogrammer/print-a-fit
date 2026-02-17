import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import ProgressSteps from '../components/ui/ProgressSteps';
import ImageUploader from '../components/upload/ImageUploader';
import ValentinesPopup from '../components/valentines/ValentinesPopup';
import UpgradeModal from '../components/monetization/UpgradeModal';
import { createPageUrl } from '@/utils';
import { tierData } from '../components/monetization/SubscriptionTiers';

export default function Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [showValentinesPopup, setShowValentinesPopup] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isSuperbowlChallenge, setIsSuperbowlChallenge] = useState(false);
  const [superbowlTeam, setSuperbowlTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) {
      base44.auth.redirectToLogin(createPageUrl('Upload'));
      return;
    }
    checkSubscriptionAndPopups();
  };

  const checkSubscriptionAndPopups = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        // Get or create subscription
        const subs = await base44.entities.UserSubscription.list();
        const userSub = subs.find(s => s.created_by === user.email);
        
        if (userSub) {
          // Reset daily count if new day
          const today = new Date().toISOString().split('T')[0];
          if (userSub.last_pattern_date !== today) {
            await base44.entities.UserSubscription.update(userSub.id, {
              patterns_used_today: 0,
              last_pattern_date: today
            });
            userSub.patterns_used_today = 0;
          }
          setSubscription(userSub);
          
          // Show Valentines popup if not created
          if (!userSub.valentines_gift_created) {
            setTimeout(() => setShowValentinesPopup(true), 1000);
          }
        } else {
          // Create new subscription record
          const newSub = await base44.entities.UserSubscription.create({
            tier: 'free',
            patterns_used_today: 0,
            total_patterns_created: 0,
            has_used_free_pattern: false,
            valentines_gift_created: false
          });
          setSubscription(newSub);
          setTimeout(() => setShowValentinesPopup(true), 1000);
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setTimeout(() => setShowValentinesPopup(true), 1000);
    }

    // Check URL params for challenge mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('challenge') === 'superbowl') {
      setIsSuperbowlChallenge(true);
      setSuperbowlTeam(urlParams.get('team'));
    }
  };

  const canCreatePattern = () => {
    if (isSuperbowlChallenge && !subscription?.superbowl_entry_submitted) {
      return true; // Superbowl challenge is free
    }
    
    if (!subscription) return true; // First time user
    
    const tier = tierData[subscription.tier] || tierData.free;
    
    // Free tier: only 1 pattern ever
    if (subscription.tier === 'free') {
      return !subscription.has_used_free_pattern;
    }
    
    // Paid tiers: check daily limit
    if (tier.patternsPerDay === -1) return true; // Unlimited
    return subscription.patterns_used_today < tier.patternsPerDay;
  };

  const handleImageSelect = async (file) => {
    // Check if user can create pattern
    if (!canCreatePattern()) {
      setShowUpgradeModal(true);
      return;
    }
    setIsUploading(true);
    try {
      // Upload the image
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Track upload event
      base44.analytics.track({
        eventName: "upload_photo",
        properties: {
          success: true
        }
      });
      
      // Create a new project
      const project = await base44.entities.Project.create({
        original_image_url: file_url,
        status: 'uploaded'
      });

      // Update subscription usage
      if (subscription) {
        const updates = {
          patterns_used_today: (subscription.patterns_used_today || 0) + 1,
          total_patterns_created: (subscription.total_patterns_created || 0) + 1,
          last_pattern_date: new Date().toISOString().split('T')[0]
        };
        
        if (subscription.tier === 'free') {
          updates.has_used_free_pattern = true;
        }
        
        // Mark Valentine's gift as created
        if (!subscription.valentines_gift_created) {
          updates.valentines_gift_created = true;
        }
        
        await base44.entities.UserSubscription.update(subscription.id, updates);
      }
      
      // Navigate to refine page with project ID
      navigate(createPageUrl('Refine') + `?projectId=${project.id}`);
    } catch (error) {
      console.error('Error uploading:', error);
      setIsUploading(false);
    }
  };

  const getRemainingPatterns = () => {
    if (!subscription) return 1;
    if (isSuperbowlChallenge && !subscription.superbowl_entry_submitted) return 1;
    
    const tier = tierData[subscription.tier] || tierData.free;
    
    if (subscription.tier === 'free') {
      return subscription.has_used_free_pattern ? 0 : 1;
    }
    if (tier.patternsPerDay === -1) return '∞';
    return Math.max(0, tier.patternsPerDay - (subscription.patterns_used_today || 0));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
      <FloatingShapes />
      
      {/* Valentines Popup */}
      <ValentinesPopup
        isOpen={showValentinesPopup}
        onClose={() => setShowValentinesPopup(false)}
        onJoin={() => setShowValentinesPopup(false)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={subscription?.tier || 'free'}
        reason={subscription?.tier === 'free' 
          ? "You've used your free pattern! Upgrade to create more."
          : "You've reached your daily limit. Upgrade for more patterns."
        }
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {isSuperbowlChallenge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-full border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              🏈 SUPERBOWL CHALLENGE - FREE PATTERN! {superbowlTeam && `(Team ${superbowlTeam.toUpperCase()})`}
            </motion.div>
          )}
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
            ✨ Print A Fit ✨
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            Transform any clothing photo into a custom sewing pattern
          </p>
          
          {/* Patterns remaining indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {canCreatePattern() ? (
              <>
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-bold text-sm">
                  {isSuperbowlChallenge ? '🏈 FREE Challenge Pattern' : `${getRemainingPatterns()} pattern${getRemainingPatterns() === 1 ? '' : 's'} remaining today`}
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="font-bold text-sm text-gray-600">
                  Upgrade for more patterns
                </span>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="text-purple-600 underline font-bold text-sm"
                >
                  View Plans
                </button>
              </>
            )}
          </motion.div>
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