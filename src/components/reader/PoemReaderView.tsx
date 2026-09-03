"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poem } from "@/types/database";
import { FloatingReaderBar } from "@/components/reader/FloatingReaderBar";
import { AudioReciterBar } from "@/components/reader/AudioReciterBar";
import { QuoteCardModal } from "@/components/reader/QuoteCardModal";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { ArrowLeft, Sparkles, BookOpen, User, Eye, Calendar, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface PoemReaderViewProps {
  poem: Poem;
}

export function PoemReaderView({ poem }: PoemReaderViewProps) {
  const [fontSize, setFontSize] = useState(19);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const formTypeName = {
    luc_bat: "Thơ Lục Bát",
    song_that_luc_bat: "Song Thất Lục Bát",
    that_ngon: "Thơ Đường Luật",
    tu_do: "Thơ Tự Do",
  }[poem.form_type];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 relative">
      {/* Floating Reader Controls (Light / Sepia / Dark + Font Zoom) */}
      <FloatingReaderBar fontSize={fontSize} setFontSize={setFontSize} />

      {/* Quote Card Generator Modal */}
      <QuoteCardModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        defaultQuote={poem.excerpt || poem.raw_text.slice(0, 120)}
        poemTitle={poem.title}
        authorName={poem.author?.name || "Ánh Thịnh"}
      />

      {/* Back button */}
      <Link
        href="/#tho-moi"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Về trang thơ</span>
      </Link>

      {/* Header Bài Thơ */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D5A3D]/10 text-[#2D5A3D] text-xs font-mono uppercase tracking-wider mb-4">
          <BookOpen className="w-3 h-3" />
          <span>{formTypeName}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
          {poem.title}
        </h1>

        <div className="flex items-center justify-center flex-wrap gap-4 text-xs font-mono text-neutral-500">
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

      {/* Audio Recitation Player Bar (nếu có audio_url) */}
      {poem.audio_url && (
        <AudioReciterBar audioUrl={poem.audio_url} title={`Ngâm thơ: ${poem.title}`} />
      )}

      {/* Thân Bài Thơ (Poem Body) */}
      <div
        className={cn(
          "tai-card p-8 sm:p-14 my-8 relative overflow-hidden shadow-sm",
          poem.form_type === "luc_bat" && "poem-luc-bat",
          poem.form_type === "song_that_luc_bat" && "poem-song-that"
        )}
      >
        {/* Nút Tạo Quote Card nổi ở góc */}
        <div className="absolute top-5 right-5">
          <button
            type="button"
            onClick={() => setIsQuoteModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase bg-[#FAF8F5] dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-[#2D5A3D] text-neutral-700 dark:text-neutral-300 transition-colors rounded-full shadow-xs cursor-pointer"
            title="Tạo ảnh trích dẫn câu thơ để chia sẻ"
          >
            <Quote className="w-3.5 h-3.5 text-[#2D5A3D]" />
            <span className="hidden sm:inline">Trích dẫn ảnh</span>
          </button>
        </div>

        {/* Nội dung bài thơ */}
        <div
          className="font-serif leading-loose text-neutral-900 dark:text-neutral-100 max-w-lg mx-auto"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: poem.content_html }}
        />

        {/* Chú giải từ cổ / Điển cố (nếu có) */}
        {poem.annotations && poem.annotations.length > 0 && (
          <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2D5A3D]" />
              <span>Chú giải từ vựng & Điển cố</span>
            </h4>
            <ul className="flex flex-col gap-2 text-sm font-serif text-neutral-600 dark:text-neutral-400">
              {poem.annotations.map((ann) => (
                <li key={ann.id}>
                  <strong className="text-neutral-900 dark:text-neutral-200">
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
          <div className="w-20 h-20 shrink-0 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
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
            <span className="text-xs font-mono uppercase tracking-widest text-[#2D5A3D] font-semibold">
              Tác giả thi phẩm
            </span>
            <Link
              href={`/tac-gia/${poem.author.slug}`}
              className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 hover:text-[#2D5A3D] transition-colors"
            >
              {poem.author.name}
            </Link>
            <p className="font-serif text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              {poem.author.bio}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
