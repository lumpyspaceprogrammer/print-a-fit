import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VersionComparisonModal({ isOpen, onClose, version1, version2 }) {
  if (!version1 || !version2) return null;

  const renderVersionCard = (version, side) => (
    <div className="flex-1 space-y-3">
      <div className="text-center">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
          {version.version_name}
        </h3>
        <p className="text-xs text-gray-500">
          {new Date(version.created_date).toLocaleDateString()}
        </p>
      </div>

      {/* Sketch */}
      {version.flat_sketch_url && (
        <div className="rounded-lg overflow-hidden border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <img 
            src={version.flat_sketch_url} 
            alt={version.version_name}
            className="w-full h-48 object-cover bg-white"
          />
        </div>
      )}

      {/* Style Details */}
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-bold text-gray-600 dark:text-gray-400">Style:</span>
          <p className="text-gray-800 dark:text-white">{version.custom_options?.styleModifier || 'N/A'}</p>
        </div>
        <div>
          <span className="font-bold text-gray-600 dark:text-gray-400">Fabric:</span>
          <p className="text-gray-800 dark:text-white">{version.custom_options?.fabricType || 'N/A'}</p>
        </div>
        <div>
          <span className="font-bold text-gray-600 dark:text-gray-400">Seam:</span>
          <p className="text-gray-800 dark:text-white">{version.custom_options?.seamFinish || 'N/A'}</p>
        </div>
      </div>

      {/* Style Preferences */}
      <div className="flex flex-wrap gap-2">
        {version.style_preferences?.sleeves && (
          <Badge className="text-xs bg-pink-100 text-pink-800">
            {version.style_preferences.sleeves}
          </Badge>
        )}
        {version.style_preferences?.necklines && (
          <Badge className="text-xs bg-purple-100 text-purple-800">
            {version.style_preferences.necklines}
          </Badge>
        )}
        {version.style_preferences?.collars && (
          <Badge className="text-xs bg-cyan-100 text-cyan-800">
            {version.style_preferences.collars}
          </Badge>
        )}
        {version.style_preferences?.pockets && (
          <Badge className="text-xs bg-lime-100 text-lime-800">
            {version.style_preferences.pockets}
          </Badge>
        )}
      </div>

      {/* Pattern Info */}
      {version.pattern_data && (
        <div className="p-3 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border-2 border-black dark:border-white text-xs space-y-1">
          <p><span className="font-bold">Difficulty:</span> {version.pattern_data.difficulty_level}</p>
          <p><span className="font-bold">Time:</span> {version.pattern_data.estimated_time}</p>
          <p><span className="font-bold">Pieces:</span> {version.pattern_data.pattern_pieces?.length || 0}</p>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-purple-500" />
            Compare Versions
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {renderVersionCard(version1, 'left')}
          
          {/* Divider */}
          <div className="hidden md:block absolute left-1/2 top-20 bottom-6 w-px bg-gradient-to-b from-pink-300 via-purple-300 to-cyan-300" />
          
          {renderVersionCard(version2, 'right')}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={onClose} variant="outline" className="border-2 border-black dark:border-white">
            Close Comparison
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}