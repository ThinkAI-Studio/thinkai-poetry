"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  BookOpen,
  StickyNote,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { PoeticOpenBook } from "./PoeticOpenBook";
import { FloatingPoemNote } from "./FloatingPoemNote";
import { BookSearchBar } from "./BookSearchBar";
import { cn } from "@/lib/utils";
import { SPRINGS } from "@/lib/motion";

export function FloatingBookModal() {
  const {
    isOpen,
    closeBook,
    readingMode,
    setReadingMode,
    soundEnabled,
    toggleSound,
    currentPoem,
  } = usePoeticBook();

  // Khóa scroll trang khi modal đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Không gian đọc sách Thịnh và Thơ"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto no-scrollbar"
        >
          {/* 1. LỚP NỀN LÀM MỜ BACKGROUND (BLUR BACKGROUND OVERLAY) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeBook}
            className="fixed inset-0 bg-black/65 dark:bg-black/80 backdrop-blur-xl z-10"
          />

          {/* Vùng hào quang ấm tỏa sau cuốn sách */}
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-[70vh] rounded-full blur-3xl opacity-20 pointer-events-none z-10"
            style={{
              background: "radial-gradient(ellipse at center, rgba(197,160,89,0.2) 0%, rgba(45,90,61,0.2) 50%, transparent 75%)",
            }}
          />

          {/* 2. KHỐI CONTAINER NỔI BỒNG BỀNH (FLOATING CONTAINER) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 25 }}
            transition={SPRINGS.responsive}
            className="relative z-20 w-full max-w-5xl my-auto flex flex-col items-center"
          >
            {/* THANH CÔNG CỤ ĐIỀU KHIỂN NỔI TRÊN ĐẦU SÁCH (FLOATING TOOLBAR) */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-3 px-2 sm:px-4">
              {/* Nút Chuyển Đổi Chế Độ: Sách Mở ⇋ Giấy Note Thơ */}
              <div className="flex items-center gap-1 p-1 bg-white/90 dark:bg-[#181816]/90 backdrop-blur-md rounded-full border border-amber-900/20 dark:border-white/10 shadow-lg">
                <button
                  type="button"
                  onClick={() => setReadingMode("book")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]",
                    readingMode === "book"
                      ? "bg-[var(--accent-green)] dark:bg-[var(--accent-green)] text-white shadow-xs font-semibold"
                      : "text-neutral-600 dark:text-[#A6A39C] hover:text-black dark:hover:text-white"
                  )}
                >
                  <span>Sách Mở 3D</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReadingMode("note")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]",
                    readingMode === "note"
                      ? "bg-[var(--accent-green)] dark:bg-[var(--accent-green)] text-white shadow-xs font-semibold"
                      : "text-neutral-600 dark:text-[#A6A39C] hover:text-black dark:hover:text-white"
                  )}
                >
                  <span>Giấy Note Thơ</span>
                </button>
              </div>

              {/* Thanh kẹp Tìm Kiếm Tự Động Lật Trang */}
              <BookSearchBar />

              {/* Nhóm Nút Âm thanh & Nút Đóng */}
              <div className="flex items-center gap-2">
                {/* Nút Bật/Tắt âm thanh lật trang */}
                <button
                  type="button"
                  onClick={toggleSound}
                  title={soundEnabled ? "Tắt âm thanh lật giấy" : "Bật âm thanh lật giấy"}
                  className="p-2 rounded-full bg-white/90 dark:bg-[#1C1B18]/90 backdrop-blur-md border border-amber-900/20 dark:border-amber-500/20 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-lg"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[var(--accent-green)] dark:text-[var(--accent-gold)]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {/* Nút Đóng Sách */}
                <button
                  type="button"
                  onClick={closeBook}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1C1B18]/90 backdrop-blur-md border border-amber-900/20 dark:border-amber-500/20 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-lg text-xs font-mono"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Gập Sách (Esc)</span>
                </button>
              </div>
            </div>

            {/* NỘI DUNG HIỂN THỊ CHÍNH (THEO CHẾ ĐỘ ĐỌC ĐÃ CHỌN) */}
            <div className="w-full">
              {readingMode === "book" ? (
                <PoeticOpenBook />
              ) : (
                <FloatingPoemNote />
              )}
            </div>

            {/* Dòng hướng dẫn phím tắt chân modal */}
            <div className="mt-3 text-center text-[11px] font-mono text-white/60 drop-shadow-xs select-none">
              <span>Bấm mép trang hoặc dùng phím </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">←</kbd>
              <span> / </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">→</kbd>
              <span> để lật trang thơ • Gõ vào ô tìm kiếm để tự động lật đến bài thơ</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
