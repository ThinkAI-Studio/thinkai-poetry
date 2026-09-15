"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSeason, Season, SEASONS_META } from "@/context/SeasonContext";
import { cn } from "@/lib/utils";
import { SPRINGS } from "@/lib/motion";
import { Feather, Check } from "lucide-react";

export function SeasonSwitch({ className }: { className?: string }) {
  const { season, setSeason, metadata, allSeasons } = useSeason();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Đóng popover khi nhấp ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (s: Season) => {
    setSeason(s);
    setIsOpen(false);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch {}
    }
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block select-none", className)}>
      {/* Nút xúc giác hiển thị Mùa hiện tại (min-h-[36px] with impeccable-touch-target) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Chọn mùa thi ca (Hiện tại: ${metadata.fullName})`}
        aria-expanded={isOpen}
        className={cn(
          "impeccable-touch-target inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-serif transition-all duration-200 cursor-pointer shadow-2xs backdrop-blur-md active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]",
          "border-amber-900/15 dark:border-white/10 bg-white/80 dark:bg-[#181816]/90 text-neutral-800 dark:text-[#EAE6DF] hover:border-amber-900/30 dark:hover:border-white/25 hover:shadow-xs"
        )}
      >
        <span className="text-sm leading-none transition-transform duration-200 group-hover:scale-110">
          {metadata.icon}
        </span>
        <span className="font-medium tracking-wide">
          {metadata.name}
        </span>
        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 ml-0.5">
          ▾
        </span>
      </button>

      {/* Popover Menu 4 Mùa */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 4 }}
            transition={SPRINGS.responsive}
            className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-56 p-1.5 rounded-2xl bg-[#FAF7F2]/95 dark:bg-[#1C1C1A]/95 border border-amber-950/10 dark:border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-amber-950/5 dark:border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Sắc Hương 4 Mùa
              </span>
              <Feather className="w-3 h-3 text-[var(--accent-gold)] opacity-75" />
            </div>

            <div className="flex flex-col gap-1 pt-1.5">
              {allSeasons.map((item) => {
                const isActive = item.id === season;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={cn(
                      "w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left transition-all duration-150 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]",
                      isActive
                        ? "bg-black/5 dark:bg-white/10 text-neutral-950 dark:text-white font-semibold"
                        : "text-neutral-700 dark:text-[#C5C2BA] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0 transition-transform duration-200 group-hover:scale-120">
                        {item.icon}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-poem-heading text-sm font-bold tracking-tight truncate">
                          {item.fullName}
                        </span>
                        <span className="text-[10px] font-serif italic text-neutral-500 dark:text-neutral-400 truncate">
                          {item.flower}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <Check className="w-3.5 h-3.5 shrink-0 text-[var(--accent-green)] dark:text-[var(--accent-gold)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
