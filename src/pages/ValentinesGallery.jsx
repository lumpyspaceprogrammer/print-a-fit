import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Loader2, Gift } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowCard from '../components/ui/GlowCard';
import GlowButton from '../components/ui/GlowButton';
import { createPageUrl } from '@/utils';

export default function ValentinesGallery() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEntry, setUserEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const allEntries = await base44.entities.ValentinesEntry.list('-created_date', 100);
      setEntries(allEntries || []);
      
      // Check if user has already entered
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const user = await base44.auth.me();
        if (user) {
          const myEntry = allEntries.find(e => e.created_by === user.email);
          setUserEntry(myEntry);
        }
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCreating = () => {
    navigate(createPageUrl('Upload'));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-200 via-red-200 to-purple-200">
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
            className="inline-flex items-center gap-2 text-pink-700 font-bold mb-4 hover:text-pink-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="p-5 rounded-full bg-gradient-to-br from-pink-400 via-red-400 to-purple-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Gift className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-2">
            💝 Valentine's Day
          </h1>
          <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 bg-clip-text text-transparent">
            LOVE GIFTS GALLERY
          </h2>
          <p className="text-pink-800 mt-4 text-lg max-w-2xl mx-auto">
            Create handmade gifts for those you love (including yourself!)
          </p>
        </motion.div>

        {/* Start Creating Card */}
        {!userEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <GlowCard glowColor="pink" className="p-6 bg-white/95">
              <h3 className="text-center font-bold text-xl mb-4 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 bg-clip-text text-transparent">
                Make Someone's Day Special
              </h3>
              
              <p className="text-center text-gray-600 mb-6">
                Design a custom outfit pattern as a gift. Perfect for partners, friends, family, or treating yourself! 💕
              </p>

              <div className="text-center">
                <GlowButton
                  onClick={handleStartCreating}
                  variant="primary"
                >
                  <Heart className="w-5 h-5 mr-2 inline" fill="currentColor" />
                  Start Creating My Gift
                </GlowButton>
              </div>
            </GlowCard>
          </motion.div>
        )}

        {/* Entries Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-center text-2xl font-bold text-pink-800 mb-6">
            💕 Community Love Gifts
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <GlowCard glowColor="pink" className="p-8 text-center max-w-md mx-auto bg-white/95">
              <div className="text-5xl mb-4">💝</div>
              <h4 className="text-xl font-bold mb-2">Be the First!</h4>
              <p className="text-gray-600">No entries yet. Create the first Valentine's gift!</p>
            </GlowCard>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50"
                >
                  {entry.outfit_photo_url && (
                    <div className="aspect-square bg-gray-100">
                      <img 
                        src={entry.outfit_photo_url} 
                        alt={entry.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">💝</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-red-500">
                        For {entry.gift_for}
                      </span>
                    </div>
                    <h4 className="font-bold line-clamp-1">{entry.title || 'Valentine Gift'}</h4>
                    {entry.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{entry.description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-pink-500">
                      <Heart className="w-4 h-4 fill-pink-500" />
                      <span className="text-sm font-bold">{entry.likes_count || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}