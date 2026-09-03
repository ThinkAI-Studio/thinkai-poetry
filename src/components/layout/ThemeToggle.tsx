"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("site-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(activeDark);
    if (activeDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-reader-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-reader-theme", "ivory");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-reader-theme", "dark");
      localStorage.setItem("site-theme", "dark");
      localStorage.setItem("reader-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-reader-theme", "ivory");
      localStorage.setItem("site-theme", "light");
      localStorage.setItem("reader-theme", "ivory");
    }
  };

  if (!mounted) {
    return (
      <div className={cn("w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800", className)} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Chuyển sang giao diện Sáng ngà" : "Chuyển sang giao diện Đêm sâu"}
      title={isDark ? "Chế độ Sáng ngà (Botanical Light)" : "Chế độ Đêm sâu (Obsidian Dark)"}
      className={cn(
        "relative w-8 h-8 flex items-center justify-center rounded-full cursor-pointer select-none",
        "border transition-colors duration-300 outline-none shadow-xs",
        isDark
          ? "bg-[#111114] border-neutral-800 text-amber-300 hover:border-neutral-700 hover:bg-neutral-900"
          : "bg-white/80 border-neutral-300/80 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100",
        className
      )}
    >
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600 fill-amber-600/20" />
        )}
      </motion.div>
    </button>
  );
}
