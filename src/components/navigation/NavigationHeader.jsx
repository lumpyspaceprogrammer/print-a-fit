import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';

export default function NavigationHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === createPageUrl('Home') || location.pathname === '/';
  
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(createPageUrl('Home'));
    }
  };
  
  return (
    <div className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b-4 border-black dark:border-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0_4px_0px_0px_rgba(255,255,255,1)]">
      <div className="flex items-center justify-between h-14 px-4 select-none">
        {isHomePage ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 border-2 border-black dark:border-white flex items-center justify-center">
                <span className="text-white font-black text-sm">P</span>
              </div>
              <span className="font-black text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Print A Fit
              </span>
            </div>
            <button
              onClick={() => navigate(createPageUrl('Settings'))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="font-bold text-gray-700 dark:text-gray-300">Back</span>
            </button>
            <button
              onClick={() => navigate(createPageUrl('Settings'))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}