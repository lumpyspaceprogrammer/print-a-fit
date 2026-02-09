import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Upload, Wand2, Ruler, Scissors, Star, Heart, Zap, ArrowRight, Users } from 'lucide-react';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowButton from '../components/ui/GlowButton';
import GlowCard from '../components/ui/GlowCard';
import TutorialOverlay from '../components/tutorial/TutorialOverlay';
import { homeTutorial } from '../components/tutorial/tutorialSteps';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(true);

  const features = [
    {
      icon: Upload,
      title: "Upload Your Fit",
      description: "Snap a photo of any clothing item you want to recreate",
      color: "from-pink-400 to-rose-400",
      delay: 0.1
    },
    {
      icon: Wand2,
      title: "AI Magic",
      description: "Our AI removes backgrounds and enhances your image",
      color: "from-purple-400 to-violet-400",
      delay: 0.2
    },
    {
      icon: Ruler,
      title: "Custom Measurements",
      description: "Enter your measurements for a perfect, personalized fit",
      color: "from-cyan-400 to-blue-400",
      delay: 0.3
    },
    {
      icon: Scissors,
      title: "Get Your Pattern",
      description: "Download printable patterns with full sewing instructions",
      color: "from-lime-400 to-green-400",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
      <FloatingShapes />
      
      {showTutorial && (
        <TutorialOverlay
          steps={homeTutorial}
          tutorialKey="home"
          onComplete={() => setShowTutorial(false)}
        />
      )}
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  Y2K Sewing Magic
                </span>
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6">
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                Print A
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 animate-pulse">
                ✨ Fit ✨
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-4 font-medium">
              Transform any clothing photo into a custom sewing pattern with AI-powered magic
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-gradient-to-r from-lime-400 to-cyan-400 rounded-full border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-bold text-white text-sm md:text-base">
                Sign up FREE • Get 1 pattern instantly • No credit card needed
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <GlowButton 
                variant="primary" 
                className="text-xl md:text-2xl px-10 py-5"
                onClick={async () => {
                  const isAuth = await base44.auth.isAuthenticated();
                  if (isAuth) {
                    window.location.href = createPageUrl('Upload');
                  } else {
                    base44.auth.redirectToLogin(createPageUrl('Upload'));
                  }
                }}
              >
                <Upload className="w-6 h-6 mr-2 inline" />
                Upload Photo & Create Pattern
                <ArrowRight className="w-6 h-6 ml-2 inline" />
              </GlowButton>

              <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">OR</div>

              <Link to={createPageUrl('AIPatternGenerator')}>
                <GlowButton variant="secondary" className="text-lg px-8 py-4">
                  <Wand2 className="w-5 h-5 mr-2 inline" />
                  Describe & Generate with AI
                </GlowButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating decorative cards */}
          <div className="hidden lg:block">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-40 left-10 p-4 bg-pink-300 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Heart className="w-8 h-8 text-white" fill="white" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute top-60 right-10 p-4 bg-cyan-300 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Zap className="w-8 h-8 text-white" fill="white" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-black text-center mb-12 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
          >
            How It Works ✨
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
              >
                <GlowCard glowColor={index % 2 === 0 ? 'pink' : 'cyan'} className="h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <GlowCard glowColor="cyan" className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                    <Users className="w-7 h-7 text-purple-500" />
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                      Community Showcase
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get inspired by finished garments from makers around the world. 
                    Share your own creations and discover new styles!
                  </p>
                  <Link to={createPageUrl('Community')}>
                    <GlowButton variant="secondary">
                      <Heart className="w-5 h-5 mr-2 inline" />
                      Explore Community
                    </GlowButton>
                  </Link>
                </div>
                <div className="flex -space-x-4">
                  {['🧵', '✂️', '🎀', '👗'].map((emoji, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <GlowCard glowColor="rainbow" className="text-center py-12 px-8">
              <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Ready to Print A Fit?
              </h2>
              <p className="text-lg text-gray-600 mb-2 max-w-xl mx-auto">
                Join thousands of creators making custom patterns from their favorite clothes
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/80 rounded-full border-2 border-black">
                <span className="font-bold text-sm text-gray-700">
                  ✨ Create free account → Upload photo → Get instant pattern
                </span>
              </div>
              <GlowButton 
                variant="success"
                onClick={async () => {
                  const isAuth = await base44.auth.isAuthenticated();
                  if (isAuth) {
                    window.location.href = createPageUrl('Upload');
                  } else {
                    base44.auth.redirectToLogin(createPageUrl('Upload'));
                  }
                }}
              >
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Make Your First Outfit For FREE!
              </GlowButton>
            </GlowCard>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600">
          <p className="font-medium">
            Made with 💜 & ✨ by Print A Fit
          </p>
        </footer>
      </div>

      {/* Background decorations */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-400/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-400/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
    </div>
  );
}