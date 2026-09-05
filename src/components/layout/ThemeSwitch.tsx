"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { executePoeticTransition } from "@/lib/theme-transition";
import { useReducedMotion, SPRINGS } from "@/lib/motion";
import { useMagnetic } from "@/lib/useMagnetic";

export interface ThemeSwitchProps {
  className?: string;
  id?: string;
}

export function ThemeSwitch({ className, id }: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // ThinkAI UI Signature Magnetic Pull Effect (Lực hút nam châm mượt mà)
  const { ref: magneticRef, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(0.2);

  // Đồng bộ theme từ DOM & LocalStorage khi mount
  useEffect(() => {
    setMounted(true);
    const syncTheme = () => {
      const isHtmlDark = document.documentElement.classList.contains("dark");
      const savedTheme = localStorage.getItem("site-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const activeDark = savedTheme ? savedTheme === "dark" : isHtmlDark;

      // Đảm bảo state React luôn khớp chính xác với lớp .dark trên HTML element
      setIsDark(isHtmlDark);
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
      ref={magneticRef as any}
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? undefined : { x, y }}
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      transition={SPRINGS.responsive}
      className={cn(
        "relative inline-flex items-center w-[60px] h-[32px] p-[3px] rounded-full cursor-pointer select-none shrink-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-green)]",
        "transition-colors duration-500",
        // Đường ray (Track) chuẩn token phong cách thi ca ThinkAI UI
        isDark
          ? "bg-[var(--bg-card)] border border-[var(--accent-green)]/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
          : "bg-[var(--bg-card)] border border-[var(--border-strong)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      {/* 1. ĐỐM DẤU TRACK NỀN (Stationary Track Icons) */}
      <div
        className="absolute inset-0 px-2.5 flex items-center justify-between pointer-events-none"
        aria-hidden="true"
      >
        {/* Biểu tượng nắng mờ bên trái */}
        <span
          className={cn(
            "transition-opacity duration-300 select-none flex items-center justify-center",
            isDark ? "opacity-40 text-[var(--accent-green)]" : "opacity-0"
          )}
        >
          <Sun className="w-3 h-3 stroke-[2.2]" />
        </span>

        {/* Biểu tượng trăng mờ bên phải */}
        <span
          className={cn(
            "transition-opacity duration-300 select-none flex items-center justify-center",
            !isDark ? "opacity-40 text-[var(--text-muted)]" : "opacity-0"
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
          "transition-all duration-300 border",
          isDark
            ? "bg-[#27272a] border-[var(--accent-green)]/40 text-emerald-400 shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
            : "bg-white border-[var(--border-subtle)] text-[var(--accent-green)] shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
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
              <Sun className="w-3.5 h-3.5 text-[var(--accent-green)] stroke-[2.3]" />
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
              <Moon className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-300 fill-emerald-400/20 stroke-[2.2]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
