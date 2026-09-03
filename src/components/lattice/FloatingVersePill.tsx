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
        "bg-white/90 dark:bg-[#141418]/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 shadow-md",
        "font-mono text-xs text-neutral-700 dark:text-neutral-300 transition-colors",
        className
      )}
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -7, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: { duration: 4.2 + delay, repeat: Infinity, ease: "easeInOut", delay },
      }}
      whileHover={{
        scale: 1.12,
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
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
