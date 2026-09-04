"use client";

import React, { useState } from "react";
import Image from "next/image";
import { mockCollections } from "@/data/mock-poetry";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { BookMarked, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState(mockCollections);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newCol = {
      id: `col-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      description,
      cover_image_url: "/floral/flower-pink.png",
      is_featured: true,
      sort_order: collections.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      poems_count: 0,
    };

    setCollections([newCol, ...collections]);
    setTitle("");
    setDescription("");
    setShowCreateForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
            Quản Lý Tuyển Tập & Bộ Sưu Tập Thơ
          </h1>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Gom nhóm các thi phẩm theo từng chủ đề hoặc giai đoạn sáng tác
          </p>
        </div>

        <TaiButton
          variant="primary"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Đóng Form" : "Tạo Tuyển Tập Mới"}
        </TaiButton>
      </div>

      {/* Form Tạo Tuyển Tập Mới */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex flex-col gap-4 shadow-md"
        >
          <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
            <span>Thêm Tuyển Tập Mới</span>
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Tên Tuyển Tập *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Tuyển Tập Thơ Hữu Thịnh 2026"
              className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-base rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Lời Tựa / Giới Thiệu
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vài dòng cảm nghĩ mở đầu cho tuyển tập..."
              className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-sm rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <TaiButton
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setShowCreateForm(false)}
            >
              Hủy
            </TaiButton>
            <TaiButton variant="primary" size="sm" type="submit">
              Xác Nhận Tạo
            </TaiButton>
          </div>
        </form>
      )}

      {/* Danh sách Tuyển Tập */}
      {collections.length === 0 ? (
        <div className="p-12 text-center bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
          <BookMarked className="w-10 h-10 mx-auto text-[var(--accent-gold)] mb-3 opacity-80" />
          <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] mb-1">
            Chưa có tuyển tập nào
          </h3>
          <p className="font-mono text-xs text-[var(--text-muted)] mb-5">
            Dữ liệu mẫu đã được xóa sạch. Hãy bấm nút phía trên để tạo tuyển tập đầu tiên.
          </p>
          <TaiButton
            variant="primary"
            size="sm"
            onClick={() => setShowCreateForm(true)}
          >
            Tạo Tuyển Tập Mới
          </TaiButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
          <div
            key={col.id}
            className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex flex-col justify-between shadow-xs hover:border-[var(--accent-green)]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 bg-[var(--text-primary)]/5 border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-full font-medium">
                  {col.poems_count} thi phẩm
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-[var(--text-secondary)] hover:text-red-500"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif font-bold text-xl text-[var(--text-primary)] mb-2 line-clamp-1">
                {col.title}
              </h3>
              <p className="font-serif text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
                {col.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>Slug: /{col.slug}</span>
              <span className="text-[var(--accent-green)] dark:text-emerald-400">Đang hiển thị</span>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
