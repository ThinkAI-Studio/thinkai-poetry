"use client";

import React from "react";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { FloralDecoration } from "@/components/lattice/FloralDecoration";
import { CornerFloralBranches } from "@/components/effects/CornerFloralBranches";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { PoeticBookSection } from "@/components/book/PoeticBookSection";

export default function HomePage() {
  const { openBook } = usePoeticBook();

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-24 overflow-x-clip">
      {/* Cành hoa lá phong & hoa đào rủ từ góc header khi cuộn tới phần sách */}
      <CornerFloralBranches />

      {/* ========================================================= */}
      {/* 1. HERO SECTION: KHÔNG GIAN THI CA ĐƯƠNG ĐẠI               */}
      {/* ========================================================= */}
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center overflow-hidden pt-4 pb-16">
        {/* Nền hoa lá màu nước đung đưa & cánh hoa tương tác */}
        <FloralDecoration />

        {/* Container nội dung Hero */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
          {/* Tiêu đề chính: Hallmark Gate 38a Purity (EB Garamond Roman) */}
          <div className="mb-8 select-none text-center">
            <h1 className="font-poem-heading text-5xl sm:text-6xl md:text-[68px] font-bold tracking-tight text-neutral-900 dark:text-[#EAE6DF] leading-[1.1]">
              Không gian thi ca đương đại
            </h1>
            <p className="font-poem-heading text-3xl sm:text-4xl md:text-[46px] text-neutral-700 dark:text-[#A6A39C] font-light mt-3 tracking-tight">
              Nơi hồn thơ lắng đọng
            </p>
          </div>

          {/* VÙNG KHUNG THƠ TRUNG TÂM VÀ CÁC THẺ PHÂN LOẠI THI CA */}
          <div className="relative w-full max-w-[410px] mx-auto flex items-center justify-center mt-2">
            {/* THẺ THỂ LOẠI 1 (TRÁI): Thơ Lục Bát */}
            <a
              href="#khong-gian-sach-tho"
              className="hidden md:flex absolute right-full mr-6 lg:mr-8 top-[71%] -translate-y-1/2 items-center gap-2 rounded-full border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#181816]/95 px-4 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md z-30 transition-all duration-200 hover:scale-105 active:scale-95 select-none whitespace-nowrap group cursor-pointer"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent-green)] dark:bg-[var(--accent-gold)]" />
              <span className="font-serif text-xs tracking-wider text-neutral-800 dark:text-[#EAE6DF] font-medium group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
                Thơ Lục Bát
              </span>
            </a>

            {/* THẺ THỂ LOẠI 2 (PHẢI TRÊN): Thơ Tự Do */}
            <a
              href="#khong-gian-sach-tho"
              className="hidden md:flex absolute left-full ml-6 lg:ml-8 top-[28%] -translate-y-1/2 items-center gap-2 rounded-full border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#181816]/95 px-4 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md z-30 transition-all duration-200 hover:scale-105 active:scale-95 select-none whitespace-nowrap group cursor-pointer"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#C87932]" />
              <span className="font-serif text-xs tracking-wider text-neutral-800 dark:text-[#EAE6DF] font-medium group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
                Thơ Tự Do
              </span>
            </a>

            {/* THẺ THỂ LOẠI 3 (PHẢI DƯỚI): Thơ Đường Luật */}
            <a
              href="#khong-gian-sach-tho"
              className="hidden md:flex absolute left-full ml-6 lg:ml-8 top-[78%] -translate-y-1/2 items-center gap-2 rounded-full border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#181816]/95 px-4 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md z-30 transition-all duration-200 hover:scale-105 active:scale-95 select-none whitespace-nowrap group cursor-pointer"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#756A88]" />
              <span className="font-serif text-xs tracking-wider text-neutral-800 dark:text-[#EAE6DF] font-medium group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
                Thơ Đường Luật
              </span>
            </a>

            {/* THẺ TRÍCH DẪN THƠ TRUNG TÂM (IMPECCABLE TECTONIC DEPTH) */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="w-full px-8 pt-8 pb-6 sm:px-9 sm:pt-9 sm:pb-7 rounded-2xl bg-[#FAF8F5]/95 dark:bg-[#181816]/95 text-neutral-900 dark:text-[#EAE6DF] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_15px_35px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-md border border-amber-950/10 dark:border-white/10 text-center relative z-20 transition-all duration-300 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_20px_45px_rgba(0,0,0,0.09)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_25px_60px_rgba(0,0,0,0.8)]"
            >
              {/* Nội dung bài thơ */}
              <div className="space-y-4 font-poem-verse text-[14.5px] sm:text-[15px] leading-[1.8] text-neutral-800 dark:text-[#EAE6DF] select-none">
                <div className="space-y-1">
                  <p>Những tháng ngày đã cũ</p>
                  <p>Em nhắc lại làm gì?</p>
                  <p>Do yêu thương chưa đủ</p>
                  <p>Nên chúng mình rời đi</p>
                </div>
                <div className="space-y-1">
                  <p>Hạnh phúc do em chọn</p>
                  <p>Cớ sao phải nặng lòng?</p>
                  <p>Bước qua bao mùa hạ</p>
                  <p>Rồi lại trở về &ldquo;không&rdquo;.</p>
                </div>
              </div>

              {/* Tên tác giả: Thịnh (Wind) */}
              <div className="mt-5 mb-5 text-right font-poem-heading text-sm font-medium text-neutral-700 dark:text-[#A6A39C] select-none pr-1">
                Thịnh (Ký danh: Wind)
              </div>

              {/* Nút Mở Cuốn Sách Thơ 3D */}
              <div className="mt-5 pt-4 border-t border-amber-950/10 dark:border-white/10 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => openBook()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-xs font-serif tracking-wider text-[var(--accent-green)] dark:text-[var(--accent-gold)] bg-amber-950/[0.03] dark:bg-white/[0.04] border border-amber-950/10 dark:border-white/10 hover:border-[var(--accent-green)] dark:hover:border-[var(--accent-gold)] hover:bg-[var(--accent-green)]/10 dark:hover:bg-[var(--accent-gold)]/15 transition-all duration-200 cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.97] shadow-xs group"
                >
                  <BookOpen className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                  <span>Mở Cuốn Sách Thơ 3D</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. KHÔNG GIAN CUỐN SÁCH THƠ MỞ 3D                           */}
      {/* ========================================================= */}
      <PoeticBookSection />
    </div>
  );
}
