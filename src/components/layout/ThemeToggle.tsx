"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { executePoeticTransition } from "@/lib/theme-transition";

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
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    executePoeticTransition({
      event: e,
      targetTheme: nextDark ? "dark" : "ivory",
      onCommit: () => applyTheme(nextDark),
    });
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200/80 bg-white/80 text-amber-500 shadow-xs",
          className
        )}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </div>
    );
  }

  // 8 tia nắng hoa thảo
  const sunRays = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 450, damping: 22 }}
      aria-label={isDark ? "Đón nắng sớm (Sáng ngà)" : "Nhập đêm sâu (Nghiên mực)"}
      title={isDark ? "Chế độ Sáng ngà (Botanical Light)" : "Chế độ Đêm sâu (Obsidian Dark)"}
      className={cn(
        "relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer select-none outline-none",
        "border transition-colors duration-500 shadow-xs backdrop-blur-md overflow-hidden",
        isDark
          ? "bg-[#111114]/90 border-neutral-700/70 text-emerald-400 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.15)]"
          : "bg-white/90 border-neutral-300/80 text-amber-600 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(217,119,6,0.15)]",
        className
      )}
    >
      {/* Ánh hào quang huyền ảo phía sau */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full blur-md opacity-30 transition-colors duration-700 pointer-events-none",
          isDark ? "bg-emerald-500" : "bg-amber-400"
        )}
        animate={{ scale: [0.85, 1.15, 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* SVG Thiên thể biến hình (Celestial Morphing Core) */}
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 relative z-10 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="celestial-eclipse-mask">
            {/* Vùng màu trắng giữ nguyên toàn bộ */}
            <rect width="24" height="24" fill="white" />
            {/* Hình tròn đen dịch chuyển tạo bóng nguyệt thực che vầng thái dương */}
            <motion.circle
              initial={false}
              animate={{
                cx: isDark ? 9 : 25,
                cy: isDark ? 7 : -2,
                r: isDark ? 7.2 : 0,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              fill="black"
            />
          </mask>
        </defs>

        {/* 1. Các tia nắng hoa thảo xoay tròn & khép cánh */}
        <motion.g
          initial={{ opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? 45 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{ transformOrigin: "center", opacity: 1 }}
        >
          {sunRays.map((deg, i) => (
            <motion.line
              key={i}
              x1="12"
              y1="2"
              x2="12"
              y2="4.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              transform={`rotate(${deg} 12 12)`}
              className="text-amber-500"
            />
          ))}
        </motion.g>

        {/* 2. Quả cầu thiên thể trung tâm (Mặt Trời <-> Trăng Khuyết) */}
        <motion.circle
          cx="12"
          cy="12"
          r="6"
          mask="url(#celestial-eclipse-mask)"
          fill="currentColor"
          animate={{
            scale: isDark ? 1.05 : 0.95,
            rotate: isDark ? -15 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          style={{ transformOrigin: "center" }}
          className={cn(isDark ? "text-emerald-400" : "text-amber-500")}
        />

        {/* 3. Những đốm tinh tú (Constellation Stars) lấp lánh khi vào đêm sâu */}
        <AnimatePresence>
          {isDark && (
            <>
              {/* Ngôi sao thứ nhất */}
              <motion.path
                key="star-1"
                d="M18.5 4.5L19 6L20.5 6.5L19 7L18.5 8.5L18 7L16.5 6.5L18 6L18.5 4.5Z"
                fill="currentColor"
                className="text-emerald-300"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.12 }}
              />
              {/* Ngôi sao thứ hai */}
              <motion.path
                key="star-2"
                d="M6 16.5L6.5 17.8L7.8 18.3L6.5 18.8L6 20.1L5.5 18.8L4.2 18.3L5.5 17.8L6 16.5Z"
                fill="currentColor"
                className="text-emerald-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 0.85, opacity: 0.75 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.22 }}
              />
            </>
          )}
        </AnimatePresence>
      </svg>
    </motion.button>
  );
}
