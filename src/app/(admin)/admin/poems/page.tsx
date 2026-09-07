"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockPoems } from "@/data/mock-poetry";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react";

export default function AdminPoemsListPage() {
  const [poems, setPoems] = useState(mockPoems);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/poems")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setPoems(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredPoems = poems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAuthorInfo = (id: string) => {
    setPoems(
      poems.map((p) =>
        p.id === id ? { ...p, show_author_info: !p.show_author_info } : p
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
            Danh Sách Thi Phẩm Đã Sáng Tác
          </h1>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Quản lý toàn bộ bài thơ, tùy chỉnh hiển thị thông tin tác giả và lượt đọc
          </p>
        </div>

        <Link href="/admin/poems/new">
          <TaiButton variant="primary" size="sm">
            Soạn Thơ Mới
          </TaiButton>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
        <Search className="w-4 h-4 text-[var(--text-muted)] ml-1" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tiêu đề bài thơ..."
          className="bg-transparent border-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-xs font-mono focus:outline-none w-full"
        />
      </div>

      {/* Bảng Thi phẩm */}
      <div className="overflow-x-auto no-scrollbar border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded-2xl shadow-xs">
        <table className="w-full text-left text-xs font-mono min-w-[640px]">
          <thead className="bg-[var(--text-primary)]/[0.04] border-b border-[var(--border-subtle)] uppercase tracking-wider text-[var(--text-secondary)] whitespace-nowrap">
            <tr>
              <th className="py-3 px-4 min-w-[200px]">Bài thơ</th>
              <th className="py-3 px-4">Thể loại</th>
              <th className="py-3 px-4">Tác giả</th>
              <th className="py-3 px-4">Hiện thẻ tác giả</th>
              <th className="py-3 px-4">Lượt đọc</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] whitespace-nowrap">
            {filteredPoems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[var(--text-muted)]">
                  <p className="font-serif text-base text-[var(--text-secondary)] mb-1">Chưa có thi phẩm nào</p>
                  <p className="text-xs text-[var(--text-muted)] mb-4">Toàn bộ dữ liệu mẫu đã được xóa sạch. Hãy bấm nút dưới để tạo bài thơ đầu tiên.</p>
                  <Link href="/admin/poems/new" className="inline-block">
                    <TaiButton variant="primary" size="sm">
                      Soạn Thơ Mới
                    </TaiButton>
                  </Link>
                </td>
              </tr>
            ) : (
              filteredPoems.map((poem) => (
              <tr key={poem.id} className="hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                <td className="py-3.5 px-4 min-w-[200px] whitespace-normal">
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-base text-[var(--text-primary)]">
                      {poem.title}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] line-clamp-1 italic">
                      “{poem.excerpt}”
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  {poem.form_type === "luc_bat" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                      Lục Bát
                    </span>
                  ) : poem.form_type === "song_that_luc_bat" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20">
                      Song Thất Lục Bát
                    </span>
                  ) : poem.form_type === "that_ngon" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-violet-500/10 text-violet-800 dark:text-violet-300 border border-violet-500/20">
                      Đường Luật
                    </span>
                  ) : poem.form_type === "tan_van" || poem.form_type === "Tản Văn" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/20">
                      Tản Văn
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                      Tự Do
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-[var(--text-secondary)] font-medium">
                  {poem.author?.name || "Khuyết danh"}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => toggleAuthorInfo(poem.id)}
                    className="cursor-pointer transition-transform active:scale-95"
                    title="Bấm để bật/tắt hiển thị tác giả trên bài thơ này"
                  >
                    {poem.show_author_info ? (
                      <span className="px-2.5 py-0.5 bg-[var(--accent-green)]/15 text-[var(--accent-green)] dark:text-emerald-400 border border-[var(--accent-green)]/30 text-[10px] rounded-md font-semibold">
                        Bật (Hiện)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-[var(--text-primary)]/10 text-[var(--text-secondary)] text-[10px] rounded-md font-medium">
                        Tắt (Ẩn)
                      </span>
                    )}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono font-medium">
                  {poem.view_count}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/poems/${poem.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90"
                      title="Xem bài đăng"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/admin/poems/new"
                      className="p-1.5 rounded-md text-[var(--accent-green)] dark:text-emerald-400 hover:bg-[var(--accent-green)]/10 transition-all active:scale-90"
                      title="Sửa bài thơ"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
