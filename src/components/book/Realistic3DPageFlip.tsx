"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Feather,
} from "lucide-react";
import { Poem } from "@/types/database";
import { cn } from "@/lib/utils";
import { playPageTurnSound } from "@/lib/book-audio";
import { buildBookSpreads, BookSpread } from "@/lib/prose-paginator";

interface Realistic3DPageFlipProps {
  poems: Poem[];
  currentIndex: number;
  highlightedText?: string | null;
  onPageChange: (index: number) => void;
  className?: string;
}

// Làm nổi bật từ khóa tìm kiếm trong văn bản
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

// Component Trang Trái (Folio Verso - Left Page)
function PageLeft({
  spread,
  highlightedText,
}: {
  spread: BookSpread;
  highlightedText?: string | null;
}) {
  const { poem, leftPage, globalPageLeftNumber } = spread;
  const { paragraphs, isProse, pageNumberInPoem, totalPagesInPoem } = leftPage;

  return (
    <div className="w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#FAF7F0] dark:bg-[#181816] border-r border-amber-900/10 dark:border-white/5 relative overflow-hidden select-none">
      {/* Độ cong gáy sách bên phải với vệt bóng mực tao nhã */}
      <div
        className="absolute top-0 bottom-0 right-0 w-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      {/* Header trang trái */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-white/5 text-[11px] font-sans uppercase tracking-widest text-amber-900/60 dark:text-amber-200/50">
        <span className="font-serif font-bold text-neutral-800 dark:text-[#EAE6DF] tracking-wide">
          <span>Thịnh và Thơ</span>
        </span>
        <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          Trang {globalPageLeftNumber.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Thân trang trái với hiệu ứng hiện mực mượt hơn */}
      <motion.div
        key={`left-${spread.id}`}
        initial={{ opacity: 0.9, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="my-auto py-3 sm:py-4"
      >
        {/* Tiêu đề & Hoa trang trí trang đầu */}
        {pageNumberInPoem === 1 && (
          <>
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-2.5 opacity-90 transition-transform duration-300 hover:scale-105">
              <Image
                src={poem.cover_image_url || "/floral/flower-pink.png"}
                alt="Hoa trang trí"
                fill
                className="object-contain"
              />
            </div>

            <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] dark:text-[var(--accent-gold)] text-[10px] font-serif uppercase tracking-wider mb-2 border border-[var(--accent-green)]/20 dark:border-[var(--accent-gold)]/20 font-medium shadow-2xs">
              <span>
                {isProse
                  ? "Tản Văn / Tùy Bút"
                  : poem.form_type === "luc_bat"
                  ? "Thơ Lục Bát"
                  : poem.form_type === "that_ngon"
                  ? "Thất Ngôn Bát Cú"
                  : poem.form_type === "song_that_luc_bat"
                  ? "Song Thất Lục Bát"
                  : "Thơ Tự Do"}
              </span>
            </div>

            <h2 className="font-poem-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-[#EAE6DF] mb-3 tracking-tight leading-tight">
              {poem.title}
            </h2>
          </>
        )}

        {pageNumberInPoem > 1 && (
          <div className="text-xs font-serif italic text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
            <span className="font-bold text-neutral-700 dark:text-neutral-300">{poem.title}</span>
            <span>•</span>
            <span>Phần {pageNumberInPoem}/{totalPagesInPoem}</span>
          </div>
        )}

        {/* Nội dung Tản Văn vs Thi Phẩm */}
        {isProse ? (
          <div className="space-y-3 font-poem-verse text-[14.5px] sm:text-[15px] leading-[1.95] text-neutral-800 dark:text-[#EAE6DF] text-justify">
            {paragraphs.map((para, pIdx) => {
              const isFirstPara = pageNumberInPoem === 1 && pIdx === 0;
              if (isFirstPara && para.length > 0) {
                const firstChar = para.charAt(0);
                const restText = para.slice(1);
                return (
                  <p key={pIdx} className="indent-4 leading-[1.95]">
                    <span className="float-left font-poem-heading text-4xl sm:text-5xl font-bold leading-none pr-2 pt-1 text-[var(--accent-green)] dark:text-[var(--accent-gold)] drop-shadow-xs">
                      {firstChar}
                    </span>
                    <HighlightText text={restText} query={highlightedText} />
                  </p>
                );
              }
              return (
                <p key={pIdx} className="indent-4">
                  <HighlightText text={para} query={highlightedText} />
                </p>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3.5 font-poem-verse text-[14.5px] sm:text-[15.5px] leading-[2.05] text-neutral-800 dark:text-[#EAE6DF]">
            {paragraphs.map((stanza, sIdx) => {
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
        )}
      </motion.div>

      {/* Footer trang trái */}
      <div className="pt-3 border-t border-amber-900/10 dark:border-white/5 flex items-center justify-between text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
        <span>← Lật về trước</span>
        <span className="font-serif italic text-neutral-600 dark:text-neutral-300">Thịnh và Thơ</span>
      </div>
    </div>
  );
}

// Component Trang Phải (Folio Recto - Right Page)
function PageRight({
  spread,
  highlightedText,
}: {
  spread: BookSpread;
  highlightedText?: string | null;
}) {
  const { poem, rightPage, globalPageRightNumber } = spread;
  const { paragraphs, isProse, pageNumberInPoem, totalPagesInPoem } = rightPage;

  const isLastPageOfPoem = pageNumberInPoem === totalPagesInPoem;

  return (
    <div className="w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#FBF8F2] dark:bg-[#181816] relative overflow-hidden select-none">
      {/* Độ cong gáy sách bên trái với vệt bóng mực tao nhã */}
      <div
        className="absolute top-0 bottom-0 left-0 w-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      {/* Header trang phải */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-white/5 text-[11px] font-sans uppercase tracking-widest text-amber-900/60 dark:text-amber-200/50">
        <span className="font-poem-heading font-medium tracking-normal text-xs text-neutral-700 dark:text-[#EAE6DF] truncate max-w-[200px]">
          {poem.title}
        </span>
        <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          Trang {globalPageRightNumber.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Thân trang phải */}
      <motion.div
        key={`right-${spread.id}`}
        initial={{ opacity: 0.9, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="my-auto py-3 sm:py-4"
      >
        {isProse ? (
          <div className="space-y-3 font-poem-verse text-[14.5px] sm:text-[15px] leading-[1.95] text-neutral-800 dark:text-[#EAE6DF] text-justify">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="indent-4">
                  <HighlightText text={para} query={highlightedText} />
                </p>
              ))
            ) : (
              <div className="italic text-neutral-400 dark:text-neutral-500 text-sm">
                (Nội dung trọn vẹn ở trang trước)
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3.5 font-poem-verse text-[14.5px] sm:text-[15.5px] leading-[2.05] text-neutral-800 dark:text-[#EAE6DF]">
            {paragraphs.length > 0 ? (
              paragraphs.map((stanza, sIdx) => {
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
        )}

        {/* Tác giả & Con dấu Triện Son (Chỉ hiện ở trang cuối của tác phẩm) */}
        {isLastPageOfPoem && (
          <div className="mt-8 flex items-center justify-end gap-3 select-none">
            <div className="text-right">
              <span className="block font-poem-heading text-sm font-semibold text-neutral-800 dark:text-[#EAE6DF]">
                {poem.author?.name || "Hữu Thịnh"}
              </span>
              <span className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
                {poem.author?.period || "Chép trong vườn thiền"}
              </span>
            </div>

            <div
              className="w-11 h-11 rounded-lg border-2 border-[#9E2A2B] bg-[#9E2A2B]/10 dark:bg-[#9E2A2B]/15 p-0.5 shadow-xs relative flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
              title={`Dấu ấn thi phẩm ${poem.author?.name || "Hữu Thịnh"}`}
            >
              <div className="w-full h-full border border-[#9E2A2B]/50 rounded-sm flex items-center justify-center">
                <span className="font-serif text-[11px] font-bold text-[#9E2A2B] tracking-tighter leading-tight text-center select-none">
                  Hữu
                  <br />
                  Thịnh
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer trang phải */}
      <div className="pt-3 border-t border-amber-900/10 dark:border-white/5 flex items-center justify-between text-[11px] font-sans text-neutral-500 dark:text-neutral-400">
        <span className="font-serif italic text-neutral-600 dark:text-neutral-300">Thịnh và Thơ</span>
        <span className="font-medium text-neutral-700 dark:text-neutral-300">Lật tiếp →</span>
      </div>
    </div>
  );
}

// Component Trang Di Động (Single Mobile Folio)
function PageMobile({
  spread,
  currentSpreadIndex,
  totalSpreads,
  highlightedText,
  onPrev,
  onNext,
}: {
  spread: BookSpread;
  currentSpreadIndex: number;
  totalSpreads: number;
  highlightedText?: string | null;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { poem, leftPage } = spread;

  return (
    <div className="w-full p-5 sm:p-7 flex flex-col justify-between bg-[#FBF8F2] dark:bg-[#181816] relative overflow-hidden select-none min-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-white/5 text-[11px] font-sans uppercase tracking-widest text-amber-900/60 dark:text-amber-200/50">
        <span className="font-serif font-bold text-neutral-800 dark:text-[#EAE6DF]">
          <span>Thịnh và Thơ</span>
        </span>
        <span className="font-mono text-xs">
          Trang {currentSpreadIndex + 1}/{totalSpreads}
        </span>
      </div>

      {/* Thân trang mobile */}
      <div className="py-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] dark:text-[var(--accent-gold)] text-[10px] font-serif uppercase tracking-wider border border-[var(--accent-green)]/20 dark:border-[var(--accent-gold)]/20 font-medium">
            {leftPage.isProse
              ? "Tản Văn"
              : poem.form_type === "luc_bat"
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
          {leftPage.paragraphs.map((pText, sIdx) => (
            <p key={sIdx}>
              <HighlightText text={pText} query={highlightedText} />
            </p>
          ))}
        </div>
      </div>

      {/* Điều hướng bài trước / sau Mobile */}
      <div className="pt-3 border-t border-amber-900/10 dark:border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-sans text-neutral-600 dark:text-neutral-400">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentSpreadIndex === 0}
            className={cn(
              "flex items-center gap-1 py-1.5 px-3 rounded-lg border border-neutral-300/80 dark:border-white/10 transition-colors",
              currentSpreadIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:scale-95"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trang trước</span>
          </button>
          <span className="text-[11px] font-serif italic text-neutral-500">Thịnh và Thơ</span>
          <button
            type="button"
            onClick={onNext}
            disabled={currentSpreadIndex === totalSpreads - 1}
            className={cn(
              "flex items-center gap-1 py-1.5 px-3 rounded-lg border border-neutral-300/80 dark:border-white/10 transition-colors",
              currentSpreadIndex === totalSpreads - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:scale-95"
            )}
          >
            <span>Trang tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

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
  // Tạo danh sách các Spread (2 trang / spread) cho toàn bộ tuyển tập thơ & tản văn
  const spreads = useMemo(() => buildBookSpreads(poems), [poems]);

  // Trạng thái trang spread đang hiển thị chính
  const [displayedSpreadIdx, setDisplayedSpreadIdx] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [targetSpreadIdx, setTargetSpreadIdx] = useState<number>(0);

  const prevPropIndexRef = useRef<number>(currentIndex);
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dọn dẹp timer khi unmount
  useEffect(() => {
    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, []);

  // Đồng bộ khi `currentIndex` từ props thay đổi do chọn bài ở Mục lục / Search
  useEffect(() => {
    if (!poems || poems.length === 0 || spreads.length === 0) return;

    if (prevPropIndexRef.current !== currentIndex) {
      prevPropIndexRef.current = currentIndex;
      const targetPoemId = poems[currentIndex]?.id;

      if (targetPoemId) {
        const foundSpreadIdx = spreads.findIndex((s) => s.poem.id === targetPoemId);
        if (foundSpreadIdx !== -1 && foundSpreadIdx !== displayedSpreadIdx && !isFlipping) {
          triggerFlip(foundSpreadIdx > displayedSpreadIdx ? "next" : "prev", foundSpreadIdx);
        }
      }
    }
  }, [currentIndex, poems, spreads, displayedSpreadIdx, isFlipping]);

  // Kết thúc lật trang & cập nhật state đồng bộ chuẩn xác
  const handleAnimationComplete = useCallback((finalSpreadIdx: number) => {
    setDisplayedSpreadIdx(finalSpreadIdx);
    setIsFlipping(false);

    // Thông báo cho parent context KHI LẬT HOÀN TẤT
    const targetPoemId = spreads[finalSpreadIdx]?.poem.id;
    if (targetPoemId) {
      const poemIndexInProps = poems.findIndex((p) => p.id === targetPoemId);
      if (poemIndexInProps !== -1 && poemIndexInProps !== prevPropIndexRef.current) {
        prevPropIndexRef.current = poemIndexInProps;
        onPageChange(poemIndexInProps);
      }
    }
  }, [spreads, poems, onPageChange]);

  // Kích hoạt chuỗi lật trang 3D có quản lý Timer an toàn tuyệt đối
  const triggerFlip = (dir: "next" | "prev", toSpreadIdx: number) => {
    if (isFlipping) return;
    if (toSpreadIdx < 0 || toSpreadIdx >= spreads.length) return;

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);

    playPageTurnSound();
    setIsFlipping(true);
    setFlipDirection(dir);
    setTargetSpreadIdx(toSpreadIdx);

    // Đặt timer 630ms đồng bộ hoàn toàn với animation rotateY 650ms
    flipTimerRef.current = setTimeout(() => {
      handleAnimationComplete(toSpreadIdx);
    }, 630);
  };

  const handleNext = () => {
    if (displayedSpreadIdx < spreads.length - 1 && !isFlipping) {
      const nextSpreadIdx = displayedSpreadIdx + 1;
      triggerFlip("next", nextSpreadIdx);
    }
  };

  const handlePrev = () => {
    if (displayedSpreadIdx > 0 && !isFlipping) {
      const prevSpreadIdx = displayedSpreadIdx - 1;
      triggerFlip("prev", prevSpreadIdx);
    }
  };

  // Cử chỉ vuốt màn hình cảm ứng
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

  if (!poems || poems.length === 0 || spreads.length === 0) {
    return (
      <div className={cn("relative w-full select-none", className)}>
        <div className="relative rounded-3xl p-8 sm:p-14 border border-amber-900/20 dark:border-amber-500/20 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#FAF5EC] via-[#F3EDE0] to-[#E9DFCF] dark:from-[#1C3325] dark:via-[#122219] dark:to-[#0B1711]">
          <div className="max-w-md mx-auto py-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-5 text-[var(--accent-gold)]">
              <Feather className="w-7 h-7" />
            </div>
            <h3 className="font-poem-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-amber-100 mb-3">
              Kho Thơ Đang Chờ Khởi Tạo
            </h3>
            <p className="font-poem-verse text-sm sm:text-base text-neutral-700 dark:text-amber-200/70 mb-8">
              Chưa có tác phẩm nào trong tuyển tập.
            </p>
            <Link
              href="/admin/poems/new"
              className="px-6 py-2.5 rounded-full bg-[var(--accent-green)] text-white font-serif font-bold text-sm"
            >
              Soạn Thi Phẩm Mới
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentSpread = spreads[displayedSpreadIdx] || spreads[0];
  const targetSpread = spreads[targetSpreadIdx] || currentSpread;

  return (
    <div
      className={cn("relative w-full select-none", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* KHUNG BÌA CỨNG 3D HARDCOVER BOUND SLAB */}
      <div
        className="relative rounded-3xl p-3 sm:p-5 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] dark:shadow-[0_35px_100px_-20px_rgba(0,0,0,0.9)] border border-amber-900/30 dark:border-amber-500/20"
        style={{
          background: "linear-gradient(135deg, #1C3325 0%, #122219 45%, #0B1711 100%)",
        }}
      >
        {/* Ke góc đồng cổ 4 góc */}
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

        {/* Lớp xếp chồng thớ giấy Dó (Deckled Paper Edge) */}
        <div
          className="relative rounded-2xl overflow-hidden bg-[#FBF8F2] dark:bg-[#181816] shadow-[inset_0_0_25px_rgba(0,0,0,0.08),0_3px_0_0_#ECE6D8,0_6px_0_0_#DFD8C5,0_7px_2px_0_rgba(0,0,0,0.25)] dark:shadow-[inset_0_0_25px_rgba(0,0,0,0.4),0_3px_0_0_#2A2722,0_6px_0_0_#22201C,0_7px_2px_0_rgba(0,0,0,0.7)]"
        >
          {/* DẢI RUY BĂNG LỤA ĐỎ RỦ TỪ GÁY */}
          <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex-col items-center">
            <div
              className="w-4 sm:w-5 h-20 sm:h-24 shadow-xl bg-gradient-to-b from-[#8C1D24] via-[#A82830] to-[#73141A] relative"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 82%, 0% 100%)",
              }}
            >
              <div className="absolute top-0 bottom-3 left-1/2 -translate-x-1/2 w-[1px] bg-[#D4AF37]/50" />
            </div>
          </div>

          {/* RÃNH GÁY SÁCH Ở GIỮA */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 z-30 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.02) 42%, rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.02) 58%, rgba(0,0,0,0.14) 100%)",
              }}
            />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-black/15 dark:bg-white/10" />
          </div>

          {/* 1. HIỂN THỊ TRANG DI ĐỘNG (< MD) */}
          <div className="block md:hidden w-full">
            <PageMobile
              spread={currentSpread}
              currentSpreadIndex={displayedSpreadIdx}
              totalSpreads={spreads.length}
              highlightedText={highlightedText}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>

          {/* 2. KHÔNG GIAN 3D CỦA CUỐN SÁCH MỞ TRÊN DESKTOP (>= MD) */}
          <div
            className="hidden md:grid md:grid-cols-2 relative w-full min-h-[520px] sm:min-h-[580px] preserve-3d"
            style={{
              perspective: "2200px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {/* TRANG TRÁI TĨNH DƯỚI ĐÁY (BASE LEFT PAGE) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className={cn(
                "w-full h-full relative group transition-colors duration-200",
                displayedSpreadIdx > 0 && !isFlipping && "cursor-pointer hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
              )}
              title={displayedSpreadIdx > 0 ? "Bấm vào trang trái để lật về trước (Phím ←)" : undefined}
            >
              <PageLeft
                spread={isFlipping && flipDirection === "prev" ? targetSpread : currentSpread}
                highlightedText={highlightedText}
              />

              {/* Góc nếp gấp hiệu ứng hover lật lùi */}
              {displayedSpreadIdx > 0 && !isFlipping && (
                <div
                  className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none transition-transform duration-300 group-hover:scale-125 origin-bottom-left opacity-70 group-hover:opacity-100 z-30"
                  style={{
                    background: "linear-gradient(225deg, transparent 50%, rgba(0,0,0,0.18) 51%, #DFD6BE 100%)",
                  }}
                />
              )}
            </div>

            {/* TRANG PHẢI TĨNH DƯỚI ĐÁY (BASE RIGHT PAGE) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className={cn(
                "w-full h-full relative group transition-colors duration-200",
                displayedSpreadIdx < spreads.length - 1 && !isFlipping && "cursor-pointer hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
              )}
              title={displayedSpreadIdx < spreads.length - 1 ? "Bấm vào trang phải để lật tiếp (Phím →)" : undefined}
            >
              <PageRight
                spread={isFlipping && flipDirection === "next" ? targetSpread : currentSpread}
                highlightedText={highlightedText}
              />

              {/* Góc nếp gấp hiệu ứng hover lật tiếp */}
              {displayedSpreadIdx < spreads.length - 1 && !isFlipping && (
                <div
                  className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none transition-transform duration-300 group-hover:scale-125 origin-bottom-right opacity-70 group-hover:opacity-100 z-30"
                  style={{
                    background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.18) 51%, #DFD6BE 100%)",
                  }}
                />
              )}
            </div>

            {/* 3. TỜ GIẤY ĐANG LẬT THẬT 3D KHI LẬT TỚI (NEXT FLIPPING LEAF) */}
            {isFlipping && flipDirection === "next" && (
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                transition={{
                  duration: 0.65,
                  ease: [0.645, 0.045, 0.355, 1.0],
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                }}
                className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1/2 z-30 shadow-2xl pointer-events-none preserve-3d"
              >
                {/* MẶT TRƯỚC TỜ GIẤY (Trang phải hiện tại lật lên) */}
                <div
                  style={{
                    transform: "rotateY(0deg)",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden backface-hidden"
                >
                  <PageRight
                    spread={currentSpread}
                    highlightedText={highlightedText}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)",
                    }}
                  />
                </div>

                {/* MẶT SAU TỜ GIẤY (Trang trái mới tiếp đất) */}
                <div
                  style={{
                    transform: "rotateY(180deg)",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden backface-hidden"
                >
                  <PageLeft
                    spread={targetSpread}
                    highlightedText={highlightedText}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(270deg, rgba(0,0,0,0.25) 0%, transparent 60%)",
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* 4. TỜ GIẤY ĐANG LẬT THẬT 3D KHI LẬT LÙI (PREV FLIPPING LEAF) */}
            {isFlipping && flipDirection === "prev" && (
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                transition={{
                  duration: 0.65,
                  ease: [0.645, 0.045, 0.355, 1.0],
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "right center",
                }}
                className="hidden md:block absolute top-0 bottom-0 left-0 w-1/2 z-30 shadow-2xl pointer-events-none preserve-3d"
              >
                {/* MẶT TRƯỚC TỜ GIẤY (Trang trái hiện tại lật qua) */}
                <div
                  style={{
                    transform: "rotateY(0deg)",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden backface-hidden"
                >
                  <PageLeft
                    spread={currentSpread}
                    highlightedText={highlightedText}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(270deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)",
                    }}
                  />
                </div>

                {/* MẶT SAU TỜ GIẤY (Trang phải mới tiếp đất) */}
                <div
                  style={{
                    transform: "rotateY(-180deg)",
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden backface-hidden"
                >
                  <PageRight
                    spread={targetSpread}
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
          </div>
        </div>
      </div>

      {/* HAI NÚT MŨI TÊN NỔI TRÒN 2 BÊN KÈM VIỀN ĐỒNG (DESKTOP) */}
      <div className="hidden lg:flex absolute left-[-26px] top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={displayedSpreadIdx === 0 || isFlipping}
          title="Lật trang trước (Phím ←)"
          className={cn(
            "w-12 h-12 rounded-full bg-white/95 dark:bg-[#181816]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-amber-900/20 dark:border-[var(--accent-gold)]/30 flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
            displayedSpreadIdx === 0 || isFlipping
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
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          disabled={displayedSpreadIdx === spreads.length - 1 || isFlipping}
          title="Lật trang tiếp (Phím →)"
          className={cn(
            "w-12 h-12 rounded-full bg-white/95 dark:bg-[#181816]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-amber-900/20 dark:border-[var(--accent-gold)]/30 flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
            displayedSpreadIdx === spreads.length - 1 || isFlipping
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
