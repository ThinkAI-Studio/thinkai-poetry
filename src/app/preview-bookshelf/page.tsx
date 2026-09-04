"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { PoeticBookshelf, DEFAULT_BOOKSHELF_ITEMS } from "@/components/bookshelf/PoeticBookshelf";
import { 
  Feather, 
  Compass, 
  BookmarkCheck, 
  BookOpen, 
  Layers, 
  ChevronRight,
  Eye,
  CheckCircle2,
  Info
} from "lucide-react";

function BookshelfPreviewContent() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const bookParam = searchParams.get("book");
  const defaultViewMode = viewParam === "grid" ? "grid" : "shelf";
  const defaultBookId = bookParam || undefined;

  return (
    <PoeticBookshelf 
      defaultViewMode={defaultViewMode}
      defaultBookId={defaultBookId}
    />
  );
}

export default function PreviewBookshelfPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B0F0E] text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* 1. Header Nhận Diện Mới: "Thịnh và Thơ" + Công Tắc Xúc Giác ThemeSwitch */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FDFBF7]/90 dark:bg-[#0B0F0E]/90 border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo & Tên Thương Hiệu Thịnh và Thơ */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-10 h-10 shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/thinh-va-tho-symbol.png"
                alt="Thịnh và Thơ Logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-poem-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-[#1E3F2E] dark:group-hover:text-[#4ade80] transition-colors">
                  Thịnh và Thơ
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300/50 dark:border-amber-700/50 font-semibold">
                  Preview Nghiệm Thu
                </span>
              </div>
              <span className="text-xs font-serif text-neutral-500 dark:text-neutral-400">
                Thịnh và Thơ &bull; Không Gian Thi Ca Đương Đại
              </span>
            </div>
          </Link>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-5">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
              <span className="text-[#1E3F2E] dark:text-[#4ade80] font-semibold flex items-center gap-1.5 cursor-pointer">
                <Compass className="w-4 h-4" /> Tủ Sách Thi Ca
              </span>
              <span className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                Vườn Thơ Mới
              </span>
              <span className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                Tác Giả Hữu Thịnh
              </span>
            </nav>

            <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-800 hidden md:block" />

            {/* Công tắc chuyển đổi Light / Dark mode dạng viên nang tactile */}
            <div className="flex items-center gap-2.5 bg-neutral-100/80 dark:bg-neutral-900/80 py-1 px-3 rounded-full border border-neutral-200/80 dark:border-neutral-800/80">
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 font-medium">
                Giao diện:
              </span>
              <ThemeSwitch id="header-preview-switch" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Banner Thông Báo Nghiệm Thu & Các Cải Tiến Trọng Tâm */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/12 via-emerald-500/10 to-transparent dark:from-emerald-950/40 dark:via-neutral-900/50 dark:to-neutral-900/20 border border-amber-300/40 dark:border-emerald-800/40 backdrop-blur-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/15 dark:bg-emerald-500/20 text-amber-800 dark:text-emerald-300 shrink-0 mt-0.5">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-poem-heading text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  Bản Thử Nghiệm: Tủ Sách Thi Ca 3D & Công Tắc Xúc Giác Mới
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-3xl leading-relaxed">
                  Trang thử nghiệm độc lập (chưa can thiệp mã nguồn trang chủ chính). Được thiết kế riêng để bạn xem trước và trải nghiệm thực tế:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Tủ Sách 3D:</strong> Kệ gỗ mun, gáy sách dập nhũ vàng, cơ học rút sách.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Công tắc viên nang:</strong> Thay nút tròn bằng switch trượt xúc giác êm ái.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Fix giật nửa màn hình:</strong> 3-keyframe GPU affine polygon triệt tiêu khựng.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Nhận diện chuẩn:</strong> Toàn bộ định vị là &ldquo;Thịnh và Thơ&rdquo; - Thơ Hữu Thịnh.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 self-stretch sm:self-auto justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-white/90 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 shadow-xs">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Tác giả: Hữu Thịnh
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-300">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Chưa ghi đè source chính
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hero Thi Ca Rút Gọn */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest text-[#1E3F2E] dark:text-[#4ade80] bg-[#1E3F2E]/8 dark:bg-[#4ade80]/10 border border-[#1E3F2E]/15 dark:border-[#4ade80]/20 mb-5">
          <span>Thịnh và Thơ</span>
          <span>&bull;</span>
          <span>Thư Phòng Thơ Hữu Thịnh</span>
        </div>
        <h1 className="font-poem-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-5 leading-tight">
          Lắng đọng tâm tình <br />
          <span className="italic font-normal text-[#1E3F2E] dark:text-emerald-400 font-poem-title">
            trên từng trang giấy Dó
          </span>
        </h1>
        <p className="font-poem-verse text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 italic max-w-2xl mx-auto leading-relaxed">
          &ldquo;Ghé lại thềm xưa nhặt chút hương,<br />
          Thơ rơi mấy nhịp giữa tơ vương...&rdquo;
        </p>
      </section>

      {/* 4. POETIC BOOKSHELF COMPONENT: TỦ SÁCH THI CA 3D */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-28">
        <Suspense fallback={<div className="h-96 flex items-center justify-center font-mono text-sm text-neutral-400">Đang chuẩn bị Tủ Sách...</div>}>
          <BookshelfPreviewContent />
        </Suspense>
      </main>

      {/* 5. Footer Prototype */}
      <footer className="w-full border-t border-neutral-200/80 dark:border-neutral-800/80 py-10 bg-neutral-100/50 dark:bg-neutral-950/50 text-center text-xs text-neutral-500 dark:text-neutral-400 font-serif">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-2">
          <p className="font-medium text-neutral-700 dark:text-neutral-300">
            Thịnh và Thơ &copy; {new Date().getFullYear()} &bull; Không gian thi ca đương đại của tác giả Hữu Thịnh
          </p>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Bản xem trước nghiệm thu &bull; Chưa merge vào luồng chính &bull; Tối ưu hóa 60fps Native Compositor
          </p>
        </div>
      </footer>
    </div>
  );
}
