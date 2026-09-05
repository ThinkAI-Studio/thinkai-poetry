"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { Poem } from "@/types/database";
import { FloatingReaderBar } from "./FloatingReaderBar";
import { InkVerseReader } from "./InkVerseReader";
import { QuoteCardModal } from "./QuoteCardModal";
import {
  ArrowLeft,
  User,
  Quote,
  Clock,
  BookOpen,
} from "lucide-react";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { cn } from "@/lib/utils";

interface PoemReaderViewProps {
  poem: Poem;
}

export function PoemReaderView({ poem }: PoemReaderViewProps) {
  const { openBook } = usePoeticBook();
  const [fontSize, setFontSize] = useState<number>(20);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Thanh tiến trình đọc (Reading Progress Bar)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const isProse = [
    "tan_van",
    "van_xuoi",
    "but_ky",
    "doan_van",
    "Tản Văn",
    "Văn Xuôi",
    "Bút Ký",
    "Tùy Bút",
  ].includes(poem.form_type) || [
    "tan_van",
    "Tản Văn",
    "Văn Xuôi",
  ].includes(poem.category?.name || "");

  const formTypeName =
    poem.form_type === "luc_bat"
      ? "Thơ Lục Bát"
      : poem.form_type === "song_that_luc_bat"
      ? "Song Thất Lục Bát"
      : poem.form_type === "that_ngon"
      ? "Thất Ngôn Bát Cú"
      : poem.form_type === "tu_do"
      ? "Thơ Tự Do"
      : poem.form_type === "tan_van" || poem.form_type === "Tản Văn"
      ? "Tản Văn"
      : poem.form_type === "van_xuoi" || poem.form_type === "Văn Xuôi"
      ? "Văn Xuôi"
      : poem.form_type === "but_ky" || poem.form_type === "Bút Ký"
      ? "Bút Ký"
      : poem.category?.name || poem.form_type;

  const wordCount = poem.raw_text
    ? poem.raw_text.split(/\s+/).filter(Boolean).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <>
      {/* Thanh tiến trình đọc dính đỉnh màn hình (Sticky Reading Progress Line) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-green)] via-emerald-400 to-[var(--accent-gold)] z-50 origin-left"
        style={{ scaleX }}
      />

      <div className={cn("mx-auto px-4 sm:px-6 py-8 md:py-14", isProse ? "max-w-4xl" : "max-w-3xl")}>
        {/* Nút quay lại & Nút Mở Chế Độ Sách 3D */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] rounded-md px-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Trở về Vườn Thơ</span>
          </Link>

          <button
            type="button"
            onClick={() => openBook(poem.slug)}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-white transition-all shadow-xs cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-2 font-medium"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mở Dạng Sách Mở 3D</span>
          </button>
        </div>

        {/* Header Bài Thơ / Bài Văn */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-xs font-mono uppercase tracking-wider mb-4 border border-[var(--accent-green)]/20 font-medium">
            <span>{formTypeName}</span>
          </div>

          <h1 className="font-poem-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4 leading-tight">
            {poem.title}
          </h1>

          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 text-xs font-mono text-[var(--text-muted)]">
            {poem.author && (
              <>
                <span className="font-serif font-bold text-[var(--text-primary)]">{poem.author.name}</span>
                <span>•</span>
              </>
            )}
            {isProse && (
              <>
                <span>{wordCount} từ</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-[var(--accent-green)] font-semibold">
                  <Clock className="w-3 h-3" />
                  <span>~{readingTime} phút đọc</span>
                </span>
                <span>•</span>
              </>
            )}
            <span>{poem.view_count} lượt đọc</span>
            <span>•</span>
            <span>{new Date(poem.created_at).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>

        {/* Thân Bài Thơ / Bài Văn */}
        <div
          className={cn(
            "tai-card p-8 sm:p-14 my-8 relative overflow-hidden shadow-xs",
            poem.form_type === "luc_bat" && "poem-luc-bat",
            poem.form_type === "song_that_luc_bat" && "poem-song-that",
            isProse && "prose-body text-left leading-relaxed max-w-2xl mx-auto"
          )}
        >
          {/* Nút Tạo Quote Card nổi ở góc */}
          <div className="absolute top-5 right-5 z-20">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[var(--accent-green)] text-[var(--text-primary)] transition-colors rounded-full shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)]"
              title="Tạo ảnh trích dẫn câu thơ để chia sẻ"
            >
              <Quote className="w-3.5 h-3.5 text-[var(--accent-green)]" />
              <span className="hidden sm:inline">Trích dẫn ảnh</span>
            </button>
          </div>

          {/* Nội dung bài thơ/văn: Render theo nhịp mực loang (InkVerseReader) */}
          <InkVerseReader contentHtml={poem.content_html} fontSize={fontSize} />

          {/* Chú giải từ cổ / Điển cố (nếu có) */}
          {poem.annotations && poem.annotations.length > 0 && (
            <div className="mt-12 pt-6 border-t border-[var(--border-subtle)]">
              <h4 className="font-poem-heading text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                <span>Chú giải từ vựng & Điển cố</span>
              </h4>
              <ul className="flex flex-col gap-2 text-sm font-poem-verse text-[var(--text-secondary)]">
                {poem.annotations.map((ann) => (
                  <li key={ann.id}>
                    <strong className="text-[var(--text-primary)] font-bold">
                      {ann.term}:
                    </strong>{" "}
                    {ann.explanation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* THÔNG TIN TÁC GIẢ (CHỈ HIỂN THỊ KHI ADMIN BẬT: show_author_info === true) */}
        {poem.show_author_info && poem.author && (
          <div className="tai-card rounded-2xl p-6 md:p-8 mt-10 border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 shrink-0 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center overflow-hidden shadow-xs">
              {poem.author.avatar_url ? (
                <Image
                  src={poem.author.avatar_url}
                  alt={poem.author.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-full"
                />
              ) : (
                <User className="w-8 h-8 text-[var(--text-muted)]" />
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-green)] font-semibold">
                Tác giả thi phẩm
              </span>
              <Link
                href="/tac-gia"
                className="font-poem-heading text-xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] rounded"
              >
                {poem.author.name}
              </Link>
              <p className="font-poem-verse text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
                {poem.author.bio}
              </p>
            </div>
          </div>
        )}

        {/* THANH ĐIỀU KHIỂN NỔI (FLOATING BAR) */}
        <FloatingReaderBar
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        />

        {/* Modal Trích dẫn câu thơ */}
        <QuoteCardModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          poem={poem}
        />
      </div>
    </>
  );
}
