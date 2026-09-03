"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, BookOpen, Type, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReaderTheme = "ivory" | "sepia" | "dark";

interface FloatingReaderBarProps {
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
}

export function FloatingReaderBar({
  fontSize,
  setFontSize,
  className,
}: FloatingReaderBarProps) {
  const [theme, setTheme] = useState<ReaderTheme>("ivory");

  useEffect(() => {
    // Load stored theme
    const saved = localStorage.getItem("reader-theme") as ReaderTheme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-reader-theme", saved);
    }
  }, []);

  const changeTheme = (newTheme: ReaderTheme) => {
    setTheme(newTheme);
    localStorage.setItem("reader-theme", newTheme);
    document.documentElement.setAttribute("data-reader-theme", newTheme);
  };

  const handleZoomOut = () => setFontSize((prev) => Math.max(15, prev - 1));
  const handleZoomIn = () => setFontSize((prev) => Math.min(26, prev + 1));

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center gap-1.5 p-1.5 rounded-none",
        "bg-white/95 dark:bg-[#111114]/95 backdrop-blur-md border border-neutral-300 dark:border-neutral-800 shadow-xl",
        "text-neutral-800 dark:text-neutral-200 transition-all select-none",
        className
      )}
    >
      {/* 3 Nút chọn Theme */}
      <button
        type="button"
        onClick={() => changeTheme("ivory")}
        title="Nắng sớm (Sáng ngà)"
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-none transition-colors",
          theme === "ivory"
            ? "bg-[#2D5A3D] text-white"
            : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        )}
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => changeTheme("sepia")}
        title="Giấy dó cổ truyền (Sepia)"
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-none transition-colors",
          theme === "sepia"
            ? "bg-[#5C4F44] text-white"
            : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        )}
      >
        <BookOpen className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => changeTheme("dark")}
        title="Đêm sâu (Obsidian Dark)"
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-none transition-colors",
          theme === "dark"
            ? "bg-white text-neutral-950 font-bold"
            : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
        )}
      >
        <Moon className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-neutral-200 dark:bg-neutral-800 mx-1" />

      {/* Điều chỉnh cỡ chữ */}
      <button
        type="button"
        onClick={handleZoomOut}
        title="Giảm cỡ chữ"
        className="w-7 h-8 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="text-xs font-mono px-1 min-w-[2.2rem] text-center font-medium">
        {fontSize}px
      </span>

      <button
        type="button"
        onClick={handleZoomIn}
        title="Tăng cỡ chữ"
        className="w-7 h-8 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
