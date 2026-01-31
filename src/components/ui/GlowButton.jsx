import React from 'react';
import { cn } from "@/lib/utils";

export default function GlowButton({ children, className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400",
    secondary: "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500",
    success: "bg-gradient-to-r from-lime-400 via-cyan-400 to-purple-500"
  };

  return (
    <button
      className={cn(
        "relative px-8 py-4 font-bold text-white text-lg",
        "border-4 border-black rounded-xl",
        "transform hover:scale-105 active:scale-95 transition-all duration-200",
        "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        "hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        "active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        variants[variant],
        "before:absolute before:inset-0 before:rounded-lg before:animate-pulse",
        "before:bg-gradient-to-r before:from-pink-400/30 before:via-purple-400/30 before:to-cyan-400/30",
        "before:blur-xl before:-z-10",
        className
      )}
      {...props}
    >
      <span className="relative z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
        {children}
      </span>
    </button>
  );
}