"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { executePoeticTransition } from "@/lib/theme-transition";
import { useReducedMotion } from "@/lib/motion";

export interface ThemeSwitchProps {
  className?: string;
  id?: string;
}

export function ThemeSwitch({ className, id }: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Đồng bộ theme từ DOM & LocalStorage khi mount
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

  // Áp dụng theme và đồng bộ trạng thái tài liệu
  const applyTheme = useCallback((dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-reader-theme", "dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("site-theme", "dark");
      localStorage.setItem("reader-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-reader-theme", "ivory");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("site-theme", "light");
      localStorage.setItem("reader-theme", "ivory");
    }
    window.dispatchEvent(new Event("themechange"));
  }, []);

  // Xử lý chuyển đổi với hiệu ứng lật trang thi ca
  const handleToggle = (
    e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    executePoeticTransition({
      event: e && "clientX" in e ? e : undefined,
      targetTheme: nextDark ? "dark" : "ivory",
      onCommit: () => applyTheme(nextDark),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle(e);
    }
  };

  // Tránh Layout Shift trong giai đoạn Hydration SSR
  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center w-[60px] h-[32px] p-[3px] rounded-full border border-neutral-300/80 bg-[#EAE4DC]/70 opacity-70",
          className
        )}
        aria-hidden="true"
      >
        <div className="w-[26px] h-[26px] rounded-full bg-white shadow-xs" />
      </div>
    );
  }

  // Cấu hình vật lý lò xo xúc giác siêu mượt
  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 30, mass: 0.8 };

  return (
    <motion.button
      id={id}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Chuyển sang chế độ Sáng ngà" : "Chuyển sang chế độ Đêm sâu"}
      title={
        isDark
          ? "Chế độ: Đêm sâu (Nghiên mực & Ánh trăng) — Nhấn để đón Nắng sớm"
          : "Chế độ: Sáng ngà (Giấy dó & Nắng mai) — Nhấn để vào Đêm sâu"
      }
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      className={cn(
        "relative inline-flex items-center w-[60px] h-[32px] p-[3px] rounded-full cursor-pointer select-none shrink-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
        "transition-colors duration-500",
        // Đường ray (Track) phong cách văn học
        isDark
          ? "bg-gradient-to-r from-[#121216] via-[#17171F] to-[#101014] border border-neutral-700/80 hover:border-[var(--accent-gold)]/50 shadow-[inset_0_2px_5px_rgba(0,0,0,0.7),0_0_12px_rgba(197,160,89,0.06)]"
          : "bg-gradient-to-r from-[#F2ECE1] via-[#EAE1D3] to-[#DFD4C4] border border-amber-950/15 hover:border-amber-900/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.9)]",
        className
      )}
    >
      {/* 1. ĐỐM DẤU TRACK NỀN (Stationary Guides) */}
      <div
        className="absolute inset-0 px-2.5 flex items-center justify-between pointer-events-none"
        aria-hidden="true"
      >
        {/* Biểu tượng nắng mờ bên trái */}
        <span
          className={cn(
            "transition-opacity duration-300 select-none flex items-center justify-center",
            isDark ? "opacity-35 text-amber-400" : "opacity-0"
          )}
        >
          <Sun className="w-3 h-3 stroke-[2.2]" />
        </span>

        {/* Biểu tượng trăng mờ bên phải */}
        <span
          className={cn(
            "transition-opacity duration-300 select-none flex items-center justify-center",
            !isDark ? "opacity-40 text-neutral-500" : "opacity-0"
          )}
        >
          <Moon className="w-3 h-3 stroke-[2]" />
        </span>
      </div>

      {/* 2. HẠT CÔNG TẮC TRƯỢT TACTILE (Sliding Spring Thumb) */}
      <motion.div
        animate={{
          x: isDark ? 28 : 0,
        }}
        whileTap={prefersReducedMotion ? {} : { scaleX: 1.14, scaleY: 0.92 }}
        transition={springConfig}
        className={cn(
          "relative z-10 w-[26px] h-[26px] rounded-full flex items-center justify-center pointer-events-none",
          "transition-all duration-300",
          isDark
            ? "bg-gradient-to-b from-[#2A2B36] to-[#181922] border border-[var(--accent-gold)]/40 text-[var(--accent-gold)] shadow-[0_2px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(197,160,89,0.15),inset_0_1px_0_rgba(255,255,255,0.18)]"
            : "bg-gradient-to-b from-white to-[#F5F0E6] border border-amber-900/15 text-amber-600 shadow-[0_2px_6px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]"
        )}
      >
        {/* Micro-Icon chuyển động mượt mà bên trong hạt công tắc */}
        <AnimatePresence mode="wait" initial={false}>
          {!isDark ? (
            /* --- NẮNG MAI (Morning Sun) --- */
            <motion.div
              key="sun-icon"
              initial={{ scale: 0.3, rotate: -70, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.3, rotate: 70, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center w-full h-full"
            >
              <Sun className="w-3.5 h-3.5 text-amber-600 stroke-[2.3]" />
            </motion.div>
          ) : (
            /* --- ÁNH TRĂNG VÀNG (Golden Moonlight) --- */
            <motion.div
              key="moon-icon"
              initial={{ scale: 0.3, rotate: 70, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.3, rotate: -70, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center w-full h-full"
            >
              <Moon className="w-3.5 h-3.5 text-amber-300 dark:text-amber-200 fill-amber-300/20 stroke-[2.2]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
