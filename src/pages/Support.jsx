import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowCard from '../components/ui/GlowCard';

export default function Support() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pb-20 md:pb-8">
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
            💌 Support & Help 💌
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2 font-medium">
            We're here to help you create amazing patterns!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Contact Card */}
          <GlowCard glowColor="rainbow" className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Get in Touch
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Have a question, issue, or feedback? We'd love to hear from you!
              </p>

              <div className="p-6 rounded-xl border-3 border-black dark:border-white bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <p className="font-bold text-purple-600 dark:text-purple-400">Email Us</p>
                </div>
                <a 
                  href="mailto:info@printafit.com"
                  className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors break-all"
                >
                  info@printafit.com
                </a>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">📧 Bug Reports</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found an issue? Let us know the details and we'll fix it ASAP.
                  </p>
                </div>
                <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">💡 Feature Requests</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Have an idea? Share your suggestions for new features.
                  </p>
                </div>
                <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">❓ General Questions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Need help understanding how something works? Ask away!
                  </p>
                </div>
                <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">💳 Billing & Plans</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Questions about subscriptions or payments? We're here to help.
                  </p>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Response Time */}
          <GlowCard glowColor="cyan" className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-400 border-2 border-black dark:border-white">
                <MessageCircle className="w-5 h-5 text-black dark:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">⏰ Response Time</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We typically respond within 24-48 hours during business days. For urgent issues, please mention "URGENT" in your email subject line.
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Privacy Policy Link */}
          <div className="text-center pt-4">
            <Link to={createPageUrl('PrivacyPolicy')}>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-gray-900 dark:text-white">
                <FileText className="w-4 h-4" />
                View Privacy Policy
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}