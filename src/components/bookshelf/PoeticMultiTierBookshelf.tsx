"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  X,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Feather,
  Bookmark,
} from "lucide-react";
import { Collection, Poem } from "@/types/database";
import { getPoemGenreInfo } from "@/lib/poem-genre";
import { usePoeticBook } from "@/context/PoeticBookContext";

// =============================================================================
// COLOR PALETTES FOR SPINES
// =============================================================================

const POETRY_PALETTES = [
  {
    bg: "linear-gradient(180deg, #183d2b 0%, #0f291c 50%, #08170f 100%)",
    border: "#2d5e43",
    ribs: "#0d2419",
    foil: "linear-gradient(135deg, #FFF1C5 0%, #D4AF37 50%, #AA820A 100%)",
    ribbon: "#C5A059",
    accent: "#10b981",
  },
  {
    bg: "linear-gradient(180deg, #4c1d28 0%, #341219 50%, #1e090e 100%)",
    border: "#732c3c",
    ribs: "#290c13",
    foil: "linear-gradient(135deg, #FFE4E6 0%, #FB7185 50%, #E11D48 100%)",
    ribbon: "#BE123C",
    accent: "#f43f5e",
  },
  {
    bg: "linear-gradient(180deg, #1e293b 0%, #0f172a 50%, #020617 100%)",
    border: "#334155",
    ribs: "#0a0f1d",
    foil: "linear-gradient(135deg, #E2E8F0 0%, #94A3B8 50%, #64748B 100%)",
    ribbon: "#38BDF8",
    accent: "#38bdf8",
  },
  {
    bg: "linear-gradient(180deg, #3b2354 0%, #261537 50%, #150a1f 100%)",
    border: "#58367d",
    ribs: "#190d24",
    foil: "linear-gradient(135deg, #F3E8FF 0%, #C084FC 50%, #9333EA 100%)",
    ribbon: "#A855F7",
    accent: "#a855f7",
  },
  {
    bg: "linear-gradient(180deg, #3d2b1f 0%, #291b12 50%, #170d07 100%)",
    border: "#614431",
    ribs: "#1a100a",
    foil: "linear-gradient(135deg, #FEF3C7 0%, #F59E0B 50%, #B45309 100%)",
    ribbon: "#F59E0B",
    accent: "#f59e0b",
  },
];

const PROSE_PALETTES = [
  {
    bg: "linear-gradient(180deg, #4a2810 0%, #331a08 50%, #1f0f04 100%)",
    border: "#78421b",
    ribs: "#241103",
    foil: "linear-gradient(135deg, #FED7AA 0%, #FB923C 50%, #C2410C 100%)",
    ribbon: "#EA580C",
    accent: "#ea580c",
  },
  {
    bg: "linear-gradient(180deg, #3b2a1a 0%, #271b0e 50%, #160e06 100%)",
    border: "#5c4229",
    ribs: "#1a1107",
    foil: "linear-gradient(135deg, #FEF08A 0%, #EAB308 50%, #A16207 100%)",
    ribbon: "#CA8A04",
    accent: "#ca8a04",
  },
  {
    bg: "linear-gradient(180deg, #30241b 0%, #201710 50%, #120b06 100%)",
    border: "#4d392b",
    ribs: "#140e08",
    foil: "linear-gradient(135deg, #E7E5E4 0%, #A8A29E 50%, #78716C 100%)",
    ribbon: "#A8A29E",
    accent: "#a8a29e",
  },
];

interface PoeticMultiTierBookshelfProps {
  collections: Collection[];
  className?: string;
}

