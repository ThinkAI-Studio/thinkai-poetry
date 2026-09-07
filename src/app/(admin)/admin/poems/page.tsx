"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockPoems } from "@/data/mock-poetry";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import {
  Plus,
  Search,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import type { Poem } from "@/types/database";

export default function AdminPoemsListPage() {
  const [poems, setPoems] = useState<Poem[]>(mockPoems);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/poems?include_drafts=true")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setPoems(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const filteredPoems = poems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const togglePoemVisibility = async (poem: Poem) => {
    const isCurrentlyPublished = poem.status === "published";
    const nextStatus: "published" | "draft" = isCurrentlyPublished ? "draft" : "published";
    setUpdatingId(poem.id);

    // Optimistic UI update
    setPoems((prev) =>
      prev.map((p) => (p.id === poem.id ? { ...p, status: nextStatus } : p))
    );

    try {
      const res = await fetch("/api/poems", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: poem.id,
          status: nextStatus,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Không thể cập nhật trạng thái");
      }

      setJustSavedId(poem.id);
      setTimeout(() => setJustSavedId(null), 2500);

      showToast(
        "success",
        nextStatus === "published"
          ? `Đã xuất bản và hiển thị bài "${poem.title}" lên website.`
          : `Đã ẩn toàn bộ bài "${poem.title}" khỏi website và sách 3D.`
      );
    } catch (err: any) {
      // Rollback on error
      setPoems((prev) =>
        prev.map((p) => (p.id === poem.id ? { ...p, status: poem.status } : p))
      );
      showToast(
        "error",
        err.message || "Lỗi khi lưu thay đổi lên máy chủ."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-16 relative">
      {/* Toast thông báo — Cân xứng hoàn hảo trên cả mobile (left-4 right-4) và desktop (sm:w-96) */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 pointer-events-none transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <div
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg backdrop-blur-md flex items-center justify-between gap-3 text-xs font-serif ${
              toast.type === "success"
                ? "bg-[var(--bg-card)]/95 border-emerald-500/30 text-[var(--text-primary)] shadow-emerald-950/10"
                : "bg-[var(--bg-card)]/95 border-red-500/30 text-[var(--text-primary)] shadow-red-950/10"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span className="truncate leading-snug font-medium">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            Danh Sách Thi Phẩm Đã Sáng Tác
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[var(--accent-green)]/15 text-[var(--accent-green)] dark:text-emerald-400 border border-[var(--accent-green)]/30">
              {poems.length} tác phẩm
            </span>
          </h1>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Quản lý toàn bộ bài thơ, tùy chỉnh hiển thị thông tin tác giả và lượt đọc
          </p>
        </div>

        <Link href="/admin/poems/new">
          <TaiButton variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            <span>Soạn Thơ Mới</span>
          </TaiButton>
        </Link>
      </div>

      {/* Thanh tìm kiếm & Ghi chú tự động lưu tinh gọn (loại bỏ banner AI slop) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề bài thơ..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-green)] transition-colors shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)] shrink-0 self-start sm:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Tự động lưu khi bật/ẩn bài viết trên web</span>
        </div>
      </div>

      {/* Bảng Thi phẩm */}
      <div className="overflow-x-auto no-scrollbar border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded-2xl shadow-xs">
        <table className="w-full text-left text-xs font-mono min-w-[640px]">
          <thead className="bg-[var(--text-primary)]/[0.04] border-b border-[var(--border-subtle)] uppercase tracking-wider text-[var(--text-secondary)] whitespace-nowrap">
            <tr>
              <th className="py-3 px-4 min-w-[200px]">Tác phẩm</th>
              <th className="py-3 px-4">Thể loại</th>
              <th className="py-3 px-4">Tác giả</th>
              <th className="py-3 px-4 min-w-[170px]">
                <div className="flex items-center gap-1.5">
                  <span>Hiển thị trên Web</span>
                  <span className="text-[10px] lowercase text-[var(--accent-green)] dark:text-emerald-400 font-normal">
                    (tự động lưu)
                  </span>
                </div>
              </th>
              <th className="py-3 px-4">Lượt đọc</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] whitespace-nowrap">
            {filteredPoems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[var(--text-muted)]">
                  <p className="font-serif text-base text-[var(--text-secondary)] mb-1">
                    Chưa có thi phẩm nào
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mb-4">
                    Toàn bộ dữ liệu mẫu đã được xóa sạch. Hãy bấm nút dưới để tạo bài thơ đầu tiên.
                  </p>
                  <Link href="/admin/poems/new" className="inline-block">
                    <TaiButton variant="primary" size="sm">
                      <Plus className="w-4 h-4" />
                      <span>Soạn Thơ Mới</span>
                    </TaiButton>
                  </Link>
                </td>
              </tr>
            ) : (
              filteredPoems.map((poem) => {
                const isUpdating = updatingId === poem.id;
                const isJustSaved = justSavedId === poem.id;
                const isPublished = poem.status === "published";

                return (
                  <tr key={poem.id} className="hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                    <td className="py-3.5 px-4 min-w-[200px] whitespace-normal">
                      <div className="flex flex-col">
                        <span className="font-serif font-bold text-base text-[var(--text-primary)]">
                          {poem.title}
                        </span>
                        {poem.status !== "published" && (
                          <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 mt-0.5">
                            [Đang ẩn khỏi website]
                          </span>
                        )}
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
                      {poem.author?.name
                        ? poem.author.pen_name
                          ? `${poem.author.name} (${poem.author.pen_name})`
                          : poem.author.name
                        : "Thịnh (Wind)"}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => togglePoemVisibility(poem)}
                        disabled={isUpdating}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-serif font-medium transition-all cursor-pointer active:scale-95 ${
                          isUpdating
                            ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 animate-pulse cursor-wait"
                            : isJustSaved
                            ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/50 shadow-xs"
                            : isPublished
                            ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/35 hover:bg-emerald-500/25"
                            : "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                        }`}
                        title={
                          isPublished
                            ? "Bài đang hiển thị công khai trên website. Bấm để ẩn toàn bộ bài."
                            : "Bài đang ẩn khỏi website. Bấm để xuất bản và hiển thị lại."
                        }
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Đang lưu...</span>
                          </>
                        ) : isJustSaved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>✓ Đã lưu</span>
                          </>
                        ) : isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Đang Hiện</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Đang Ẩn</span>
                          </>
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
                          title="Xem trước bài thơ"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/poems/new?edit=${poem.id}`}
                          className="p-1.5 rounded-md text-[var(--accent-green)] dark:text-emerald-400 hover:bg-[var(--accent-green)]/10 transition-all active:scale-90"
                          title="Chỉnh sửa nội dung bài thơ & lưu thủ công"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
