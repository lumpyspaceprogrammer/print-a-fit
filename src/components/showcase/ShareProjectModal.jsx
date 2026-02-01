import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Sparkles, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GlowButton from '../ui/GlowButton';
import GlowCard from '../ui/GlowCard';
import { base44 } from '@/api/base44Client';

export default function ShareProjectModal({ isOpen, onClose, project, patternData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tips_from_maker: '',
    maker_name: ''
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (photos.length === 0 || !formData.title) return;
    
    setIsSubmitting(true);
    try {
      // Upload all photos
      const uploadedUrls = await Promise.all(
        photos.map(async (photo) => {
          const { file_url } = await base44.integrations.Core.UploadFile({ file: photo });
          return file_url;
        })
      );

      // Create shared project
      await base44.entities.SharedProject.create({
        project_id: project?.id,
        title: formData.title,
        description: formData.description,
        finished_photos: uploadedUrls,
        pattern_image_url: patternData?.flat_sketch_url,
        clothing_type: project?.clothing_type,
        fabric_type: patternData?.customOptions?.fabricType,
        style_modifier: patternData?.customOptions?.styleModifier,
        seam_finish: patternData?.customOptions?.seamFinish,
        difficulty_level: patternData?.difficulty_level,
        estimated_time: patternData?.estimated_time,
        tips_from_maker: formData.tips_from_maker,
        maker_name: formData.maker_name,
        likes_count: 0
      });

      onClose(true);
    } catch (error) {
      console.error('Error sharing project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => onClose(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <GlowCard glowColor="rainbow" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-500" />
                Share Your Creation
              </h2>
              <button
                onClick={() => onClose(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Photo Upload */}
              <div>
                <Label className="text-sm font-bold text-gray-700 mb-2 block">
                  Photos of Your Finished Garment *
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {photoPreviews.map((preview, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-3 border-black">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full border-2 border-black"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {photoPreviews.length < 6 && (
                    <label className="aspect-square rounded-xl border-3 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-colors">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label className="text-sm font-bold text-gray-700 mb-2 block">
                  Title *
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., My First Vintage Blouse"
                  className="border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              {/* Maker Name */}
              <div>
                <Label className="text-sm font-bold text-gray-700 mb-2 block">
                  Your Name (optional)
                </Label>
                <Input
                  value={formData.maker_name}
                  onChange={(e) => setFormData({ ...formData, maker_name: e.target.value })}
                  placeholder="How should we credit you?"
                  className="border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-bold text-gray-700 mb-2 block">
                  Tell Us About Your Project
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Share your sewing journey..."
                  className="border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] min-h-[100px]"
                />
              </div>

              {/* Tips */}
              <div>
                <Label className="text-sm font-bold text-gray-700 mb-2 block">
                  Tips for Other Makers
                </Label>
                <Textarea
                  value={formData.tips_from_maker}
                  onChange={(e) => setFormData({ ...formData, tips_from_maker: e.target.value })}
                  placeholder="Any advice for someone making this pattern?"
                  className="border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              {/* Project Details Preview */}
              {project && (
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-3 border-black">
                  <p className="text-xs font-bold text-gray-500 mb-2">PROJECT DETAILS</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full border-2 border-black text-xs font-bold">
                      {project.clothing_type}
                    </span>
                    {patternData?.customOptions?.styleModifier && (
                      <span className="px-3 py-1 bg-white rounded-full border-2 border-black text-xs font-bold">
                        {patternData.customOptions.styleModifier}
                      </span>
                    )}
                    {patternData?.customOptions?.fabricType && (
                      <span className="px-3 py-1 bg-white rounded-full border-2 border-black text-xs font-bold">
                        {patternData.customOptions.fabricType}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => onClose(false)}
                  className="border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  Cancel
                </Button>
                <GlowButton
                  onClick={handleSubmit}
                  disabled={isSubmitting || photos.length === 0 || !formData.title}
                  variant="success"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Share with Community
                    </>
                  )}
                </GlowButton>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}