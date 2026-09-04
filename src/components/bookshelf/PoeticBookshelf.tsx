"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Volume2, 
  X, 
  ChevronRight, 
  Bookmark, 
  Layers,
  ArrowRight,
  Library,
  LayoutGrid
} from "lucide-react";
import { SPRINGS } from "@/lib/motion";
import { Collection } from "@/types/database";
import { cn } from "@/lib/utils";

// =============================================================================
// 1. DATA INTERFACES
// =============================================================================

export interface FeaturedPoemRef {
  title: string;
  slug: string;
  form: string;
}

export interface PoeticBookItem {
  id: string;
  title: string;
  volumeLabel?: string;
  slug: string;
  author: string;
  year?: string;
  description: string;
  poemsCount: number;
  hasAudioNgamTho?: boolean;
  coverImageUrl?: string;
  sampleExcerpt: {
    verse1: string;
    verse2: string;
  };
  featuredPoems: FeaturedPoemRef[];
  height: number;
  spineWidth: number;
  depth: number;
  palette: {
    spineBg: string;
    spineGradient: string;
    ribsColor: string;
    clothTrim: string;
    foilText: string;
    popoverAccent: string;
    ribbonColor: string;
  };
}

export const DEFAULT_BOOKSHELF_ITEMS: PoeticBookItem[] = [
  {
    id: "col-gio-dau-mua",
    title: "Gió Đầu Mùa",
    volumeLabel: "Tập I",
    slug: "tuyen-tap-anh-thinh-gio-dau-mua",
    author: "Ánh Thịnh",
    year: "2024",
    description: "Tập thơ tập hợp những sáng tác tiêu biểu về tình người, nỗi nhớ và những giao cảm tinh tế với đất trời lúc giao mùa chớm lạnh.",
    poemsCount: 8,
    hasAudioNgamTho: true,
    coverImageUrl: "/floral/flower-pink.png",
    sampleExcerpt: {
      verse1: "Gió xuân thổi nhẹ qua rèm,",
      verse2: "Nhành hoa hé nụ dịu êm đón ngày...",
    },
    featuredPoems: [
      { title: "Vườn Xưa Hoa Nở", slug: "vuon-xua-hoa-no", form: "Lục Bát" },
      { title: "Gió Thoảng Hương Trầm", slug: "gio-thoang-huong-tram", form: "Lục Bát" },
      { title: "Mai Về Dặm Dài", slug: "mai-ve-dam-dai", form: "Lục Bát" },
    ],
    height: 320,
    spineWidth: 54,
    depth: 195,
    palette: {
      spineBg: "#1B382B",
      spineGradient: "linear-gradient(90deg, #102219 0%, #1B382B 22%, #2A543E 54%, #183325 86%, #0E1D15 100%)",
      ribsColor: "#12261C",
      clothTrim: "#D4AF37",
      foilText: "linear-gradient(135deg, #FFF0B8 0%, #E8B958 45%, #F5D280 75%, #C49126 100%)",
      popoverAccent: "#2D5A3D",
      ribbonColor: "from-[#C5A059] to-[#8C6D37]",
    },
  },
  {
    id: "col-huong-sac-mua-thu",
    title: "Hương Sắc Mùa Thu",
    volumeLabel: "Tập II",
    slug: "huong-sac-mua-thu",
    author: "Ánh Thịnh",
    year: "2024",
    description: "Những câu thơ dệt nên từ heo may se lạnh, hoa cúc vàng rực và những chiều sương bảng lảng bên hồ nước phẳng lặng.",
    poemsCount: 6,
    hasAudioNgamTho: true,
    coverImageUrl: "/floral/flower-yellow.png",
    sampleExcerpt: {
      verse1: "Có chiếc lá chạm vào hoàng hôn,",
      verse2: "Nghe mùa trở mình rất khẽ...",
    },
    featuredPoems: [
      { title: "Tiếng Thu Rơi Nghiêng", slug: "tieng-thu-roi-nghieng", form: "Tự Do" },
      { title: "Góc Phố Nhỏ", slug: "goc-pho-nho", form: "Tự Do" },
    ],
    height: 335,
    spineWidth: 58,
    depth: 190,
    palette: {
      spineBg: "#581C23",
      spineGradient: "linear-gradient(90deg, #370F14 0%, #581C23 20%, #7A2732 52%, #49171D 86%, #280B0F 100%)",
      ribsColor: "#390F14",
      clothTrim: "#FAD7A0",
      foilText: "linear-gradient(135deg, #FFF0B8 0%, #E8B958 50%, #C49126 100%)",
      popoverAccent: "#8C2A36",
      ribbonColor: "from-[#9E2A2B] to-[#541219]",
    },
  },
  {
    id: "col-thien-tra",
    title: "Thiền Trà & Chiêm Nghiệm",
    volumeLabel: "Tập III",
    slug: "thien-tra-va-chiem-nghiem",
    author: "Ánh Thịnh",
    year: "2025",
    description: "Nhấp ngụm trà sớm bên thềm hoa, lắng nghe tiếng chuông chiều buông nhẹ ngân nga giữa cõi trần thế an nhiên.",
    poemsCount: 5,
    hasAudioNgamTho: false,
    coverImageUrl: "/floral/leaf-1.png",
    sampleExcerpt: {
      verse1: "Đêm vắng ngẩng đầu hỏi ánh trăng,",
      verse2: "Mấy độ thăng trầm thế sự nhăng...",
    },
    featuredPoems: [
      { title: "Vấn Trăng", slug: "van-trang", form: "Thất Ngôn" },
      { title: "Thiền Trà Sớm", slug: "thien-tra-som", form: "Thất Ngôn" },
    ],
    height: 310,
    spineWidth: 50,
    depth: 200,
    palette: {
      spineBg: "#3A261D",
      spineGradient: "linear-gradient(90deg, #221610 0%, #3A261D 24%, #53372B 54%, #322119 88%, #1A110C 100%)",
      ribsColor: "#221510",
      clothTrim: "#E59866",
      foilText: "linear-gradient(135deg, #F8C471 0%, #E59866 50%, #BA4A00 100%)",
      popoverAccent: "#6E4532",
      ribbonColor: "from-[#2B4C6F] to-[#152538]",
    },
  },
];

