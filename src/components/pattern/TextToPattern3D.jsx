import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GlowCard from '../ui/GlowCard';
import Interactive3DViewer from './Interactive3DViewer';

export default function TextToPattern3D() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const examples = [
    "A-line skirt with pockets, knee-length, high waisted",
    "Fitted button-down shirt with French cuffs and collar",
    "Oversized hoodie with kangaroo pocket and drawstring",
    "Flowy maxi dress with empire waist and flutter sleeves",
    "Cropped wide-leg pants with elastic waistband"
  ];

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    setShowPreview(false);

    try {
      // Generate 3D model parameters from description
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this garment description and extract 3D modeling parameters:

Description: "${description}"

Generate realistic garment specifications that can be visualized in 3D. Focus on:
1. Clothing type classification
2. Silhouette and fit characteristics
3. Measurements and proportions
4. Fabric properties based on garment type
5. Style details that affect the 3D shape

Provide practical values for 3D visualization.`,
        response_json_schema: {
          type: "object",
          properties: {
            clothing_type: {
              type: "string",
              enum: ["top", "bottom", "dress", "outerwear", "jumpsuit"],
              description: "Primary clothing category"
            },
            garment_name: {
              type: "string",
              description: "Short descriptive name"
            },
            measurements: {
              type: "object",
              properties: {
                lengthScale: {
                  type: "number",
                  description: "1.0 is normal, 0.7-1.3 range for short to long"
                },
                widthScale: {
                  type: "number",
                  description: "1.0 is normal, 0.7-1.3 for fitted to oversized"
                },
                sleeveScale: {
                  type: "number",
                  description: "0.5-1.5 for sleeve length variations"
                }
              }
            },
            fabric_properties: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["cotton", "silk", "denim", "velvet", "leather", "linen", "jersey", "satin"],
                  description: "Fabric type best suited for this garment"
                },
                weight: {
                  type: "number",
                  description: "0-1 scale, 0=very light, 1=very heavy"
                },
                stretch: {
                  type: "number",
                  description: "0-1 scale, 0=no stretch, 1=very stretchy"
                },
                drape: {
                  type: "number",
                  description: "0-1 scale, 0=structured, 1=flows freely"
                }
              }
            },
            style_notes: {
              type: "array",
              items: { type: "string" },
              description: "Key style features from the description"
            },
            recommended_color: {
              type: "string",
              description: "Hex color code that suits the garment"
            }
          }
        }
      });

      setGeneratedData(result);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating 3D pattern:', error);
      alert('Failed to generate pattern. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlowCard glowColor="pink" className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold">Text to 3D Pattern</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Describe Your Garment
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: A-line skirt with pockets, knee-length..."
              className="min-h-24 border-3 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
            />
          </div>

          {/* Example suggestions */}
          <div>
            <Label className="text-xs font-bold text-gray-600 mb-2 block">
              Try these examples:
            </Label>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setDescription(example)}
                  className="text-xs px-3 py-1.5 bg-white border-2 border-black rounded-lg hover:bg-purple-50 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              onClick={handleGenerate}
              disabled={!description.trim() || isGenerating}
              className={`
                bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold
                border-3 border-black rounded-xl px-6 py-3
                shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
                active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                transform hover:scale-105 active:scale-95
                transition-all duration-200
                ${(!description.trim() || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate 3D Model
                </>
              )}
            </Button>
          </div>
        </div>
      </GlowCard>

      {/* Generated Result */}
      {showPreview && generatedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Info card */}
          <GlowCard glowColor="cyan" className="p-4">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-bold text-lg mb-2">{generatedData.garment_name}</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-bold">Type:</span> {generatedData.clothing_type}
                  </p>
                  <p>
                    <span className="font-bold">Fabric:</span> {generatedData.fabric_properties.type}
                  </p>
                  {generatedData.style_notes && generatedData.style_notes.length > 0 && (
                    <div>
                      <span className="font-bold">Style Features:</span>
                      <ul className="list-disc list-inside mt-1">
                        {generatedData.style_notes.slice(0, 3).map((note, idx) => (
                          <li key={idx} className="text-gray-700">{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlowCard>

          {/* 3D Preview */}
          <Interactive3DViewer
            clothingType={generatedData.clothing_type}
            measurements={{
              values: generatedData.measurements
            }}
            initialSettings={{
              texture: generatedData.fabric_properties.type,
              color: generatedData.recommended_color || '#e9d5ff',
              fabricProps: {
                weight: generatedData.fabric_properties.weight,
                stretch: generatedData.fabric_properties.stretch,
                drape: generatedData.fabric_properties.drape
              },
              adjustments: {
                lengthScale: generatedData.measurements.lengthScale || 1,
                widthScale: generatedData.measurements.widthScale || 1,
                sleeveScale: generatedData.measurements.sleeveScale || 1
              }
            }}
          />

          {/* Next Steps */}
          <GlowCard glowColor="pink" className="p-6">
            <h4 className="font-bold text-lg mb-3">✨ Love your 3D preview? Let's make it real!</h4>
            <p className="text-sm text-gray-600 mb-4">
              Want to create a full sewing pattern with measurements, instructions, and printable templates?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  // Switch to full pattern generator tab and pre-fill the description
                  const fullTabTrigger = document.querySelector('[value="full"]');
                  if (fullTabTrigger) {
                    fullTabTrigger.click();
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold border-3 border-black rounded-xl px-6 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 active:scale-95 transition-all"
              >
                <Wand2 className="w-5 h-5 mr-2 inline" />
                Generate Full Pattern
              </Button>
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex-1 border-3 border-black rounded-xl px-6 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
              >
                Create Another 3D Model
              </Button>
            </div>
          </GlowCard>
        </motion.div>
      )}
    </div>
  );
}