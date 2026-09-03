"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FloralDecoration } from "@/components/lattice/FloralDecoration";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { WipeButton } from "@/components/tai-ui/WipeButton";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { mockPoems, mockCollections, mockAuthor } from "@/data/mock-poetry";
import { PoemFormType } from "@/types/database";
import { Sparkles, BookOpen, Feather, Volume2, ArrowRight, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [selectedForm, setSelectedForm] = useState<PoemFormType | "all">("all");

  const featuredPoem = mockPoems[0]; // Vườn Xưa Hoa Nở

  const filteredPoems =
    selectedForm === "all"
      ? mockPoems
      : mockPoems.filter((p) => p.form_type === selectedForm);

  return (
    <div className="flex flex-col gap-20 md:gap-32 pb-24 overflow-x-hidden">
      {/* ========================================================= */}
      {/* 1. HERO SECTION: SORA LATTICE FLORAL CANVAS               */}
      {/* ========================================================= */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center overflow-hidden">
        {/* Khung hoa lá màu nước đung đưa theo gió */}
        <FloralDecoration />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-7 pt-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#131316]/90 border border-neutral-200/90 dark:border-neutral-800 shadow-sm text-xs font-mono tracking-wider uppercase text-[#2D5A3D]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ánh Thịnh Thi Tuyển • ThinkAI Studio</span>
          </div>

          {/* Tiêu đề Serif kết hợp Italic nghệ thuật kiểu Sora Lattice */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-[1.15]">
            Không gian thi ca <br />
            <span className="italic font-normal text-[#2D5A3D] dark:text-[#5BA26B]">
              nơi hồn thơ lắng đọng
            </span>
          </h1>

          {/* Mô tả giàu chất thơ */}
          <p className="font-serif text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            Tuyển tập những tác phẩm thi ca đương đại trác tuyệt. Nơi mỗi câu chữ được nâng niu, hòa cùng âm điệu ngâm thơ và vẻ đẹp thanh tao của hoa cỏ.
          </p>

          {/* Nút hành động */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link href="/tuyen-tap">
              <TaiButton variant="primary" size="lg">
                Khám Phá Tuyển Tập
              </TaiButton>
            </Link>

            <Link href="#tho-moi">
              <WipeButton
                as="div"
                wipeColor="#2D5A3D"
                textColor="#1A1A1A"
                hoverTextColor="#ffffff"
                className="px-6 py-3.5 text-sm bg-white dark:bg-[#131316] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700"
              >
                <span>Thưởng Thức Bài Thơ Mới</span>
                <span className="ml-1.5">↓</span>
              </WipeButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FEATURED POEM OF THE DAY (TÁC PHẨM ĐẶC SẮC)           */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2D5A3D] font-semibold">
            — Thi Phẩm Tiêu Biểu —
          </span>
          <h2 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
            {featuredPoem.title}
          </h2>
        </div>

        <div className="tai-card p-8 sm:p-12 relative overflow-hidden border-l-4 border-l-[#2D5A3D] shadow-md bg-white dark:bg-[#111114]">
          {/* Audio hint badge */}
          {featuredPoem.audio_url && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#2D5A3D]/10 text-[#2D5A3D] text-xs font-mono uppercase tracking-wider rounded-full mb-6">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Có bản thu âm ngâm thơ</span>
            </div>
          )}

          {/* Preview stanzas */}
          <div className="font-serif text-lg md:text-xl leading-loose text-neutral-800 dark:text-neutral-200 poem-luc-bat max-w-md mx-auto my-4 text-left">
            <p className="verse-6">Gió xuân thổi nhẹ qua rèm</p>
            <p className="verse-8">Nhành hoa hé nụ dịu êm đón ngày</p>
            <p className="verse-6">Sương giăng mờ ảo hàng cây</p>
            <p className="verse-8">Hương xưa còn đọng tháng ngày phôi pha...</p>
          </div>

          <div className="flex items-center justify-between pt-8 mt-6 border-t border-neutral-200 dark:border-neutral-800">
            <span className="font-serif italic text-sm text-neutral-500">
              — {featuredPoem.author?.name} • Thể thơ Lục bát
            </span>

            <Link href={`/tho/${featuredPoem.slug}`}>
              <TaiButton variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Đọc toàn văn
              </TaiButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TUYỂN TẬP THI CA (FEATURED COLLECTIONS)                 */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2D5A3D] font-semibold">
              Tuyển Tập & Bộ Sưu Tập
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
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
            <Link
              key={col.id}
              href={`/tuyen-tap/${col.slug}`}
              className="tai-card group p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300"
            >
              <div>
                <div className="w-full h-36 bg-neutral-100 dark:bg-neutral-900 mb-5 flex items-center justify-center relative overflow-hidden rounded-xl border border-neutral-200/50 dark:border-neutral-800/50">
                  {col.cover_image_url && (
                    <Image
                      src={col.cover_image_url}
                      alt={col.title}
                      width={80}
                      height={80}
                      className="object-contain group-hover:scale-110 transition-transform duration-300 opacity-80"
                    />
                  )}
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 bg-white/90 dark:bg-black/90 rounded-full border border-neutral-200 dark:border-neutral-800">
                    {col.poems_count} bài
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#2D5A3D] transition-colors line-clamp-1 mb-2">
                  {col.title}
                </h3>
                <p className="font-serif text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                  {col.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>Khám phá tuyển tập</span>
                <ArrowRoll size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TẤT CẢ BÀI THƠ MỚI (#THO-MOI)                          */}
      {/* ========================================================= */}
      <section id="tho-moi" className="max-w-6xl mx-auto px-4 sm:px-6 w-full scroll-mt-28">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2D5A3D] font-semibold">
              Thi Phẩm Mới Nhất
            </span>
            <h2 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              Vườn thơ hôm nay
            </h2>
          </div>

          {/* Filter tabs theo thể thơ */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full select-none shadow-xs">
            {[
              { id: "all", label: "Tất Cả" },
              { id: "luc_bat", label: "Lục Bát" },
              { id: "tu_do", label: "Tự Do" },
              { id: "that_ngon", label: "Đường Luật" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedForm(tab.id as any)}
                className={cn(
                  "px-4 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors rounded-full cursor-pointer",
                  selectedForm === tab.id
                    ? "bg-[#2D5A3D] text-white font-bold shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách bài thơ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPoems.map((poem) => (
            <Link
              key={poem.id}
              href={`/tho/${poem.slug}`}
              className="tai-card p-6 flex flex-col justify-between group hover:-translate-y-0.5 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#2D5A3D]">
                    {poem.form_type === "luc_bat" ? "Thơ Lục Bát" : poem.form_type === "that_ngon" ? "Thơ Đường Luật" : "Thơ Tự Do"}
                  </span>
                  {poem.audio_url && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-purple-600 dark:text-purple-400">
                      <Volume2 className="w-3 h-3" />
                      <span>Audio</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#2D5A3D] transition-colors mb-3">
                  {poem.title}
                </h3>

                <p className="font-serif text-base text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed italic mb-6">
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
          ))}
        </div>
      </section>
    </div>
  );
}
