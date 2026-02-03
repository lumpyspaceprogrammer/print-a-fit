import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Heart, Send } from 'lucide-react';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowCard from '../components/ui/GlowCard';
import GlowButton from '../components/ui/GlowButton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Contact() {
  const [messageSent, setMessageSent] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
            ✨ Get in Touch ✨
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            Questions, feedback, or just want to say hi?
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlowCard className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-4">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-black mb-2">Contact the Developer</h2>
                <p className="text-gray-600">I'd love to hear from you!</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-3 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    Email Me
                  </h3>
                  <a 
                    href="mailto:printyourfit@hey.com"
                    className="text-xl font-black text-purple-600 hover:text-pink-500 transition-colors"
                  >
                    printyourfit@hey.com
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    I typically respond within 24-48 hours
                  </p>
                </div>

                <div className="bg-gradient-to-r from-cyan-100 to-purple-100 rounded-xl border-3 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    What I'd Love to Hear About
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-pink-500">✨</span> Feature suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">🐛</span> Bug reports
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-500">📸</span> Photos of your finished projects!
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-lime-500">🤝</span> Collaboration ideas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-500">💬</span> General feedback
                    </li>
                  </ul>
                </div>

                <div className="text-center pt-4">
                  <Link to={createPageUrl('Home')}>
                    <GlowButton variant="secondary">
                      ← Back to Home
                    </GlowButton>
                  </Link>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/30 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}