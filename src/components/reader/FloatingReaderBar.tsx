"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon, BookOpen, Minus, Plus, Quote } from "lucide-react";
import { SPRINGS } from "@/lib/motion";
import { executePoeticTransition } from "@/lib/theme-transition";
import { cn } from "@/lib/utils";

export type ReaderTheme = "ivory" | "sepia" | "dark";

interface FloatingReaderBarProps {
  fontSize: number;
  setFontSize?: React.Dispatch<React.SetStateAction<number>>;
  onFontSizeChange?: React.Dispatch<React.SetStateAction<number>>;
  onOpenQuoteModal?: () => void;
  className?: string;
}

export function FloatingReaderBar({
  fontSize,
  setFontSize,
  onFontSizeChange,
  onOpenQuoteModal,
  className,
}: FloatingReaderBarProps) {
  const [theme, setTheme] = useState<ReaderTheme>("ivory");

  const updateSize = onFontSizeChange || setFontSize || (() => {});

  useEffect(() => {
    const syncTheme = () => {
      const readerTheme = document.documentElement.getAttribute("data-reader-theme") as ReaderTheme | null;
      const isDark = document.documentElement.classList.contains("dark");
      if (readerTheme === "sepia") {
        setTheme("sepia");
      } else if (readerTheme === "dark" || isDark) {
        setTheme("dark");
      } else {
        setTheme("ivory");
      }
    };

    syncTheme();
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  const changeTheme = (e: React.MouseEvent, newTheme: ReaderTheme) => {
    if (theme === newTheme) return;
    setTheme(newTheme);

    executePoeticTransition({
      event: e,
      targetTheme: newTheme,
      onCommit: (appliedTheme) => {
        localStorage.setItem("reader-theme", appliedTheme);
        document.documentElement.setAttribute("data-reader-theme", appliedTheme);

        if (appliedTheme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.style.colorScheme = "dark";
          localStorage.setItem("site-theme", "dark");
        } else if (appliedTheme === "sepia") {
          document.documentElement.classList.remove("dark");
          document.documentElement.style.colorScheme = "light";
          localStorage.setItem("site-theme", "sepia");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.style.colorScheme = "light";
          localStorage.setItem("site-theme", "light");
        }

        window.dispatchEvent(new Event("themechange"));
      },
    });
  };

  const handleZoomOut = () => updateSize((prev) => Math.max(15, prev - 1));
  const handleZoomIn = () => updateSize((prev) => Math.min(26, prev + 1));

  const themeOptions: { id: ReaderTheme; label: string; icon: typeof Sun; activeColor: string }[] = [
    { id: "ivory", label: "Sáng ngà", icon: Sun, activeColor: "#2D5A3D" },
    { id: "sepia", label: "Giấy Dó", icon: BookOpen, activeColor: "#5C4F44" },
    { id: "dark", label: "Đêm sâu", icon: Moon, activeColor: "#F4F4F5" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRINGS.responsive}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center gap-1.5 p-1.5 px-2 rounded-full",
        "bg-white/95 dark:bg-[#111114]/95 backdrop-blur-md border border-neutral-300 dark:border-neutral-800 shadow-2xl",
        "text-neutral-800 dark:text-neutral-200 transition-all select-none",
        className
      )}
    >
      {/* 3 Nút chọn Theme với viên thuốc trượt lò xo layoutId */}
      <div className="flex items-center gap-0.5 relative">
        {themeOptions.map((t) => {
          const isActive = theme === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={(e) => changeTheme(e, t.id)}
              title={t.label}
              className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="activeReaderThemePill"
                  transition={SPRINGS.bouncy}
                  className="absolute inset-0 rounded-full shadow-xs -z-10"
                  style={{
                    backgroundColor: t.id === "dark" ? "#FFFFFF" : t.activeColor,
                  }}
                />
              )}
              <Icon
                className={cn(
                  "w-3.5 h-3.5 transition-transform active:scale-90",
                  isActive
                    ? t.id === "dark"
                      ? "text-neutral-950 font-bold"
                      : "text-white font-bold"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="w-[1px] h-4 bg-neutral-200 dark:bg-neutral-800 mx-0.5" />

      {/* Điều chỉnh cỡ chữ với lò xo nảy số */}
      <button
        type="button"
        onClick={handleZoomOut}
        title="Giảm cỡ chữ"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-transform active:scale-90 cursor-pointer"
      >
        <Minus className="w-3 h-3" />
      </button>

      <motion.span
        key={fontSize}
        initial={{ scale: 0.75, y: -2 }}
        animate={{ scale: 1, y: 0 }}
        transition={SPRINGS.bouncy}
        className="text-[11px] font-mono px-0.5 min-w-[2rem] text-center font-semibold inline-block"
      >
        {fontSize}px
      </motion.span>

      <button
        type="button"
        onClick={handleZoomIn}
        title="Tăng cỡ chữ"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-transform active:scale-90 cursor-pointer"
      >
        <Plus className="w-3 h-3" />
      </button>

      {/* Nút Tạo trích dẫn ảnh nếu có handler */}
      {onOpenQuoteModal && (
        <>
          <div className="w-[1px] h-4 bg-neutral-200 dark:bg-neutral-800 mx-0.5" />
          <button
            type="button"
            onClick={onOpenQuoteModal}
            title="Tạo ảnh trích dẫn"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2D5A3D]/10 hover:bg-[#2D5A3D]/20 text-[#2D5A3D] dark:text-[#4ade80] transition-transform active:scale-90 cursor-pointer"
          >
            <Quote className="w-3 h-3" />
          </button>
        </>
      )}
    </motion.div>
  );
}
