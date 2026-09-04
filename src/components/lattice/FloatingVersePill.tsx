"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FloatingVersePillProps {
  label: string;
  iconDotColor?: string;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export function FloatingVersePill({
  label,
  iconDotColor = "#2D5A3D",
  className,
  delay = 0,
  onClick,
}: FloatingVersePillProps) {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full select-none cursor-pointer",
        "bg-white/95 dark:bg-[#18181E]/95 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-700/80 shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.6)]",
        "font-mono text-xs text-neutral-800 dark:text-neutral-200 transition-all hover:border-[#2D5A3D] dark:hover:border-[#4ade80]",
        className
      )}
      initial={false}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -6, 0],
      }}
      transition={{
        y: { duration: 3.8 + delay, repeat: Infinity, ease: "easeInOut", delay },
      }}
      whileHover={{
        scale: 1.08,
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }}
      whileTap={{ scale: 0.94 }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0 shadow-xs"
        style={{ backgroundColor: iconDotColor }}
      />
      <span className="whitespace-nowrap tracking-tight">{label}</span>
    </motion.div>
  );
}
