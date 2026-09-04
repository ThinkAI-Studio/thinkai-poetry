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
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
            Hồ Sơ Tác Giả & Bút Danh
          </h1>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Thông tin sẽ hiển thị ở cuối bài thơ khi bạn bật tính năng "Hiện thẻ tác giả"
          </p>
        </div>

        <TaiButton variant="primary" size="sm" onClick={handleSave}>
          Lưu Thay Đổi
        </TaiButton>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-mono text-xs flex items-center gap-2 rounded-xl">
          <span>✓</span>
          <span>Hồ sơ tác giả đã được cập nhật thành công!</span>
        </div>
      )}

      {/* Form & Live Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSave} className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex flex-col gap-5 shadow-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Họ và tên / Bút danh *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-base rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Thời kỳ / Trường phái thi ca
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="VD: Văn học đương đại, Thơ trữ tình..."
              className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Đường dẫn ảnh chân dung (Avatar)
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="/floral/flower-pink.png"
              className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Tiểu sử / Đôi nét về tác giả
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-sm leading-relaxed rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Xem trước khi hiển thị cho người đọc:
          </span>

          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-xs">
            <div className="w-16 h-16 shrink-0 bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  width={64}
                  height={64}
                  className="object-cover rounded-full"
                />
              ) : (
                <User className="w-6 h-6 text-[var(--text-muted)]" />
              )}
            </div>

            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-green)] dark:text-[var(--accent-gold)] font-bold">
                {period}
              </span>
              <span className="font-serif text-lg font-bold text-[var(--text-primary)]">
                {name}
              </span>
              <p className="font-serif text-xs text-[var(--text-secondary)] leading-relaxed">
                {bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
