import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Star, Trash2, Eye, GitBranch, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function PatternVersionManager({ 
  projectId, 
  currentPattern, 
  customOptions,
  stylePreferences,
  onRestoreVersion 
}) {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadVersions();
  }, [projectId]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const allVersions = await base44.entities.PatternVersion.filter({ project_id: projectId });
      setVersions(allVersions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!versionName.trim()) {
      toast.error('Please enter a version name');
      return;
    }

    setIsSaving(true);
    try {
      await base44.entities.PatternVersion.create({
        project_id: projectId,
        version_name: versionName.trim(),
        custom_options: customOptions,
        style_preferences: stylePreferences,
        pattern_data: currentPattern,
        flat_sketch_url: currentPattern?.flat_sketch_url,
        pattern_layout_url: currentPattern?.pattern_layout_url,
        is_favorite: false
      });

      toast.success(`Version "${versionName}" saved!`);
      setVersionName('');
      setShowSaveDialog(false);
      loadVersions();
    } catch (error) {
      console.error('Error saving version:', error);
      toast.error('Failed to save version');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async (version) => {
    try {
      await base44.entities.PatternVersion.update(version.id, {
        is_favorite: !version.is_favorite
      });
      loadVersions();
      toast.success(version.is_favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteVersion = async (versionId) => {
    try {
      await base44.entities.PatternVersion.delete(versionId);
      loadVersions();
      toast.success('Version deleted');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting version:', error);
      toast.error('Failed to delete version');
    }
  };

  const handleRestoreVersion = (version) => {
    onRestoreVersion({
      customOptions: version.custom_options,
      stylePreferences: version.style_preferences,
      patternData: version.pattern_data
    });
    toast.success(`Restored version: ${version.version_name}`);
  };

  const getStyleSummary = (version) => {
    const parts = [];
    if (version.custom_options?.styleModifier) parts.push(version.custom_options.styleModifier);
    if (version.custom_options?.fabricType) parts.push(version.custom_options.fabricType);
    if (version.style_preferences?.sleeves) parts.push(version.style_preferences.sleeves);
    return parts.slice(0, 3).join(', ');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">
            Pattern Versions
          </h3>
          <Badge variant="outline" className="border-2 border-black dark:border-white">
            {versions.length}
          </Badge>
        </div>
        <Button
          onClick={() => setShowSaveDialog(true)}
          disabled={!currentPattern}
          className="border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Current
        </Button>
      </div>

      {/* Save Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Save Pattern Version</AlertDialogTitle>
            <AlertDialogDescription>
              Give this version a memorable name to easily identify it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="e.g., 'Summer Dress v1' or 'Puff Sleeves Variation'"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveVersion()}
            className="border-2 border-black dark:border-white"
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black dark:border-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSaveVersion}
              disabled={isSaving || !versionName.trim()}
              className="bg-purple-500 hover:bg-purple-600 border-2 border-black dark:border-white"
            >
              {isSaving ? 'Saving...' : 'Save Version'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="border-3 border-black dark:border-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Version?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteConfirm?.version_name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black dark:border-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteVersion(deleteConfirm.id)}
              className="bg-red-500 hover:bg-red-600 border-2 border-black dark:border-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Versions List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading versions...</div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No saved versions yet</p>
            <p className="text-xs mt-1">Save your current pattern to compare iterations</p>
          </div>
        ) : (
          <AnimatePresence>
            {versions.map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {version.is_favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <h4 className="font-bold text-gray-800 dark:text-white">
                        {version.version_name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(version.created_date), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleFavorite(version)}
                      className="h-8 w-8"
                    >
                      <Star className={`w-4 h-4 ${version.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteConfirm(version)}
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Style Summary */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {version.custom_options?.styleModifier && (
                    <Badge className="text-xs bg-pink-100 text-pink-800 border-pink-300">
                      {version.custom_options.styleModifier}
                    </Badge>
                  )}
                  {version.custom_options?.fabricType && (
                    <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-300">
                      {version.custom_options.fabricType}
                    </Badge>
                  )}
                  {version.style_preferences?.sleeves && (
                    <Badge className="text-xs bg-cyan-100 text-cyan-800 border-cyan-300">
                      {version.style_preferences.sleeves} sleeves
                    </Badge>
                  )}
                  {version.style_preferences?.necklines && (
                    <Badge className="text-xs bg-lime-100 text-lime-800 border-lime-300">
                      {version.style_preferences.necklines}
                    </Badge>
                  )}
                </div>

                {/* Thumbnail */}
                {version.flat_sketch_url && (
                  <div className="mb-3 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <img 
                      src={version.flat_sketch_url} 
                      alt={version.version_name}
                      className="w-full h-32 object-cover bg-white"
                    />
                  </div>
                )}

                {/* Action */}
                <Button
                  onClick={() => handleRestoreVersion(version)}
                  variant="outline"
                  className="w-full border-2 border-black dark:border-white"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Restore This Version
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}