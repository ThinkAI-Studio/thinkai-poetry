"use client";

import React, { useState, useRef } from "react";
import { X, Download, Sparkles } from "lucide-react";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { cn } from "@/lib/utils";

interface QuoteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuote?: string;
  poemTitle: string;
  authorName: string;
}

export function QuoteCardModal({
  isOpen,
  onClose,
  defaultQuote = "Lòng anh như hoa sen thơm ngát\nNở giữa bùn lầy đón ánh mai...",
  poemTitle,
  authorName,
}: QuoteCardModalProps) {
  const [quote, setQuote] = useState(defaultQuote);
  const [cardTheme, setCardTheme] = useState<"botanical" | "ivory" | "sepia" | "dark">("botanical");
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExportImage = () => {
    try {
      setIsExporting(true);

      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 675;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Theme Colors
      const isDark = cardTheme === "dark";
      const isSepia = cardTheme === "sepia";
      const bgColor = isDark ? "#08080A" : isSepia ? "#F5EFEB" : "#FAF8F5";
      const textColor = isDark ? "#F4F4F5" : isSepia ? "#2C251E" : "#1A1A1A";
      const accentColor = isDark ? "#4ade80" : "#2D5A3D";

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Decorative Frame
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      ctx.lineWidth = 1;
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Quotation Mark
      ctx.fillStyle = accentColor;
      ctx.font = "italic bold 72px serif";
      ctx.textAlign = "center";
      ctx.fillText("“", canvas.width / 2, 140);

      // Quote Text (Multi-line)
      ctx.fillStyle = textColor;
      ctx.font = "italic 32px serif";
      const lines = quote.split("\n");
      const startY = 240;
      const lineHeight = 52;
      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
      });

      // Divider
      const divY = startY + lines.length * lineHeight + 30;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 80, divY);
      ctx.lineTo(canvas.width / 2 + 80, divY);
      ctx.stroke();

      // Author attribution
      ctx.fillStyle = textColor;
      ctx.font = "bold 24px serif";
      ctx.fillText(`— ${authorName} —`, canvas.width / 2, divY + 50);

      // Subtitle
      ctx.fillStyle = isDark ? "#A1A1AA" : "#71717A";
      ctx.font = "16px monospace";
      ctx.fillText(`Tác phẩm: ${poemTitle}  •  Ánh Thịnh Thi Quán`, canvas.width / 2, divY + 85);

      // Download trigger
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `trich-doan-${poemTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export quote error:", err);
      alert("Không thể xuất ảnh lúc này. Bạn vui lòng thử lại nhé!");
    } finally {
      setIsExporting(false);
    }
  };

  const themeStyles = {
    botanical: "bg-[#FAF8F5] text-[#1A1A1A] border-[#2D5A3D]/20",
    ivory: "bg-[#FFFFFF] text-[#1A1A1A] border-neutral-200",
    sepia: "bg-[#F5EFEB] text-[#2C251E] border-[#5C4F44]/20",
    dark: "bg-[#08080A] text-[#F4F4F5] border-white/10",
  }[cardTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#131316] w-full max-w-xl p-6 rounded-none border border-neutral-300 dark:border-neutral-800 shadow-2xl flex flex-col gap-5">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2D5A3D]" />
            <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-neutral-100">
              Tạo Thẻ Trích Dẫn Thơ (Quote Card)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Card Preview Target */}
        <div
          ref={cardRef}
          className={cn(
            "p-8 relative overflow-hidden border shadow-lg transition-all duration-300 select-none",
            themeStyles
          )}
          style={{ minHeight: "260px" }}
        >
          <div className="relative z-10 flex flex-col justify-between h-full gap-6">
            <div className="text-2xl font-serif text-[#2D5A3D] select-none font-bold">“</div>

            <p className="font-serif text-lg md:text-xl leading-relaxed whitespace-pre-line italic text-center px-4">
              {quote}
            </p>

            <div className="flex flex-col items-center justify-center pt-4 border-t border-current/10 gap-1">
              <span className="font-serif text-sm font-bold tracking-wide">
                — {authorName} —
              </span>
              <span className="text-xs font-mono opacity-70">
                Tác phẩm: {poemTitle} • ThinkAI Poetry
              </span>
            </div>
          </div>
        </div>

        {/* Điều khiển tùy chọn */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Chỉnh sửa câu thơ trích dẫn:
          </label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            className="w-full p-2.5 text-sm font-serif border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-none focus:outline-none focus:border-[#2D5A3D]"
          />

          {/* Chọn Theme Card */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-mono text-neutral-500 mr-2">Nền thi ảnh:</span>
            {[
              { id: "botanical", label: "Hoa Cỏ" },
              { id: "ivory", label: "Sáng Ngà" },
              { id: "sepia", label: "Giấy Dó" },
              { id: "dark", label: "Đêm Sâu" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCardTheme(t.id as any)}
                className={cn(
                  "px-3 py-1 text-xs font-mono rounded-none border transition-colors",
                  cardTheme === t.id
                    ? "bg-[#2D5A3D] text-white border-[#2D5A3D]"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nút Xuất Ảnh */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          >
            Hủy
          </button>

          <TaiButton
            variant="primary"
            onClick={handleExportImage}
            disabled={isExporting}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            {isExporting ? "Đang xuất ảnh..." : "Tải ảnh về"}
          </TaiButton>
        </div>
      </div>
    </div>
  );
}
