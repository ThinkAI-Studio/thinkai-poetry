"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Feather,
  BookOpen,
} from "lucide-react";
import { Poem } from "@/types/database";
import { cn } from "@/lib/utils";
import { playPageTurnSound } from "@/lib/book-audio";

interface Realistic3DPageFlipProps {
  poems: Poem[];
  currentIndex: number;
  highlightedText?: string | null;
  onPageChange: (index: number) => void;
  className?: string;
}

// Làm nổi bật từ khóa tìm kiếm
function HighlightText({ text, query }: { text: string; query?: string | null }) {
  if (!query || !query.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-amber-300/70 dark:bg-emerald-400/40 text-amber-950 dark:text-emerald-50 px-1 py-0.5 rounded shadow-xs font-semibold animate-pulse"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}

// Component Trang Trái (Folio Verso)
function PageLeft({
  poem,
  pageNumber,
  highlightedText,
}: {
  poem: Poem;
  pageNumber: number;
  highlightedText?: string | null;
}) {
  const stanzas = poem.raw_text ? poem.raw_text.split(/\n\s*\n/).filter(Boolean) : [poem.excerpt || ""];
  const leftStanzas = stanzas.slice(0, Math.max(1, Math.ceil(stanzas.length / 2)));

  return (
    <div className="w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#FAF7F0] dark:bg-[#181816] border-r border-amber-900/10 dark:border-white/5 relative overflow-hidden select-none">
      {/* Độ cong gáy sách */}
      <div
        className="absolute top-0 bottom-0 right-0 w-16 pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent, rgba(0,0,0,0.06))",
        }}
      />

      {/* Header trang trái */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-white/5 text-[11px] font-sans uppercase tracking-widest text-amber-900/60 dark:text-amber-200/50">
        <span className="font-serif font-bold text-neutral-800 dark:text-[#EAE6DF]">
          <span>Thịnh và Thơ</span>
        </span>
        <span className="font-mono text-xs">Trang {pageNumber.toString().padStart(2, "0")}</span>
      </div>

      {/* Thân trang trái */}
      <div className="my-auto py-4">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-3 opacity-90">
          <Image
            src={poem.cover_image_url || "/floral/flower-pink.png"}
            alt="Hoa trang trí"
            fill
            className="object-contain"
          />
        </div>

        <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] dark:text-[var(--accent-gold)] text-[10px] font-serif uppercase tracking-wider mb-2 border border-[var(--accent-green)]/20 dark:border-[var(--accent-gold)]/20 font-medium">
          <span>
            {poem.form_type === "luc_bat"
              ? "Thơ Lục Bát"
              : poem.form_type === "that_ngon"
              ? "Thất Ngôn Bát Cú"
              : poem.form_type === "song_that_luc_bat"
              ? "Song Thất Lục Bát"
              : "Thơ Tự Do"}
          </span>
        </div>

        <h2 className="font-poem-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-[#EAE6DF] mb-4 tracking-tight leading-tight">
          {poem.title}
        </h2>

        <div className="space-y-3 font-poem-verse text-[14.5px] sm:text-[15.5px] leading-[2] text-neutral-800 dark:text-[#EAE6DF]">
          {leftStanzas.map((stanza, sIdx) => {
            const lines = stanza.split("\n").filter(Boolean);
            return (
              <div key={sIdx} className="space-y-1">
                {lines.map((line, lIdx) => (
                  <p
                    key={lIdx}
                    className={cn(
                      poem.form_type === "luc_bat" && lIdx % 2 === 0 && "pl-3 sm:pl-4"
                    )}
                  >
                    <HighlightText text={line} query={highlightedText} />
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer trang trái */}
      <div className="pt-3 border-t border-amber-900/10 dark:border-white/5 flex items-center justify-between text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
        <span>← Lật về trước</span>
        <span className="font-serif italic">Thịnh và Thơ</span>
      </div>
    </div>
  );
}

// Component Trang Phải (Folio Recto)
function PageRight({
  poem,
  pageNumber,
  highlightedText,
}: {
  poem: Poem;
  pageNumber: number;
  highlightedText?: string | null;
}) {
  const stanzas = poem.raw_text ? poem.raw_text.split(/\n\s*\n/).filter(Boolean) : [poem.excerpt || ""];
  const rightStanzas = stanzas.slice(Math.max(1, Math.ceil(stanzas.length / 2)));

  return (
    <div className="w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#FBF8F2] dark:bg-[#181816] relative overflow-hidden select-none">
      {/* Độ cong gáy sách */}
      <div
        className="absolute top-0 bottom-0 left-0 w-16 pointer-events-none"
        style={{
          background: "linear-gradient(to left, transparent, rgba(0,0,0,0.06))",
        }}
      />

      {/* Header trang phải */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-white/5 text-[11px] font-sans uppercase tracking-widest text-amber-900/60 dark:text-amber-200/50">
        <span className="font-poem-heading font-medium tracking-normal text-xs text-neutral-700 dark:text-[#EAE6DF]">
          {poem.title}
        </span>
        <span className="font-mono text-xs">Trang {pageNumber.toString().padStart(2, "0")}</span>
      </div>

      {/* Thân trang phải */}
      <div className="my-auto py-4">
        <div className="space-y-3 font-poem-verse text-[14.5px] sm:text-[15.5px] leading-[2] text-neutral-800 dark:text-[#EAE6DF]">
          {rightStanzas.length > 0 ? (
            rightStanzas.map((stanza, sIdx) => {
              const lines = stanza.split("\n").filter(Boolean);
              return (
                <div key={sIdx} className="space-y-1">
                  {lines.map((line, lIdx) => (
                    <p
                      key={lIdx}
                      className={cn(
                        poem.form_type === "luc_bat" && lIdx % 2 === 0 && "pl-3 sm:pl-4"
                      )}
                    >
                      <HighlightText text={line} query={highlightedText} />
                    </p>
                  ))}
                </div>
              );
            })
          ) : (
            <div className="italic text-neutral-400 dark:text-neutral-500 text-sm">
              (Thi phẩm trọn vẹn ở trang trước)
            </div>
          )}
        </div>

        {/* Tác giả & Con dấu Triện Son */}
        <div className="mt-8 flex items-center justify-end gap-3 select-none">
          <div className="text-right">
            <span className="block font-poem-heading text-sm font-semibold text-neutral-800 dark:text-[#EAE6DF]">
              Hữu Thịnh
            </span>
            <span className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
              Chép trong vườn thiền
            </span>
          </div>

          <div
            className="w-11 h-11 rounded-lg border-2 border-[#9E2A2B] bg-[#9E2A2B]/10 dark:bg-[#9E2A2B]/15 p-0.5 shadow-xs relative flex items-center justify-center"
            title="Dấu ấn thi phẩm Hữu Thịnh"
          >
            {/* Viền đôi thư pháp ấn triện */}
            <div className="w-full h-full border border-[#9E2A2B]/50 rounded-sm flex items-center justify-center">
              <span className="font-serif text-[11px] font-bold text-[#9E2A2B] tracking-tighter leading-tight text-center select-none">
                Hữu
                <br />
                Thịnh
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer trang phải */}
      <div className="pt-3 border-t border-amber-900/10 dark:border-white/5 flex items-center justify-between text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
        <span className="font-serif italic">Thịnh và Thơ</span>
        <span className="font-medium text-neutral-700 dark:text-neutral-300">Lật tiếp →</span>
      </div>
    </div>
  );
}

// Component Trang Di Động (Single Mobile Folio - Hallmark Gate 49-53 & Impeccable Mobile)
function PageMobile({
  poem,
  pageIndex,
  totalPages,
  highlightedText,
  onPrev,
  onNext,
}: {
  poem: Poem;
  pageIndex: number;
  totalPages: number;
  highlightedText?: string | null;
  onPrev: () => void;
  onNext: () => void;
}) {
  const stanzas = poem.raw_text ? poem.raw_text.split(/\n\s*\n/).filter(Boolean) : [poem.excerpt || ""];

  return (
    <div className="w-full p-5 sm:p-7 flex flex-col justify-between bg-[#FBF8F2] dark:bg-[#181816] relative overflow-hidden select-none min-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-white/5 text-[11px] font-sans uppercase tracking-widest text-amber-900/60 dark:text-amber-200/50">
        <span className="font-serif font-bold text-neutral-800 dark:text-[#EAE6DF]">
          <span>Thịnh và Thơ</span>
        </span>
        <span className="font-mono text-xs">
          Bài {pageIndex + 1}/{totalPages}
        </span>
      </div>

      {/* Thân bài thơ */}
      <div className="py-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] dark:text-[var(--accent-gold)] text-[10px] font-serif uppercase tracking-wider border border-[var(--accent-green)]/20 dark:border-[var(--accent-gold)]/20 font-medium">
            {poem.form_type === "luc_bat"
              ? "Thơ Lục Bát"
              : poem.form_type === "that_ngon"
              ? "Thất Ngôn Bát Cú"
              : poem.form_type === "song_that_luc_bat"
              ? "Song Thất Lục Bát"
              : "Thơ Tự Do"}
          </span>

          <div className="w-8 h-8 rounded-md border-2 border-[#9E2A2B] bg-[#9E2A2B]/10 p-0.5 shadow-xs flex items-center justify-center">
            <div className="w-full h-full border border-[#9E2A2B]/50 rounded-xs flex items-center justify-center font-serif text-[10px] font-bold text-[#9E2A2B]">
              Thơ
            </div>
          </div>
        </div>

        <h2 className="font-poem-heading text-2xl font-bold text-neutral-900 dark:text-[#EAE6DF] mb-4 tracking-tight leading-tight">
          {poem.title}
        </h2>

        <div className="space-y-4 font-poem-verse text-[15px] leading-[2.1] text-neutral-800 dark:text-[#EAE6DF]">
          {stanzas.map((stanza, sIdx) => {
            const lines = stanza.split("\n").filter(Boolean);
            return (
              <div key={sIdx} className="space-y-1.5">
                {lines.map((line, lIdx) => (
                  <p
                    key={lIdx}
                    className={cn(
                      poem.form_type === "luc_bat" && lIdx % 2 === 0 && "pl-3",
                      poem.form_type === "song_that_luc_bat" && lIdx === 2 && "pl-3"
                    )}
                  >
                    <HighlightText text={line} query={highlightedText} />
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Điều hướng bài trước / sau Mobile & Chỉ dẫn vuốt */}
      <div className="pt-3 border-t border-amber-900/10 dark:border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-sans text-neutral-600 dark:text-neutral-400">
          <button
            type="button"
            onClick={onPrev}
            disabled={pageIndex === 0}
            className={cn(
              "flex items-center gap-1 py-1.5 px-3 rounded-lg border border-neutral-300/80 dark:border-white/10 transition-colors",
              pageIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:scale-95"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bài trước</span>
          </button>
          <span className="text-[11px] font-serif italic text-neutral-500">Thịnh và Thơ</span>
          <button
            type="button"
            onClick={onNext}
            disabled={pageIndex === totalPages - 1}
            className={cn(
              "flex items-center gap-1 py-1.5 px-3 rounded-lg border border-neutral-300/80 dark:border-white/10 transition-colors",
              pageIndex === totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:scale-95"
            )}
          >
            <span>Bài tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Gợi ý vuốt ngón tay nhẹ nhàng */}
        <div className="text-center text-[10px] font-mono text-neutral-400 dark:text-neutral-500 tracking-wider">
          ← Vuốt ngang màn hình để lật trang →
        </div>
      </div>
    </div>
  );
}

export function Realistic3DPageFlip({
  poems,
  currentIndex,
  highlightedText,
  onPageChange,
  className,
}: Realistic3DPageFlipProps) {
  const [displayedIndex, setDisplayedIndex] = useState(currentIndex);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [targetIndex, setTargetIndex] = useState(currentIndex);

  // Đồng bộ khi currentIndex từ props thay đổi (ví dụ do search hoặc context)
  useEffect(() => {
    if (currentIndex !== displayedIndex && !isFlipping) {
      triggerFlip(currentIndex > displayedIndex ? "next" : "prev", currentIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, displayedIndex, isFlipping]);

  // Kích hoạt chuỗi lật trang thật 3D (rotateY 0 -> -180 hoặc 0 -> 180)
  const triggerFlip = (dir: "next" | "prev", toIdx: number) => {
    if (isFlipping) return;
    if (toIdx < 0 || toIdx >= poems.length) return;

    playPageTurnSound();
    setIsFlipping(true);
    setFlipDirection(dir);
    setTargetIndex(toIdx);
  };

  const handleNext = () => {
    if (displayedIndex < poems.length - 1 && !isFlipping) {
      const nextIdx = displayedIndex + 1;
      triggerFlip("next", nextIdx);
      onPageChange(nextIdx);
    }
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handlePrev = () => {
    if (displayedIndex > 0 && !isFlipping) {
      const prevIdx = displayedIndex - 1;
      triggerFlip("prev", prevIdx);
      onPageChange(prevIdx);
    }
  };

  if (!poems || poems.length === 0) {
    return (
      <div className={cn("relative w-full select-none", className)}>
        <div
          className="relative rounded-3xl p-8 sm:p-14 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_35px_100px_-20px_rgba(0,0,0,0.9)] border border-amber-900/20 dark:border-amber-500/20 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#FAF5EC] via-[#F3EDE0] to-[#E9DFCF] dark:from-[#1C3325] dark:via-[#122219] dark:to-[#0B1711] transition-colors duration-300"
        >
          {/* Ke góc đồng cổ 4 góc */}
          <div className="absolute top-2.5 left-2.5 w-8 h-8 pointer-events-none">
            <div className="w-full h-full border-t-2 border-l-2 border-[#916207]/60 dark:border-[#C5A059]/80 rounded-tl-lg" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-8 h-8 pointer-events-none">
            <div className="w-full h-full border-t-2 border-r-2 border-[#916207]/60 dark:border-[#C5A059]/80 rounded-tr-lg" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 w-8 h-8 pointer-events-none">
            <div className="w-full h-full border-b-2 border-l-2 border-[#916207]/60 dark:border-[#C5A059]/80 rounded-bl-lg" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 w-8 h-8 pointer-events-none">
            <div className="w-full h-full border-b-2 border-r-2 border-[#916207]/60 dark:border-[#C5A059]/80 rounded-br-lg" />
          </div>

          <div className="max-w-md mx-auto py-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-5 text-[var(--accent-gold)]">
              <Feather className="w-7 h-7" />
            </div>

            <h3 className="font-poem-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-amber-100 mb-3 tracking-tight">
              Kho Thơ Đang Chờ Khởi Tạo
            </h3>

            <p className="font-poem-verse text-sm sm:text-base text-neutral-700 dark:text-amber-200/70 mb-8 leading-relaxed">
              Dữ liệu mẫu đã được dọn sạch hoàn toàn. Không gian thi ca Thịnh và Thơ đã sẵn sàng để đón nhận những thi phẩm sáng tác nguyên bản.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/admin/poems/new"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] dark:bg-[var(--accent-gold)] dark:hover:bg-[#d4ad64] text-white dark:text-neutral-950 font-serif font-bold text-sm tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Soạn Thi Phẩm Mới</span>
              </Link>
              <Link
                href="/authors"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[var(--border-strong)] bg-white/60 dark:bg-black/20 hover:bg-white/90 text-[var(--text-primary)] font-serif text-sm tracking-wide transition-all active:scale-95 cursor-pointer"
              >
                <span>Về Trang Tác Giả</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPoem = poems[displayedIndex] || poems[0];
  const targetPoem = poems[targetIndex] || currentPoem;

  return (
    <div
      className={cn("relative w-full select-none", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ===================================================================== */}
      {/* KHUNG BÌA CỨNG 3D (HARDCOVER BOUND SLAB) VỚI ĐỘ SÂU QUANG HỌC          */}
      {/* ===================================================================== */}
      <div
        className="relative rounded-3xl p-3 sm:p-5 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] dark:shadow-[0_35px_100px_-20px_rgba(0,0,0,0.9)] border border-amber-900/30 dark:border-amber-500/20"
        style={{
          background: "linear-gradient(135deg, #1C3325 0%, #122219 45%, #0B1711 100%)",
        }}
      >
        {/* Ke góc đồng cổ 4 góc (Embossed Antique Brass Corners with Rivets) */}
        <div className="absolute top-2.5 left-2.5 w-8 h-8 pointer-events-none">
          <div className="w-full h-full border-t-2 border-l-2 border-[#C5A059]/80 rounded-tl-lg shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]" />
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-8 h-8 pointer-events-none">
          <div className="w-full h-full border-t-2 border-r-2 border-[#C5A059]/80 rounded-tr-lg shadow-[inset_-1px_1px_0_rgba(255,255,255,0.4)]" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-8 h-8 pointer-events-none">
          <div className="w-full h-full border-b-2 border-l-2 border-[#C5A059]/80 rounded-bl-lg shadow-[inset_1px_-1px_0_rgba(255,255,255,0.4)]" />
          <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-8 h-8 pointer-events-none">
          <div className="w-full h-full border-b-2 border-r-2 border-[#C5A059]/80 rounded-br-lg shadow-[inset_-1px_-1px_0_rgba(255,255,255,0.4)]" />
          <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Lớp xếp chồng thớ giấy Dó (Deckled Paper Edge - Impeccable Tectonic Shadows) */}
        <div
          className="relative rounded-2xl overflow-hidden bg-[#FBF8F2] dark:bg-[#181816] shadow-[inset_0_0_25px_rgba(0,0,0,0.08),0_3px_0_0_#ECE6D8,0_6px_0_0_#DFD8C5,0_7px_2px_0_rgba(0,0,0,0.25)] dark:shadow-[inset_0_0_25px_rgba(0,0,0,0.4),0_3px_0_0_#2A2722,0_6px_0_0_#22201C,0_7px_2px_0_rgba(0,0,0,0.7)]"
        >
          {/* DẢI RUY BĂNG LỤA ĐỎ RỦ TỪ GÁY (Ẩn trên mobile để không đè chữ) */}
          <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex-col items-center">
            <div
              className="w-4 sm:w-5 h-20 sm:h-24 shadow-xl bg-gradient-to-b from-[#8C1D24] via-[#A82830] to-[#73141A] relative"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 82%, 0% 100%)",
              }}
            >
              {/* Chỉ vàng dệt giữa ruy băng lụa */}
              <div className="absolute top-0 bottom-3 left-1/2 -translate-x-1/2 w-[1px] bg-[#D4AF37]/50" />
            </div>
          </div>

          {/* RÃNH GÁY SÁCH Ở GIỮA VỚI ĐỘ CONG VẬT LÝ */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 z-30 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.02) 42%, rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.02) 58%, rgba(0,0,0,0.14) 100%)",
              }}
            />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-black/15 dark:bg-white/10" />
          </div>

          {/* ================================================================= */}
          {/* 1. HIỂN THỊ TRANG DI ĐỘNG (< MD): SINGLE MOBILE FOLIO TAO NHÃ     */}
          {/* ================================================================= */}
          <div className="block md:hidden w-full">
            <PageMobile
              poem={currentPoem}
              pageIndex={displayedIndex}
              totalPages={poems.length}
              highlightedText={highlightedText}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>

          {/* ================================================================= */}
          {/* 2. KHÔNG GIAN 3D CỦA CUỐN SÁCH MỞ TRÊN DESKTOP (>= MD)            */}
          {/* ================================================================= */}
          <div
            className="hidden md:grid md:grid-cols-2 relative w-full min-h-[520px] sm:min-h-[580px]"
            style={{
              perspective: "2200px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {/* 1. TRANG TRÁI TĨNH DƯỚI ĐÁY (BASE LEFT PAGE) */}
            <div className="w-full h-full">
              <PageLeft
                poem={isFlipping && flipDirection === "prev" ? targetPoem : currentPoem}
                pageNumber={((isFlipping && flipDirection === "prev" ? targetIndex : displayedIndex) + 1) * 2 - 1}
                highlightedText={highlightedText}
              />
            </div>

            {/* 2. TRANG PHẢI TĨNH DƯỚI ĐÁY (BASE RIGHT PAGE) */}
            <div className="w-full h-full">
              <PageRight
                poem={isFlipping && flipDirection === "next" ? targetPoem : currentPoem}
                pageNumber={((isFlipping && flipDirection === "next" ? targetIndex : displayedIndex) + 1) * 2}
                highlightedText={highlightedText}
              />
            </div>

            {/* =============================================================== */}
            {/* 3. TỜ GIẤY ĐANG LẬT THẬT 3D KHI LẬT TỚI (NEXT FLIPPING LEAF)     */}
            {/* =============================================================== */}
            {isFlipping && flipDirection === "next" && (
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                transition={{
                  duration: 0.65,
                  ease: [0.645, 0.045, 0.355, 1.0], // cubic-bezier tự nhiên của tờ giấy uốn cong
                }}
                onAnimationComplete={() => {
                  setDisplayedIndex(targetIndex);
                  setIsFlipping(false);
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                }}
                className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1/2 z-30 shadow-2xl"
              >
                {/* MẶT TRƯỚC TỜ GIẤY (Nội dung trang phải cũ lúc bắt đầu lật lên) */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(0deg)",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <PageRight
                    poem={currentPoem}
                    pageNumber={(displayedIndex + 1) * 2}
                    highlightedText={highlightedText}
                  />
                  {/* Bóng đổ uốn cong khi trang bắt đầu dựng lên 90 độ */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)",
                    }}
                  />
                </div>

                {/* MẶT SAU TỜ GIẤY (Nội dung trang trái mới khi vượt qua góc 90 độ) */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <PageLeft
                    poem={targetPoem}
                    pageNumber={(targetIndex + 1) * 2 - 1}
                    highlightedText={highlightedText}
                  />
                  {/* Vệt bóng đổ khi trang sắp tiếp đất bên trái */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(270deg, rgba(0,0,0,0.25) 0%, transparent 60%)",
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* =============================================================== */}
            {/* 4. TỜ GIẤY ĐANG LẬT THẬT 3D KHI LẬT LÙI (PREV FLIPPING LEAF)     */}
            {/* =============================================================== */}
            {isFlipping && flipDirection === "prev" && (
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                transition={{
                  duration: 0.65,
                  ease: [0.645, 0.045, 0.355, 1.0],
                }}
                onAnimationComplete={() => {
                  setDisplayedIndex(targetIndex);
                  setIsFlipping(false);
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "right center",
                }}
                className="hidden md:block absolute top-0 bottom-0 left-0 w-1/2 z-30 shadow-2xl"
              >
                {/* MẶT TRƯỚC TỜ GIẤY (Nội dung trang trái cũ lúc bắt đầu lật qua phải) */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(0deg)",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <PageLeft
                    poem={currentPoem}
                    pageNumber={(displayedIndex + 1) * 2 - 1}
                    highlightedText={highlightedText}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(270deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)",
                    }}
                  />
                </div>

                {/* MẶT SAU TỜ GIẤY (Nội dung trang phải mới khi vượt qua góc 90 độ) */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(-180deg)",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <PageRight
                    poem={targetPoem}
                    pageNumber={(targetIndex + 1) * 2}
                    highlightedText={highlightedText}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 60%)",
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* =============================================================== */}
            {/* 5. GÓC TRANG GẤP UỐN TƯƠNG TÁC (DOG-EAR CORNER HOVER CURL)        */}
            {/* =============================================================== */}
            {displayedIndex < poems.length - 1 && !isFlipping && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Lật trang tiếp theo"
                title="Bấm để lật sang trang tiếp (Phím →)"
                className="absolute bottom-0 right-0 w-14 h-14 cursor-pointer z-30 group overflow-hidden"
              >
                <div
                  className="w-full h-full transition-transform duration-300 group-hover:scale-125 origin-bottom-right opacity-80 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.18) 51%, var(--book-corner-curl, #DFD6BE) 100%)",
                  }}
                />
              </button>
            )}

            {displayedIndex > 0 && !isFlipping && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Lật về trang trước"
                title="Bấm để lật về trang trước (Phím ←)"
                className="absolute bottom-0 left-0 w-14 h-14 cursor-pointer z-30 group overflow-hidden"
              >
                <div
                  className="w-full h-full transition-transform duration-300 group-hover:scale-125 origin-bottom-left opacity-80 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(225deg, transparent 50%, rgba(0,0,0,0.18) 51%, var(--book-corner-curl, #DFD6BE) 100%)",
                  }}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 6. HAI NÚT MŨI TÊN NỔI TRÒN 2 BÊN KÈM VIỀN ĐỒNG (TACTILE PAGE TURNERS) */}
      {/* ===================================================================== */}
      <div className="hidden lg:flex absolute left-[-26px] top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          onClick={handlePrev}
          disabled={displayedIndex === 0 || isFlipping}
          title="Lật trang trước (Phím ←)"
          className={cn(
            "w-12 h-12 rounded-full bg-white/95 dark:bg-[#181816]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-amber-900/20 dark:border-[var(--accent-gold)]/30 flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
            displayedIndex === 0 || isFlipping
              ? "opacity-20 cursor-not-allowed"
              : "hover:scale-110 active:scale-90 text-neutral-800 dark:text-[#EAE6DF] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] dark:hover:border-[var(--accent-gold)] dark:hover:text-[var(--accent-gold)]"
          )}
          aria-label="Lật trang trước (Phím ←)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="hidden lg:flex absolute right-[-26px] top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          onClick={handleNext}
          disabled={displayedIndex === poems.length - 1 || isFlipping}
          title="Lật trang tiếp (Phím →)"
          className={cn(
            "w-12 h-12 rounded-full bg-white/95 dark:bg-[#181816]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-amber-900/20 dark:border-[var(--accent-gold)]/30 flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
            displayedIndex === poems.length - 1 || isFlipping
              ? "opacity-20 cursor-not-allowed"
              : "hover:scale-110 active:scale-90 text-neutral-800 dark:text-[#EAE6DF] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] dark:hover:border-[var(--accent-gold)] dark:hover:text-[var(--accent-gold)]"
          )}
          aria-label="Lật trang tiếp (Phím →)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
