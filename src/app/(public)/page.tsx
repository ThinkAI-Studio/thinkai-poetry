"use client";

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { FloralDecoration } from "@/components/lattice/FloralDecoration";
import { Play, Pause, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { PoeticBookSection } from "@/components/book/PoeticBookSection";

export default function HomePage() {
  const { openBook } = usePoeticBook();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-24 overflow-x-clip">
      {/* ========================================================= */}
      {/* 1. HERO SECTION: KHÔNG GIAN THI CA ĐƯƠNG ĐẠI               */}
      {/* ========================================================= */}
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center overflow-hidden pt-4 pb-16">
        {/* Nền hoa lá màu nước đung đưa & cánh hoa tương tác */}
        <FloralDecoration />

        {/* Audio Element cho bản ngâm thơ mẫu */}
        <audio
          ref={audioRef}
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          preload="none"
          onEnded={() => setIsPlaying(false)}
        />

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

            {/* THẺ THỂ LOẠI 2 (PHẢI TRÊN): Phong Trào Thơ Mới */}
            <a
              href="#khong-gian-sach-tho"
              className="hidden md:flex absolute left-full ml-6 lg:ml-8 top-[28%] -translate-y-1/2 items-center gap-2 rounded-full border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#181816]/95 px-4 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md z-30 transition-all duration-200 hover:scale-105 active:scale-95 select-none whitespace-nowrap group cursor-pointer"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#C87932]" />
              <span className="font-serif text-xs tracking-wider text-neutral-800 dark:text-[#EAE6DF] font-medium group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
                Phong Trào Thơ Mới
              </span>
            </a>

            {/* THẺ THỂ LOẠI 3 (PHẢI DƯỚI): Bản Ngâm Diễn Cảm */}
            <a
              href="#khong-gian-sach-tho"
              className="hidden md:flex absolute left-full ml-6 lg:ml-8 top-[78%] -translate-y-1/2 items-center gap-2 rounded-full border border-neutral-200/90 dark:border-white/10 bg-white/95 dark:bg-[#181816]/95 px-4 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md z-30 transition-all duration-200 hover:scale-105 active:scale-95 select-none whitespace-nowrap group cursor-pointer"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#756A88]" />
              <span className="font-serif text-xs tracking-wider text-neutral-800 dark:text-[#EAE6DF] font-medium group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
                Bản Ngâm Diễn Cảm
              </span>
            </a>

            {/* THẺ TRÍCH DẪN THƠ TRUNG TÂM (IMPECCABLE TECTONIC DEPTH) */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="w-full px-8 pt-8 pb-6 sm:px-9 sm:pt-9 sm:pb-7 rounded-2xl bg-white/95 dark:bg-[#181816]/95 text-neutral-900 dark:text-[#EAE6DF] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_15px_35px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md border border-neutral-200/80 dark:border-white/10 text-center relative z-20 transition-all duration-300 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_20px_45px_rgba(0,0,0,0.08)]"
            >
              {/* Nội dung bài thơ */}
              <div className="space-y-4 font-poem-verse text-[14.5px] sm:text-[15px] leading-[1.8] text-neutral-800 dark:text-[#EAE6DF] select-none">
                <div className="space-y-1">
                  <p>Gió xuân thổi nhẹ qua rèm,</p>
                  <p>Nhành hoa hé nụ dịu êm đón ngày,</p>
                  <p>Không gian thi ca đương đại.</p>
                </div>
                <div className="space-y-1">
                  <p>Dạt dào một tấm lòng son,</p>
                  <p>Ngàn năm dẫu bước chân mòn nẻo xưa,</p>
                  <p>Khí thiêng đất Việt ngàn năm.</p>
                </div>
              </div>

              {/* Tên tác giả */}
              <div className="mt-5 mb-5 text-right font-poem-heading text-sm font-medium text-neutral-700 dark:text-[#A6A39C] select-none pr-1">
                Ánh Thịnh
              </div>

              {/* TRÌNH PHÁT AUDIO MINI DƯỚI ĐÁY CARD */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="text-neutral-900 dark:text-[#EAE6DF] transition-transform active:scale-90 hover:scale-110 cursor-pointer shrink-0 p-1 rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                  aria-label={isPlaying ? "Dừng ngâm thơ" : "Phát ngâm thơ"}
                  title={isPlaying ? "Tạm dừng" : "Ngâm thơ diễn cảm"}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>

                {/* Sóng âm Equalizer 60fps mượt mà */}
                <div className="flex items-end gap-[2.5px] h-4 px-1 shrink-0">
                  {[2, 3, 3, 4, 6, 11, 16, 12, 8, 5, 4, 3, 2, 2].map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-[2px] rounded-full transition-colors duration-200",
                        isPlaying
                          ? "bg-[var(--accent-green)] dark:bg-[var(--accent-gold)] animate-eq-bar"
                          : "bg-neutral-300 dark:bg-neutral-700"
                      )}
                      style={{
                        height: isPlaying ? "100%" : `${h}px`,
                        animationDelay: isPlaying ? `${(i % 5) * 0.12}s` : undefined,
                      }}
                    />
                  ))}
                </div>

                {/* Thanh tiến trình ngâm thơ mảnh */}
                <div className="flex-1 h-[1.5px] bg-neutral-300 dark:bg-neutral-700 rounded-full overflow-hidden ml-1">
                  <div
                    className={cn(
                      "h-full bg-[var(--accent-green)] dark:bg-[var(--accent-gold)] rounded-full transition-all duration-300",
                      isPlaying ? "w-2/5 animate-pulse" : "w-1/12"
                    )}
                  />
                </div>
              </div>

              {/* Nút Mở Cuốn Sách Thơ 3D (Rút gọn tên theo Impeccable Distill) */}
              <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/10 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => openBook()}
                  className="inline-flex items-center justify-center text-xs font-serif tracking-wider text-[var(--accent-green)] dark:text-[var(--accent-gold)] hover:text-black dark:hover:text-white transition-colors cursor-pointer py-1 font-semibold focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
                >
                  <span>Mở Cuốn Sách Thơ</span>
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
