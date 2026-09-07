"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { User, Save, Feather, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import type { Author } from "@/types/database";

const AVATAR_PRESETS = [
  { label: "Hoa Hồng Mơ", url: "/floral/flower-pink.png" },
  { label: "Hoa Cúc Vàng", url: "/floral/flower-yellow.png" },
  { label: "Nhành Lá Xanh", url: "/floral/leaf-1.png" },
];

export default function AdminAuthorProfilePage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("Thịnh");
  const [penName, setPenName] = useState("Wind");
  const [slug, setSlug] = useState("thinh-wind");
  const [period, setPeriod] = useState("Văn học đương đại");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/floral/flower-pink.png");

  // UI status
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const populateFields = useCallback((author: Author) => {
    setName(author.name || "");
    setPenName(author.pen_name || "");
    setSlug(author.slug || "");
    setPeriod(author.period || "Văn học đương đại");
    setBio(author.bio || "");
    setAvatarUrl(author.avatar_url || "/floral/flower-pink.png");
  }, []);

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/authors");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setAuthors(json.data);
        const current = json.data[0];
        setSelectedAuthorId(current.id);
        populateFields(current);
      }
    } catch (e) {
      console.error("Lỗi nạp tác giả:", e);
    } finally {
      setLoading(false);
    }
  }, [populateFields]);

  // Load authors on mount
  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const handleSelectAuthor = (authorId: string) => {
    setSelectedAuthorId(authorId);
    const found = authors.find((a) => a.id === authorId);
    if (found) {
      populateFields(found);
      setSaveStatus(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setSaveStatus({ type: "error", message: "Vui lòng nhập họ và tên tác giả." });
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus(null);

      const res = await fetch("/api/authors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAuthorId,
          name: name.trim(),
          pen_name: penName.trim() || null,
          slug: slug.trim() || undefined,
          period: period.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSaveStatus({
          type: "success",
          message: "Hồ sơ tác giả đã được cập nhật thành công lên Supabase & hệ thống!",
        });

        // Update list
        setAuthors((prev) =>
          prev.map((a) => (a.id === json.data.id ? json.data : a))
        );

        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus({
          type: "error",
          message: json.error || "Không thể cập nhật hồ sơ tác giả.",
        });
      }
    } catch (err: any) {
      setSaveStatus({
        type: "error",
        message: err.message || "Lỗi kết nối máy chủ.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Hồ Sơ Tác Giả & Ký Danh
          </h1>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Chỉnh sửa thông tin tác giả, ký danh, tiểu sử và triện son hiển thị trên toàn bộ không gian Wind
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TaiButton
            variant="outline"
            size="sm"
            onClick={fetchAuthors}
            disabled={loading}
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Làm Mới</span>
          </TaiButton>

          <TaiButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || loading}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Đang Lưu..." : "Lưu Thay Đổi"}</span>
          </TaiButton>
        </div>
      </div>

      {/* Thông báo trạng thái lưu */}
      {saveStatus && (
        <div
          className={`p-4 border font-mono text-xs flex items-center gap-2.5 rounded-xl transition-all ${
            saveStatus.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200"
              : "bg-red-500/15 border-red-500/40 text-red-800 dark:text-red-200"
          }`}
        >
          {saveStatus.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Bộ chọn tác giả nếu có nhiều hơn 1 tác giả */}
      {authors.length > 1 && (
        <div className="flex items-center gap-2 p-1.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
          <span className="text-xs font-mono text-[var(--text-muted)] px-2 whitespace-nowrap">
            Chọn tác giả:
          </span>
          {authors.map((author) => (
            <button
              key={author.id}
              type="button"
              onClick={() => handleSelectAuthor(author.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors cursor-pointer whitespace-nowrap ${
                selectedAuthorId === author.id
                  ? "bg-[var(--accent-green)] text-white font-bold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {author.name} {author.pen_name ? `(${author.pen_name})` : ""}
            </button>
          ))}
        </div>
      )}

      {/* Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Chỉnh Sửa */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-7 p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex flex-col gap-5 shadow-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tên thật / Họ và tên */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                Tên tác giả *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Thịnh"
                className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-base rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
              />
            </div>

            {/* Ký danh / Bút danh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center justify-between">
                <span>Ký danh / Bút danh</span>
                <span className="text-[10px] text-[var(--accent-gold)]">Wind</span>
              </label>
              <input
                type="text"
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                placeholder="VD: Wind"
                className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-base rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                Đường dẫn định danh (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="thinh-wind"
                className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
              />
            </div>

            {/* Thời kỳ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                Thời kỳ / Trường phái
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="VD: Văn học đương đại"
                className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
              />
            </div>
          </div>

          {/* Avatar URL & Preset Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Ảnh đại diện (Avatar URL)
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="/floral/flower-pink.png"
              className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />

            {/* Presets hoa thi ca */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Mẫu có sẵn:</span>
              <div className="flex items-center gap-2">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`px-2.5 py-1 text-[11px] font-sans rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      avatarUrl === preset.url
                        ? "border-[var(--accent-green)] bg-[var(--accent-green)]/10 text-[var(--accent-green)] font-semibold"
                        : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="relative w-3.5 h-3.5">
                      <Image src={preset.url} alt={preset.label} fill className="object-contain" />
                    </div>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tiểu sử */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Tiểu sử / Đôi nét về tác giả
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tác giả Thịnh (Ký danh: Wind) — Người gieo vần cho những miền ký ức và triết lý nhân sinh sâu lắng..."
              className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-sm leading-relaxed rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <TaiButton
              variant="primary"
              size="default"
              type="submit"
              disabled={isSaving || loading}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Đang lưu thay đổi..." : "Cập Nhật Hồ Sơ Tác Giả"}</span>
            </TaiButton>
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Xem trước khi hiển thị cho người đọc:
          </span>

          {/* Thẻ Hồ Sơ Trực Quan */}
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] flex flex-col items-center text-center gap-4 shadow-xs relative overflow-hidden">
            <div className="w-20 h-20 shrink-0 bg-[var(--bg-page)] border-2 border-[var(--border-subtle)] rounded-full flex items-center justify-center overflow-hidden shadow-xs relative">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name || "Tác giả"}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <User className="w-8 h-8 text-[var(--text-muted)]" />
              )}
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-green)] dark:text-[var(--accent-gold)] font-bold">
                {period || "Văn học đương đại"}
              </span>

              <h3 className="font-poem-heading text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>{name || "Thịnh"}</span>
                {penName && (
                  <span className="text-base font-serif text-[var(--accent-gold)] font-normal">
                    (Ký danh: {penName})
                  </span>
                )}
              </h3>

              <p className="font-poem-verse text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mt-1">
                {bio || "Một ngòi bút thầm lặng ghi chép những chuyển động vi tế của tâm hồn qua từng thi khúc đương đại."}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] w-full flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>Định vị: Wind</span>
              <span className="text-[var(--accent-green)] dark:text-[var(--accent-gold)] font-medium">
                Tác Quyền: {name} {penName ? `(${penName})` : ""}
              </span>
            </div>
          </div>

          {/* Xem Trước Triện Son Đỏ (Dấu ấn cuối mỗi trang sách 3D) */}
          <div className="p-5 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-amber-950/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-serif font-bold text-neutral-800 dark:text-neutral-200">
                Triện Son Chu Sa Trên Sách 3D
              </span>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                Dấu ấn xác thực tác quyền kết thúc mỗi bài thơ / văn
              </span>
            </div>

            <div
              className="w-12 h-12 rounded-lg border-2 border-[#9E2A2B] bg-[#9E2A2B]/10 dark:bg-[#9E2A2B]/20 p-0.5 shadow-xs flex items-center justify-center shrink-0"
              title={`Dấu ấn thi phẩm: ${name} (${penName})`}
            >
              <div className="w-full h-full border border-[#9E2A2B]/50 rounded-sm flex items-center justify-center">
                <span className="font-serif text-[11px] font-bold text-[#9E2A2B] tracking-tighter leading-tight text-center select-none uppercase">
                  {name || "Thịnh"}
                  <br />
                  {penName || "Wind"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
