import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Users } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';

export default function BottomTabs() {
  const location = useLocation();
  
  const tabs = [
    { icon: Home, label: 'Home', path: createPageUrl('Home') },
    { icon: Upload, label: 'Create', path: createPageUrl('Upload') },
    { icon: Users, label: 'Community', path: createPageUrl('Community') }
  ];
  
  const isActive = (path) => {
    const currentPath = location.pathname;
    return currentPath === path || currentPath === path + '/';
  };
  
  // Preserve scroll position when switching tabs
  const handleTabClick = (path) => {
    const currentPath = location.pathname;
    if (currentPath !== path) {
      sessionStorage.setItem(`scroll_${currentPath}`, window.scrollY.toString());
    }
  };
  
  React.useEffect(() => {
    const savedScroll = sessionStorage.getItem(`scroll_${location.pathname}`);
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
    }
  }, [location.pathname]);
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t-4 border-black dark:border-white shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0_-4px_0px_0px_rgba(255,255,255,1)] bottom-tabs-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center h-16 px-2 select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all",
                active 
                  ? "text-purple-600 dark:text-purple-400" 
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all",
                  active && "scale-110"
                )} 
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={cn(
                "text-xs font-bold mt-1",
                active && "scale-105"
              )}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}