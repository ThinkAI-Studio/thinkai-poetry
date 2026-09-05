"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Check, Feather, BookOpen, Clock, FileText, Upload } from "lucide-react";
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
  { id: "tan_van", name: "Tản Văn (Tùy bút, Cảm xúc)", slug: "tan_van" },
  { id: "van_xuoi", name: "Văn Xuôi Nghệ Thuật", slug: "van_xuoi" },
  { id: "but_ky", name: "Bút Ký / Hồi Ký", slug: "but_ky" },
  { id: "doan_van", name: "Đoạn Văn Triết Lý", slug: "doan_van" },
  { id: "tho_thien", name: "Thơ Thiền & Tĩnh Tâm", slug: "tho_thien" },
  { id: "tho_4_5_chu", name: "Thơ 4 chữ / 5 chữ", slug: "tho_4_5_chu" },
  { id: "tho_7_chu", name: "Thơ 7 chữ", slug: "tho_7_chu" },
];

export default function NewPoemPage() {
  return (
    <Suspense fallback={<div className="p-8 font-mono text-xs text-[var(--text-muted)]">Đang tải trình soạn thảo tác phẩm...</div>}>
      <NewPoemFormContent />
    </Suspense>
  );
}

function NewPoemFormContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "prose" ? "prose" : "poem";
  const [contentType, setContentType] = useState<"poem" | "prose">(initialType);
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
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(`Đang xử lý tệp ${file.name}...`);
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const textContent = event.target?.result as string;
        if (!textContent) return;

        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(textContent);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.slug) setSlug(parsed.slug);
          if (parsed.excerpt) setExcerpt(parsed.excerpt);
          if (parsed.raw_text || parsed.content) {
            setPoemText(parsed.raw_text || parsed.content);
          }
          if (parsed.form_type) {
            const isProseType = ["tan_van", "van_xuoi", "but_ky", "doan_van"].includes(parsed.form_type);
            setContentType(isProseType ? "prose" : "poem");
            setSelectedCategories([parsed.form_type]);
          }
          setImportStatus(`Đã tải lên tệp ${file.name} thành công!`);
          setTimeout(() => setImportStatus(null), 4000);
          return;
        }

        let extractedTitle = fileNameWithoutExt;
        let extractedContent = textContent;

        const titleMatch = textContent.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          extractedTitle = titleMatch[1].trim();
          extractedContent = textContent.replace(/^#\s+.+$/m, "").trim();
        }

        const autoSlug = extractedTitle
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        setTitle(extractedTitle);
        setSlug(autoSlug);
        setPoemText(extractedContent);

        const lines = extractedContent.split("\n").filter((l) => l.trim().length > 0);
        const avgLineLength = lines.length > 0 ? lines.reduce((acc, l) => acc + l.length, 0) / lines.length : 0;

        if (avgLineLength > 55 || lines.length <= 4) {
          setContentType("prose");
          setSelectedCategories(["tan_van"]);
          setExcerpt(lines[0] ? lines[0].slice(0, 140) + "..." : "");
        } else {
          setContentType("poem");
          setSelectedCategories(["luc_bat"]);
          setExcerpt(lines.slice(0, 2).join(" "));
        }

        setImportStatus(`Đã phân tích & nhập nội dung từ ${file.name} thành công!`);
        setTimeout(() => setImportStatus(null), 4000);
      } catch (err: any) {
        setImportStatus(`Không thể đọc tệp ${file.name}: ${err.message}`);
      }
    };

    reader.readAsText(file, "UTF-8");
  };

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
      // Tự động phân tách khổ thơ hoặc đoạn văn tùy theo thể loại
      let stanzas = "";
      if (contentType === "prose" || ["tan_van", "van_xuoi", "but_ky", "doan_van"].includes(primaryFormType)) {
        const paragraphs = poemText
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
          .join("");
        stanzas = `<div class="prose-content">${paragraphs}</div>`;
      } else {
        stanzas = poemText
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
      }

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
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/poems"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--text-primary)]/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
              {contentType === "prose" ? "Soạn Thảo Tản Văn Mới" : "Soạn Thảo Thi Phẩm Mới"}
            </h1>
            <p className="text-xs font-mono text-[var(--text-secondary)]">
              {contentType === "prose"
                ? "Biên tập tản văn, văn xuôi hoặc bút ký nghệ thuật lên hệ thống"
                : "Biên tập bài thơ, chọn thể loại linh hoạt và xuất bản lên vườn thơ Hữu Thịnh"}
            </p>
          </div>
        </div>

        {/* Tab chuyển đổi chế độ Soạn Thơ vs Soạn Văn */}
        <div className="flex items-center gap-2 p-1.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setContentType("poem");
              setSelectedCategories(["luc_bat"]);
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer",
              contentType === "poem"
                ? "bg-[var(--accent-green)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Soạn Thơ</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setContentType("prose");
              setSelectedCategories(["tan_van"]);
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer",
              contentType === "prose"
                ? "bg-[var(--accent-green)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Soạn Tản Văn</span>
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent-green)] transition-all cursor-pointer shadow-xs active:scale-95">
            <Upload className="w-3.5 h-3.5 text-[var(--accent-green)]" />
            <span>Tải Lên Tệp (.txt, .md, .json)</span>
            <input
              type="file"
              accept=".txt,.md,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <TaiButton
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang Xuất Bản..." : "Xuất Bản Ngay"}
          </TaiButton>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)] dark:text-emerald-300 font-mono text-xs flex items-center gap-2 rounded-xl">
          <Upload className="w-4 h-4 text-[var(--accent-green)] animate-bounce" />
          <span>{importStatus}</span>
        </div>
      )}

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
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
              {contentType === "prose" ? "Tiêu đề bài tản văn / văn xuôi *" : "Tiêu đề bài thơ *"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder={contentType === "prose" ? "VD: Nhớ Mùa Thu Hà Nội" : "VD: Trăng Thu Dạ Khúc"}
              className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-base rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
              Đường dẫn tĩnh (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={contentType === "prose" ? "nho-mua-thu-ha-noi" : "trang-thu-da-khuc"}
              className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-secondary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
            />
          </div>
        </div>

        {/* Row 2: Thể loại (Phân loại theo Thơ hay Tản Văn) */}
        <div className="flex flex-col gap-3 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                {contentType === "prose" ? "Thể loại văn xuôi / tản văn *" : "Thể loại thơ *"}
              </label>
              <p className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                {contentType === "prose"
                  ? "Đánh dấu thể loại tản văn, tùy bút phù hợp hoặc tự tạo thể loại mới"
                  : "Đánh dấu thể loại phù hợp, hoặc tự tạo thêm nếu chưa có trong danh sách"}
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
                placeholder="Nhập tên thể loại mới (VD: Tùy Bút Cảm Nhận, Thơ Haiku...)"
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

        {/* Row 3: Thuộc Tuyển Tập */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            Thuộc Tuyển Tập
          </label>
          <select
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">
              -- Tác phẩm độc lập --
            </option>
            {mockCollections.map((c) => (
              <option key={c.id} value={c.id} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Trích dẫn ngắn / Lời tựa */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            {contentType === "prose" ? "Lời tựa / Tóm tắt dạo đầu tản văn (Excerpt)" : "Trích dẫn tiêu biểu (Excerpt)"}
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder={
              contentType === "prose"
                ? "Viết đoạn văn ngắn 2-3 câu dạo đầu cảm xúc để thu hút người đọc..."
                : "Hai câu thơ tâm đắc nhất dùng để giới thiệu..."
            }
            className="p-3 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif text-sm rounded-xl focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
          />
        </div>

        {/* BOX INPUT CHUYÊN BIỆT CHO NỘI DUNG */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
              {contentType === "prose"
                ? "Nội dung tản văn / văn xuôi (Phân cách các đoạn bằng 2 lần Enter) *"
                : "Nội dung bài thơ (Mỗi dòng một câu, ngắt khổ bằng 2 lần Enter) *"}
            </label>
            {contentType === "prose" ? (
              <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--accent-green)] bg-[var(--accent-green)]/10 px-3 py-1 rounded-full border border-[var(--accent-green)]/20">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                  <span>{poemText ? poemText.split(/\s+/).filter(Boolean).length : 0} từ</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                  <span>~{Math.max(1, Math.ceil((poemText ? poemText.split(/\s+/).filter(Boolean).length : 0) / 200))} phút đọc</span>
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {primaryFormType === "luc_bat" ? "Hệ thống tự động căn lề nhịp 6-8" : "Căn dòng tiêu chuẩn"}
              </span>
            )}
          </div>
          <textarea
            required
            rows={contentType === "prose" ? 14 : 10}
            value={poemText}
            onChange={(e) => setPoemText(e.target.value)}
            placeholder={
              contentType === "prose"
                ? `Hà Nội những ngày chớm thu, cái lạnh chầm chậm lan qua từng khoảng không nồng nàn vị hoa sữa. Tôi đi qua những góc phố quen, thấy nắng vàng rải nhẹ trên mái ngói rêu phong.\n\nCó những kỷ niệm đã nằm yên trong miền ký ức, nhưng chỉ cần một làn gió thu nhẹ thoảng qua là mọi cảm xúc lại vỡ òa...`
                : `Gió xuân thổi nhẹ qua rèm\nNhành hoa hé nụ dịu êm đón ngày\nSương giăng mờ ảo hàng cây\nHương xưa còn đọng tháng ngày phôi pha.\n\nThềm rêu vương vấn bước qua...`
            }
            className={cn(
              "p-5 bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] font-serif focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] rounded-xl transition-all",
              contentType === "prose"
                ? "text-base leading-relaxed text-left p-6"
                : "text-lg leading-loose text-center"
            )}
          />
        </div>

        {/* CÔNG TẮC BẬT / TẮT THÔNG TIN TÁC GIẢ */}
        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex flex-col">
            <span className="text-sm font-serif font-bold text-[var(--text-primary)]">
              {contentType === "prose" ? "Hiển thị thẻ tác giả Hữu Thịnh ở cuối bài văn" : "Hiển thị thẻ tác giả Hữu Thịnh ở cuối bài thơ"}
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              Nếu tắt, bài viết sẽ ẩn thẻ tác giả để người đọc tập trung hoàn toàn vào câu từ
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
