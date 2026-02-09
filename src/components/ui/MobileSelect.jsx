import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Check } from 'lucide-react';

export default function MobileSelect({ 
  value, 
  onValueChange, 
  options = [], 
  placeholder = "Select...",
  label,
  className 
}) {
  const [open, setOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const handleSelect = (optionValue) => {
    onValueChange(optionValue);
    setOpen(false);
  };
  
  if (!isMobile) {
    // On desktop, render a regular select
    return (
      <select
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3 rounded-xl border-3 border-black dark:border-white font-bold",
          "bg-white dark:bg-gray-800 dark:text-white",
          "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]",
          "focus:outline-none focus:ring-2 focus:ring-purple-500",
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "w-full px-4 py-3 rounded-xl border-3 border-black dark:border-white font-bold text-left",
          "bg-white dark:bg-gray-800",
          "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
          "select-none",
          className
        )}
      >
        <span className={cn(
          selectedOption ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
        )}>
          {selectedOption?.label || placeholder}
        </span>
      </button>
      
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="border-t-4 border-black dark:border-white">
          <DrawerHeader>
            <DrawerTitle className="text-center font-black text-xl">
              {label || placeholder}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 max-h-[60vh] overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-4 rounded-xl mb-2",
                  "border-3 border-black dark:border-white font-bold select-none",
                  "transition-all active:scale-98",
                  value === option.value
                    ? "bg-purple-100 dark:bg-purple-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                    : "bg-white dark:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                )}
              >
                <span className="dark:text-white">{option.label}</span>
                {value === option.value && (
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}