// =============================================================================
// 2. KỆ GỖ THƯ VIỆN THỦ CÔNG (WOODEN SHELF PLANK)
// =============================================================================

function ShelfPlank() {
  return (
    <div className="relative w-full z-10 pointer-events-none select-none mt-[-4px]">
      {/* 1. Mặt trên kệ gỗ (Top Surface đón sáng) */}
      <div 
        className="relative w-full h-7 rounded-t-xs overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #5C3A25 0%, #462A19 55%, #382012 100%)",
          boxShadow: "inset 0 1.5px 2px rgba(255, 255, 255, 0.28), inset 0 -2px 5px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Vệt sáng rọi phản chiếu */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(255,235,190,0.45) 50%, transparent 95%)",
          }}
        />
        {/* Vân thớ gỗ sồi */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 16px, rgba(0,0,0,0.35) 17px, transparent 18px)",
          }}
        />
      </div>

      {/* 2. Gờ vát trước kệ (Bevel Bullnose Edge) */}
      <div 
        className="relative w-full h-[20px] flex items-center justify-between px-3 sm:px-8 shadow-md"
        style={{
          background: "linear-gradient(180deg, #4E2F1C 0%, #351E11 65%, #22120A 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.18)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Vạch nẹp đồng thau chìm */}
        <div className="absolute top-[2px] left-0 right-0 h-[1px] bg-white/20" />
        <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-black/50" />

        {/* Ke đồng cổ trang trí góc trái */}
        <div className="flex items-center gap-1.5 opacity-80">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#E2B96F] to-[#7B5927] shadow-sm flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#3D250C]" />
          </div>
          <div className="hidden sm:block w-10 h-[1.5px] bg-gradient-to-r from-[#D4AF37]/70 to-transparent" />
        </div>

        {/* Khắc chìm nhãn Thư phòng Thịnh và Thơ */}
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#EAD0A0]/50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
          Thịnh và Thơ • Tủ Sách Tác Quyền
        </div>

        {/* Ke đồng cổ trang trí góc phải */}
        <div className="flex items-center gap-1.5 opacity-80">
          <div className="hidden sm:block w-10 h-[1.5px] bg-gradient-to-l from-[#D4AF37]/70 to-transparent" />
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#E2B96F] to-[#7B5927] shadow-sm flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#3D250C]" />
          </div>
        </div>
      </div>

      {/* 3. Bóng đổ sâu xuống nền (Under-shelf Drop Shadow) */}
      <div 
        className="w-full h-3"
        style={{ background: "linear-gradient(180deg, #170C06 0%, #0A0503 100%)" }}
      />
      <div 
        className="w-full h-10 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)",
          filter: "blur(5px)",
        }}
      />
    </div>
  );
}

