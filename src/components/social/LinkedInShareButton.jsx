import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Loader2, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import GlowButton from '../ui/GlowButton';
import { toast } from 'sonner';

export default function LinkedInShareButton({ project, customMessage }) {
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const user = await base44.auth.me();
      
      const message = customMessage || `🎨 Just created a custom sewing pattern using Print A Fit! 

Proud to showcase my design and pattern-making skills:
✂️ ${project.clothing_type ? project.clothing_type.charAt(0).toUpperCase() + project.clothing_type.slice(1) : 'Custom'} Pattern
📐 Personalized measurements
🎯 AI-assisted pattern generation

Excited to bring this design to life! #SewingSkills #PatternMaking #Fashion #DIY #Design`;

      const result = await base44.functions.invoke('shareToLinkedIn', {
        text: message,
        projectId: project.id
      });

      if (result.data.success) {
        setShared(true);
        toast.success('Shared to LinkedIn!');
        setTimeout(() => setShared(false), 3000);
      } else {
        throw new Error(result.data.error || 'Failed to share');
      }
    } catch (error) {
      console.error('Error sharing to LinkedIn:', error);
      toast.error(error.message || 'Failed to share to LinkedIn. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <GlowButton
      onClick={handleShare}
      disabled={isSharing || shared}
      variant="secondary"
      className={shared ? 'bg-gradient-to-r from-green-400 to-emerald-500' : ''}
    >
      {isSharing ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Sharing...
        </>
      ) : shared ? (
        <>
          <CheckCircle className="w-5 h-5 mr-2" />
          Shared to LinkedIn!
        </>
      ) : (
        <>
          <Linkedin className="w-5 h-5 mr-2" />
          Share Design Skills on LinkedIn
        </>
      )}
    </GlowButton>
  );
}