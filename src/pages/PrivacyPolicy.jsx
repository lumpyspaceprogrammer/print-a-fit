import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowCard from '../components/ui/GlowCard';

export default function PrivacyPolicy() {
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
            🔒 Privacy Policy 🔒
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2 font-medium">
            Last Updated: February 17, 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <GlowCard glowColor="rainbow" className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Privacy Matters
              </h2>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Introduction</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Welcome to Print A Fit ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our sewing pattern generation service. Please read this policy carefully.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Information We Collect</h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p><strong>Account Information:</strong> When you create an account, we collect your name, email address, and authentication credentials.</p>
                  <p><strong>Project Data:</strong> Images you upload, measurements you provide, pattern designs you create, and customization preferences.</p>
                  <p><strong>Usage Data:</strong> Information about how you interact with our service, including pages visited, features used, and time spent on the platform.</p>
                  <p><strong>Payment Information:</strong> When you subscribe to a paid plan, payment information is processed securely through Stripe. We do not store your full credit card details.</p>
                  <p><strong>Device Information:</strong> Browser type, device type, IP address, and operating system.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide, operate, and maintain our sewing pattern generation service</li>
                    <li>Generate custom patterns based on your uploaded images and specifications</li>
                    <li>Process your payments and manage subscriptions</li>
                    <li>Send you service-related communications and updates</li>
                    <li>Improve and personalize your experience</li>
                    <li>Analyze usage patterns to enhance our service</li>
                    <li>Respond to your support requests and inquiries</li>
                    <li>Detect and prevent fraud or abuse</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. AI and Image Processing</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We use artificial intelligence and machine learning to analyze uploaded images and generate sewing patterns. Your images are processed to identify clothing features, measurements, and design elements. These AI services may temporarily store your images during processing, but are deleted after pattern generation is complete.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Data Sharing and Disclosure</h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>We do not sell your personal information. We may share your information with:</p>
                  <p><strong>Service Providers:</strong> Third-party vendors who help us operate our service (payment processing, cloud hosting, AI processing, analytics).</p>
                  <p><strong>Community Features:</strong> If you choose to share your projects in the community showcase, your shared designs and associated information become publicly visible.</p>
                  <p><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety.</p>
                  <p><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Data Storage and Security</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We implement industry-standard security measures to protect your data. Your uploaded images and pattern data are stored securely on cloud servers. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Cookies and Tracking</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze usage patterns. You can control cookies through your browser settings, but disabling them may affect functionality.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Your Rights and Choices</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Access, update, or delete your account information</li>
                    <li>Download your pattern data</li>
                    <li>Delete your projects and uploaded images</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of your personal data</li>
                    <li>Close your account at any time</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">9. Children's Privacy</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">10. Data Retention</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time. Some information may be retained for legal or operational purposes.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">11. International Users</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">12. Changes to This Policy</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the service after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="pt-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">13. Contact Us</h3>
                <div className="p-4 rounded-xl border-2 border-black dark:border-white bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    If you have questions or concerns about this Privacy Policy, please contact us:
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <a 
                      href="mailto:info@printafit.com"
                      className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      info@printafit.com
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
}