// =============================================================================
// 3. GÁY SÁCH 3D TƯƠNG TÁC (3D INTERACTIVE BOOK SPINE)
// =============================================================================

interface BookSpineItemProps {
  book: PoeticBookItem;
  isSelected: boolean;
  isHovered: boolean;
  isSiblingActive: boolean;
  onHover: (id: string | null) => void;
  onSelect: (book: PoeticBookItem) => void;
}

function BookSpineItem({
  book,
  isSelected,
  isHovered,
  isSiblingActive,
  onHover,
  onSelect,
}: BookSpineItemProps) {
  const { palette } = book;

  return (
    <div 
      className="relative flex flex-col items-center justify-end group cursor-pointer select-none focus:outline-none"
      style={{
        width: `${book.spineWidth}px`,
        height: "365px",
        transformStyle: "preserve-3d",
      }}
      onClick={() => onSelect(book)}
      onMouseEnter={() => onHover(book.id)}
      onMouseLeave={() => onHover(null)}
      role="button"
      tabIndex={0}
      aria-label={`Tập thơ: ${book.title}, tác giả ${book.author}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(book);
        }
      }}
    >
      {/* Contact Shadow dưới chân gáy sách */}
      <motion.div
        animate={{
          scaleX: isSelected ? 1.3 : isHovered ? 1.15 : 1,
          opacity: isSelected ? 0.3 : isHovered ? 0.45 : 0.65,
          y: isSelected ? 16 : isHovered ? 8 : 0,
        }}
        transition={SPRINGS.responsive}
        className="absolute bottom-0 w-[85%] h-3 bg-black/80 rounded-full blur-[3px] -z-10 pointer-events-none"
      />

      {/* THÂN GÁY SÁCH 3D */}
      <motion.div
        animate={
          isSelected
            ? {
                y: -26,
                z: 65,
                rotateY: -16,
                rotateZ: 1.2,
                scale: 1.04,
                boxShadow: "-18px 20px 32px -4px rgba(0, 0, 0, 0.65)",
              }
            : isHovered
            ? {
                y: -14,
                z: 32,
                rotateY: -9,
                rotateZ: -0.8,
                scale: 1.025,
                boxShadow: "-12px 14px 24px -4px rgba(0, 0, 0, 0.5)",
              }
            : {
                y: 0,
                z: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                boxShadow: "-3px 6px 12px -2px rgba(0, 0, 0, 0.3)",
                filter: isSiblingActive ? "brightness(0.72) contrast(0.95)" : "brightness(1) contrast(1)",
              }
        }
        transition={SPRINGS.responsive}
        style={{
          width: `${book.spineWidth}px`,
          height: `${book.height}px`,
          transformStyle: "preserve-3d",
          transformOrigin: "bottom center",
        }}
        className="relative rounded-t-[3px] select-none"
      >
        {/* CẠNH GIẤY 3D BÊN PHẢI (Right Page Edge) */}
        <div
          className="absolute top-0 right-0 h-full origin-right pointer-events-none"
          style={{
            width: `${book.depth}px`,
            transform: "rotateY(90deg)",
            background: "linear-gradient(90deg, #EBE3D5 0%, #DDD3C0 30%, #F5EFEB 70%, #C9BAA0 100%)",
            boxShadow: "inset 0 0 16px rgba(0,0,0,0.3)",
            borderTop: "1px solid rgba(0,0,0,0.15)",
            borderBottom: "1px solid rgba(0,0,0,0.35)",
          }}
        >
          <div 
            className="w-full h-full opacity-35"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(120, 95, 65, 0.35) 3px)",
            }}
          />
        </div>

        {/* MẶT CHÍNH GÁY SÁCH */}
        <div
          className="relative w-full h-full rounded-t-[3px] overflow-hidden flex flex-col justify-between items-center py-3.5 shadow-2xl"
          style={{
            background: palette.spineGradient,
            boxShadow: `
              inset 3px 0 5px -1px rgba(0, 0, 0, 0.7),
              inset -3px 0 5px -1px rgba(0, 0, 0, 0.6),
              0 8px 24px -4px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          {/* Lớp bóng cong trụ (Cylindrical Lighting) */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, transparent 12%, rgba(255,255,255,0.85) 32%, transparent 58%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          {/* Vải bọc mép gáy trên */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5 z-20 flex"
            style={{ backgroundColor: palette.clothTrim }}
          >
            <div 
              className="w-full h-full opacity-60"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #781E1E 0, #781E1E 2px, transparent 2px, transparent 4px)",
              }}
            />
          </div>

          {/* Gân nổi 1 */}
          <div 
            className="w-full h-[3.5px] my-1 relative z-10"
            style={{
              background: palette.ribsColor,
              boxShadow: "0 1px 1px rgba(255,255,255,0.25), 0 -1px 1.5px rgba(0,0,0,0.85)",
            }}
          />

          {/* Hoa văn sen & Huy hiệu tập số */}
          <div className="flex flex-col items-center gap-1 z-10 px-1 opacity-90">
            <div className="w-5 h-[1px] bg-gradient-to-r from-transparent via-[#E8B958] to-transparent" />
            <span className="font-mono text-[9px] uppercase tracking-tighter text-[#F9E79F]/90 text-center font-bold">
              {book.volumeLabel}
            </span>
          </div>

          {/* Gân nổi 2 */}
          <div 
            className="w-full h-[3.5px] relative z-10"
            style={{
              background: palette.ribsColor,
              boxShadow: "0 1px 1px rgba(255,255,255,0.25), 0 -1px 1.5px rgba(0,0,0,0.85)",
            }}
          />

          {/* TIÊU ĐỀ DỌC DÁT VÀNG */}
          <div className="flex-1 flex items-center justify-center my-2 overflow-hidden z-10 px-1">
            <div 
              className="font-poem-heading text-[14px] sm:text-[15px] font-bold tracking-wider select-none text-center whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                background: palette.foilText,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.95)) drop-shadow(0 0 3px rgba(212,175,55,0.25))",
              }}
            >
              {book.title}
            </div>
          </div>

          {/* Gân nổi 3 */}
          <div 
            className="w-full h-[3.5px] relative z-10"
            style={{
              background: palette.ribsColor,
              boxShadow: "0 1px 1px rgba(255,255,255,0.25), 0 -1px 1.5px rgba(0,0,0,0.85)",
            }}
          />

          {/* Tác giả & Triện son ở đáy */}
          <div className="flex flex-col items-center gap-1.5 z-10 px-1 pb-1">
            <span 
              className="font-sans text-[10px] tracking-wider uppercase font-medium text-center"
              style={{
                color: "#E2C992",
                textShadow: "0 1px 2px rgba(0,0,0,0.9)",
              }}
            >
              {book.author}
            </span>
            
            {/* Triện son đỏ Ánh Thịnh */}
            <div className="w-4 h-4 rounded-[2px] bg-[#9E2A2B] border border-amber-300/40 flex items-center justify-center shadow-xs">
              <span className="text-[7px] font-serif text-amber-100 font-bold leading-none">
                ÁT
              </span>
            </div>
          </div>

          {/* Gân nổi 4 */}
          <div 
            className="w-full h-[3.5px] relative z-10"
            style={{
              background: palette.ribsColor,
              boxShadow: "0 1px 1px rgba(255,255,255,0.25), 0 -1px 1.5px rgba(0,0,0,0.85)",
            }}
          />

          {/* Vải bọc mép gáy dưới */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1.5 z-20 flex"
            style={{ backgroundColor: palette.clothTrim }}
          >
            <div 
              className="w-full h-full opacity-60"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #781E1E 0, #781E1E 2px, transparent 2px, transparent 4px)",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* DẢI RUY BĂNG LỤA RỦ DƯỚI KỆ GỖ */}
      <motion.div
        animate={isHovered ? { rotate: [-4, 3, -1, 0], y: 3 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)",
        }}
        className={`w-3 h-8 -mt-1.5 z-0 shadow-md bg-gradient-to-b ${palette.ribbonColor}`}
      />
    </div>
  );
}

