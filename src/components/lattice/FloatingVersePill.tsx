"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FloatingVersePillProps {
  label: string;
  iconDotColor?: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export function FloatingVersePill({
  label,
  iconDotColor = "#2D5A3D",
  className,
  duration = 4.2,
  delay = 0,
}: FloatingVersePillProps) {
  return (
    <div
      className={cn(
        "floating-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full",
        "bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-md",
        "text-xs md:text-sm font-serif text-neutral-800 transition-transform duration-300 hover:scale-105 select-none cursor-pointer",
        className
      )}
      style={
        {
          "--float-duration": `${duration}s`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties
      }
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: iconDotColor }}
      />
      <span className="whitespace-nowrap italic">{label}</span>
    </div>
  );
}
