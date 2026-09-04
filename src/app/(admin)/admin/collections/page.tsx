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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">
            Quản Lý Tuyển Tập & Bộ Sưu Tập Thơ
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Gom nhóm các thi phẩm theo từng chủ đề hoặc giai đoạn sáng tác
          </p>
        </div>

        <TaiButton
          variant="primary"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          {showCreateForm ? "Đóng Form" : "Tạo Tuyển Tập Mới"}
        </TaiButton>
      </div>

      {/* Form Tạo Tuyển Tập Mới */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-[#0D0D10] border border-white/10 rounded-2xl flex flex-col gap-4 shadow-md"
        >
          <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-[#4ade80]" />
            <span>Thêm Tuyển Tập Mới</span>
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Tên Tuyển Tập *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Tuyển Tập Thơ Ánh Thịnh 2026"
              className="p-3 bg-[#08080A] border border-white/10 text-white font-serif text-base rounded-xl focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Lời Tựa / Giới Thiệu
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả cảm xúc hoặc bối cảnh ra đời của tập thơ..."
              className="p-3 bg-[#08080A] border border-white/10 text-white font-serif text-sm rounded-xl focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white rounded-full transition-colors"
            >
              Hủy
            </button>
            <TaiButton variant="primary" type="submit">
              Lưu Tuyển Tập
            </TaiButton>
          </div>
        </form>
      )}

      {/* Danh sách Tuyển Tập */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="p-6 bg-[#0D0D10] border border-white/10 rounded-2xl flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 bg-white/5 border border-white/10 text-neutral-300 rounded-full">
                  {col.poems_count} thi phẩm
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 text-neutral-400 hover:text-white"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-neutral-400 hover:text-red-400"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif font-bold text-xl text-white mb-2 line-clamp-1">
                {col.title}
              </h3>
              <p className="font-serif text-sm text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                {col.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>Slug: /{col.slug}</span>
              <span className="text-emerald-400">Đang hiển thị</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
