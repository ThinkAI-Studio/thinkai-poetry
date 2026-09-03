"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    const syncTheme = () => {
      const isHtmlDark = document.documentElement.classList.contains("dark");
      const savedTheme = localStorage.getItem("site-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const activeDark = isHtmlDark || savedTheme === "dark" || (!savedTheme && prefersDark);
      setIsDark(activeDark);
    };

    syncTheme();
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  const applyTheme = (dark: boolean) => {
    if (dark) {
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
    window.dispatchEvent(new Event("themechange"));
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    // Sử dụng View Transition API nếu trình duyệt hỗ trợ để chuyển đổi giao diện mượt mà như Sora Labs
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      // @ts-ignore
      document.startViewTransition(() => {
        applyTheme(nextDark);
      });
    } else {
      applyTheme(nextDark);
    }
  };

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800", className)} />
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={isDark ? "Chuyển sang giao diện Sáng ngà" : "Chuyển sang giao diện Đêm sâu"}
      title={isDark ? "Chế độ Sáng ngà (Botanical Light)" : "Chế độ Đêm sâu (Obsidian Dark)"}
      className={cn(
        "relative w-9 h-9 flex items-center justify-center rounded-full cursor-pointer select-none",
        "border transition-colors duration-300 outline-none shadow-sm",
        isDark
          ? "bg-[#111114] border-neutral-700/80 text-emerald-400 hover:border-emerald-500/50 hover:bg-neutral-900"
          : "bg-white/90 border-neutral-300/80 text-amber-600 hover:border-amber-500/50 hover:bg-neutral-100",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ rotate: isDark ? -120 : 120, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: isDark ? 120 : -120, scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 20 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
