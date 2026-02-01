import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Sparkles, Filter, TrendingUp, Clock, Heart, Loader2, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowCard from '../components/ui/GlowCard';
import GlowButton from '../components/ui/GlowButton';
import ProjectCard from '../components/showcase/ProjectCard';
import AISuggestions from '../components/showcase/AISuggestions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';

export default function Community() {
  const [sharedProjects, setSharedProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [shared, user] = await Promise.all([
        base44.entities.SharedProject.list('-created_date', 50),
        base44.entities.Project.list('-created_date', 10)
      ]);
      setSharedProjects(shared || []);
      setUserProjects(user || []);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = sharedProjects
    .filter(p => filter === 'all' || p.clothing_type === filter)
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.likes_count || 0) - (a.likes_count || 0);
      return new Date(b.created_date) - new Date(a.created_date);
    });

  const clothingTypes = ['all', 'top', 'bottom', 'dress', 'outerwear', 'jumpsuit'];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200">
      <FloatingShapes />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link 
            to={createPageUrl('Home')}
            className="inline-flex items-center gap-2 text-purple-600 font-bold mb-4 hover:text-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3">
            <Users className="w-12 h-12 text-purple-500" />
            Community Showcase
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            Get inspired by creations from makers around the world
          </p>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <AISuggestions 
            userProjects={userProjects}
            sharedProjects={sharedProjects}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <GlowCard glowColor="cyan" className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-sm">Filter:</span>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black">
                    {clothingTypes.map(type => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type === 'all' ? '✨ All Types' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Sort:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm transition-all ${
                      sortBy === 'recent'
                        ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    Recent
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm transition-all ${
                      sortBy === 'popular'
                        ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Popular
                  </button>
                </div>
              </div>

              <div className="ml-auto">
                <span className="text-sm text-gray-500 font-medium">
                  {filteredProjects.length} projects
                </span>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-purple-500" />
            </motion.div>
            <p className="mt-4 text-gray-600 font-medium">Loading community projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlowCard glowColor="rainbow" className="p-12 text-center">
              <div className="text-6xl mb-4">🧵</div>
              <h3 className="text-2xl font-bold mb-2">No Projects Yet!</h3>
              <p className="text-gray-600 mb-6">
                Be the first to share your creation with the community
              </p>
              <Link to={createPageUrl('Upload')}>
                <GlowButton variant="primary">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Your First Pattern
                </GlowButton>
              </Link>
            </GlowCard>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <GlowCard glowColor="pink" className="p-8 inline-block">
            <h3 className="text-xl font-bold mb-2">Made something amazing?</h3>
            <p className="text-gray-600 mb-4">Share your finished garment and inspire others!</p>
            <Link to={createPageUrl('Upload')}>
              <GlowButton variant="success">
                <Heart className="w-5 h-5 mr-2" />
                Start Creating
              </GlowButton>
            </Link>
          </GlowCard>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/30 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}