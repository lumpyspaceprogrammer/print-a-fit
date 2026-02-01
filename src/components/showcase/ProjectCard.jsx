import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const styleEmojis = {
  classic: '👔',
  vintage: '🎀',
  modern: '⚡',
  oversized: '🧸',
  fitted: '💃',
  minimalist: '◻️'
};

const fabricLabels = {
  woven: 'Woven',
  knit: 'Knit',
  stretch: 'Stretch',
  denim: 'Denim',
  silk: 'Delicate',
  leather: 'Leather'
};

export default function ProjectCard({ project, onLike }) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(project.likes_count || 0);

  const photos = project.finished_photos || [];

  const handleLike = async () => {
    if (isLiked) return;
    
    setIsLiked(true);
    setLikesCount(prev => prev + 1);
    
    try {
      await base44.entities.SharedProject.update(project.id, {
        likes_count: likesCount + 1
      });
    } catch (error) {
      console.error('Error liking project:', error);
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    }
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* Photo Carousel */}
      <div className="relative aspect-square bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100">
        {photos.length > 0 && (
          <img
            src={photos[currentPhoto]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full border-2 border-black hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full border-2 border-black hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full border border-black ${
                    i === currentPhoto ? 'bg-pink-400' : 'bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full border-2 border-black transition-all ${
            isLiked 
              ? 'bg-pink-400 scale-110' 
              : 'bg-white/80 hover:bg-pink-100'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white' : 'text-pink-500'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{project.title}</h3>
          <span className="flex items-center gap-1 text-sm text-pink-500 font-bold">
            <Heart className="w-4 h-4 fill-pink-500" />
            {likesCount}
          </span>
        </div>

        {project.maker_name && (
          <p className="text-sm text-gray-500 mb-2">by {project.maker_name}</p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="px-2 py-0.5 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border border-black text-xs font-bold">
            {project.clothing_type}
          </span>
          {project.style_modifier && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-full border border-black text-xs font-bold">
              {styleEmojis[project.style_modifier]} {project.style_modifier}
            </span>
          )}
          {project.fabric_type && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-100 to-lime-100 rounded-full border border-black text-xs font-bold">
              {fabricLabels[project.fabric_type] || project.fabric_type}
            </span>
          )}
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {project.difficulty_level && (
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              {project.difficulty_level}
            </span>
          )}
          {project.estimated_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              {project.estimated_time}
            </span>
          )}
        </div>

        {project.tips_from_maker && (
          <div className="mt-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
            <p className="text-xs font-bold text-orange-600 mb-1">💡 Maker's Tip</p>
            <p className="text-xs text-gray-600 line-clamp-2">{project.tips_from_maker}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}