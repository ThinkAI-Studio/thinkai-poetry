"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { FloralDecoration } from "@/components/lattice/FloralDecoration";
import { FloatingVersePill } from "@/components/lattice/FloatingVersePill";
import { TiltCard } from "@/components/tai-ui/TiltCard";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { mockPoems, mockCollections } from "@/data/mock-poetry";
import { PoemFormType } from "@/types/database";
import { Volume2, Play, Pause, Sparkles } from "lucide-react";
import { SPRINGS } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [selectedForm, setSelectedForm] = useState<PoemFormType | "all">("all");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
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

  const filteredPoems =
    selectedForm === "all"
      ? mockPoems
      : mockPoems.filter((p) => p.form_type === selectedForm);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-24 overflow-x-hidden">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (CHUẨN 100% THEO THIẾT KẾ MẪU)             */}
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
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center w-full">
          {/* Tiêu đề chính: EB Garamond (Kinh điển thời Thơ Mới) */}
          <div className="mb-8 select-none">
            <h1 className="font-poem-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
              Không gian thi ca đương đại
            </h1>
            <p className="font-poem-heading italic text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-neutral-100 font-normal mt-1.5 tracking-tight">
              nơi hồn thơ lắng đọng
            </p>
          </div>

          {/* VÙNG KHUNG THƠ TRUNG TÂM VÀ CÁC THẺ FLOATING PILLS */}
          <div className="relative w-full max-w-lg mx-auto flex items-center justify-center">
            {/* Floating Pill bên trái */}
            <div className="absolute -left-12 sm:-left-36 md:-left-44 bottom-14 z-30 hidden sm:block">
              <FloatingVersePill
                label="--thể-thơ-lục-bát"
                iconDotColor="#2D5A3D"
                delay={0.2}
                onClick={() => {
                  setSelectedForm("luc_bat");
                  document.getElementById("vuon-tho")?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>

            {/* Floating Pills bên phải */}
            <div className="absolute -right-10 sm:-right-36 md:-right-48 top-12 z-30 hidden sm:block">
              <FloatingVersePill
                label="--phong-trào-thơ-mới"
                iconDotColor="#D97706"
                delay={0.6}
                onClick={() => {
                  setSelectedForm("tu_do");
                  document.getElementById("vuon-tho")?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>

            <div className="absolute -right-8 sm:-right-28 md:-right-36 bottom-6 z-30 hidden sm:block">
              <FloatingVersePill
                label="--ngâm-thơ-audio"
                iconDotColor="#7C3AED"
                delay={1.0}
                onClick={togglePlay}
              />
            </div>

            {/* THẺ TRÍCH DẪN THƠ TRUNG TÂM: Lora (Verse Body) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="tai-card w-full p-7 sm:p-9 rounded-2xl shadow-xl backdrop-blur-sm border border-neutral-200/90 dark:border-neutral-800/90 text-left relative z-20"
            >
              {/* Nội dung bài thơ mẫu với chuẩn thụt lề Lục bát 2ch */}
              <div className="space-y-4 font-poem-verse text-base sm:text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 poem-luc-bat">
                <div className="space-y-1">
                  <p className="verse-6">Gió xuân thổi nhẹ qua rèm,</p>
                  <p className="verse-8">Nhành hoa hé nụ dịu êm đón ngày,</p>
                  <p className="verse-6">Không gian thi ca đương đại.</p>
                </div>
                <div className="space-y-1">
                  <p className="verse-6">Dạt dào một tấm lòng son,</p>
                  <p className="verse-8">Ngàn năm dẫu bước chân mòn nẻo xưa,</p>
                  <p className="verse-6">Khí thiêng đất Việt ngàn năm.</p>
                </div>
              </div>

              {/* Tên tác giả ký họa */}
              <div className="mt-5 text-right font-poem-heading text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Ánh Thịnh
              </div>

              {/* TRÌNH PHÁT AUDIO MINI DƯỚI ĐÁY CARD */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200/70 dark:border-neutral-800/70 mt-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-7 h-7 flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-full transition-transform active:scale-90 hover:scale-105 cursor-pointer shadow-xs shrink-0"
                  aria-label={isPlaying ? "Dừng ngâm thơ" : "Phát ngâm thơ"}
                  title={isPlaying ? "Tạm dừng" : "Ngâm thơ diễn cảm"}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </button>

                {/* Sóng âm Equalizer động */}
                <div className="flex items-center gap-0.5 h-4 px-1 shrink-0">
                  {[25, 60, 95, 45, 80, 35, 75, 55, 90, 30].map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-0.5 rounded-full transition-all duration-200",
                        isPlaying ? "bg-[#2D5A3D] dark:bg-[#4ade80]" : "bg-neutral-400 dark:bg-neutral-600"
                      )}
                      style={{
                        height: isPlaying ? `${Math.max(25, h)}%` : "30%",
                      }}
                    />
                  ))}
                </div>

                {/* Thanh tiến trình ngâm thơ */}
                <div className="flex-1 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-[#2D5A3D] dark:bg-[#4ade80] rounded-full transition-all duration-300",
                      isPlaying ? "w-2/5 animate-pulse" : "w-1/12"
                    )}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TUYỂN TẬP THI CA (FEATURED COLLECTIONS VỚI TILT 3D)    */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2D5A3D] dark:text-[#4ade80] font-semibold">
              Tuyển Tập & Bộ Sưu Tập
            </span>
            <h2 className="font-poem-heading text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              Những miền cảm xúc <span className="italic font-normal">chắt chiu</span>
            </h2>
          </div>

          <Link
            href="/tuyen-tap"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            <span>Xem tất cả tuyển tập</span>
            <ArrowRoll size="sm" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockCollections.map((col) => (
            <TiltCard key={col.id} maxTilt={4} className="p-0 border-0 shadow-none bg-transparent">
              <Link
                href={`/tuyen-tap/${col.slug}`}
                className="tai-card group p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 rounded-2xl h-full block"
              >
                <div>
                  <div className="w-full h-36 bg-neutral-100 dark:bg-neutral-900 mb-5 flex items-center justify-center relative overflow-hidden rounded-xl border border-neutral-200/50 dark:border-neutral-800/50">
                    {col.cover_image_url && (
                      <Image
                        src={col.cover_image_url}
                        alt={col.title}
                        width={80}
                        height={80}
                        className="object-contain group-hover:scale-110 transition-transform duration-300 opacity-85"
                      />
                    )}
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 bg-white/90 dark:bg-black/90 text-neutral-800 dark:text-neutral-200 rounded-full border border-neutral-200 dark:border-neutral-800">
                      {col.poems_count} bài
                    </span>
                  </div>

                  <h3 className="font-poem-heading text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#2D5A3D] dark:group-hover:text-[#4ade80] transition-colors line-clamp-1 mb-2">
                    {col.title}
                  </h3>
                  <p className="font-poem-verse text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {col.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Khám phá tuyển tập</span>
                  <ArrowRoll size="sm" />
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TẤT CẢ BÀI THƠ MỚI (#VUON-THO) VỚI TABS SLIDING PILL    */}
      {/* ========================================================= */}
      <section id="vuon-tho" className="max-w-6xl mx-auto px-4 sm:px-6 w-full scroll-mt-28">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2D5A3D] dark:text-[#4ade80] font-semibold">
              Thi Phẩm Chọn Lọc
            </span>
            <h2 className="font-poem-heading text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              Vườn thơ hôm nay
            </h2>
          </div>

          {/* Filter tabs với viên thuốc trượt lò xo layoutId */}
          <div
            onMouseLeave={() => setHoveredTab(null)}
            className="relative flex flex-wrap items-center gap-1 p-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full select-none shadow-xs"
          >
            {[
              { id: "all", label: "Tất Cả" },
              { id: "luc_bat", label: "Lục Bát" },
              { id: "tu_do", label: "Tự Do" },
              { id: "that_ngon", label: "Đường Luật" },
            ].map((tab) => {
              const isActive = selectedForm === tab.id;
              const isHovered = hoveredTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedForm(tab.id as any)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  className="relative px-4 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors rounded-full cursor-pointer z-10 outline-none"
                >
                  {/* Nền Hover lướt trước */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hoverFilterTab"
                      transition={SPRINGS.responsive}
                      className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10"
                    />
                  )}

                  {/* Nền Active màu xanh lá Ánh Thịnh trượt lò xo */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterTab"
                      transition={SPRINGS.responsive}
                      className="absolute inset-0 bg-[#2D5A3D] rounded-full shadow-xs -z-10"
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
        </div>

        {/* Danh sách bài thơ với hiệu ứng nghiêng 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPoems.map((poem) => (
            <TiltCard key={poem.id} maxTilt={3} className="p-0 border-0 shadow-none bg-transparent">
              <Link
                href={`/tho/${poem.slug}`}
                className="tai-card p-6 flex flex-col justify-between group hover:shadow-lg transition-shadow duration-300 rounded-2xl h-full block"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#2D5A3D] dark:text-[#4ade80]">
                      {poem.form_type === "luc_bat" ? "Thơ Lục Bát" : poem.form_type === "that_ngon" ? "Thơ Đường Luật" : "Thơ Tự Do"}
                    </span>
                    {poem.audio_url ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                        <Volume2 className="w-3 h-3" />
                        <span>Ngâm thơ</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#2D5A3D] dark:text-[#4ade80] bg-[#2D5A3D]/10 px-2.5 py-0.5 rounded-full border border-[#2D5A3D]/20">
                        <Sparkles className="w-3 h-3" />
                        <span>Âm cảnh đọc</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-poem-heading text-2xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#2D5A3D] dark:group-hover:text-[#4ade80] transition-colors mb-3">
                    {poem.title}
                  </h3>

                  <p className="font-poem-verse text-base text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed italic mb-6">
                    “{poem.excerpt}”
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">
                    {poem.author?.name} • {poem.view_count} lượt đọc
                  </span>
                  <ArrowRoll size="sm" />
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>
    </div>
  );
}
