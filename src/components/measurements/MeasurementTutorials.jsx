import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronRight, Play } from 'lucide-react';
import GlowCard from '../ui/GlowCard';

const tutorials = [
  {
    id: 'shoulder-width',
    title: 'Shoulder Width',
    difficulty: 'Medium',
    duration: '2 min',
    description: 'Measure across your back from shoulder point to shoulder point',
    steps: [
      'Stand naturally with arms relaxed at sides',
      'Have helper place tape measure on back of one shoulder',
      'Measure straight across to the other shoulder point',
      'The shoulder point is where your shoulder meets your arm',
      'Keep tape parallel to the floor'
    ],
    tips: [
      'Don\'t measure along the curved top of shoulders',
      'Measure at the widest part of your back',
      'Wear a fitted shirt to see shoulder points clearly'
    ],
    videoPlaceholder: 'shoulder-width-demo'
  },
  {
    id: 'bust-fullness',
    title: 'Full Bust Adjustment',
    difficulty: 'Advanced',
    duration: '3 min',
    description: 'Account for larger bust when measuring chest circumference',
    steps: [
      'Measure around the fullest part of your bust',
      'Keep tape parallel to floor, not too tight',
      'Note if measurement differs significantly from underbust',
      'For full bust: add 2-4 inches to chest measurement',
      'For pattern adjustments: consider bust apex points'
    ],
    tips: [
      'Wear a well-fitted bra for accurate measurement',
      'Difference >2 inches may need full bust adjustment (FBA)',
      'Patterns assume B cup; adjust for larger/smaller cups'
    ],
    videoPlaceholder: 'full-bust-adjustment'
  },
  {
    id: 'torso-length',
    title: 'Torso Length',
    difficulty: 'Easy',
    duration: '2 min',
    description: 'Measure from shoulder to natural waist for perfect top length',
    steps: [
      'Find your natural waist by bending to the side',
      'Place tape at shoulder seam (where shoulder meets neck)',
      'Run tape down front of body to natural waist',
      'Keep body straight, don\'t slouch',
      'Note if you have a long or short torso relative to height'
    ],
    tips: [
      'Longer torso: add length to patterns',
      'Shorter torso: reduce pattern length',
      'Affects placement of darts and seams'
    ],
    videoPlaceholder: 'torso-length-demo'
  },
  {
    id: 'inseam',
    title: 'Inseam (Pants)',
    difficulty: 'Easy',
    duration: '2 min',
    description: 'Critical measurement for perfect pant length',
    steps: [
      'Wear well-fitting pants or stand against wall',
      'Measure from crotch seam to desired hem length',
      'Stand naturally, don\'t stretch',
      'For full length: measure to floor',
      'For cropped: decide length and measure'
    ],
    tips: [
      'Consider shoe heel height',
      'Allow 1 inch for hem finishing',
      'Inseam varies by style (skinny vs. wide leg)'
    ],
    videoPlaceholder: 'inseam-demo'
  },
  {
    id: 'sleeve-length',
    title: 'Sleeve Length',
    difficulty: 'Medium',
    duration: '2 min',
    description: 'Measure from shoulder point to wrist for perfect sleeve fit',
    steps: [
      'Bend arm slightly at natural angle',
      'Start at shoulder point (where shoulder meets arm)',
      'Run tape down outside of arm to wrist bone',
      'Don\'t pull tape tight, let it follow arm curve',
      'Measure to where you want sleeve to end'
    ],
    tips: [
      'Long arms: add length to sleeve pattern',
      'For fitted sleeves: measure both arms',
      'Consider adding ease for comfort'
    ],
    videoPlaceholder: 'sleeve-length-demo'
  },
  {
    id: 'waist-vs-natural-waist',
    title: 'Natural Waist vs. Preferred Waist',
    difficulty: 'Easy',
    duration: '2 min',
    description: 'Understanding the difference for better fit',
    steps: [
      'Natural waist: bend sideways, note where you crease',
      'Usually 1-2 inches above belly button',
      'Preferred waist: where you like pants/skirts to sit',
      'High rise: at or above natural waist',
      'Low rise: below natural waist, at hip bones'
    ],
    tips: [
      'Patterns assume natural waist unless stated',
      'Adjust rise measurement for preferred waist position',
      'Different rises need different measurements'
    ],
    videoPlaceholder: 'waist-comparison'
  },
  {
    id: 'rounded-shoulders',
    title: 'Measuring with Rounded Shoulders',
    difficulty: 'Advanced',
    duration: '3 min',
    description: 'Adjusting for forward or rounded shoulder posture',
    steps: [
      'Measure normally first to establish baseline',
      'Note if shoulders naturally roll forward',
      'For rounded shoulders: may need more back width',
      'Consider adding 1-2 inches to back shoulder measurement',
      'Front may need less width than back'
    ],
    tips: [
      'Rounded shoulders are very common',
      'Results in pulling across upper back',
      'Pattern adjustment: add width to back, reduce front'
    ],
    videoPlaceholder: 'rounded-shoulders-demo'
  },
  {
    id: 'hip-measurement',
    title: 'Full Hip Measurement',
    difficulty: 'Easy',
    duration: '2 min',
    description: 'Measure at the fullest part for bottoms and dresses',
    steps: [
      'Find the fullest part of your hips (usually 7-9 inches below waist)',
      'Stand with feet together',
      'Wrap tape around fullest part of hips and rear',
      'Keep tape parallel to floor',
      'Don\'t pull tight, allow tape to rest on body'
    ],
    tips: [
      'Different from high hip (top of hip bones)',
      'Critical for pants and skirt fit',
      'Hip-to-waist ratio affects pattern size selection'
    ],
    videoPlaceholder: 'hip-measurement-demo'
  }
];

export default function MeasurementTutorials() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleTutorial = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <GlowCard glowColor="pink" className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-400 to-purple-400 border-2 border-black">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Measurement Tutorials</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Learn how to take accurate measurements
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="border-2 border-black dark:border-white rounded-xl overflow-hidden">
            <button
              onClick={() => toggleTutorial(tutorial.id)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <div className={`w-2 h-2 rounded-full ${
                  tutorial.difficulty === 'Easy' ? 'bg-green-500' :
                  tutorial.difficulty === 'Medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white">{tutorial.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{tutorial.difficulty}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{tutorial.duration}</span>
                  </div>
                </div>
              </div>
              {expandedId === tutorial.id ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedId === tutorial.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 border-t-2 border-black dark:border-white">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      {tutorial.description}
                    </p>

                    {/* Video Placeholder */}
                    <div className="mb-4 aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-black dark:border-white flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Video Demo Coming Soon</p>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="mb-4">
                      <h5 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Steps:</h5>
                      <ol className="space-y-1.5">
                        {tutorial.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-bold text-purple-500 flex-shrink-0">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Tips */}
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tips:</h5>
                      <ul className="space-y-1.5">
                        {tutorial.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-purple-500 flex-shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </GlowCard>
  );
}