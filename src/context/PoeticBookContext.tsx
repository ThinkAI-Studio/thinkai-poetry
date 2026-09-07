"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Poem } from "@/types/database";
import { mockPoems } from "@/data/mock-poetry";
import { playPageTurnSound, setPageTurnSoundEnabled } from "@/lib/book-audio";
import { POEM_SYNC_CHANNEL, PoemSyncMessage } from "@/lib/poem-sync";

export type ReadingViewMode = "book" | "note";

interface PoeticBookContextType {
  isOpen: boolean;
  readingMode: ReadingViewMode;
  poems: Poem[];
  currentPageIndex: number;
  totalPages: number;
  currentPoem: Poem | null;
  searchKeyword: string;
  highlightedText: string | null;
  soundEnabled: boolean;
  openBook: (poemSlug?: string, pageIndex?: number) => void;
  closeBook: () => void;
  setReadingMode: (mode: ReadingViewMode) => void;
  toggleSound: () => void;
  goToPage: (pageIndex: number, highlightTerm?: string) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  searchAndFlipTo: (poemSlug: string, keyword?: string) => void;
  refreshPoems: () => Promise<void>;
}

const PoeticBookContext = createContext<PoeticBookContextType | undefined>(undefined);

export function PoeticBookProvider({
  children,
  initialPoems = mockPoems,
}: {
  children: React.ReactNode;
  initialPoems?: Poem[];
}) {
  const [poems, setPoems] = useState<Poem[]>(() =>
    initialPoems.filter((p) => p.status === "published")
  );
  const [isOpen, setIsOpen] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingViewMode>("book");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  // Hàm tải lại danh sách bài thơ với cache-busting tuyệt đối
  const refreshPoems = useCallback(async () => {
    try {
      const res = await fetch(`/api/poems?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { Pragma: "no-cache" },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const published = json.data.filter((p: Poem) => p.status === "published");
        setPoems(published);
      }
    } catch {}
  }, []);

  // Cập nhật khi initialPoems từ server SSR thay đổi
  useEffect(() => {
    if (initialPoems && initialPoems.length > 0) {
      setPoems(initialPoems.filter((p) => p.status === "published"));
    }
  }, [initialPoems]);

  // Nạp thêm poems từ API ngay khi mount
  useEffect(() => {
    refreshPoems();
  }, [refreshPoems]);

  // Lắng nghe tín hiệu đồng bộ thời gian thực giữa các Tab (0ms delay khi Admin bấm Ẩn/Hiện)
  useEffect(() => {
    const handleSyncMessage = (msg: PoemSyncMessage) => {
      if (msg.type === "POEM_VISIBILITY_CHANGED") {
        if (msg.status === "draft") {
          // Ngay lập tức ẩn bài thơ khỏi giao diện sách 3D trong 0ms
          setPoems((prev) => prev.filter((p) => p.id !== msg.poemId));
        } else {
          // Bài thơ được xuất bản lại, cập nhật ngay lập tức
          refreshPoems();
        }
      } else if (msg.type === "POEMS_MUTATED") {
        refreshPoems();
      }
    };

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(POEM_SYNC_CHANNEL);
      channel.onmessage = (e) => {
        if (e.data) handleSyncMessage(e.data);
      };
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "poetic_sync_timestamp" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleSyncMessage(parsed);
        } catch {}
      }
    };

    // Khi người dùng chuyển qua lại giữa các tab (Focus lại tab web)
    const handleFocus = () => {
      refreshPoems();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshPoems]);

  // Đảm bảo không bị vỡ trang khi bài thơ đang xem bị ẩn đi
  useEffect(() => {
    if (poems.length > 0 && currentPageIndex >= poems.length) {
      setCurrentPageIndex(Math.max(0, poems.length - 1));
    }
  }, [poems.length, currentPageIndex]);

  const totalPages = poems.length;
  const currentPoem = poems[currentPageIndex] || poems[0] || null;

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      setPageTurnSoundEnabled(next);
      return next;
    });
  }, []);

  const goToPage = useCallback(
    (pageIndex: number, highlightTerm?: string) => {
      if (pageIndex < 0 || pageIndex >= totalPages) return;
      playPageTurnSound();
      setCurrentPageIndex(pageIndex);
      if (highlightTerm) {
        setHighlightedText(highlightTerm);
        // Tự tắt highlight sau 3.5 giây
        setTimeout(() => {
          setHighlightedText(null);
        }, 3500);
      }
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      goToPage(currentPageIndex + 1);
    }
  }, [currentPageIndex, totalPages, goToPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      goToPage(currentPageIndex - 1);
    }
  }, [currentPageIndex, goToPage]);

  const openBook = useCallback(
    (poemSlug?: string, pageIndex?: number) => {
      if (typeof pageIndex === "number" && pageIndex >= 0 && pageIndex < poems.length) {
        setCurrentPageIndex(pageIndex);
      } else if (poemSlug) {
        const foundIdx = poems.findIndex((p) => p.slug === poemSlug);
        if (foundIdx !== -1) {
          setCurrentPageIndex(foundIdx);
        }
      }
      setIsOpen(true);
      playPageTurnSound();
    },
    [poems]
  );

  const closeBook = useCallback(() => {
    setIsOpen(false);
    setHighlightedText(null);
    setSearchKeyword("");
  }, []);

  const searchAndFlipTo = useCallback(
    (poemSlug: string, keyword?: string) => {
      const targetIdx = poems.findIndex((p) => p.slug === poemSlug);
      if (targetIdx !== -1) {
        goToPage(targetIdx, keyword);
      }
    },
    [poems, goToPage]
  );

  // Phím tắt Esc và phím mũi tên bàn phím (Hoạt động cả khi inline và modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Nếu đang gõ trong input search thì không bắt phím mũi tên lật trang
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (e.key === "Escape") {
        if (isOpen) {
          closeBook();
        }
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === " " && isOpen) {
        // Chỉ bắt phím Space để lật trang khi đang đọc ở chế độ modal toàn màn hình
        e.preventDefault();
        goToNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeBook, goToNextPage, goToPrevPage]);

  return (
    <PoeticBookContext.Provider
      value={{
        isOpen,
        readingMode,
        poems,
        currentPageIndex,
        totalPages,
        currentPoem,
        searchKeyword,
        highlightedText,
        soundEnabled,
        openBook,
        closeBook,
        setReadingMode,
        toggleSound,
        goToPage,
        goToNextPage,
        goToPrevPage,
        searchAndFlipTo,
        refreshPoems,
      }}
    >
      {children}
    </PoeticBookContext.Provider>
  );
}

export function usePoeticBook() {
  const ctx = useContext(PoeticBookContext);
  if (!ctx) {
    throw new Error("usePoeticBook must be used within a PoeticBookProvider");
  }
  return ctx;
}