export function PoeticMultiTierBookshelf({
  collections,
  className = "",
}: PoeticMultiTierBookshelfProps) {
  const { openBook } = usePoeticBook();
  const [selectedGenre, setSelectedGenre] = useState<"all" | "poetry" | "prose">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePoem, setActivePoem] = useState<{
    poem: Poem;
    collection: Collection;
  } | null>(null);
  const [hoveredPoemId, setHoveredPoemId] = useState<string | null>(null);

  // Trigger haptic if available
  const triggerHaptic = (pattern: number[] = [10]) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  };

  // Filter collections according to selected tab
  const filteredCollections = useMemo(() => {
    return collections.filter((col) => {
      const colType = col.type || "poetry";
      if (selectedGenre === "poetry") {
        return colType === "poetry" || colType === "mixed";
      }
      if (selectedGenre === "prose") {
        return colType === "prose" || colType === "mixed";
      }
      return true;
    });
  }, [collections, selectedGenre]);

  // Total books count
  const totalPoemsCount = useMemo(() => {
    return collections.reduce((acc, col) => acc + (col.poems?.length || col.poems_count || 0), 0);
  }, [collections]);

  return (
    <div className={`w-full flex flex-col gap-8 ${className}`}>
      {/* 1. Thanh điều khiển kệ sách: Bộ lọc Thơ / Tản Văn + Tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-md border border-[var(--border-subtle)] shadow-xs">
        {/* Tabs Thể Loại */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] self-start">
          <button
            type="button"
            onClick={() => {
              setSelectedGenre("all");
              triggerHaptic([8]);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              selectedGenre === "all"
                ? "bg-[var(--accent-green)] text-white font-semibold shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Tất Cả Kệ Sách ({collections.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedGenre("poetry");
              triggerHaptic([8]);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              selectedGenre === "poetry"
                ? "bg-[var(--accent-green)] text-white font-semibold shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            🌸 Kệ Thơ Ca
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedGenre("prose");
              triggerHaptic([8]);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
              selectedGenre === "prose"
                ? "bg-amber-600 text-white font-semibold shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            🍃 Kệ Tản Văn
          </button>
        </div>

        {/* Input Tìm kiếm tác phẩm trên kệ */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên bài thơ, tản văn..."
            className="w-full pl-8 pr-8 py-1.5 text-xs font-serif rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-green)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Thư viện Kệ Sách Đa Tầng (Multi-Tier Wooden Library Bookshelf) */}
      <div className="relative rounded-3xl p-4 sm:p-8 bg-gradient-to-b from-[#22150c] via-[#2d1b10] to-[#1a0f07] dark:from-[#140b05] dark:via-[#1c1008] dark:to-[#0f0703] border-4 border-[#4a2e19] shadow-2xl overflow-hidden">
        {/* Họa tiết vân gỗ & ánh sáng vàng cổ điển rọi từ đỉnh tủ sách */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.12)_0%,_transparent_70%)]" />
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />

        {/* Danh sách các Tầng Kệ (Mỗi tầng là 1 Tuyển tập) */}
        <div className="flex flex-col gap-14 sm:gap-16 relative z-10">
          {filteredCollections.length === 0 ? (
            <div className="py-16 text-center text-amber-200/60 font-serif text-sm">
              Không tìm thấy tuyển tập phù hợp với bộ lọc.
            </div>
          ) : (
            filteredCollections.map((col, tierIdx) => {
              const isProse = col.type === "prose";
              const rawPoems = col.poems || [];
              const matchedPoems = rawPoems.filter((p) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase().trim();
                return (
                  p.title?.toLowerCase().includes(query) ||
                  p.raw_text?.toLowerCase().includes(query) ||
                  p.excerpt?.toLowerCase().includes(query)
                );
              });

              return (
                <div key={col.id} className="flex flex-col relative group/tier">
                  {/* Biển Bảng Gỗ Khắc Kim Loại của Tuyển Tập (Shelf Plaque) */}
                  <div className="flex items-center justify-between mb-3 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#3d2414]/90 via-[#4e2f1b]/90 to-[#3d2414]/90 border border-amber-500/25 shadow-md">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                        Tầng {tierIdx + 1}
                      </span>
                      <h3 className="font-poem-heading text-lg sm:text-xl font-bold text-amber-100 tracking-tight flex items-center gap-2">
                        <span>{col.title}</span>
                        <span
                          className={`text-[11px] font-serif font-normal px-2 py-0.5 rounded-full border ${
                            isProse
                              ? "bg-amber-900/50 border-amber-600/40 text-amber-200"
                              : "bg-emerald-950/60 border-emerald-600/40 text-emerald-200"
                          }`}
                        >
                          {isProse ? "Tuyển Tập Tản Văn" : "Tuyển Tập Thơ Ca"}
                        </span>
                      </h3>
                      <span className="hidden md:inline-block text-xs font-serif text-amber-200/60 max-w-md truncate">
                        {col.description}
                      </span>
                    </div>

                    <Link
                      href={`/collections/${col.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-medium text-amber-300 hover:text-amber-100 transition-colors shrink-0 group-hover/tier:translate-x-1 duration-200"
                    >
                      <span>Xem tuyển tập</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Vòm Tủ Kệ Chứa Sách (Shelf Compartment) */}
                  <div className="relative min-h-[260px] sm:min-h-[290px] px-4 sm:px-8 pt-6 flex items-end overflow-x-auto no-scrollbar scroll-smooth">
                    {/* Bức tường sau lưng kệ (Backboard paneling) */}
                    <div className="absolute inset-0 bg-[#1e120a]/80 dark:bg-[#110804]/90 rounded-t-lg border-x border-t border-[#3e2413] shadow-inner pointer-events-none" />

                    {/* Hàng Sách Đứng Dọc Trên Kệ */}
                    <div className="relative z-10 flex items-end gap-3.5 sm:gap-5 pb-1">
                      {matchedPoems.length > 0 ? (
                        matchedPoems.map((poem, bookIdx) => {
                          const genre = getPoemGenreInfo(poem);
                          const isBookProse = genre.isProse;
                          const palette = isBookProse
                            ? PROSE_PALETTES[bookIdx % PROSE_PALETTES.length]
                            : POETRY_PALETTES[bookIdx % POETRY_PALETTES.length];

                          // Chiều cao gáy sách tự nhiên ngẫu nhiên nhẹ (~220px -> 260px)
                          const bookHeight = 220 + ((bookIdx * 17) % 35);
                          const bookWidth = isBookProse ? 52 : 44;
                          const isHovered = hoveredPoemId === poem.id;
                          const isActive = activePoem?.poem.id === poem.id;

                          return (
                            <div
                              key={poem.id}
                              className="relative flex flex-col items-center select-none"
                              onMouseEnter={() => {
                                setHoveredPoemId(poem.id);
                                triggerHaptic([6]);
                              }}
                              onMouseLeave={() => setHoveredPoemId(null)}
                            >
                              {/* Cuốn sách tương tác 3D */}
                              <motion.button
                                type="button"
                                onClick={() => {
                                  setActivePoem({ poem, collection: col });
                                  triggerHaptic([15, 20]);
                                }}
                                whileHover={{ y: -16, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                                style={{
                                  height: `${bookHeight}px`,
                                  width: `${bookWidth}px`,
                                  background: palette.bg,
                                  borderColor: palette.border,
                                }}
                                className={`relative rounded-t-sm rounded-b-[2px] border shadow-xl flex flex-col justify-between items-center py-3.5 px-1 cursor-pointer transition-shadow duration-300 ${
                                  isActive
                                    ? "ring-2 ring-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)] -translate-y-4"
                                    : "hover:shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                                }`}
                              >
                                {/* Dải lụa kẹp trang sách (Bookmark Ribbon) */}
                                <div
                                  className="absolute -top-3 right-2 w-2.5 h-6 rounded-t-xs shadow-md pointer-events-none"
                                  style={{ backgroundColor: palette.ribbon }}
                                />

                                {/* Gân gáy sách dập nổi đỉnh (Top spine rib) */}
                                <div
                                  className="w-full h-1 border-y opacity-70"
                                  style={{ borderColor: palette.ribs }}
                                />

                                {/* Dấu hiệu Thể Loại Thơ / Văn dập trên đầu gáy */}
                                <div className="text-[9px] font-mono tracking-widest text-amber-200/70 uppercase">
                                  {isBookProse ? "VĂN" : "THƠ"}
                                </div>

                                {/* Tên Tác Phẩm Dọc Thân Gáy Sách (Calligraphy Vertical Spine Title) */}
                                <div
                                  className="flex-1 my-2 flex items-center justify-center overflow-hidden"
                                  style={{
                                    writingMode: "vertical-rl",
                                    textOrientation: "mixed",
                                  }}
                                >
                                  <span
                                    className="font-poem-heading text-xs sm:text-sm font-semibold tracking-wider line-clamp-1 max-h-[140px]"
                                    style={{
                                      backgroundImage: palette.foil,
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                    }}
                                  >
                                    {poem.title}
                                  </span>
                                </div>

                                {/* Con Dấu Triện Vuông Đỏ / Đồng (Seal Stamp) */}
                                <div className="w-5 h-5 rounded-xs border border-amber-400/40 bg-red-900/80 flex items-center justify-center text-[9px] font-poem-verse font-bold text-amber-200 shadow-xs">
                                  {genre.sealText}
                                </div>

                                {/* Gân gáy sách dập nổi chân (Bottom spine rib) */}
                                <div
                                  className="w-full h-1 border-y opacity-70"
                                  style={{ borderColor: palette.ribs }}
                                />
                              </motion.button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-44 flex items-center justify-center px-8 text-amber-200/50 font-serif text-xs italic">
                          Không có tác phẩm khớp với từ khóa tìm kiếm.
                        </div>
                      )}

                      {/* Cuốn Sổ Tay Dự Phòng "Chờ Chắp Bút" Trang Trí Nếu Kệ Ít Sách */}
                      {matchedPoems.length <= 2 && (
                        <div
                          style={{ height: "205px", width: "42px" }}
                          className="rounded-t-sm border border-[#523824] bg-gradient-to-b from-[#2a1a0f] to-[#190f08] opacity-50 flex flex-col items-center justify-center p-2 text-center select-none"
                          title="Quyển sổ mới đang chờ chắp bút..."
                        >
                          <div
                            style={{ writingMode: "vertical-rl" }}
                            className="font-serif text-[10px] text-amber-200/40 tracking-widest"
                          >
                            Đang Biên Soạn
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mặt Gỗ Khối 3D Kê Đáy Sách (Solid 3D Wooden Shelf Plank) */}
                  <div className="relative w-full z-20">
                    {/* Viền mặt gỗ bóng sáng đón sáng rọi (Top highlight wood grain) */}
                    <div className="w-full h-2 bg-gradient-to-r from-[#8b5a2b] via-[#a8733e] to-[#8b5a2b] shadow-xs" />
                    {/* Thân ván gỗ dày dặn (Plank facade) */}
                    <div className="w-full h-4 sm:h-5 bg-gradient-to-b from-[#5c3a1d] to-[#36210f] border-t border-[#b37d45]/40 shadow-lg flex items-center justify-between px-6">
                      <div className="w-2 h-2 rounded-full bg-[#1e1005] shadow-inner" />
                      <div className="w-2 h-2 rounded-full bg-[#1e1005] shadow-inner" />
                    </div>
                    {/* Vệt bóng đổ dưới đáy ván kệ (Cast shelf shadow) */}
                    <div className="w-full h-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Popover Card Chi Tiết Nổi Bật Khi Bấm Vào Cuốn Sách */}
      <AnimatePresence>
        {activePoem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 25 }}
              className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-amber-500/30 shadow-2xl flex flex-col gap-5 overflow-hidden"
            >
              {/* Trang trí góc giấy thi ca */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.15)_0%,_transparent_70%)] pointer-events-none" />

              {/* Header card */}
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-serif font-medium px-2.5 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] dark:text-emerald-300 border border-[var(--accent-green)]/20">
                      {getPoemGenreInfo(activePoem.poem).label}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      Thuộc {activePoem.collection.title}
                    </span>
                  </div>
                  <h3 className="font-poem-heading text-2xl font-bold text-[var(--text-primary)] mt-1">
                    {activePoem.poem.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-serif text-[var(--text-secondary)]">
                    <Feather className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    <span>Tác giả: Thịnh (Wind)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePoem(null)}
                  className="p-1.5 rounded-full hover:bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Trích dẫn vần thơ / đoạn tản văn */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-page)]/80 border border-[var(--border-subtle)] relative z-10">
                <p className="font-poem-verse text-sm sm:text-base text-[var(--text-primary)] leading-relaxed italic line-clamp-6 whitespace-pre-line">
                  {activePoem.poem.excerpt ||
                    activePoem.poem.raw_text?.slice(0, 220) ||
                    "Tác phẩm sâu lắng về những nỗi niềm và giao cảm của tác giả Thịnh (Wind)..."}
                </p>
              </div>

              {/* Hành động chính: Mở Sách 3D Flip hoặc Đến Trang Tác Phẩm */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 relative z-10">
                <Link
                  href={`/poems/${activePoem.poem.slug}`}
                  onClick={() => setActivePoem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-strong)] text-xs font-serif font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Xem Chi Tiết Bài Viết</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setActivePoem(null);
                    openBook(activePoem.poem.slug);
                    triggerHaptic([20, 30]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[var(--accent-green)] hover:opacity-90 text-white text-xs font-serif font-semibold shadow-md text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Mở Cuốn Sách 3D</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
