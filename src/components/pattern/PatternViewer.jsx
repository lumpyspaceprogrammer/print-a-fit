import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Ruler, Scissors, BookOpen, Loader2, Settings, Sparkles, Share2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import PatternCustomizer, { fabricTypes, styleModifiers, seamFinishes } from './PatternCustomizer';
import Interactive3DViewer from './Interactive3DViewer';
import ShareProjectModal from '../showcase/ShareProjectModal';
import { createPageUrl } from '@/utils';

export default function PatternViewer({ refinedImage, measurements, clothingType, project }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [patternData, setPatternData] = useState(null);
  const [activeTab, setActiveTab] = useState('customize');
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [modelAdjustments, setModelAdjustments] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  
  // Customization options
  const [customOptions, setCustomOptions] = useState({
    fabricType: 'woven',
    styleModifier: 'classic',
    seamFinish: 'serged',
  });

  const generatePattern = async () => {
    setIsGenerating(true);
    setActiveTab('sketch');
    
    try {
      const fabricInfo = fabricTypes.find(f => f.value === customOptions.fabricType);
      const styleInfo = styleModifiers.find(s => s.value === customOptions.styleModifier);
      const seamInfo = seamFinishes.find(s => s.value === customOptions.seamFinish);

      // Generate pattern details using AI with customization
      const patternResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional pattern maker. Create detailed sewing pattern instructions for a ${clothingType} with the following customizations:

FABRIC TYPE: ${fabricInfo?.label || customOptions.fabricType}
- ${fabricInfo?.description || ''}

STYLE: ${styleInfo?.label || customOptions.styleModifier} (${customOptions.styleModifier})
- Adjust the pattern to reflect this style. For example:
  - Vintage: Add darts, fitted waist, classic proportions
  - Modern: Clean lines, minimal details, contemporary fit
  - Oversized: Extra ease throughout, dropped shoulders, relaxed fit
  - Fitted: Closer to body measurements, more darts/shaping
  - Minimalist: Fewer pattern pieces, simple construction

SEAM FINISHING: ${seamInfo?.label || customOptions.seamFinish}
- ${seamInfo?.description || ''}
- Incorporate this finishing technique into ALL seam instructions

Measurements provided (in ${measurements.unit}):
${Object.entries(measurements.values || {}).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

${modelAdjustments ? `
ADJUSTED PROPORTIONS:
- Length scale: ${Math.round(modelAdjustments.lengthScale * 100)}%
- Width scale: ${Math.round(modelAdjustments.widthScale * 100)}%
- Sleeve scale: ${Math.round(modelAdjustments.sleeveScale * 100)}%
Adjust all pattern piece dimensions accordingly.
` : ''}

Generate comprehensive pattern data including:
1. A flat sketch description reflecting the ${customOptions.styleModifier} style
2. All pattern pieces with dimensions adjusted for ${customOptions.fabricType} fabric (seam allowances may vary)
3. Specific instructions for ${customOptions.seamFinish} seam finishing on every seam
4. Grain line directions
5. Notch placements
6. Step-by-step sewing instructions optimized for ${customOptions.fabricType} fabric
7. Fabric recommendations within the ${customOptions.fabricType} category
8. Tips specific to working with ${customOptions.fabricType} and achieving the ${customOptions.styleModifier} look`,
        file_urls: [refinedImage],
        response_json_schema: {
          type: "object",
          properties: {
            garment_name: { type: "string" },
            style_notes: { type: "string" },
            flat_sketch_description: { type: "string" },
            pattern_pieces: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  quantity: { type: "number" },
                  dimensions: { type: "string" },
                  grain_direction: { type: "string" },
                  notches: { type: "array", items: { type: "string" } },
                  seam_allowance: { type: "string" }
                }
              }
            },
            seam_allowance: { type: "string" },
            seam_finishing_notes: { type: "string" },
            fabric_recommendations: { type: "array", items: { type: "string" } },
            fabric_yardage: { type: "string" },
            difficulty_level: { type: "string" },
            estimated_time: { type: "string" },
            sewing_instructions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  seam_finish_tip: { type: "string" }
                }
              }
            },
            tips: { type: "array", items: { type: "string" } },
            style_specific_details: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Generate flat sketch image
      const sketchResult = await base44.integrations.Core.GenerateImage({
        prompt: `Technical flat sketch fashion illustration of a ${customOptions.styleModifier} ${clothingType}. 
        ${patternResult.flat_sketch_description}.
        Style: Clean black line drawing on white background, professional fashion technical drawing, 
        ${customOptions.styleModifier} aesthetic, front view, showing all seams, darts, and construction details.
        ${customOptions.styleModifier === 'vintage' ? 'Classic proportions, fitted details, retro elements.' : ''}
        ${customOptions.styleModifier === 'modern' ? 'Clean minimalist lines, contemporary silhouette.' : ''}
        ${customOptions.styleModifier === 'oversized' ? 'Relaxed fit, dropped shoulders, extra volume.' : ''}
        No shading, pure technical illustration style.`,
        existing_image_urls: [refinedImage]
      });

      // Generate pattern layout image
      const patternLayoutResult = await base44.integrations.Core.GenerateImage({
        prompt: `Sewing pattern layout diagram for a ${customOptions.styleModifier} ${clothingType}.
        Pattern pieces arranged efficiently showing:
        ${patternResult.pattern_pieces?.map(p => `- ${p.name} (cut ${p.quantity})`).join('\n')}
        Style: Technical pattern diagram, black outlines on white/cream background,
        showing grain lines as arrows, notches as small triangles,
        fold lines as dashed lines, seam allowances marked,
        clean professional pattern drafting style.
        Include labels for each piece.`
      });

      setPatternData({
        ...patternResult,
        flat_sketch_url: sketchResult.url,
        pattern_layout_url: patternLayoutResult.url,
        customOptions: { ...customOptions }
      });
      
      setShowCustomizer(false);
    } catch (error) {
      console.error('Error generating pattern:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!patternData) return;
    
    const fabricInfo = fabricTypes.find(f => f.value === patternData.customOptions?.fabricType);
    const styleInfo = styleModifiers.find(s => s.value === patternData.customOptions?.styleModifier);
    const seamInfo = seamFinishes.find(s => s.value === patternData.customOptions?.seamFinish);

    const content = `
╔══════════════════════════════════════════════════════════════╗
║           ✨ PRINT YOUR FIT - SEWING PATTERN ✨              ║
╚══════════════════════════════════════════════════════════════╝

PATTERN: ${patternData?.garment_name || clothingType.toUpperCase()}
STYLE: ${styleInfo?.label || 'Classic'} ${styleInfo?.emoji || ''}
═══════════════════════════════════════════════════════════════

CUSTOMIZATION DETAILS
─────────────────────
• Fabric Type: ${fabricInfo?.label || 'Woven'}
  ${fabricInfo?.description || ''}

• Style Modifier: ${styleInfo?.label || 'Classic'}
  ${patternData?.style_notes || ''}

• Seam Finishing: ${seamInfo?.label || 'Serged'}
  ${seamInfo?.description || ''}
  ${patternData?.seam_finishing_notes || ''}

═══════════════════════════════════════════════════════════════

YOUR MEASUREMENTS
─────────────────
${Object.entries(measurements.values || {}).map(([k, v]) => `• ${k}: ${v} ${measurements.unit}`).join('\n')}

${modelAdjustments ? `
ADJUSTED PROPORTIONS
────────────────────
• Length: ${Math.round(modelAdjustments.lengthScale * 100)}%
• Width: ${Math.round(modelAdjustments.widthScale * 100)}%
• Sleeves: ${Math.round(modelAdjustments.sleeveScale * 100)}%
` : ''}

═══════════════════════════════════════════════════════════════

PATTERN PIECES
──────────────
${patternData?.pattern_pieces?.map(p => `
┌─ ${p.name.toUpperCase()} ─────────────────────
│ Quantity: Cut ${p.quantity}
│ Dimensions: ${p.dimensions}
│ Grain Line: ${p.grain_direction}
│ Seam Allowance: ${p.seam_allowance || patternData.seam_allowance || '5/8"'}
│ Notches: ${p.notches?.join(', ') || 'As marked'}
└───────────────────────────────────────────`).join('\n') || 'See pattern layout'}

═══════════════════════════════════════════════════════════════

MATERIALS NEEDED
────────────────
FABRIC: ${patternData?.fabric_yardage || '2-3 yards'}

RECOMMENDED FABRICS:
${patternData?.fabric_recommendations?.map(f => `• ${f}`).join('\n') || '• Medium weight fabric'}

NOTIONS:
• Matching thread
• Pins or clips
• ${seamInfo?.value === 'bias' ? 'Bias tape/binding' : ''}
• ${seamInfo?.value === 'serged' ? 'Serger/overlocker thread' : ''}

═══════════════════════════════════════════════════════════════

SEWING INSTRUCTIONS
───────────────────
${patternData?.sewing_instructions?.map(s => `
STEP ${s.step}: ${s.title.toUpperCase()}
${s.description}
${s.seam_finish_tip ? `\n💡 Seam Finishing: ${s.seam_finish_tip}` : ''}
`).join('\n────────────────────────────────────────\n') || 'Follow standard construction methods'}

═══════════════════════════════════════════════════════════════

STYLE-SPECIFIC DETAILS (${styleInfo?.label || 'Classic'})
─────────────────────────────────────────
${patternData?.style_specific_details?.map(d => `• ${d}`).join('\n') || '• Follow pattern as drafted'}

═══════════════════════════════════════════════════════════════

PRO TIPS ✨
──────────
${patternData?.tips?.map(t => `• ${t}`).join('\n') || '• Press seams as you go\n• Test fit before finishing'}

═══════════════════════════════════════════════════════════════

DIFFICULTY: ${patternData?.difficulty_level || 'Intermediate'}
ESTIMATED TIME: ${patternData?.estimated_time || '2-4 hours'}

───────────────────────────────────────────────────────────────
Generated by Print Your Fit ✨
Your AI-Powered Pattern Making Assistant
───────────────────────────────────────────────────────────────
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrintYourFit_${clothingType}_${customOptions.styleModifier}_pattern.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle 3D model adjustments
  const handleModelAdjustments = (adjustments) => {
    setModelAdjustments(adjustments);
  };

  if (isGenerating) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <GlowCard glowColor="rainbow" className="p-12">
          <motion.div 
            className="flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="p-8 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <Scissors className="w-16 h-16 text-white" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                ✨ Creating Your Custom Pattern ✨
              </h3>
              <p className="text-gray-600 mt-2 text-lg">
                Applying {customOptions.styleModifier} style with {customOptions.seamFinish.replace('_', ' ')} seams...
              </p>
            </div>
            <div className="flex gap-2">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -15, 0],
                    backgroundColor: ['#FF69B4', '#8B5CF6', '#00CED1', '#FF69B4']
                  }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.15,
                    repeat: Infinity 
                  }}
                  className="w-4 h-4 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </GlowCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          {patternData ? '🎉 Your Pattern is Ready!' : '✨ Customize Your Pattern'}
        </h2>
        <p className="text-gray-600 mt-2">
          {patternData 
            ? `${patternData?.garment_name || `Custom ${clothingType}`} - ${patternData.customOptions?.styleModifier} style`
            : 'Choose your fabric, style, and finishing options'
          }
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {showCustomizer && !patternData ? (
          <motion.div
            key="customizer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Left: 3D Preview */}
            <Interactive3DViewer 
              clothingType={clothingType}
              measurements={measurements}
              onMeasurementsChange={handleModelAdjustments}
            />

            {/* Right: Customization Options */}
            <div className="space-y-4">
              <PatternCustomizer 
                options={customOptions}
                onOptionsChange={setCustomOptions}
              />
              
              {/* Generate Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <GlowButton onClick={generatePattern} variant="primary" className="text-xl px-10 py-5">
                  <Sparkles className="w-6 h-6 mr-2 inline" />
                  Generate Custom Pattern
                </GlowButton>
              </motion.div>
            </div>
          </motion.div>
        ) : patternData ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: 3D Preview */}
              <div className="lg:col-span-1">
                <Interactive3DViewer 
                  clothingType={clothingType}
                  measurements={measurements}
                  onMeasurementsChange={handleModelAdjustments}
                />
              </div>

              {/* Right: Pattern Details */}
              <div className="lg:col-span-2">
                <GlowCard glowColor="cyan" className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 gap-2 bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 p-2 rounded-xl border-3 border-black">
                      <TabsTrigger value="sketch" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
                        <FileText className="w-4 h-4 mr-1" /> Sketch
                      </TabsTrigger>
                      <TabsTrigger value="pattern" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
                        <Ruler className="w-4 h-4 mr-1" /> Pattern
                      </TabsTrigger>
                      <TabsTrigger value="instructions" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
                        <BookOpen className="w-4 h-4 mr-1" /> Steps
                      </TabsTrigger>
                      <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold text-xs">
                        <Settings className="w-4 h-4 mr-1" /> Info
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sketch" className="mt-6">
                      <div className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <img 
                          src={patternData?.flat_sketch_url} 
                          alt="Flat Sketch"
                          className="w-full h-auto bg-white"
                        />
                      </div>
                      <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-black">
                        <p className="text-sm font-bold text-purple-600 mb-1">Style: {patternData.customOptions?.styleModifier}</p>
                        <p className="text-gray-600 text-sm">{patternData?.style_notes || patternData?.flat_sketch_description}</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="pattern" className="mt-6">
                      <div className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <img 
                          src={patternData?.pattern_layout_url}
                          alt="Pattern Layout"
                          className="w-full h-auto bg-white"
                        />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                        {patternData?.pattern_pieces?.map((piece, i) => (
                          <div 
                            key={i}
                            className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-black"
                          >
                            <p className="font-bold text-purple-700">{piece.name}</p>
                            <p className="text-xs text-gray-500">Cut {piece.quantity} • {piece.grain_direction}</p>
                            <p className="text-xs text-gray-600 mt-1">{piece.dimensions}</p>
                            <p className="text-xs text-pink-500 mt-1">SA: {piece.seam_allowance || patternData.seam_allowance}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="instructions" className="mt-6">
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {patternData?.sewing_instructions?.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex gap-4 p-4 bg-gradient-to-r from-pink-50 via-purple-50 to-cyan-50 rounded-xl border-3 border-black"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 border-3 border-black flex items-center justify-center text-white font-bold">
                              {step.step}
                            </div>
                            <div>
                              <h4 className="font-bold text-purple-700">{step.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                              {step.seam_finish_tip && (
                                <p className="text-xs text-pink-600 mt-2 bg-pink-50 p-2 rounded-lg">
                                  ✂️ {step.seam_finish_tip}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="info" className="mt-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-pink-50 rounded-xl border-3 border-black">
                          <p className="text-xs font-bold text-pink-600 uppercase">Difficulty</p>
                          <p className="text-lg font-bold">{patternData?.difficulty_level || 'Intermediate'}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl border-3 border-black">
                          <p className="text-xs font-bold text-purple-600 uppercase">Time</p>
                          <p className="text-lg font-bold">{patternData?.estimated_time || '2-4 hours'}</p>
                        </div>
                        <div className="p-3 bg-cyan-50 rounded-xl border-3 border-black">
                          <p className="text-xs font-bold text-cyan-600 uppercase">Seam Allowance</p>
                          <p className="text-lg font-bold">{patternData?.seam_allowance || '5/8"'}</p>
                        </div>
                        <div className="p-3 bg-lime-50 rounded-xl border-3 border-black">
                          <p className="text-xs font-bold text-lime-600 uppercase">Fabric</p>
                          <p className="text-lg font-bold">{patternData?.fabric_yardage || '2-3 yards'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border-3 border-black">
                        <p className="text-xs font-bold text-orange-600 uppercase mb-2">Your Customizations</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-white rounded-full border-2 border-black text-xs font-bold">
                            {fabricTypes.find(f => f.value === patternData.customOptions?.fabricType)?.label || 'Woven'}
                          </span>
                          <span className="px-3 py-1 bg-white rounded-full border-2 border-black text-xs font-bold">
                            {styleModifiers.find(s => s.value === patternData.customOptions?.styleModifier)?.emoji} {patternData.customOptions?.styleModifier}
                          </span>
                          <span className="px-3 py-1 bg-white rounded-full border-2 border-black text-xs font-bold">
                            {seamFinishes.find(s => s.value === patternData.customOptions?.seamFinish)?.label || 'Serged'}
                          </span>
                        </div>
                      </div>

                      {patternData?.seam_finishing_notes && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-3 border-black">
                          <p className="text-xs font-bold text-purple-600 uppercase mb-1">Seam Finishing Notes</p>
                          <p className="text-sm text-gray-600">{patternData.seam_finishing_notes}</p>
                        </div>
                      )}

                      {patternData?.style_specific_details && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-xl border-3 border-black">
                          <p className="text-xs font-bold text-cyan-600 uppercase mb-2">Style Details ✨</p>
                          <ul className="space-y-1">
                            {patternData.style_specific_details.map((d, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-pink-500">•</span>
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </GlowCard>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-4 mt-6"
            >
              <GlowButton onClick={() => { setPatternData(null); setShowCustomizer(true); }} variant="secondary">
                <Settings className="w-5 h-5 mr-2 inline" />
                Customize Again
              </GlowButton>
              <GlowButton onClick={handleDownload} variant="primary" className="text-xl px-10">
                <Download className="w-6 h-6 mr-2 inline" />
                Download Pattern Packet
              </GlowButton>
              <GlowButton 
                onClick={() => setShowShareModal(true)} 
                variant="success"
                disabled={hasShared}
              >
                <Share2 className="w-5 h-5 mr-2 inline" />
                {hasShared ? 'Shared!' : 'Share to Community'}
              </GlowButton>
            </motion.div>

            {/* Community Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-center"
            >
              <Link 
                to={createPageUrl('Community')}
                className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 hover:underline"
              >
                <Users className="w-4 h-4" />
                Browse Community Showcase →
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareProjectModal
        isOpen={showShareModal}
        onClose={(success) => {
          setShowShareModal(false);
          if (success) setHasShared(true);
        }}
        project={project}
        patternData={patternData}
      />
    </div>
  );
}