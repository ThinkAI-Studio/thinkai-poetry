"use client";

import React, { useState } from "react";
import Image from "next/image";
import { mockAuthor } from "@/data/mock-poetry";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { User, Save, Feather } from "lucide-react";

export default function AdminAuthorProfilePage() {
  const [name, setName] = useState(mockAuthor.name);
  const [penName, setPenName] = useState(mockAuthor.pen_name || "");
  const [period, setPeriod] = useState(mockAuthor.period || "Văn học đương đại");
  const [bio, setBio] = useState(mockAuthor.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(mockAuthor.avatar_url || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">
            Hồ Sơ Tác Giả & Bút Danh
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Thông tin sẽ hiển thị ở cuối bài thơ khi bạn bật tính năng "Hiện thẻ tác giả"
          </p>
        </div>

        <TaiButton variant="primary" size="sm" onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />}>
          Lưu Thay Đổi
        </TaiButton>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-950 border border-emerald-500/50 text-emerald-200 font-mono text-xs flex items-center gap-2">
          <span>✓</span>
          <span>Hồ sơ tác giả đã được cập nhật thành công!</span>
        </div>
      )}

      {/* Form & Live Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSave} className="p-6 bg-[#0D0D10] border border-white/10 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Họ và tên / Bút danh *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 bg-[#08080A] border border-white/10 text-white font-serif text-base focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Thời kỳ / Trường phái thi ca
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="VD: Văn học đương đại, Thơ trữ tình..."
              className="p-3 bg-[#08080A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Đường dẫn ảnh chân dung (Avatar)
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="/floral/flower-pink.png"
              className="p-3 bg-[#08080A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Tiểu sử / Đôi nét về tác giả
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="p-3 bg-[#08080A] border border-white/10 text-white font-serif text-sm leading-relaxed focus:outline-none focus:border-[#4ade80]"
            />
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            Xem trước khi hiển thị cho người đọc:
          </span>

          <div className="tai-card p-6 border-l-4 border-l-[#2D5A3D] bg-[#FAF8F5] text-[#1A1A1A] flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 shrink-0 bg-neutral-200 border border-neutral-300 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-neutral-500" />
              )}
            </div>

            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2D5A3D] font-bold">
                {period}
              </span>
              <span className="font-serif text-lg font-bold text-neutral-900">
                {name}
              </span>
              <p className="font-serif text-xs text-neutral-600 leading-relaxed">
                {bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
