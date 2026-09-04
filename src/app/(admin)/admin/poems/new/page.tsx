"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Volume2, UserCheck, Eye } from "lucide-react";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { WipeButton } from "@/components/tai-ui/WipeButton";
import { PoemFormType } from "@/types/database";
import { mockCollections } from "@/data/mock-poetry";

export default function NewPoemPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [formType, setFormType] = useState<PoemFormType>("luc_bat");
  const [collectionId, setCollectionId] = useState(mockCollections[0]?.id || "");
  const [excerpt, setExcerpt] = useState("");
  const [poemText, setPoemText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [showAuthorInfo, setShowAuthorInfo] = useState(true); // Toggle per user requirement!
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    // Auto generate slug
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Tự động phân tách khổ thơ và gán class thụt lề câu 6-8 lục bát
      const stanzas = poemText
        .split(/\n\s*\n/)
        .map((stanza) => {
          const lines = stanza
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
          if (formType === "luc_bat") {
            const verses = lines
              .map((l, i) => `<p class="verse ${i % 2 === 0 ? "verse-6" : "verse-8"}">${l}</p>`)
              .join("");
            return `<div class="stanza">${verses}</div>`;
          }
          const verses = lines.map((l) => `<p class="verse">${l}</p>`).join("");
          return `<div class="stanza">${verses}</div>`;
        })
        .join("");

      const res = await fetch("/api/poems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          form_type: formType,
          excerpt: excerpt || poemText.slice(0, 120),
          content_html: stanzas,
          raw_text: poemText,
          audio_url: audioUrl || null,
          show_author_info: showAuthorInfo,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Không thể lưu thi phẩm");
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/poems"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--text-primary)]/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
              Soạn Thảo Thi Phẩm Mới
            </h1>
            <p className="text-xs font-mono text-[var(--text-secondary)]">
              Biên tập bài thơ, điều chỉnh niêm luật và cấu hình hiển thị
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TaiButton
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang Xuất Bản..." : "Xuất Bản Ngay"}
          </TaiButton>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-mono text-xs flex items-center gap-2 rounded-xl">
          <span>✓</span>
          <span>
            Thi phẩm đã được lưu và đồng bộ lên cơ sở dữ liệu thành công!
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-800 dark:text-red-200 font-mono text-xs flex items-center gap-2 rounded-xl">
          <span>✕</span>
          <span>Lỗi: {errorMsg}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Row 1: Tiêu đề & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Tiêu đề bài thơ *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="VD: Trăng Thu Dạ Khúc"
              className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-base rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Đường dẫn tĩnh (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="trang-thu-da-khuc"
              className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-secondary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>
        </div>

        {/* Row 2: Thể loại & Tuyển tập */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Thể loại thơ
            </label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as any)}
              className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            >
              <option value="luc_bat" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Thơ Lục Bát (6 - 8)</option>
              <option value="tu_do" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Thơ Tự Do</option>
              <option value="that_ngon" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Thơ Đường Luật (Thất ngôn)</option>
              <option value="song_that_luc_bat" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Song Thất Lục Bát</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Thuộc Tuyển Tập
            </label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            >
              <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">-- Không thuộc tuyển tập nào (Độc lập) --</option>
              {mockCollections.map((c) => (
                <option key={c.id} value={c.id} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trích dẫn ngắn */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Trích dẫn tiêu biểu (Excerpt)
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Hai câu thơ tâm đắc nhất dùng để giới thiệu..."
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-sm rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
          />
        </div>

        {/* Thân bài thơ */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Nội dung bài thơ (Mỗi dòng một câu, ngắt khổ bằng 2 lần Enter) *
            </label>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              {formType === "luc_bat" ? "Hệ thống sẽ tự động căn lề nhịp 6-8" : "Căn dòng tự do"}
            </span>
          </div>
          <textarea
            required
            rows={10}
            value={poemText}
            onChange={(e) => setPoemText(e.target.value)}
            placeholder={`Gió xuân thổi nhẹ qua rèm\nNhành hoa hé nụ dịu êm đón ngày\nSương giăng mờ ảo hàng cây\nHương xưa còn đọng tháng ngày phôi pha.\n\nThềm rêu vương vấn bước qua...`}
            className="p-4 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-lg leading-loose focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] rounded-xl"
          />
        </div>

        {/* Audio URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            <span>Đường dẫn file âm thanh ngâm thơ (Audio MP3)</span>
          </label>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://... hoặc tải lên Supabase Storage"
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
          />
        </div>

        {/* ========================================================= */}
        {/* CÔNG TẮC BẬT / TẮT THÔNG TIN TÁC GIẢ (USER REQUIREMENT)   */}
        {/* ========================================================= */}
        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex flex-col">
            <span className="text-sm font-serif font-bold text-[var(--text-primary)]">
              Hiển thị thẻ thông tin tác giả ở cuối bài thơ
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              Nếu tắt, bài thơ sẽ ẩn thẻ tác giả để người đọc tập trung vào con chữ
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showAuthorInfo}
              onChange={(e) => setShowAuthorInfo(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--text-primary)]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-green)]"></div>
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <Link
            href="/admin/poems"
            className="px-5 py-2.5 text-xs font-mono uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-colors"
          >
            Hủy bỏ
          </Link>
          <TaiButton variant="primary" type="submit">
            Xuất Bản Tác Phẩm
          </TaiButton>
        </div>
      </form>
    </div>
  );
}
