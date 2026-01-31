import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ruler, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/shared/StepIndicator';
import GlowButton from '@/components/shared/GlowButton';
import NeoCard from '@/components/shared/NeoCard';
import SparkleDecoration from '@/components/shared/SparkleDecoration';
import ClothingTypeSelector from '@/components/measurements/ClothingTypeSelector';
import MeasurementForm from '@/components/measurements/MeasurementForm';
import MeasurementDiagram from '@/components/measurements/MeasurementDiagram';
import { createPageUrl } from '@/utils';

const clothingTypes = [
  { id: 'top', label: 'Top/Shirt', emoji: '👕' },
  { id: 'dress', label: 'Dress', emoji: '👗' },
  { id: 'pants', label: 'Pants/Trousers', emoji: '👖' },
  { id: 'skirt', label: 'Skirt', emoji: '🩱' },
  { id: 'jacket', label: 'Jacket/Coat', emoji: '🧥' },
  { id: 'shorts', label: 'Shorts', emoji: '🩳' },
];

const measurementsByType = {
  top: [
    { id: 'chest', label: 'Chest', unit: 'in', description: 'Around the fullest part of your chest' },
    { id: 'waist', label: 'Waist', unit: 'in', description: 'Around your natural waistline' },
    { id: 'shoulder', label: 'Shoulder Width', unit: 'in', description: 'From shoulder point to shoulder point' },
    { id: 'sleeve', label: 'Sleeve Length', unit: 'in', description: 'From shoulder to wrist' },
    { id: 'length', label: 'Garment Length', unit: 'in', description: 'From highest shoulder point to hem' },
  ],
  dress: [
    { id: 'bust', label: 'Bust', unit: 'in', description: 'Around the fullest part of your bust' },
    { id: 'waist', label: 'Waist', unit: 'in', description: 'Around your natural waistline' },
    { id: 'hip', label: 'Hip', unit: 'in', description: 'Around the fullest part of your hips' },
    { id: 'shoulder', label: 'Shoulder Width', unit: 'in', description: 'From shoulder point to shoulder point' },
    { id: 'length', label: 'Dress Length', unit: 'in', description: 'From highest shoulder point to hem' },
  ],
  pants: [
    { id: 'waist', label: 'Waist', unit: 'in', description: 'Around your natural waistline' },
    { id: 'hip', label: 'Hip', unit: 'in', description: 'Around the fullest part of your hips' },
    { id: 'inseam', label: 'Inseam', unit: 'in', description: 'From crotch to ankle' },
    { id: 'outseam', label: 'Outseam', unit: 'in', description: 'From waist to ankle (outer leg)' },
    { id: 'thigh', label: 'Thigh', unit: 'in', description: 'Around the fullest part of your thigh' },
  ],
  skirt: [
    { id: 'waist', label: 'Waist', unit: 'in', description: 'Around your natural waistline' },
    { id: 'hip', label: 'Hip', unit: 'in', description: 'Around the fullest part of your hips' },
    { id: 'length', label: 'Skirt Length', unit: 'in', description: 'From waist to hem' },
  ],
  jacket: [
    { id: 'chest', label: 'Chest', unit: 'in', description: 'Around the fullest part of your chest' },
    { id: 'waist', label: 'Waist', unit: 'in', description: 'Around your natural waistline' },
    { id: 'shoulder', label: 'Shoulder Width', unit: 'in', description: 'From shoulder point to shoulder point' },
    { id: 'sleeve', label: 'Sleeve Length', unit: 'in', description: 'From shoulder to wrist' },
    { id: 'length', label: 'Jacket Length', unit: 'in', description: 'From highest shoulder point to hem' },
  ],
  shorts: [
    { id: 'waist', label: 'Waist', unit: 'in', description: 'Around your natural waistline' },
    { id: 'hip', label: 'Hip', unit: 'in', description: 'Around the fullest part of your hips' },
    { id: 'inseam', label: 'Inseam', unit: 'in', description: 'From crotch to hem' },
    { id: 'outseam', label: 'Outseam', unit: 'in', description: 'From waist to hem (outer leg)' },
    { id: 'thigh', label: 'Thigh', unit: 'in', description: 'Around the fullest part of your thigh' },
  ],
};

export default function MeasurementsPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [measurements, setMeasurements] = useState({});
  const [activeMeasurement, setActiveMeasurement] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const image = params.get('image');
    if (image) {
      setImageUrl(image);
    }
  }, []);

  const handleMeasurementChange = (id, value) => {
    setMeasurements(prev => ({ ...prev, [id]: value }));
  };

  const handleContinue = () => {
    const params = new URLSearchParams();
    params.set('image', imageUrl);
    params.set('type', selectedType);
    params.set('measurements', JSON.stringify(measurements));
    navigate(createPageUrl('Pattern') + `?${params.toString()}`);
  };

  const handleBack = () => {
    navigate(createPageUrl('Refine') + `?image=${encodeURIComponent(imageUrl)}`);
  };

  const requiredMeasurements = selectedType ? measurementsByType[selectedType] : [];
  const allMeasurementsFilled = requiredMeasurements.every(m => measurements[m.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD6E8] via-[#D0F4FF] to-[#E8D5FF] p-4 md:p-8 relative overflow-hidden">
      <SparkleDecoration />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#FF6B9D] to-[#9B5DE5] mb-2"
              style={{ WebkitTextStroke: '1px black' }}>
            📏 Your Measurements 📏
          </h1>
        </motion.div>

        <StepIndicator currentStep={3} />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left side - Type selection and form */}
          <div className="space-y-6">
            <NeoCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00F5D4] to-[#B8F83A] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000]">
                  <Ruler className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-black">What are we making?</h2>
                  <p className="text-sm font-semibold text-[#9B5DE5]">Select your garment type</p>
                </div>
              </div>

              <ClothingTypeSelector 
                types={clothingTypes}
                selected={selectedType}
                onSelect={setSelectedType}
              />
            </NeoCard>

            <AnimatePresence>
              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <NeoCard className="p-6">
                    <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                      <span className="text-2xl">{clothingTypes.find(t => t.id === selectedType)?.emoji}</span>
                      Enter Your Measurements
                    </h3>
                    
                    <MeasurementForm 
                      measurements={requiredMeasurements}
                      values={measurements}
                      onChange={handleMeasurementChange}
                      onFocus={setActiveMeasurement}
                    />
                  </NeoCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side - Diagram and preview */}
          <div className="space-y-6">
            {/* Clothing image preview */}
            {imageUrl && (
              <NeoCard className="p-4">
                <p className="text-center font-black text-[#9B5DE5] mb-2">Your Garment</p>
                <div className="rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0_0_#000] bg-white">
                  <img 
                    src={imageUrl} 
                    alt="Your garment" 
                    className="w-full h-48 object-contain"
                  />
                </div>
              </NeoCard>
            )}

            {/* Measurement diagram */}
            <AnimatePresence>
              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <NeoCard className="p-6">
                    <h3 className="text-xl font-black text-black mb-4 text-center">
                      How to Measure 📐
                    </h3>
                    <MeasurementDiagram 
                      type={selectedType}
                      activeMeasurement={activeMeasurement}
                    />
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
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >
          <GlowButton onClick={handleBack} variant="secondary">
            <ArrowLeft className="w-5 h-5" />
            Back
          </GlowButton>
          
          <GlowButton 
            onClick={handleContinue}
            disabled={!selectedType || !allMeasurementsFilled}
          >
            Generate Pattern
            <ArrowRight className="w-5 h-5" />
          </GlowButton>
        </motion.div>
      </div>
    </div>
  );
}