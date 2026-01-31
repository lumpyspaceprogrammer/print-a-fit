import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, FileText, Scissors, Layers, BookOpen, RotateCcw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import StepIndicator from '@/components/shared/StepIndicator';
import GlowButton from '@/components/shared/GlowButton';
import NeoCard from '@/components/shared/NeoCard';
import SparkleDecoration from '@/components/shared/SparkleDecoration';
import ThreeViewer from '@/components/pattern/ThreeViewer';
import PatternCard from '@/components/pattern/PatternCard';
import InstructionsPanel from '@/components/pattern/InstructionsPanel';
import { createPageUrl } from '@/utils';

export default function PatternPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [clothingType, setClothingType] = useState(null);
  const [measurements, setMeasurements] = useState({});
  const [patternData, setPatternData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [activeTab, setActiveTab] = useState('pattern');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const image = params.get('image');
    const type = params.get('type');
    const measurementsStr = params.get('measurements');
    
    if (image) setImageUrl(image);
    if (type) setClothingType(type);
    if (measurementsStr) {
      try {
        setMeasurements(JSON.parse(measurementsStr));
      } catch (e) {
        console.error('Failed to parse measurements');
      }
    }
    
    if (image && type && measurementsStr) {
      generatePattern(image, type, JSON.parse(measurementsStr));
    }
  }, []);

  const generatePattern = async (image, type, meas) => {
    setIsGenerating(true);
    
    try {
      const measurementsList = Object.entries(meas)
        .map(([key, value]) => `${key}: ${value} inches`)
        .join(', ');

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert pattern maker and fashion designer. Based on the clothing image provided and these measurements (${measurementsList}), create a detailed sewing pattern guide for a ${type}.

Generate a comprehensive pattern package that includes:

1. PATTERN PIECES: List each pattern piece needed with exact dimensions based on the measurements. Include seam allowances (typically 5/8 inch or 1.5cm).

2. FLAT SKETCH: Describe a technical flat sketch showing the garment from front and back views with construction details.

3. GRAIN LINES: Specify grain line directions for each pattern piece.

4. NOTCHES: Indicate where notches should be placed for alignment.

5. CUTTING INSTRUCTIONS: How many pieces to cut of each (e.g., "Cut 2", "Cut 1 on fold").

6. SEWING INSTRUCTIONS: Step-by-step assembly instructions with professional techniques.

7. FINISHING DETAILS: Hemming, seam finishing, closures, and other finishing techniques.

Be specific with all measurements and provide professional-quality instructions that a home sewer could follow.`,
        file_urls: [image],
        response_json_schema: {
          type: "object",
          properties: {
            pattern_name: { type: "string" },
            difficulty_level: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
            estimated_time: { type: "string" },
            fabric_suggestions: { type: "array", items: { type: "string" } },
            fabric_yardage: { type: "string" },
            notions_needed: { type: "array", items: { type: "string" } },
            pattern_pieces: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  quantity: { type: "string" },
                  dimensions: { type: "string" },
                  grain_line: { type: "string" },
                  notes: { type: "string" }
                }
              }
            },
            sewing_instructions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  tips: { type: "string" }
                }
              }
            },
            finishing_techniques: { type: "array", items: { type: "string" } },
            care_instructions: { type: "string" }
          }
        }
      });
      
      setPatternData(result);
    } catch (error) {
      console.error('Pattern generation failed:', error);
    }
    
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!patternData) return;
    
    const content = `
PRINT YOUR FIT - SEWING PATTERN
================================

Pattern: ${patternData.pattern_name || 'Custom ' + clothingType}
Difficulty: ${patternData.difficulty_level || 'Intermediate'}
Estimated Time: ${patternData.estimated_time || '3-5 hours'}

YOUR MEASUREMENTS
-----------------
${Object.entries(measurements).map(([k, v]) => `${k}: ${v} inches`).join('\n')}

FABRIC REQUIREMENTS
-------------------
Suggested Fabrics: ${patternData.fabric_suggestions?.join(', ') || 'Medium weight cotton, linen, or similar'}
Yardage Needed: ${patternData.fabric_yardage || '2-3 yards depending on width'}

NOTIONS NEEDED
--------------
${patternData.notions_needed?.map(n => `• ${n}`).join('\n') || '• Matching thread\n• Pins\n• Scissors'}

PATTERN PIECES
--------------
${patternData.pattern_pieces?.map(p => 
  `${p.name}
   Quantity: ${p.quantity}
   Dimensions: ${p.dimensions}
   Grain Line: ${p.grain_line}
   Notes: ${p.notes || 'None'}`
).join('\n\n') || 'See instructions below'}

SEWING INSTRUCTIONS
-------------------
${patternData.sewing_instructions?.map(s => 
  `Step ${s.step}: ${s.title}
   ${s.description}
   ${s.tips ? `TIP: ${s.tips}` : ''}`
).join('\n\n') || 'Follow standard construction techniques'}

FINISHING TECHNIQUES
--------------------
${patternData.finishing_techniques?.map(t => `• ${t}`).join('\n') || '• Finish seams with serger or zigzag\n• Press all seams\n• Hem to desired length'}

CARE INSTRUCTIONS
-----------------
${patternData.care_instructions || 'Follow fabric care label recommendations'}

---
Generated by Print Your Fit ✨
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrintYourFit_${clothingType}_pattern.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set('image', imageUrl);
    navigate(createPageUrl('Measurements') + `?image=${encodeURIComponent(imageUrl)}`);
  };

  const handleStartOver = () => {
    navigate(createPageUrl('Upload'));
  };

  const tabs = [
    { id: 'pattern', label: 'Pattern Pieces', icon: Layers },
    { id: 'instructions', label: 'Instructions', icon: BookOpen },
    { id: '3d', label: '3D Preview', icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8D5FF] via-[#FFD6E8] to-[#D0F4FF] p-4 md:p-8 relative overflow-hidden">
      <SparkleDecoration />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] via-[#FEE440] to-[#9B5DE5] mb-2"
              style={{ WebkitTextStroke: '1px black' }}>
            🧵 Your Pattern is Ready! 🧵
          </h1>
        </motion.div>

        <StepIndicator currentStep={4} />

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NeoCard className="p-8 md:p-12">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    className="w-32 h-32 mb-6"
                  >
                    <Scissors className="w-full h-full text-[#9B5DE5]" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-black text-black mb-4">
                    ✨ Creating Your Pattern ✨
                  </h2>
                  
                  <div className="flex gap-2 mb-4">
                    {['#FF6B9D', '#9B5DE5', '#00F5D4', '#FEE440', '#B8F83A'].map((color, i) => (
                      <motion.div
                        key={color}
                        animate={{ 
                          y: [0, -15, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 0.8, 
                          delay: i * 0.15 
                        }}
                        className="w-4 h-4 rounded-full border-2 border-black"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  <p className="text-[#9B5DE5] font-bold">
                    Analyzing your garment and measurements...
                  </p>
                </div>
              </NeoCard>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Tab navigation */}
              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl border-3 border-black font-bold transition-all
                        ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white shadow-[4px_4px_0_0_#000]'
                          : 'bg-white text-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px]'
                        }
                      `}
                    >
                      <TabIcon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Original image */}
                <div className="lg:col-span-1">
                  <NeoCard className="p-4">
                    <h3 className="font-black text-center mb-3 text-[#9B5DE5]">Your Original</h3>
                    <div className="rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0_0_#000] bg-white">
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt="Original garment" 
                          className="w-full aspect-square object-contain"
                        />
                      )}
                    </div>
                    
                    {patternData && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-[#E8D5FF] to-[#FFD6E8] rounded-xl border-3 border-black">
                        <p className="font-black text-sm mb-1">{patternData.pattern_name || `Custom ${clothingType}`}</p>
                        <p className="text-xs font-bold text-[#9B5DE5]">
                          {patternData.difficulty_level || 'Intermediate'} • {patternData.estimated_time || '3-5 hours'}
                        </p>
                      </div>
                    )}
                  </NeoCard>
                </div>

                {/* Right: Content area */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {activeTab === 'pattern' && (
                      <motion.div
                        key="pattern"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <PatternCard patternData={patternData} measurements={measurements} />
                      </motion.div>
                    )}
                    
                    {activeTab === 'instructions' && (
                      <motion.div
                        key="instructions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <InstructionsPanel patternData={patternData} />
                      </motion.div>
                    )}
                    
                    {activeTab === '3d' && (
                      <motion.div
                        key="3d"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <NeoCard className="p-6">
                          <h3 className="font-black text-xl mb-4 text-center">3D Preview</h3>
                          <div className="h-[400px] rounded-xl border-4 border-black overflow-hidden bg-gradient-to-br from-[#E8D5FF] to-[#D0F4FF]">
                            <Suspense fallback={
                              <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="w-12 h-12 animate-spin text-[#9B5DE5]" />
                              </div>
                            }>
                              <ThreeViewer clothingType={clothingType} />
                            </Suspense>
                          </div>
                          <p className="text-center text-sm font-bold text-[#9B5DE5] mt-3">
                            🖱️ Drag to rotate • Scroll to zoom
                          </p>
                        </NeoCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
              >
                <GlowButton onClick={handleBack} variant="secondary">
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </GlowButton>
                
                <GlowButton onClick={handleDownload} variant="success">
                  <Download className="w-5 h-5" />
                  Download Pattern Pack
                </GlowButton>
                
                <GlowButton onClick={handleStartOver}>
                  <RotateCcw className="w-5 h-5" />
                  Start New Project
                </GlowButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}