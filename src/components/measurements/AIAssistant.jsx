import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Send, Loader2, X } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

export default function AIAssistant({ measurements, clothingType, unit, onAdjustment }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim() || isLoading) return;

    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const context = `
Current measurements (${unit}): ${JSON.stringify(measurements, null, 2)}
Clothing type: ${clothingType}
User question: ${question}

You are a professional tailor and fit specialist. Help the user understand their measurements, 
suggest adjustments for their body type, posture, or fit preferences. Provide specific, 
actionable advice. If they ask about adjusting measurements, provide exact values.
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: context,
        add_context_from_internet: false
      });

      const assistantMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);

      // Parse for measurement adjustments
      const adjustmentMatch = response.match(/adjust|increase|decrease|change/i);
      if (adjustmentMatch && onAdjustment) {
        // Extract suggested adjustments if AI provides specific values
        const numberMatches = response.match(/\d+\.?\d*/g);
        if (numberMatches) {
          // This is simplified - in production, you'd parse more precisely
          console.log('Suggested adjustments detected:', numberMatches);
        }
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "How should I adjust for a fuller bust?",
    "What if I have a longer torso?",
    "Tips for measuring with posture issues?",
    "How to account for rounded shoulders?"
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 md:bottom-8 z-40 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 z-50 bg-white dark:bg-gray-800 border-l-4 border-black dark:border-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-3 border-black dark:border-white bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border-2 border-black dark:border-white">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">AI Fit Assistant</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Ask about measurements</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      👋 Hi! I'm your AI fit assistant. Ask me about:
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• Adjusting measurements for body type</li>
                      <li>• Interpreting fit for different postures</li>
                      <li>• Tips for accurate measuring</li>
                      <li>• Understanding ease and allowances</li>
                    </ul>
                  </div>

                  {/* Quick Questions */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500">Quick questions:</p>
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setQuestion(q)}
                        className="w-full text-left p-3 text-sm bg-white dark:bg-gray-700 border-2 border-black dark:border-white rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-xl border-2 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-black'
                      : 'bg-white dark:bg-gray-700 border-black dark:border-white'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t-3 border-black dark:border-white bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-2">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  placeholder="Ask about your measurements..."
                  className="resize-none border-2 border-black dark:border-white rounded-lg text-sm"
                  rows={2}
                />
                <Button
                  onClick={handleAsk}
                  disabled={!question.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}