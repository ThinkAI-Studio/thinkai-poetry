"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poem } from "@/types/database";
import { FloatingReaderBar } from "./FloatingReaderBar";
import { PoetryAudioZone } from "./PoetryAudioZone";
import { InkVerseReader } from "./InkVerseReader";
import { QuoteCardModal } from "./QuoteCardModal";
import {
  ArrowLeft,
  Calendar,
  Eye,
  User,
  BookOpen,
  Sparkles,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PoemReaderViewProps {
  poem: Poem;
}

export function PoemReaderView({ poem }: PoemReaderViewProps) {
  const [fontSize, setFontSize] = useState<number>(20);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const formTypeName =
    poem.form_type === "luc_bat"
      ? "Thơ Lục Bát"
      : poem.form_type === "song_that_luc_bat"
      ? "Song Thất Lục Bát"
      : poem.form_type === "that_ngon"
      ? "Thất Ngôn Bát Cú"
      : "Thơ Tự Do";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-14">
      {/* Nút quay lại */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Trở về Vườn Thơ</span>
      </Link>

      {/* Header Bài Thơ */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D5A3D]/10 text-[#2D5A3D] dark:text-[#4ade80] text-xs font-mono uppercase tracking-wider mb-4 border border-[#2D5A3D]/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{formTypeName}</span>
        </div>

        <h1 className="font-poem-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4 leading-tight">
          {poem.title}
        </h1>

        <div className="flex items-center justify-center flex-wrap gap-4 text-xs font-mono text-[var(--text-muted)]">
          {poem.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{poem.author.name}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{poem.view_count} lượt đọc</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(poem.created_at).toLocaleDateString("vi-VN")}</span>
          </span>
        </div>
      </div>

      {/* VÙNG ÂM THANH THI CA (POETRY SOUNDZONE):
          - Nếu có audio: Hiện thanh ngâm thơ chính thức
          - Nếu chưa có audio: Hiện thanh 4 âm cảnh thư giãn đọc thơ */}
      <PoetryAudioZone
        poemId={poem.id}
        poemTitle={poem.title}
        poemSlug={poem.slug}
        audioUrl={poem.audio_url}
        className="my-6"
      />

      {/* Thân Bài Thơ (Poem Body) */}
      <div
        className={cn(
          "tai-card p-8 sm:p-14 my-8 relative overflow-hidden shadow-sm",
          poem.form_type === "luc_bat" && "poem-luc-bat",
          poem.form_type === "song_that_luc_bat" && "poem-song-that"
        )}
      >
        {/* Nút Tạo Quote Card nổi ở góc */}
        <div className="absolute top-5 right-5 z-20">
          <button
            type="button"
            onClick={() => setIsQuoteModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase bg-[var(--bg-page)] border border-[var(--border-subtle)] hover:border-[#2D5A3D] text-[var(--text-primary)] transition-colors rounded-full shadow-xs cursor-pointer"
            title="Tạo ảnh trích dẫn câu thơ để chia sẻ"
          >
            <Quote className="w-3.5 h-3.5 text-[#2D5A3D] dark:text-[#4ade80]" />
            <span className="hidden sm:inline">Trích dẫn ảnh</span>
          </button>
        </div>

        {/* Nội dung bài thơ: Từng câu thơ hiện ra theo nhịp mực loang (InkVerseReader) */}
        <InkVerseReader contentHtml={poem.content_html} fontSize={fontSize} />

        {/* Chú giải từ cổ / Điển cố (nếu có) */}
        {poem.annotations && poem.annotations.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[var(--border-subtle)]">
            <h4 className="font-poem-heading text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2D5A3D] dark:text-[#4ade80]" />
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
        <div className="tai-card rounded-2xl p-6 md:p-8 mt-10 border-l-4 border-l-[#2D5A3D] flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 shrink-0 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center overflow-hidden shadow-xs">
            {poem.author.avatar_url ? (
              <Image
                src={poem.author.avatar_url}
                alt={poem.author.name}
                width={80}
                height={80}
                className="object-cover rounded-full"
              />
            ) : (
              <User className="w-8 h-8 text-neutral-400" />
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2D5A3D] dark:text-[#4ade80] font-semibold">
              Tác giả thi phẩm
            </span>
            <Link
              href="/tac-gia"
              className="font-poem-heading text-xl font-bold text-neutral-900 dark:text-neutral-100 hover:text-[#2D5A3D] dark:hover:text-[#4ade80] transition-colors"
            >
              {poem.author.name}
            </Link>
            <p className="font-poem-verse text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
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
  );
}
