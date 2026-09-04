"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { mockCollections } from "@/data/mock-poetry";
import { cn } from "@/lib/utils";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

const DEFAULT_CATEGORY_OPTIONS: CategoryOption[] = [
  { id: "luc_bat", name: "Thơ Lục Bát (6 - 8)", slug: "luc_bat" },
  { id: "tu_do", name: "Thơ Tự Do", slug: "tu_do" },
  { id: "that_ngon", name: "Thơ Đường Luật (Thất ngôn)", slug: "that_ngon" },
  { id: "song_that_luc_bat", name: "Song Thất Lục Bát", slug: "song_that_luc_bat" },
  { id: "tho_thien", name: "Thơ Thiền & Tĩnh Tâm", slug: "tho_thien" },
  { id: "tho_4_5_chu", name: "Thơ 4 chữ / 5 chữ", slug: "tho_4_5_chu" },
  { id: "tho_7_chu", name: "Thơ 7 chữ", slug: "tho_7_chu" },
];

export default function NewPoemPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORY_OPTIONS);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["luc_bat"]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [collectionId, setCollectionId] = useState(mockCollections[0]?.id || "");
  const [excerpt, setExcerpt] = useState("");
  const [poemText, setPoemText] = useState("");
  const [showAuthorInfo, setShowAuthorInfo] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load existing categories from backend
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          const existingSlugs = new Set(json.data.map((c: any) => c.slug));
          const combined = [
            ...json.data.map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
            })),
            ...DEFAULT_CATEGORY_OPTIONS.filter((d) => !existingSlugs.has(d.slug)),
          ];
          setCategories(combined);
        }
      })
      .catch(() => {});
  }, []);

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

  const toggleCategory = (catSlug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catSlug)) {
        if (prev.length === 1) return prev; // Giữ ít nhất 1 thể loại
        return prev.filter((s) => s !== catSlug);
      } else {
        return [...prev, catSlug];
      }
    });
  };

  const handleAddNewCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    const catSlug = trimmed
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // Nếu đã có thể loại này thì chỉ việc chọn nó
    if (categories.some((c) => c.slug === catSlug)) {
      if (!selectedCategories.includes(catSlug)) {
        setSelectedCategories((prev) => [...prev, catSlug]);
      }
      setNewCategoryName("");
      setIsCreatingCategory(false);
      return;
    }

    const newOption: CategoryOption = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      slug: catSlug,
    };

    setCategories((prev) => [...prev, newOption]);
    setSelectedCategories((prev) => [...prev, catSlug]);
    setNewCategoryName("");
    setIsCreatingCategory(false);

    // Đồng bộ lên API categories
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
    } catch {}
  };

  const primaryFormType = selectedCategories[0] || "luc_bat";
  const primaryCategory = categories.find((c) => c.slug === primaryFormType);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Tự động phân tách khổ thơ và gán class thụt lề câu 6-8 lục bát
      const stanzas = poemText
        .split(/\n\s*\n/)
        .map((stanza) => {
          const lines = stanza
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
          if (primaryFormType === "luc_bat") {
            const verses = lines
              .map((l, i) => `<p class="verse ${i % 2 === 0 ? "verse-6" : "verse-8"}">${l}</p>`)
              .join("");
            return `<div class="stanza">${verses}</div>`;
          }
          const verses = lines.map((l) => `<p class="verse">${l}</p>`).join("");
          return `<div class="stanza">${verses}</div>`;
        })
        .join("");

      const res = await fetch("/api/poems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          form_type: primaryFormType,
          category_id: primaryCategory?.id,
          excerpt: excerpt || poemText.slice(0, 120),
          content_html: stanzas,
          raw_text: poemText,
          audio_url: null,
          show_author_info: showAuthorInfo,
          collection_id: collectionId || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Không thể lưu thi phẩm");
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/poems"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--text-primary)]/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
              Soạn Thảo Thi Phẩm Mới
            </h1>
            <p className="text-xs font-mono text-[var(--text-secondary)]">
              Biên tập bài thơ, chọn thể loại linh hoạt và xuất bản lên vườn thơ Hữu Thịnh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TaiButton
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang Xuất Bản..." : "Xuất Bản Ngay"}
          </TaiButton>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-mono text-xs flex items-center gap-2 rounded-xl">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            Thi phẩm đã được lưu và đồng bộ lên cơ sở dữ liệu thành công!
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-800 dark:text-red-200 font-mono text-xs flex items-center gap-2 rounded-xl">
          <span>✕</span>
          <span>Lỗi: {errorMsg}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Row 1: Tiêu đề & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Tiêu đề bài thơ *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="VD: Trăng Thu Dạ Khúc"
              className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-base rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Đường dẫn tĩnh (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="trang-thu-da-khuc"
              className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-secondary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>
        </div>

        {/* Row 2: Thể loại thơ (Checkbox & Thêm thể loại mới theo yêu cầu của Thịnh) */}
        <div className="flex flex-col gap-3 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Thể loại thơ (Chọn một hoặc nhiều thể loại) *
              </label>
              <p className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                Đánh dấu thể loại phù hợp, hoặc tự tạo thêm nếu chưa có trong danh sách
              </p>
            </div>

            {!isCreatingCategory && (
              <button
                type="button"
                onClick={() => setIsCreatingCategory(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[var(--accent-green)]/10 text-[var(--accent-green)] dark:text-emerald-300 hover:bg-[var(--accent-green)]/20 border border-[var(--accent-green)]/30 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm thể loại mới</span>
              </button>
            )}
          </div>

          {/* Danh sách Checkbox Thể loại */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.slug);
              return (
                <label
                  key={cat.slug || cat.id}
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all select-none",
                    isChecked
                      ? "bg-[var(--accent-green)]/10 border-[var(--accent-green)] text-[var(--text-primary)] font-semibold shadow-xs"
                      : "bg-[var(--bg-page)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.slug)}
                    className="w-4 h-4 rounded border-neutral-300 text-[var(--accent-green)] focus:ring-[var(--accent-green)] accent-[var(--accent-green)] cursor-pointer shrink-0"
                  />
                  <span className="truncate">{cat.name}</span>
                </label>
              );
            })}
          </div>

          {/* Ô nhập tạo thể loại mới khi bấm nút */}
          {isCreatingCategory && (
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[var(--border-subtle)]">
              <input
                type="text"
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewCategory();
                  } else if (e.key === "Escape") {
                    setIsCreatingCategory(false);
                  }
                }}
                placeholder="Nhập tên thể loại mới (VD: Thơ Văn Xuôi, Thơ Haiku...)"
                className="p-2.5 px-3 bg-[var(--bg-page)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] flex-1 max-w-md"
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="px-4 py-2.5 bg-[var(--accent-green)] text-white text-xs font-mono rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ngay</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingCategory(false)}
                className="px-3 py-2.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Hủy
              </button>
            </div>
          )}
        </div>

        {/* Row 3: Tuyển tập */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Thuộc Tuyển Tập
          </label>
          <select
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">
              -- Không thuộc tuyển tập nào (Bài thơ độc lập) --
            </option>
            {mockCollections.map((c) => (
              <option key={c.id} value={c.id} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Trích dẫn ngắn */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Trích dẫn tiêu biểu (Excerpt)
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Hai câu thơ tâm đắc nhất dùng để giới thiệu..."
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-sm rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
          />
        </div>

        {/* Thân bài thơ */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Nội dung bài thơ (Mỗi dòng một câu, ngắt khổ bằng 2 lần Enter) *
            </label>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              {primaryFormType === "luc_bat" ? "Hệ thống tự động căn lề nhịp 6-8" : "Căn dòng tiêu chuẩn"}
            </span>
          </div>
          <textarea
            required
            rows={10}
            value={poemText}
            onChange={(e) => setPoemText(e.target.value)}
            placeholder={`Gió xuân thổi nhẹ qua rèm\nNhành hoa hé nụ dịu êm đón ngày\nSương giăng mờ ảo hàng cây\nHương xưa còn đọng tháng ngày phôi pha.\n\nThềm rêu vương vấn bước qua...`}
            className="p-4 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-lg leading-loose focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] rounded-xl"
          />
        </div>

        {/* CÔNG TẮC BẬT / TẮT THÔNG TIN TÁC GIẢ */}
        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex flex-col">
            <span className="text-sm font-serif font-bold text-[var(--text-primary)]">
              Hiển thị thẻ tác giả Hữu Thịnh ở cuối bài thơ
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              Nếu tắt, bài thơ sẽ ẩn thẻ tác giả để người đọc tập trung hoàn toàn vào câu từ
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showAuthorInfo}
              onChange={(e) => setShowAuthorInfo(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--text-primary)]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-green)]"></div>
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <Link
            href="/admin/poems"
            className="px-5 py-2.5 text-xs font-mono uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-colors"
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
