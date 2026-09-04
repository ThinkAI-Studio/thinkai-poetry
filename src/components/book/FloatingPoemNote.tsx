"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Feather,
  Paperclip,
} from "lucide-react";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { cn } from "@/lib/utils";

export function FloatingPoemNote({ className }: { className?: string }) {
  const {
    poems,
    currentPageIndex,
    totalPages,
    currentPoem,
    highlightedText,
    goToNextPage,
    goToPrevPage,
  } = usePoeticBook();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dừng audio khi đổi bài
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  }, [currentPageIndex]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  const stanzas = currentPoem?.raw_text
    ? currentPoem.raw_text.split(/\n\s*\n/).filter(Boolean)
    : [currentPoem?.excerpt || ""];

  if (!currentPoem) {
    return (
      <div className="p-8 sm:p-12 bg-[#FFFDF9] dark:bg-[#1E1D19] rounded-2xl border border-amber-900/20 text-center font-serif text-neutral-700 dark:text-neutral-300 shadow-xl max-w-md mx-auto">
        <p className="text-base font-bold mb-2">Chưa có thi phẩm nào trên trang thơ</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans">
          Hãy soạn thảo tác phẩm mới tại Cổng Quản Trị.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto select-none", className)}>
      {/* Audio Element */}
      {currentPoem?.audio_url && (
        <audio
          ref={audioRef}
          src={currentPoem.audio_url}
          preload="none"
          onEnded={() => setIsPlayingAudio(false)}
        />
      )}

      {/* TỜ GIẤY NOTE THƠ NỔI (IMPECCABLE PAPER CRAFT) */}
      <motion.div
        key={currentPoem.id}
        initial={{ opacity: 0, scale: 0.96, rotate: -1.5, y: 15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, rotate: 1.5, y: -15 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl bg-[#FDFBF7] dark:bg-[#181816] p-6 sm:p-10 md:p-12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-amber-900/15 dark:border-white/10"
      >
        {/* KẸP GIẤY KIM LOẠI ĐỒNG Ở TRÊN ĐẦU NOTE */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="w-8 h-12 rounded-full border-4 border-[#C8A165] bg-gradient-to-b from-[#E5C388] to-[#99733D] shadow-md flex items-center justify-center">
            <div className="w-2.5 h-6 rounded-full border-2 border-[#7D5C2C]" />
          </div>
        </div>

        {/* NHÀNH HOA KHÔ ÉP Ở GÓC DƯỚI */}
        <div className="absolute bottom-4 right-4 w-16 h-16 opacity-30 pointer-events-none">
          <Image
            src={currentPoem.cover_image_url || "/floral/leaf-1.png"}
            alt="Nhành hoa ép"
            fill
            className="object-contain"
          />
        </div>

        {/* Header Tờ Note */}
        <div className="flex items-center justify-between pb-4 border-b border-dashed border-amber-900/15 dark:border-white/10 text-xs font-serif text-amber-900/60 dark:text-amber-200/50 mb-6">
          <span className="flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5 text-[var(--accent-green)] dark:text-[var(--accent-gold)]" />
            <span className="uppercase tracking-wider">
              {currentPoem.form_type === "luc_bat"
                ? "Thơ Lục Bát"
                : currentPoem.form_type === "that_ngon"
                ? "Thơ Đường Luật"
                : "Thơ Tự Do"}
            </span>
          </span>

          <span className="font-mono font-medium">
            Note {(currentPageIndex + 1).toString().padStart(2, "0")} / {totalPages.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Tiêu đề thơ trên giấy note */}
        <h2 className="font-poem-heading text-2xl sm:text-3xl font-bold text-center text-neutral-900 dark:text-[#EAE6DF] mb-6 tracking-tight">
          {currentPoem.title}
        </h2>

        {/* Các khổ thơ */}
        <div className="space-y-5 font-poem-verse text-base sm:text-lg leading-[2.1] text-neutral-800 dark:text-neutral-200 text-center max-w-md mx-auto">
          {stanzas.map((stanza, sIdx) => {
            const lines = stanza.split("\n").filter(Boolean);
            return (
              <div key={sIdx} className="space-y-1">
                {lines.map((line, lIdx) => (
                  <p key={lIdx}>
                    {highlightedText && line.toLowerCase().includes(highlightedText.toLowerCase()) ? (
                      <mark className="bg-amber-300/60 dark:bg-emerald-400/40 text-amber-950 dark:text-emerald-50 px-1 py-0.5 rounded shadow-xs font-semibold animate-pulse">
                        {line}
                      </mark>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            );
          })}
        </div>

        {/* Ký tên tác giả */}
        <div className="mt-8 text-right font-poem-heading italic text-base text-neutral-700 dark:text-neutral-300 pr-2">
          — {currentPoem.author?.name || "Ánh Thịnh"}
        </div>

        {/* Trình phát ngâm thơ mini */}
        {currentPoem.audio_url && (
          <div className="mt-6 p-3 rounded-xl bg-amber-900/5 dark:bg-white/5 border border-amber-900/10 dark:border-white/10 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayAudio}
              className="w-8 h-8 rounded-full bg-[#1E3F2E] text-white hover:bg-[#152e21] transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              {isPlayingAudio ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
              )}
            </button>
            <div className="flex-1 text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#1E3F2E] dark:text-[#4ade80] font-medium flex items-center gap-1.5">
                <Volume2 className="w-3 h-3" />
                <span>Ngâm thơ diễn cảm</span>
              </span>
            </div>
          </div>
        )}

        {/* Chân Tờ Note: Nút lùi / tới */}
        <div className="mt-8 pt-4 border-t border-dashed border-amber-900/15 dark:border-white/10 flex items-center justify-between text-xs font-mono">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className={cn(
              "flex items-center gap-1.5 transition-colors cursor-pointer",
              currentPageIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Bài trước</span>
          </button>

          <span className="text-[10px] text-neutral-400">Dùng phím ← / →</span>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className={cn(
              "flex items-center gap-1.5 transition-colors cursor-pointer",
              currentPageIndex === totalPages - 1
                ? "opacity-30 cursor-not-allowed"
                : "text-neutral-900 dark:text-neutral-100 hover:text-[#1E3F2E] font-medium"
            )}
          >
            <span>Bài tiếp theo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
