"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  X,
  ExternalLink,
  Edit3,
} from "lucide-react";
import type { Poem } from "@/types/database";
import { broadcastPoemSync } from "@/lib/poem-sync";

interface RecentPoemsTableProps {
  initialPoems: Poem[];
}

export function RecentPoemsTable({ initialPoems }: RecentPoemsTableProps) {
  const [poems, setPoems] = useState<Poem[]>(initialPoems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const togglePoemVisibility = async (poem: Poem) => {
    const isCurrentlyPublished = poem.status === "published";
    const nextStatus: "published" | "draft" = isCurrentlyPublished ? "draft" : "published";
    setUpdatingId(poem.id);

    // Optimistic UI update
    setPoems((prev) =>
      prev.map((p) => (p.id === poem.id ? { ...p, status: nextStatus } : p))
    );

    // Phát tín hiệu đồng bộ tức thì (0ms) tới tất cả các tab khác
    broadcastPoemSync({
      type: "POEM_VISIBILITY_CHANGED",
      poemId: poem.id,
      status: nextStatus,
    });

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
          : `Đã ẩn bài "${poem.title}" khỏi website và sách 3D.`
      );
    } catch (err: any) {
      // Rollback on error
      setPoems((prev) =>
        prev.map((p) => (p.id === poem.id ? { ...p, status: poem.status } : p))
      );
      broadcastPoemSync({
        type: "POEM_VISIBILITY_CHANGED",
        poemId: poem.id,
        status: poem.status,
      });
      showToast(
        "error",
        err.message || "Lỗi khi lưu thay đổi lên máy chủ."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="relative">
      {/* Toast thông báo nổi */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`p-3.5 rounded-xl border shadow-lg backdrop-blur-md flex items-center justify-between gap-3 text-xs font-serif ${
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

      {/* Header danh sách */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-[var(--text-primary)]">
            Các thi phẩm gần đây
          </h2>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
            Bấm nút để ẩn hoặc hiện toàn bộ bài thơ/tản văn trên website và sách 3D (tự động lưu)
          </p>
        </div>
        <Link
          href="/admin/poems"
          className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 group"
        >
          <span>Xem tất cả</span>
          <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
        </Link>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto no-scrollbar border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded-2xl shadow-xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--text-primary)]/[0.04] border-b border-[var(--border-subtle)] uppercase tracking-wider text-[var(--text-secondary)] whitespace-nowrap">
            <tr>
              <th className="py-3.5 px-4 min-w-[200px]">Tiêu đề bài thơ / văn</th>
              <th className="py-3.5 px-4">Thể loại</th>
              <th className="py-3.5 px-4 min-w-[170px]">Trạng thái hiển thị</th>
              <th className="py-3.5 px-4">Lượt đọc</th>
              <th className="py-3.5 px-4">Ngày tạo</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] whitespace-nowrap">
            {poems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[var(--text-muted)] font-serif">
                  Chưa có thi phẩm nào. Hãy bấm &ldquo;Soạn Thơ Mới&rdquo; để bắt đầu đăng tác phẩm đầu tiên.
                </td>
              </tr>
            ) : (
              poems.map((poem) => {
                const isUpdating = updatingId === poem.id;
                const isJustSaved = justSavedId === poem.id;
                const isPublished = poem.status === "published";
                const isProse =
                  poem.form_type === "tan_van" ||
                  poem.category?.slug === "tan-van" ||
                  poem.category?.name === "Tản Văn";

                return (
                  <tr key={poem.id} className="hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[var(--text-primary)] whitespace-normal min-w-[200px]">
                      <div className="flex flex-col">
                        <span>{poem.title}</span>
                        {poem.status !== "published" && (
                          <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 mt-0.5">
                            [Đang ẩn khỏi web]
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {isProse ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/20">
                          Tản Văn
                        </span>
                      ) : poem.form_type === "luc_bat" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                          Lục Bát
                        </span>
                      ) : poem.form_type === "that_ngon" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-violet-500/10 text-violet-800 dark:text-violet-300 border border-violet-500/20">
                          Đường Luật
                        </span>
                      ) : poem.form_type === "song_that_luc_bat" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20">
                          Song Thất
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                          Tự Do
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => togglePoemVisibility(poem)}
                        disabled={isUpdating}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-serif font-medium transition-all cursor-pointer active:scale-95 ${
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
                    <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono">
                      {poem.view_count}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">
                      {new Date(poem.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        {isPublished && (
                          <Link
                            href={`/poems/${poem.slug}`}
                            target="_blank"
                            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 transition-colors"
                            title="Xem bài thơ trên web"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Xem</span>
                          </Link>
                        )}
                        <Link
                          href={`/admin/poems/new?edit=${poem.id}`}
                          className="text-[var(--accent-green)] dark:text-emerald-400 hover:underline inline-flex items-center gap-1 transition-colors"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Sửa</span>
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
