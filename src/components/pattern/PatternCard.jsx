import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Ruler, ArrowDown, Layers } from 'lucide-react';
import NeoCard from '@/components/shared/NeoCard';

export default function PatternCard({ patternData, measurements }) {
  if (!patternData) return null;

  return (
    <NeoCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#FEE440] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000]">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-black">Pattern Pieces</h2>
          <p className="text-sm font-semibold text-[#9B5DE5]">
            {patternData.pattern_pieces?.length || 0} pieces to cut
          </p>
        </div>
      </div>

      {/* Fabric requirements */}
      <div className="mb-6 p-4 bg-gradient-to-r from-[#00F5D4]/20 to-[#B8F83A]/20 rounded-xl border-3 border-black">
        <h4 className="font-black text-sm mb-2">📦 Materials Needed</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-bold text-[#9B5DE5]">Fabric:</p>
            <p className="font-semibold">{patternData.fabric_yardage || '2-3 yards'}</p>
          </div>
          <div>
            <p className="font-bold text-[#9B5DE5]">Suggestions:</p>
            <p className="font-semibold text-xs">
              {patternData.fabric_suggestions?.slice(0, 2).join(', ') || 'Cotton, Linen'}
            </p>
          </div>
        </div>
      </div>

      {/* Pattern pieces */}
      <div className="space-y-4">
        {patternData.pattern_pieces?.map((piece, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-4 bg-white rounded-xl border-3 border-black shadow-[4px_4px_0_0_#000]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] border-2 border-black flex items-center justify-center text-white font-black text-sm">
                    {index + 1}
                  </span>
                  <h4 className="font-black text-lg">{piece.name}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Scissors className="w-4 h-4 text-[#FF6B9D]" />
                    <span className="font-bold">{piece.quantity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler className="w-4 h-4 text-[#9B5DE5]" />
                    <span className="font-semibold text-xs">{piece.dimensions}</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center gap-2">
                  <ArrowDown className="w-4 h-4 text-[#00F5D4]" />
                  <span className="text-xs font-bold text-[#00F5D4]">
                    Grain: {piece.grain_line}
                  </span>
                </div>
                
                {piece.notes && (
                  <p className="mt-2 text-xs font-semibold text-gray-600 bg-gray-100 p-2 rounded-lg">
                    💡 {piece.notes}
                  </p>
                )}
              </div>
              
              {/* Mini pattern piece visual */}
              <div className="w-16 h-20 bg-gradient-to-br from-[#FFD6E8] to-[#E8D5FF] rounded-lg border-2 border-black flex items-center justify-center">
                <div className="w-10 h-14 border-2 border-dashed border-[#9B5DE5] rounded relative">
                  <div className="absolute top-1/2 left-0 right-0 border-t border-[#00F5D4]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF6B9D] rounded-full border border-black" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notions */}
      {patternData.notions_needed && (
        <div className="mt-6 p-4 bg-gradient-to-r from-[#FEE440]/20 to-[#FF9F68]/20 rounded-xl border-3 border-black">
          <h4 className="font-black text-sm mb-2">🧵 Notions Needed</h4>
          <div className="flex flex-wrap gap-2">
            {patternData.notions_needed.map((notion, i) => (
              <span 
                key={i}
                className="px-3 py-1 bg-white rounded-full border-2 border-black text-xs font-bold"
              >
                {notion}
              </span>
            ))}
          </div>
        </div>
      )}
    </NeoCard>
  );
}