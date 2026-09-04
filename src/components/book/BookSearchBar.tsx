"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, BookOpen, ArrowRight, CornerDownLeft } from "lucide-react";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { Poem } from "@/types/database";
import { cn } from "@/lib/utils";

interface SearchMatch {
  poem: Poem;
  pageIndex: number;
  matchedLine?: string;
  matchType: "title" | "verse" | "form";
}

export function BookSearchBar({ className }: { className?: string }) {
  const { poems, searchAndFlipTo, currentPageIndex } = usePoeticBook();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Phím tắt Ctrl+K / Cmd+K để focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tính toán kết quả tìm kiếm full-text
  const results: SearchMatch[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const matches: SearchMatch[] = [];

    poems.forEach((poem, index) => {
      // 1. Khớp tiêu đề
      if (poem.title.toLowerCase().includes(q)) {
        matches.push({
          poem,
          pageIndex: index,
          matchType: "title",
        });
        return;
      }

      // 2. Khớp từng câu thơ trong raw_text
      if (poem.raw_text) {
        // Tách theo dấu câu hoặc câu thơ
        const lines = poem.raw_text.split(/[.\n/]/).map((l) => l.trim()).filter(Boolean);
        const matchedLine = lines.find((l) => l.toLowerCase().includes(q));
        if (matchedLine) {
          matches.push({
            poem,
            pageIndex: index,
            matchedLine,
            matchType: "verse",
          });
          return;
        }
      }

      // 3. Khớp thể thơ
      const formName =
        poem.form_type === "luc_bat"
          ? "lục bát"
          : poem.form_type === "that_ngon"
          ? "đường luật thất ngôn"
          : "tự do";
      if (formName.includes(q)) {
        matches.push({
          poem,
          pageIndex: index,
          matchType: "form",
        });
      }
    });

    return matches;
  }, [query, poems]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (match: SearchMatch) => {
    searchAndFlipTo(match.poem.slug, query.trim());
    setIsFocused(false);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex] || results[0]);
    } else if (e.key === "Escape") {
      setIsFocused(false);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative z-50", className)}>
      {/* Khung tìm kiếm kẹp sách (Bookmark Bar) */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 select-none",
          "bg-white/90 dark:bg-[#181816]/90 backdrop-blur-md",
          "border border-amber-900/20 dark:border-white/10",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.08)]",
          isFocused ? "w-64 sm:w-80 ring-2 ring-[var(--accent-green)]/30 border-[var(--accent-green)] dark:border-[var(--accent-gold)]" : "w-44 sm:w-56 hover:border-amber-800/40"
        )}
      >
        <Search className="w-3.5 h-3.5 text-amber-800/70 dark:text-[var(--accent-gold)] shrink-0" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDownInput}
          placeholder="Tìm thơ, tứ thơ... (Ctrl+K)"
          className="w-full bg-transparent text-xs font-serif text-neutral-800 dark:text-[#EAE6DF] placeholder:text-neutral-400 dark:placeholder:text-[#7E7B74] outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            aria-label="Xóa tìm kiếm"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <span className="hidden sm:inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-neutral-800 text-amber-900/60 dark:text-neutral-400">
            ⌘K
          </span>
        )}
      </div>

      {/* DROPDOWN KẾT QUẢ TÌM KIẾM TỰ ĐỘNG LẬT TRANG */}
      {isFocused && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-white/95 dark:bg-[#181816]/95 backdrop-blur-xl border border-amber-900/20 dark:border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 min-w-[280px] sm:min-w-[320px] max-h-80 overflow-y-auto z-50">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-amber-800/60 dark:text-[var(--accent-gold)] flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/50 mb-1">
            <span>Tìm thấy {results.length} trang sách</span>
            <span className="flex items-center gap-1">
              <span>Bấm</span> <CornerDownLeft className="w-2.5 h-2.5" /> <span>để lật</span>
            </span>
          </div>

          {results.length === 0 ? (
            <div className="py-5 text-center text-xs font-serif text-neutral-500 italic space-y-2">
              <p>Không tìm thấy câu thơ nào khớp với &ldquo;{query}&rdquo;</p>
              <div className="text-[11px] font-sans not-italic text-neutral-400">
                Gợi ý:{" "}
                {["thu", "xuân", "trăng", "lục bát"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="underline mx-1 text-[var(--accent-green)] dark:text-[var(--accent-gold)] hover:opacity-80 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {results.map((match, idx) => {
                const isCurrent = match.pageIndex === currentPageIndex;
                const isHighlighted = idx === selectedIndex;
                return (
                  <button
                    key={`${match.poem.id}-${match.pageIndex}`}
                    type="button"
                    onClick={() => handleSelect(match)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex flex-col gap-1 group",
                      isHighlighted
                        ? "bg-[var(--accent-green)]/15 dark:bg-[var(--accent-gold)]/15 border border-[var(--accent-green)]/40 dark:border-[var(--accent-gold)]/40"
                        : isCurrent
                        ? "bg-[var(--accent-green)]/10 dark:bg-[var(--accent-gold)]/10 border border-[var(--accent-green)]/20"
                        : "hover:bg-amber-500/10 dark:hover:bg-amber-500/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-poem-heading font-bold text-sm text-neutral-900 dark:text-[#EAE6DF] group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
                        {match.poem.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-[var(--accent-gold)] font-medium">
                        Trang {(match.pageIndex + 1).toString().padStart(2, "0")}
                      </span>
                    </div>

                    {match.matchedLine && (
                      <p className="font-poem-verse text-xs text-neutral-600 dark:text-[#A6A39C] italic line-clamp-1">
                        &ldquo;{match.matchedLine}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                      <span>
                        {match.poem.form_type === "luc_bat"
                          ? "Thơ Lục Bát"
                          : match.poem.form_type === "that_ngon"
                          ? "Thất Ngôn Bát Cú"
                          : "Thơ Tự Do"}
                      </span>
                      <span className="flex items-center gap-1 group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
                        <span>Lật đến trang</span>
                        <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