// =============================================================================
// 4. FLOATING PREVIEW POPOVER (RÚT SÁCH XEM CHI TIẾT)
// =============================================================================

interface BookPreviewProps {
  book: PoeticBookItem | null;
  onClose: () => void;
}

function BookPreviewCard({ book, onClose }: BookPreviewProps) {
  if (!book) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={SPRINGS.responsive}
      className="w-full max-w-4xl mx-auto mt-8 relative z-30"
    >
      <div className="relative overflow-hidden p-6 sm:p-8 bg-white/95 dark:bg-[#121216]/95 backdrop-blur-xl border border-neutral-200/90 dark:border-neutral-800/90 shadow-2xl rounded-3xl">
        {/* Nền mực loang mờ */}
        <div 
          className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: book.palette.popoverAccent }}
        />

        {/* Nút đóng */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Đóng bảng xem trước"
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Cột trái: Mô phỏng bìa sách nhỏ và câu thơ trích dẫn */}
          <div className="md:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
            <div 
              className="w-28 h-40 rounded-lg shadow-xl flex flex-col justify-between items-center p-3 mb-4 text-white relative overflow-hidden border border-white/10"
              style={{ background: book.palette.spineGradient }}
            >
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#F9E79F]/80">
                {book.volumeLabel || "Thi Tuyển"}
              </span>
              <span className="font-poem-heading text-base font-bold text-center leading-tight">
                {book.title}
              </span>
              <span className="text-[10px] text-[#E2C992]">
                {book.author}
              </span>
            </div>

            <div className="italic font-poem-verse text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
              <p>“{book.sampleExcerpt.verse1}</p>
              <p>{book.sampleExcerpt.verse2}”</p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-2">
              — Trích từ thi tuyển
            </span>
          </div>

          {/* Cột phải: Thông tin, danh sách bài thơ và nút mở đọc */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#1E3F2E]/10 text-[#1E3F2E] dark:text-[#4ade80] border border-[#1E3F2E]/20">
                  <Bookmark className="w-3 h-3" />
                  <span>{book.poemsCount} thi phẩm</span>
                </span>

                {book.hasAudioNgamTho && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    <Volume2 className="w-3 h-3" />
                    <span>Có ngâm thơ audio</span>
                  </span>
                )}
              </div>

              {/* Tiêu đề & Giới thiệu */}
              <h3 className="font-poem-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-2">
                {book.title}
              </h3>
              <p className="font-poem-verse text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed mb-5">
                {book.description}
              </p>

              {/* Danh sách bài thơ trong tập */}
              <div className="mb-6">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  <span>Một số bài thơ trong tập:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {book.featuredPoems.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/poems/${p.slug}`}
                      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 hover:bg-[#1E3F2E]/10 dark:hover:bg-[#1E3F2E]/20 border border-neutral-200/60 dark:border-neutral-700/60 transition-colors text-xs"
                    >
                      <span className="font-poem-heading font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-[#1E3F2E] dark:group-hover:text-[#4ade80]">
                        {p.title}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">({p.form})</span>
                      <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Chân thẻ popover */}
            <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-neutral-500">
                Nhấn <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300 text-[10px]">Esc</kbd> để thu sách lại
              </span>

              <Link
                href={`/collections/${book.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#1E3F2E] hover:bg-[#152e21] text-white text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Mở đọc toàn bộ tuyển tập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// 5. MAIN EXPORT COMPONENT: POETIC BOOKSHELF
// =============================================================================

export function PoeticBookshelf({
  className,
  books = DEFAULT_BOOKSHELF_ITEMS,
  defaultViewMode = "shelf",
  defaultBookId,
}: {
  className?: string;
  books?: PoeticBookItem[];
  defaultViewMode?: "shelf" | "grid";
  defaultBookId?: string;
}) {
  const initialBook = defaultBookId
    ? books.find((b) => b.id === defaultBookId) || books[0]
    : books[0];
  const [selectedBook, setSelectedBook] = useState<PoeticBookItem | null>(initialBook || null);
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"shelf" | "grid">(defaultViewMode);

  // Phím tắt Esc và mũi tên
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedBook(null);
      } else if (e.key === "ArrowRight") {
        const currentIndex = books.findIndex((b) => b.id === selectedBook?.id);
        const nextIndex = (currentIndex + 1) % books.length;
        setSelectedBook(books[nextIndex]);
      } else if (e.key === "ArrowLeft") {
        const currentIndex = books.findIndex((b) => b.id === selectedBook?.id);
        const prevIndex = (currentIndex - 1 + books.length) % books.length;
        setSelectedBook(books[prevIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBook, books]);

  const handleSelectBook = (book: PoeticBookItem) => {
    if (selectedBook?.id === book.id) {
      setSelectedBook(null);
    } else {
      setSelectedBook(book);
    }
  };

  return (
    <section className={cn("relative w-full select-none", className)}>
      {/* Header đề mục và nút Toggle View */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#1E3F2E] dark:text-[#4ade80] font-semibold">
            Tuyển Tập & Bộ Sưu Tập
          </span>
          <h2 className="font-poem-heading text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            Những miền cảm xúc <span className="italic font-normal">chắt chiu</span>
          </h2>
        </div>

        {/* Nút Toggle giữa Tủ Sách và Trưng Bày Bìa */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
            <button
              type="button"
              onClick={() => setViewMode("shelf")}
              className={cn(
                "relative px-3.5 py-1.5 text-xs font-mono tracking-wider transition-colors rounded-full cursor-pointer flex items-center gap-1.5 z-10",
                viewMode === "shelf"
                  ? "text-white font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              )}
            >
              {viewMode === "shelf" && (
                <motion.div
                  layoutId="activeViewMode"
                  transition={SPRINGS.responsive}
                  className="absolute inset-0 bg-[#1E3F2E] rounded-full -z-10 shadow-xs"
                />
              )}
              <Library className="w-3.5 h-3.5" />
              <span>Tủ Sách</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "relative px-3.5 py-1.5 text-xs font-mono tracking-wider transition-colors rounded-full cursor-pointer flex items-center gap-1.5 z-10",
                viewMode === "grid"
                  ? "text-white font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              )}
            >
              {viewMode === "grid" && (
                <motion.div
                  layoutId="activeViewMode"
                  transition={SPRINGS.responsive}
                  className="absolute inset-0 bg-[#1E3F2E] rounded-full -z-10 shadow-xs"
                />
              )}
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Trưng Bày</span>
            </button>
          </div>

          <Link
            href="/collections"
            className="group hidden md:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white ml-2"
          >
            <span>Toàn bộ tập thơ</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* CHẾ ĐỘ 1: TỦ SÁCH 3D (SHELF VIEW) */}
      {viewMode === "shelf" ? (
        <div className="w-full flex flex-col items-center">
          {/* KHUNG KHÔNG GIAN 3D CỦA KỆ SÁCH */}
          <div 
            className="relative w-full flex flex-col items-center pt-8 pb-4"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 65%",
            }}
          >
            {/* Ánh đèn rọi tường ấm áp */}
            <div 
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[75%] max-w-3xl h-48 rounded-full blur-3xl opacity-30 dark:opacity-15 pointer-events-none -z-10"
              style={{
                background: "radial-gradient(ellipse at center, #F8E2B2 0%, rgba(212,175,55,0.2) 45%, transparent 75%)",
              }}
            />

            {/* CONTAINER CHỨA CÁC GÁY SÁCH */}
            <div 
              className="w-full flex items-end justify-center gap-4 sm:gap-7 overflow-x-auto pb-0 px-6 sm:px-0 no-scrollbar scroll-smooth"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {books.map((book) => {
                const isSelected = selectedBook?.id === book.id;
                const isHovered = hoveredBookId === book.id;
                const isSiblingActive = Boolean(selectedBook && !isSelected);

                return (
                  <BookSpineItem
                    key={book.id}
                    book={book}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    isSiblingActive={isSiblingActive}
                    onHover={setHoveredBookId}
                    onSelect={handleSelectBook}
                  />
                );
              })}
            </div>

            {/* THANH KỆ GỖ THỰC TẾ NẰM DƯỚI ĐÁY CÁC GÁY SÁCH */}
            <ShelfPlank />
          </div>

          {/* FLOATING PREVIEW POPOVER MỞ RA KHI RÚT SÁCH */}
          <AnimatePresence mode="wait">
            {selectedBook && (
              <BookPreviewCard
                key={selectedBook.id}
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* CHẾ ĐỘ 2: TRƯNG BÀY BÌA (GRID VIEW NGHỆ THUẬT) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/collections/${book.slug}`}
              className="group p-6 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111115] border border-neutral-200/70 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:border-[#1E3F2E]/30 transition-all duration-300 h-full block"
            >
              <div>
                {/* Khung bìa mộc bản nghệ thuật */}
                <div 
                  className="w-full h-44 mb-5 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner border border-black/10"
                  style={{ background: book.palette.spineGradient }}
                >
                  <div className="absolute inset-2 border border-white/20 rounded-lg pointer-events-none" />
                  {book.coverImageUrl && (
                    <Image
                      src={book.coverImageUrl}
                      alt={book.title}
                      width={90}
                      height={90}
                      className="object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg"
                    />
                  )}
                  <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 bg-black/60 text-white rounded-full backdrop-blur-md">
                    {book.poemsCount} bài
                  </span>
                  <span className="absolute bottom-3 left-3 text-[10px] font-serif text-[#F9E79F]/80">
                    {book.volumeLabel}
                  </span>
                </div>

                <h3 className="font-poem-heading text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#1E3F2E] dark:group-hover:text-[#4ade80] transition-colors mb-2">
                  {book.title}
                </h3>
                <p className="font-poem-verse text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                  {book.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>Khám phá tuyển tập</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
