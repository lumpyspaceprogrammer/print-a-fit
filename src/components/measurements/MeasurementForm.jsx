import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, ArrowRight, Info } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MeasurementDiagram, { diagrams } from './MeasurementDiagram';

const clothingTypes = [
  { value: 'top', label: '👕 Top / Shirt / Blouse' },
  { value: 'bottom', label: '👖 Pants / Shorts / Skirt' },
  { value: 'dress', label: '👗 Dress' },
  { value: 'outerwear', label: '🧥 Jacket / Coat / Hoodie' },
  { value: 'jumpsuit', label: '🩱 Jumpsuit / Romper' },
];

export default function MeasurementForm({ refinedImage, onMeasurementsSubmit }) {
  const [clothingType, setClothingType] = useState('');
  const [measurements, setMeasurements] = useState({});
  const [unit, setUnit] = useState('inches');

  const currentDiagram = diagrams[clothingType];

  const handleMeasurementChange = (key, value) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    onMeasurementsSubmit({
      clothingType,
      measurements,
      unit
    });
  };

  const isComplete = clothingType && currentDiagram?.measurements.every(m => measurements[m.key]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Image & Diagram */}
        <div className="space-y-4">
          <GlowCard glowColor="pink" className="p-4">
            <h3 className="text-sm font-bold text-gray-500 mb-2">YOUR REFINED IMAGE</h3>
            <div className="rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <img 
                src={refinedImage} 
                alt="Refined clothing" 
                className="w-full h-48 object-contain bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50"
              />
            </div>
          </GlowCard>

          {clothingType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MeasurementDiagram clothingType={clothingType} />
            </motion.div>
          )}
        </div>

        {/* Right: Form */}
        <div className="space-y-4">
          <GlowCard glowColor="rainbow" className="p-6">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
              <Ruler className="w-6 h-6 text-purple-500" />
              Enter Your Measurements
            </h2>

            {/* Clothing Type Selection */}
            <div className="mb-6">
              <Label className="text-sm font-bold text-gray-700 mb-2 block">
                What type of clothing is this?
              </Label>
              <Select value={clothingType} onValueChange={setClothingType}>
                <SelectTrigger className="border-3 border-black rounded-xl h-14 text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <SelectValue placeholder="Select clothing type..." />
                </SelectTrigger>
                <SelectContent className="border-3 border-black">
                  {clothingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="text-lg py-3">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Unit Toggle */}
            <div className="mb-6">
              <Label className="text-sm font-bold text-gray-700 mb-2 block">Unit</Label>
              <div className="flex gap-2">
                {['inches', 'cm'].map(u => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-6 py-2 rounded-lg border-3 border-black font-bold transition-all ${
                      unit === u 
                        ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    {u === 'inches' ? 'Inches' : 'Centimeters'}
                  </button>
                ))}
              </div>
            </div>

            {/* Measurement Inputs */}
            {clothingType && currentDiagram && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <TooltipProvider>
                  {currentDiagram.measurements.map((m, i) => (
                    <motion.div
                      key={m.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Label className="text-sm font-bold flex items-center gap-2 mb-2" style={{ color: m.color }}>
                        {m.label}
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="border-2 border-black bg-white">
                            <p className="max-w-xs">{m.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          value={measurements[m.key] || ''}
                          onChange={(e) => handleMeasurementChange(m.key, e.target.value)}
                          placeholder={`Enter ${m.label.split(':')[1]?.trim() || m.label}`}
                          className="border-3 border-black rounded-xl h-12 text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:ring-2 focus:ring-purple-400"
                          style={{ borderColor: measurements[m.key] ? m.color : undefined }}
                        />
                        <span className="text-sm font-bold text-gray-500 min-w-[40px]">
                          {unit === 'inches' ? 'in' : 'cm'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </TooltipProvider>
              </motion.div>
            )}

            {/* Submit Button */}
            {clothingType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex justify-center"
              >
                <GlowButton 
                  onClick={handleSubmit} 
                  disabled={!isComplete}
                  variant="success"
                  className={!isComplete ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Generate Pattern
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </GlowButton>
              </motion.div>
            )}
          </GlowCard>
        </div>
      </div>
    </div>
  );
}