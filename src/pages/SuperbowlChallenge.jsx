import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Upload, Loader2, Heart, Shirt } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FloatingShapes from '../components/ui/FloatingShapes';
import GlowCard from '../components/ui/GlowCard';
import GlowButton from '../components/ui/GlowButton';
import { createPageUrl } from '@/utils';

export default function SuperbowlChallenge() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [userEntry, setUserEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const team = urlParams.get('team');
    if (team) setSelectedTeam(team);
    
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const allEntries = await base44.entities.SuperbowlEntry.list('-created_date', 100);
      setEntries(allEntries || []);
      
      // Check if user has already entered
      const user = await base44.auth.me();
      if (user) {
        const userSub = await base44.entities.UserSubscription.filter({ created_by: user.email });
        if (userSub?.[0]?.superbowl_entry_submitted) {
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

  // Calculate team counts
  const chiefsPicks = entries.filter(e => e.team_pick === 'chiefs').length;
  const eaglesPicks = entries.filter(e => e.team_pick === 'eagles').length;
  const totalPicks = chiefsPicks + eaglesPicks || 1;
  const chiefsPercent = Math.round((chiefsPicks / totalPicks) * 100);
  const eaglesPercent = Math.round((eaglesPicks / totalPicks) * 100);

  const handleStartChallenge = () => {
    if (!selectedTeam) return;
    navigate(createPageUrl('Upload') + `?challenge=superbowl&team=${selectedTeam}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Field pattern background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-full h-px bg-white"
            style={{ top: `${(i + 1) * 10}%` }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link 
            to={createPageUrl('Home')}
            className="inline-flex items-center gap-2 text-white/80 font-bold mb-4 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="p-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-2">
            🏈 SUPERBOWL
          </h1>
          <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
            FASHION CHALLENGE
          </h2>
          <p className="text-white/80 mt-4 text-lg max-w-2xl mx-auto">
            Create your ultimate game day outfit, pick your team, and compete for prizes!
          </p>
        </motion.div>

        {/* Team Meter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <GlowCard glowColor="rainbow" className="p-6 bg-white/95">
            <h3 className="text-center font-bold text-gray-700 mb-4">WHO'S WINNING?</h3>
            
            {/* Team Labels */}
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🔴</span>
                <div>
                  <p className="font-black text-red-600 text-lg">CHIEFS</p>
                  <p className="text-sm text-gray-500">{chiefsPicks} picks</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-right">
                <div>
                  <p className="font-black text-green-700 text-lg">EAGLES</p>
                  <p className="text-sm text-gray-500">{eaglesPicks} picks</p>
                </div>
                <span className="text-3xl">🟢</span>
              </div>
            </div>

            {/* The Meter */}
            <div className="relative h-12 rounded-full border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 flex">
                {/* Chiefs side */}
                <motion.div
                  initial={{ width: '50%' }}
                  animate={{ width: `${chiefsPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-start pl-4"
                >
                  <span className="text-white font-black text-xl drop-shadow-lg">
                    {chiefsPercent}%
                  </span>
                </motion.div>
                
                {/* Eagles side */}
                <motion.div
                  initial={{ width: '50%' }}
                  animate={{ width: `${eaglesPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-end pr-4"
                >
                  <span className="text-white font-black text-xl drop-shadow-lg">
                    {eaglesPercent}%
                  </span>
                </motion.div>
              </div>
              
              {/* Center line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-black/30 -translate-x-1/2" />
            </div>

            <p className="text-center text-sm text-gray-500 mt-3">
              {totalPicks - 1} creators have made their picks!
            </p>
          </GlowCard>
        </motion.div>

        {/* Team Selection & Start */}
        {!userEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <GlowCard glowColor="cyan" className="p-6 bg-white/95">
              <h3 className="text-center font-bold text-xl mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                JOIN THE CHALLENGE - FREE!
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTeam('chiefs')}
                  className={`p-4 rounded-xl border-4 transition-all ${
                    selectedTeam === 'chiefs'
                      ? 'bg-red-100 border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]'
                      : 'bg-gray-50 border-black hover:bg-red-50'
                  }`}
                >
                  <div className="text-4xl mb-2">🔴</div>
                  <p className="font-black text-red-600">CHIEFS</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTeam('eagles')}
                  className={`p-4 rounded-xl border-4 transition-all ${
                    selectedTeam === 'eagles'
                      ? 'bg-green-100 border-green-600 shadow-[4px_4px_0px_0px_rgba(22,163,74,1)]'
                      : 'bg-gray-50 border-black hover:bg-green-50'
                  }`}
                >
                  <div className="text-4xl mb-2">🟢</div>
                  <p className="font-black text-green-700">EAGLES</p>
                </motion.button>
              </div>

              <div className="text-center">
                <GlowButton
                  onClick={handleStartChallenge}
                  variant="success"
                  disabled={!selectedTeam}
                  className={!selectedTeam ? 'opacity-50' : ''}
                >
                  <Shirt className="w-5 h-5 mr-2 inline" />
                  Create My Game Day Outfit
                </GlowButton>
                <p className="text-sm text-gray-500 mt-2">
                  ✨ This pattern is FREE - no subscription needed!
                </p>
              </div>
            </GlowCard>
          </motion.div>
        )}

        {/* Entries Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-center text-2xl font-bold text-white mb-6">
            🔥 Community Entries
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <GlowCard glowColor="pink" className="p-8 text-center max-w-md mx-auto bg-white/95">
              <div className="text-5xl mb-4">🏈</div>
              <h4 className="text-xl font-bold mb-2">Be the First!</h4>
              <p className="text-gray-600">No entries yet. Create the first game day outfit!</p>
            </GlowCard>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${
                    entry.team_pick === 'chiefs' ? 'bg-red-50' : 'bg-green-50'
                  }`}
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
                      <span className="text-xl">
                        {entry.team_pick === 'chiefs' ? '🔴' : '🟢'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                        entry.team_pick === 'chiefs' ? 'bg-red-500' : 'bg-green-600'
                      }`}>
                        {entry.team_pick?.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold line-clamp-1">{entry.title || 'Game Day Outfit'}</h4>
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