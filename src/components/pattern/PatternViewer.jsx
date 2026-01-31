import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Ruler, Scissors, BookOpen, RotateCcw, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import * as THREE from 'three';

export default function PatternViewer({ refinedImage, measurements, clothingType }) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [patternData, setPatternData] = useState(null);
  const [activeTab, setActiveTab] = useState('sketch');
  const threeContainerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    generatePattern();
  }, []);

  useEffect(() => {
    if (patternData && threeContainerRef.current && !sceneRef.current) {
      init3DScene();
    }
    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose?.();
      }
    };
  }, [patternData]);

  const generatePattern = async () => {
    try {
      // Generate pattern details using AI
      const patternResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional pattern maker. Create detailed sewing pattern instructions for a ${clothingType}.

Measurements provided (in ${measurements.unit}):
${Object.entries(measurements.measurements).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Generate comprehensive pattern data including:
1. A flat sketch description (how the pattern pieces should look laid out)
2. All pattern pieces needed with dimensions
3. Seam allowances
4. Grain line directions
5. Notch placements
6. Step-by-step sewing instructions
7. Fabric recommendations
8. Estimated fabric yardage needed`,
        file_urls: [refinedImage],
        response_json_schema: {
          type: "object",
          properties: {
            garment_name: { type: "string" },
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
                  notches: { type: "array", items: { type: "string" } }
                }
              }
            },
            seam_allowance: { type: "string" },
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
                  description: { type: "string" }
                }
              }
            },
            tips: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Generate flat sketch image
      const sketchResult = await base44.integrations.Core.GenerateImage({
        prompt: `Technical flat sketch fashion illustration of a ${clothingType}. 
        ${patternResult.flat_sketch_description}.
        Style: Clean black line drawing on white background, professional fashion technical drawing, 
        front view, showing all seams, darts, and construction details.
        No shading, pure technical illustration style.`,
        existing_image_urls: [refinedImage]
      });

      // Generate pattern layout image
      const patternLayoutResult = await base44.integrations.Core.GenerateImage({
        prompt: `Sewing pattern layout diagram for a ${clothingType}.
        Pattern pieces arranged efficiently showing:
        ${patternResult.pattern_pieces?.map(p => `- ${p.name} (cut ${p.quantity})`).join('\n')}
        Style: Technical pattern diagram, black outlines on white/cream background,
        showing grain lines as arrows, notches as small triangles,
        fold lines as dashed lines, clean professional pattern drafting style.`
      });

      setPatternData({
        ...patternResult,
        flat_sketch_url: sketchResult.url,
        pattern_layout_url: patternLayoutResult.url
      });
    } catch (error) {
      console.error('Error generating pattern:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const init3DScene = () => {
    if (!threeContainerRef.current) return;

    const container = threeContainerRef.current;
    const width = container.clientWidth;
    const height = 400;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfce7f3);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create clothing mesh based on type
    let geometry;
    switch (clothingType) {
      case 'top':
        geometry = new THREE.BoxGeometry(2, 2.5, 0.3);
        break;
      case 'bottom':
        geometry = new THREE.CylinderGeometry(0.8, 0.6, 3, 8);
        break;
      case 'dress':
        geometry = new THREE.ConeGeometry(1.2, 3.5, 8);
        break;
      case 'outerwear':
        geometry = new THREE.BoxGeometry(2.2, 2.8, 0.5);
        break;
      case 'jumpsuit':
        geometry = new THREE.CapsuleGeometry(0.8, 2.5, 4, 8);
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2.5, 0.3);
    }

    // Gradient material
    const material = new THREE.MeshPhongMaterial({
      color: 0xe9d5ff,
      shininess: 30,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
    scene.add(wireframe);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.005;
      wireframe.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = { scene, renderer, dispose: () => {
      renderer.dispose();
      container.removeChild(renderer.domElement);
    }};
  };

  const handleDownload = () => {
    // Create downloadable content
    const content = `
PRINT YOUR FIT - SEWING PATTERN
================================

${patternData?.garment_name || clothingType.toUpperCase()}

MEASUREMENTS:
${Object.entries(measurements.measurements).map(([k, v]) => `${k}: ${v} ${measurements.unit}`).join('\n')}

PATTERN PIECES:
${patternData?.pattern_pieces?.map(p => `
• ${p.name} (Cut ${p.quantity})
  Dimensions: ${p.dimensions}
  Grain: ${p.grain_direction}
  Notches: ${p.notches?.join(', ') || 'None'}
`).join('\n') || 'See pattern layout'}

SEAM ALLOWANCE: ${patternData?.seam_allowance || '5/8" (1.5cm)'}

FABRIC RECOMMENDATIONS:
${patternData?.fabric_recommendations?.map(f => `• ${f}`).join('\n') || 'Medium weight woven fabric'}

ESTIMATED FABRIC NEEDED: ${patternData?.fabric_yardage || 'See instructions'}

DIFFICULTY: ${patternData?.difficulty_level || 'Intermediate'}
ESTIMATED TIME: ${patternData?.estimated_time || '2-4 hours'}

SEWING INSTRUCTIONS:
${patternData?.sewing_instructions?.map(s => `
Step ${s.step}: ${s.title}
${s.description}
`).join('\n') || 'Follow standard construction methods'}

TIPS:
${patternData?.tips?.map(t => `• ${t}`).join('\n') || '• Press seams as you go\n• Test fit before finishing'}

---
Generated by Print Your Fit ✨
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pattern-${clothingType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
                ✨ Creating Your Pattern ✨
              </h3>
              <p className="text-gray-600 mt-2 text-lg">AI is drafting your custom sewing pattern...</p>
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
          🎉 Your Pattern is Ready!
        </h2>
        <p className="text-gray-600 mt-2">{patternData?.garment_name || `Custom ${clothingType}`}</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: 3D Preview */}
        <div className="lg:col-span-1">
          <GlowCard glowColor="pink" className="p-4">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎨</span> 3D Preview
            </h3>
            <div 
              ref={threeContainerRef}
              className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100"
              style={{ minHeight: '400px' }}
            />
            <div className="flex justify-center gap-2 mt-4">
              <button className="p-2 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform">
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
          </GlowCard>
        </div>

        {/* Right: Pattern Details */}
        <div className="lg:col-span-2">
          <GlowCard glowColor="cyan" className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 gap-2 bg-gradient-to-r from-pink-100 via-purple-100 to-cyan-100 p-2 rounded-xl border-3 border-black">
                <TabsTrigger value="sketch" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold">
                  <FileText className="w-4 h-4 mr-1" /> Sketch
                </TabsTrigger>
                <TabsTrigger value="pattern" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold">
                  <Ruler className="w-4 h-4 mr-1" /> Pattern
                </TabsTrigger>
                <TabsTrigger value="instructions" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold">
                  <BookOpen className="w-4 h-4 mr-1" /> Steps
                </TabsTrigger>
                <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold">
                  <Scissors className="w-4 h-4 mr-1" /> Info
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
                <p className="mt-4 text-gray-600 text-sm">{patternData?.flat_sketch_description}</p>
              </TabsContent>

              <TabsContent value="pattern" className="mt-6">
                <div className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img 
                    src={patternData?.pattern_layout_url}
                    alt="Pattern Layout"
                    className="w-full h-auto bg-white"
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {patternData?.pattern_pieces?.map((piece, i) => (
                    <div 
                      key={i}
                      className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-black"
                    >
                      <p className="font-bold text-purple-700">{piece.name}</p>
                      <p className="text-xs text-gray-500">Cut {piece.quantity} • {piece.grain_direction}</p>
                      <p className="text-xs text-gray-600 mt-1">{piece.dimensions}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="mt-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {patternData?.sewing_instructions?.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 p-4 bg-gradient-to-r from-pink-50 via-purple-50 to-cyan-50 rounded-xl border-3 border-black"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 border-3 border-black flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-700">{step.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="info" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-pink-50 rounded-xl border-3 border-black">
                    <p className="text-xs font-bold text-pink-600 uppercase">Difficulty</p>
                    <p className="text-lg font-bold">{patternData?.difficulty_level || 'Intermediate'}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border-3 border-black">
                    <p className="text-xs font-bold text-purple-600 uppercase">Time</p>
                    <p className="text-lg font-bold">{patternData?.estimated_time || '2-4 hours'}</p>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-xl border-3 border-black">
                    <p className="text-xs font-bold text-cyan-600 uppercase">Seam Allowance</p>
                    <p className="text-lg font-bold">{patternData?.seam_allowance || '5/8"'}</p>
                  </div>
                  <div className="p-4 bg-lime-50 rounded-xl border-3 border-black">
                    <p className="text-xs font-bold text-lime-600 uppercase">Fabric Needed</p>
                    <p className="text-lg font-bold">{patternData?.fabric_yardage || '2-3 yards'}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border-3 border-black">
                  <p className="text-xs font-bold text-orange-600 uppercase mb-2">Recommended Fabrics</p>
                  <div className="flex flex-wrap gap-2">
                    {patternData?.fabric_recommendations?.map((fabric, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full border-2 border-black text-sm font-medium">
                        {fabric}
                      </span>
                    ))}
                  </div>
                </div>
                {patternData?.tips && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl border-3 border-black">
                    <p className="text-xs font-bold text-purple-600 uppercase mb-2">Pro Tips ✨</p>
                    <ul className="space-y-1">
                      {patternData.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-pink-500">•</span>
                          {tip}
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

      {/* Download Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <GlowButton onClick={handleDownload} variant="primary" className="text-xl px-12 py-5">
          <Download className="w-6 h-6 mr-3 inline" />
          Download Pattern Packet
        </GlowButton>
      </motion.div>
    </div>
  );
}