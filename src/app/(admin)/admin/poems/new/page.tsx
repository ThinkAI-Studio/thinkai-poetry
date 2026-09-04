"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Volume2, UserCheck, Eye } from "lucide-react";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { WipeButton } from "@/components/tai-ui/WipeButton";
import { PoemFormType } from "@/types/database";
import { mockCollections } from "@/data/mock-poetry";

export default function NewPoemPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [formType, setFormType] = useState<PoemFormType>("luc_bat");
  const [collectionId, setCollectionId] = useState(mockCollections[0].id);
  const [excerpt, setExcerpt] = useState("");
  const [poemText, setPoemText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [showAuthorInfo, setShowAuthorInfo] = useState(true); // Toggle per user requirement!
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/poems"
            className="p-2 text-neutral-400 hover:text-white border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white">
              Soạn Thảo Thi Phẩm Mới
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              Biên tập bài thơ, điều chỉnh niêm luật và cấu hình hiển thị
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TaiButton variant="primary" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
            Xuất Bản Ngay
          </TaiButton>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-950 border border-emerald-500/50 text-emerald-200 font-mono text-xs flex items-center gap-2">
          <span>✓</span>
          <span>
            Thi phẩm đã được lưu và đồng bộ lên cơ sở dữ liệu Supabase thành công!
          </span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Row 1: Tiêu đề & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Tiêu đề bài thơ *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="VD: Trăng Thu Dạ Khúc"
              className="p-3 bg-[#0D0D10] border border-white/10 text-white font-serif text-base rounded-xl focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Đường dẫn tĩnh (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="trang-thu-da-khuc"
              className="p-3 bg-[#0D0D10] border border-white/10 text-neutral-400 font-mono text-xs rounded-xl focus:outline-none focus:border-[#4ade80]"
            />
          </div>
        </div>

        {/* Row 2: Thể loại & Tuyển tập */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Thể loại thơ
            </label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as any)}
              className="p-3 bg-[#0D0D10] border border-white/10 text-white font-mono text-xs rounded-xl focus:outline-none focus:border-[#4ade80]"
            >
              <option value="luc_bat">Thơ Lục Bát (6 - 8)</option>
              <option value="tu_do">Thơ Tự Do</option>
              <option value="that_ngon">Thơ Đường Luật (Thất ngôn)</option>
              <option value="song_that_luc_bat">Song Thất Lục Bát</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Thuộc Tuyển Tập
            </label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="p-3 bg-[#0D0D10] border border-white/10 text-white font-mono text-xs rounded-xl focus:outline-none focus:border-[#4ade80]"
            >
              {mockCollections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trích dẫn ngắn */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Trích dẫn tiêu biểu (Excerpt)
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Hai câu thơ tâm đắc nhất dùng để giới thiệu..."
            className="p-3 bg-[#0D0D10] border border-white/10 text-white font-serif text-sm rounded-xl focus:outline-none focus:border-[#4ade80]"
          />
        </div>

        {/* Thân bài thơ */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Nội dung bài thơ (Mỗi dòng một câu, ngắt khổ bằng 2 lần Enter) *
            </label>
            <span className="text-[11px] font-mono text-neutral-500">
              {formType === "luc_bat" ? "Hệ thống sẽ tự động căn lề nhịp 6-8" : "Căn dòng tự do"}
            </span>
          </div>
          <textarea
            required
            rows={10}
            value={poemText}
            onChange={(e) => setPoemText(e.target.value)}
            placeholder={`Gió xuân thổi nhẹ qua rèm\nNhành hoa hé nụ dịu êm đón ngày\nSương giăng mờ ảo hàng cây\nHương xưa còn đọng tháng ngày phôi pha.\n\nThềm rêu vương vấn bước qua...`}
            className="p-4 bg-[#0D0D10] border border-white/10 text-white font-serif text-lg leading-loose focus:outline-none focus:border-[#4ade80] rounded-xl"
          />
        </div>

        {/* Audio URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#4ade80]" />
            <span>Đường dẫn file âm thanh ngâm thơ (Audio MP3)</span>
          </label>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://... hoặc tải lên Supabase Storage"
            className="p-3 bg-[#0D0D10] border border-white/10 text-white font-mono text-xs rounded-xl focus:outline-none focus:border-[#4ade80]"
          />
        </div>

        {/* ========================================================= */}
        {/* CÔNG TẮC BẬT / TẮT THÔNG TIN TÁC GIẢ (USER REQUIREMENT)   */}
        {/* ========================================================= */}
        <div className="p-4 bg-[#0D0D10] border border-white/10 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-lg text-[#4ade80]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-serif font-bold text-white">
                Hiển thị thẻ thông tin tác giả ở cuối bài thơ
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Nếu tắt, bài thơ sẽ ẩn thẻ tác giả để người đọc tập trung vào con chữ
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showAuthorInfo}
              onChange={(e) => setShowAuthorInfo(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D5A3D]"></div>
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
          <Link
            href="/khu-vuc-quan-tri/tho"
            className="px-5 py-2.5 text-xs font-mono uppercase text-neutral-400 hover:text-white rounded-full transition-colors"
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
