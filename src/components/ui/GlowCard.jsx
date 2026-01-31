import React from 'react';
import { cn } from "@/lib/utils";

export default function GlowCard({ children, className, glowColor = "pink", ...props }) {
  const glowColors = {
    pink: "from-pink-500/40 via-purple-500/40 to-cyan-500/40",
    rainbow: "from-orange-500/40 via-pink-500/40 to-purple-500/40",
    cyan: "from-cyan-500/40 via-purple-500/40 to-pink-500/40"
  };

  return (
    <div
      className={cn(
        "relative p-6 bg-white/90 backdrop-blur-sm",
        "border-4 border-black rounded-2xl",
        "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
      {...props}
    >
      <div className={cn(
        "absolute -inset-2 rounded-3xl blur-2xl -z-10 animate-pulse",
        "bg-gradient-to-r",
        glowColors[glowColor]
      )} />
      {children}
    </div>
  );
}