"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Collection } from "@/types/database";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { BookMarked, Plus, Edit, Trash2, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCol, setEditingCol] = useState<Collection | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/collections");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCollections(json.data);
      }
    } catch (e: any) {
      showToast("error", "Lỗi tải danh sách tuyển tập: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Không thể tạo tuyển tập");
      }

      setCollections((prev) => [json.data, ...prev]);
      setTitle("");
      setDescription("");
      setShowCreateForm(false);
      showToast("success", `Đã tạo thành công tuyển tập "${json.data.title}"!`);
    } catch (err: any) {
      showToast("error", err.message || "Lỗi khi tạo tuyển tập");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (col: Collection) => {
    setEditingCol(col);
    setEditTitle(col.title);
    setEditDescription(col.description || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCol || !editTitle.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/collections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCol.id,
          title: editTitle.trim(),
          description: editDescription.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Không thể cập nhật tuyển tập");
      }

      setCollections((prev) =>
        prev.map((c) => (c.id === editingCol.id ? { ...c, ...json.data } : c))
      );
      setEditingCol(null);
      showToast("success", `Đã cập nhật tuyển tập "${editTitle}"!`);
    } catch (err: any) {
      showToast("error", err.message || "Lỗi khi cập nhật tuyển tập");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (col: Collection) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tuyển tập "${col.title}"?`)) return;

    try {
      const res = await fetch("/api/collections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: col.id }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Không thể xóa tuyển tập");
      }

      setCollections((prev) => prev.filter((c) => c.id !== col.id));
      showToast("success", `Đã xóa tuyển tập "${col.title}" thành công.`);
    } catch (err: any) {
      showToast("error", err.message || "Lỗi khi xóa tuyển tập");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-16 relative">
      {/* Toast thông báo */}
      {toast && (
        <div className="fixed top-4 right-4 sm:right-8 z-50 max-w-sm w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`p-3.5 rounded-xl border shadow-lg backdrop-blur-md flex items-center gap-3 text-xs font-serif ${
              toast.type === "success"
                ? "bg-[var(--bg-card)]/95 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : "bg-[var(--bg-card)]/95 border-red-500/40 text-red-800 dark:text-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

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
              placeholder="VD: Tuyển Tập Thơ Thịnh (Wind) 2026"
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
            <TaiButton variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? "Đang Lưu..." : "Xác Nhận Tạo"}
            </TaiButton>
          </div>
        </form>
      )}

      {/* Modal Chỉnh Sửa Tuyển Tập */}
      {editingCol && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-lg p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex flex-col gap-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
                Chỉnh Sửa Tuyển Tập
              </h3>
              <button
                type="button"
                onClick={() => setEditingCol(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                Tên Tuyển Tập *
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-base rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                Lời Tựa / Giới Thiệu
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="p-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-sm rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <TaiButton
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setEditingCol(null)}
              >
                Hủy
              </TaiButton>
              <TaiButton variant="primary" size="sm" type="submit" disabled={submitting}>
                {submitting ? "Đang Cập Nhật..." : "Lưu Thay Đổi"}
              </TaiButton>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách Tuyển Tập */}
      {loading ? (
        <div className="p-12 text-center bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-green)]" />
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Đang tải danh sách tuyển tập...
          </span>
        </div>
      ) : collections.length === 0 ? (
        <div className="p-12 text-center bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
          <BookMarked className="w-10 h-10 mx-auto text-[var(--accent-gold)] mb-3 opacity-80" />
          <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] mb-1">
            Chưa có tuyển tập nào
          </h3>
          <p className="font-mono text-xs text-[var(--text-muted)] mb-5">
            Dữ liệu tuyển tập hiện đang trống. Hãy bấm nút phía trên để tạo tuyển tập đầu tiên.
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
                    {col.poems_count ?? 0} thi phẩm
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(col)}
                      className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(col)}
                      className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 transition-colors cursor-pointer"
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
                  {col.description || "Chưa có lời tựa giới thiệu."}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>Slug: /{col.slug}</span>
                <span className="text-[var(--accent-green)] dark:text-emerald-400 font-medium">Đang hiển thị</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

