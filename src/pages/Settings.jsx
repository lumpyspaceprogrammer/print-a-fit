import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, LogOut, User, Shield, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import GlowCard from '../components/ui/GlowCard';
import GlowButton from '../components/ui/GlowButton';
import { createPageUrl } from '@/utils';
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

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        navigate(createPageUrl('Home'));
        return;
      }
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      navigate(createPageUrl('Home'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Delete user account using Base44 auth client
      await base44.auth.deleteAccount();
      navigate(createPageUrl('Home'));
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent text-center">
            Settings
          </h1>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlowCard glowColor="purple" className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-3 border-black dark:border-white flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold dark:text-white">{user?.full_name || 'User'}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
              </div>
            </div>
            {user?.role === 'admin' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-lg border-2 border-purple-500 w-fit">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Admin</span>
              </div>
            )}
          </GlowCard>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Logout */}
          <GlowCard glowColor="cyan" className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between group select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 border-2 border-black dark:border-white flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="font-bold dark:text-white">Log Out</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sign out of your account</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </GlowCard>

          {/* Delete Account */}
          <GlowCard glowColor="pink" className="p-4">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full flex items-center justify-between group select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 border-2 border-black dark:border-white flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-red-600 dark:text-red-400">Delete Account</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Permanently remove your account</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </GlowCard>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="border-4 border-black dark:border-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black">Delete Account?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                disabled={isDeleting}
                className="border-3 border-black dark:border-white font-bold"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white border-3 border-black dark:border-white font-bold"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}