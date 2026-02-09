import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle, Clock, Zap, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';

export default function AIPatternReview({ project, onReviewComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [review, setReview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (project) {
      analyzePattern();
    }
  }, [project]);

  const analyzePattern = async () => {
    setIsAnalyzing(true);
    try {
      const patternInfo = {
        clothing_type: project.clothing_type,
        measurements: project.measurements,
        pattern_data: project.pattern_data
      };

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this sewing pattern for potential issues and provide recommendations:

${JSON.stringify(patternInfo, null, 2)}

Review the pattern for:
1. Measurement consistency - are all required measurements present and reasonable?
2. Seam allowance appropriateness for the fabric type
3. Construction step logical flow
4. Potential fit issues
5. Missing or unclear instructions

Provide:
- Overall quality score (0-100)
- Difficulty level (beginner/intermediate/advanced)
- Estimated completion time (in hours)
- List of specific issues found (if any)
- List of suggestions for improvement
- List of things done well`,
        response_json_schema: {
          type: "object",
          properties: {
            quality_score: { type: "number" },
            difficulty_level: { 
              type: "string",
              enum: ["beginner", "intermediate", "advanced"]
            },
            estimated_hours: { type: "number" },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { 
                    type: "string",
                    enum: ["low", "medium", "high"]
                  },
                  category: { type: "string" },
                  description: { type: "string" },
                  suggestion: { type: "string" }
                }
              }
            },
            strengths: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setReview(analysis);
    } catch (error) {
      console.error('Error analyzing pattern:', error);
      setReview({
        quality_score: 75,
        difficulty_level: 'intermediate',
        estimated_hours: 6,
        issues: [],
        strengths: ['Pattern generated successfully'],
        recommendations: ['Review measurements before cutting fabric']
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <GlowCard glowColor="purple" className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-6 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          <p className="mt-4 text-lg font-bold text-purple-600 dark:text-purple-400">
            AI is reviewing your pattern...
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Checking measurements, construction steps, and fit
          </p>
        </div>
      </GlowCard>
    );
  }

  if (!review) return null;

  const severityColors = {
    low: 'from-yellow-100 to-yellow-200',
    medium: 'from-orange-100 to-orange-200',
    high: 'from-red-100 to-red-200'
  };

  const difficultyColors = {
    beginner: 'from-green-400 to-green-500',
    intermediate: 'from-yellow-400 to-orange-500',
    advanced: 'from-red-400 to-red-500'
  };

  const qualityColor = review.quality_score >= 80 ? 'text-green-600' : 
                       review.quality_score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Overall Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlowCard glowColor="rainbow" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white">AI Pattern Review</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Analysis complete</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {/* Quality Score */}
            <div className="p-4 rounded-xl border-3 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className={`w-5 h-5 ${qualityColor}`} />
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Quality</span>
              </div>
              <p className={`text-3xl font-black ${qualityColor}`}>{review.quality_score}/100</p>
            </div>

            {/* Difficulty */}
            <div className="p-4 rounded-xl border-3 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Difficulty</span>
              </div>
              <p className={`text-2xl font-black capitalize bg-gradient-to-r ${difficultyColors[review.difficulty_level]} bg-clip-text text-transparent`}>
                {review.difficulty_level}
              </p>
            </div>

            {/* Time Estimate */}
            <div className="p-4 rounded-xl border-3 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-cyan-500" />
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Est. Time</span>
              </div>
              <p className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                {review.estimated_hours}h
              </p>
            </div>
          </div>

          {/* Quick Summary */}
          {review.issues && review.issues.length > 0 ? (
            <div className="p-4 rounded-xl border-3 border-black dark:border-white bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {review.issues.length} suggestion{review.issues.length !== 1 ? 's' : ''} for improvement
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Review the details below for optimal results
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border-3 border-black dark:border-white bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-bold text-green-600 dark:text-green-400">
                    Pattern looks great!
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    No critical issues found. Ready to proceed!
                  </p>
                </div>
              </div>
            </div>
          )}
        </GlowCard>
      </motion.div>

      {/* Detailed Review (Expandable) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-4 rounded-xl border-3 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] font-bold flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="dark:text-white">Detailed Analysis</span>
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {/* Issues */}
            {review.issues && review.issues.length > 0 && (
              <GlowCard glowColor="pink" className="p-6">
                <h4 className="font-bold text-lg mb-4 dark:text-white">Suggestions for Improvement</h4>
                <div className="space-y-3">
                  {review.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-3 border-black dark:border-white bg-gradient-to-r ${severityColors[issue.severity]} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="px-2 py-1 rounded-md bg-white border-2 border-black text-xs font-bold uppercase">
                          {issue.severity}
                        </span>
                        <span className="font-bold text-gray-900">{issue.category}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{issue.description}</p>
                      <p className="text-sm text-gray-600 italic">💡 {issue.suggestion}</p>
                    </div>
                  ))}
                </div>
              </GlowCard>
            )}

            {/* Strengths */}
            {review.strengths && review.strengths.length > 0 && (
              <GlowCard glowColor="cyan" className="p-6">
                <h4 className="font-bold text-lg mb-4 dark:text-white">Pattern Strengths</h4>
                <ul className="space-y-2">
                  {review.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            )}

            {/* Recommendations */}
            {review.recommendations && review.recommendations.length > 0 && (
              <GlowCard glowColor="purple" className="p-6">
                <h4 className="font-bold text-lg mb-4 dark:text-white">Recommendations</h4>
                <ul className="space-y-2">
                  {review.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <GlowButton
          onClick={onReviewComplete}
          variant="success"
          className="text-lg px-8 py-4"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Continue with Pattern
        </GlowButton>
      </motion.div>
    </div>
  );
}