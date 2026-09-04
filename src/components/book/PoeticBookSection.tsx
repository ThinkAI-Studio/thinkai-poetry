"use client";

import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Maximize2,
  BookOpen,
  Library,
  Feather,
} from "lucide-react";
import { Realistic3DPageFlip } from "./Realistic3DPageFlip";
import { BookSearchBar } from "./BookSearchBar";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { PoemFormType, Poem } from "@/types/database";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { SPRINGS } from "@/lib/motion";

export function PoeticBookSection({ className }: { className?: string }) {
  const {
    poems,
    currentPageIndex,
    goToPage,
    highlightedText,
    soundEnabled,
    toggleSound,
    openBook,
  } = usePoeticBook();

  const [selectedForm, setSelectedForm] = useState<PoemFormType | "all">("all");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Lọc danh sách bài thơ nếu người dùng chọn tab
  const filteredPoems =
    selectedForm === "all"
      ? poems
      : poems.filter((p) => p.form_type === selectedForm);

  const handleSelectPoem = (poem: Poem) => {
    const idx = poems.findIndex((p) => p.id === poem.id);
    if (idx !== -1) {
      goToPage(idx);
    }
  };

  return (
    <section
      id="khong-gian-sach-tho"
      className={cn("max-w-6xl mx-auto px-4 sm:px-6 w-full select-none pt-4 pb-16 scroll-mt-28", className)}
    >
      {/* ===================================================================== */}
      {/* 1. HEADER KHÔNG GIAN THI CA: TIÊU ĐỀ, TABS LỌC & CÔNG CỤ TÌM KIẾM     */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-5">
        <div>
          <div className="inline-flex items-center text-xs font-serif uppercase tracking-[0.2em] text-[var(--accent-green)] dark:text-[var(--accent-gold)] font-semibold mb-1">
            <span>Tuyển Tập Thi Ca Đương Đại</span>
          </div>
          <h2 className="font-poem-heading text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#EAE6DF] tracking-tight">
            Những miền cảm xúc chắt chiu
          </h2>
          <p className="font-serif text-sm text-neutral-600 dark:text-[#A6A39C] mt-1">
            Lật từng trang sách, lắng nghe tiếng lòng và những rung động sâu lắng
          </p>
        </div>

        {/* Cụm công cụ: Thanh Tìm Kiếm, Tabs Thể Thơ, Âm Thanh & Phóng To */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Thanh kẹp tìm kiếm thi ca tự động lật trang */}
          <BookSearchBar />

          {/* Nút bật/tắt âm thanh lật giấy */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? "Tắt âm thanh lật giấy" : "Bật âm thanh lật giấy"}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[var(--accent-green)] dark:text-[var(--accent-gold)]" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {/* Nút mở dạng nổi Float & Blur Background */}
          <button
            type="button"
            onClick={() => openBook(undefined, currentPageIndex)}
            title="Mở sách nổi toàn màn hình (Float & Blur Background)"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-white transition-all text-xs font-serif uppercase tracking-wider shadow-xs cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] font-medium"
          >
            <span>Đọc Nổi</span>
          </button>
        </div>
      </div>

      {/* TABS LỌC THỂ THƠ (SLIDING PILL) */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div
          onMouseLeave={() => setHoveredTab(null)}
          className="relative flex flex-wrap items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full select-none shadow-xs"
        >
          {[
            { id: "all", label: "Tất Cả" },
            { id: "luc_bat", label: "Lục Bát" },
            { id: "tu_do", label: "Tự Do" },
            { id: "that_ngon", label: "Đường Luật" },
            { id: "song_that_luc_bat", label: "Song Thất" },
          ].map((tab) => {
            const isActive = selectedForm === tab.id;
            const isHovered = hoveredTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedForm(tab.id as any);
                  // Tự lật đến bài đầu tiên thuộc thể loại đó
                  if (tab.id !== "all") {
                    const firstMatchIdx = poems.findIndex((p) => p.form_type === tab.id);
                    if (firstMatchIdx !== -1) {
                      goToPage(firstMatchIdx);
                    }
                  }
                }}
                onMouseEnter={() => setHoveredTab(tab.id)}
                className="relative px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors rounded-full cursor-pointer z-10 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)]"
              >
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="hoverSectionFilterTab"
                    transition={SPRINGS.responsive}
                    className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10"
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeSectionFilterTab"
                    transition={SPRINGS.responsive}
                    className="absolute inset-0 bg-[var(--accent-green)] rounded-full shadow-sm -z-10"
                  />
                )}
                <span
                  className={cn(
                    "transition-colors duration-200",
                    isActive
                      ? "text-white font-bold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Chỉ số bài thơ hiện tại */}
        <div className="text-xs font-mono text-neutral-500 flex items-center gap-2">
          <span>Đang đọc bài:</span>
          <span className="font-poem-heading font-bold text-sm text-neutral-800 dark:text-neutral-200">
            {poems[currentPageIndex]?.title}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-neutral-800 text-amber-900 dark:text-amber-200 font-bold">
            {(currentPageIndex + 1).toString().padStart(2, "0")} / {poems.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CUỐN SÁCH MỞ 3D VỚI MOTION LẬT TRANG THẬT                             */}
      {/* ===================================================================== */}
      <div className="relative w-full flex justify-center items-center py-2">
        {/* Vầng hào quang ánh sáng ấm sau cuốn sách */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-64 rounded-full blur-3xl opacity-20 pointer-events-none -z-10"
          style={{
            background: "radial-gradient(ellipse at center, #F4DEB3 0%, rgba(45,90,61,0.2) 50%, transparent 80%)",
          }}
        />

        <Realistic3DPageFlip
          poems={poems}
          currentIndex={currentPageIndex}
          highlightedText={highlightedText}
          onPageChange={goToPage}
        />
      </div>

      {/* ===================================================================== */}
      {/* 3. MỤC LỤC THI TUYỂN (ANTHOLOGY FOLIO INDEX - TASTESKILLS & IMPECCABLE) */}
      {/* ===================================================================== */}
      <div className="mt-12 pt-8 border-t border-amber-900/10 dark:border-white/10">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-serif uppercase tracking-[0.2em] text-neutral-600 dark:text-[#A6A39C] font-medium">
            <span>Mục lục thi tuyển</span>
          </span>
          <span className="text-xs font-mono text-neutral-500 dark:text-[#7E7B74]">
            {filteredPoems.length} thi phẩm
          </span>
        </div>

        {/* Danh sách mục lục dạng thẻ trang nhã 2-3 cột */}
        {filteredPoems.length === 0 ? (
          <div className="p-8 text-center bg-white/40 dark:bg-white/[0.02] rounded-2xl border border-dashed border-neutral-300 dark:border-white/10 text-neutral-500 font-serif text-sm">
            Chưa có bài thơ nào trong mục lục.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPoems.map((poem) => {
            const actualIdx = poems.findIndex((p) => p.id === poem.id);
            const isCurrent = actualIdx === currentPageIndex;

            return (
              <button
                key={poem.id}
                type="button"
                onClick={() => handleSelectPoem(poem)}
                className={cn(
                  "p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between select-none group focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]",
                  isCurrent
                    ? "bg-[var(--accent-green)]/10 dark:bg-[var(--accent-gold)]/10 border-[var(--accent-green)] dark:border-[var(--accent-gold)] shadow-xs"
                    : "bg-white/80 dark:bg-[#181816]/80 border-neutral-200/70 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/20 hover:shadow-xs"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "font-mono text-xs w-6 text-center shrink-0",
                      isCurrent
                        ? "text-[var(--accent-green)] dark:text-[var(--accent-gold)] font-bold"
                        : "text-neutral-400 dark:text-neutral-500"
                    )}
                  >
                    {(actualIdx + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <span
                      className={cn(
                        "block font-poem-heading font-bold text-sm truncate transition-colors",
                        isCurrent
                          ? "text-[var(--accent-green)] dark:text-[var(--accent-gold)]"
                          : "text-neutral-800 dark:text-[#EAE6DF] group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)]"
                      )}
                    >
                      {poem.title}
                    </span>
                    <span className="block font-poem-verse text-xs text-neutral-500 dark:text-[#7E7B74] truncate italic mt-0.5">
                      {poem.excerpt || "Một nét thơ vương..."}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2 text-right">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                    {poem.form_type === "luc_bat" ? "Lục Bát" : poem.form_type === "that_ngon" ? "Đường Luật" : "Tự Do"}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
                    Tr.{(actualIdx * 2 + 1).toString().padStart(2, "0")} →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
    </section>
  );
}
