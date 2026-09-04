"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Sparkles } from "lucide-react";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { Poem } from "@/types/database";
import { SPRINGS } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface QuoteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  poem?: Poem;
  defaultQuote?: string;
  poemTitle?: string;
  authorName?: string;
}

export function QuoteCardModal({
  isOpen,
  onClose,
  poem,
  defaultQuote,
  poemTitle,
  authorName,
}: QuoteCardModalProps) {
  const resolvedTitle = poemTitle || poem?.title || "Thi Phẩm";
  const resolvedAuthor = authorName || poem?.author?.name || "Ánh Thịnh";
  const initialQuote = defaultQuote || poem?.excerpt || "Gió xuân thổi nhẹ qua rèm\nNhành hoa hé nụ dịu êm đón ngày...";

  const [quote, setQuote] = useState(initialQuote);
  const [cardTheme, setCardTheme] = useState<"botanical" | "ivory" | "sepia" | "dark">("botanical");
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

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
      ctx.font = 'italic 72px "EB Garamond", serif';
      ctx.fillStyle = accentColor;
      ctx.fillText("“", 120, 160);

      // Quote Text (Split lines)
      ctx.font = 'italic 34px "Lora", "EB Garamond", Georgia, serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";

      const lines = quote.split("\n");
      const lineHeight = 55;
      const startY = 300 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
      });

      // Closing Quote
      ctx.font = 'italic 72px "EB Garamond", serif';
      ctx.fillStyle = accentColor;
      ctx.textAlign = "left";
      ctx.fillText("”", canvas.width - 160, startY + lines.length * lineHeight);

      // Poem & Author Attribution
      ctx.textAlign = "center";
      ctx.font = 'bold 22px "EB Garamond", serif';
      ctx.fillStyle = textColor;
      ctx.fillText(`— ${resolvedTitle} —`, canvas.width / 2, 530);

      ctx.font = '16px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = isDark ? "#A1A1AA" : "#5A5A5A";
      ctx.fillText(`Tác giả: ${resolvedAuthor} • Ánh Thịnh Thi Quán`, canvas.width / 2, 565);

      // Download
      const link = document.createElement("a");
      link.download = `anh-thinh-tho-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop mờ dần với hiệu ứng blur diffusion */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 cursor-pointer"
          />

          {/* Modal Dialog Card bung nở lò xo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.94, y: 15, filter: "blur(3px)" }}
            transition={SPRINGS.bouncy}
            className="relative z-10 bg-white dark:bg-[#131316] w-full max-w-xl p-6 rounded-2xl border border-neutral-300 dark:border-neutral-800 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D5A3D] dark:text-[#4ade80]" />
                <h3 className="font-poem-heading text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Tạo Ảnh Trích Dẫn Thi Ca
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Card */}
            <div
              ref={cardRef}
              className={cn(
                "p-8 rounded-xl border flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors min-h-[220px]",
                cardTheme === "dark" && "bg-[#08080A] text-[#F4F4F5] border-neutral-800",
                cardTheme === "sepia" && "bg-[#F5EFEB] text-[#2C251E] border-amber-900/20",
                cardTheme === "ivory" && "bg-[#FAF8F5] text-[#1A1A1A] border-neutral-300",
                cardTheme === "botanical" && "bg-emerald-950/20 text-emerald-950 dark:text-emerald-100 border-[#2D5A3D]/30"
              )}
            >
              <span className="font-poem-heading italic text-4xl text-[#2D5A3D] dark:text-[#4ade80] select-none opacity-40">
                “
              </span>
              <p className="font-poem-verse italic text-base sm:text-lg leading-relaxed whitespace-pre-line my-3">
                {quote}
              </p>
              <div className="mt-4 pt-3 border-t border-current/10 w-full flex flex-col items-center">
                <span className="font-poem-heading font-bold text-sm">— {resolvedTitle} —</span>
                <span className="text-[11px] font-mono opacity-70 mt-0.5">
                  {resolvedAuthor} • Ánh Thịnh Thi Quán
                </span>
              </div>
            </div>

            {/* Chỉnh sửa câu trích dẫn */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400">
                Nội dung câu thơ trích dẫn:
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={3}
                className="w-full p-3 text-sm font-poem-verse border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-xl focus:outline-none focus:border-[#2D5A3D]"
              />

              {/* Chọn Theme Card */}
              <div className="flex items-center gap-2 pt-2 flex-wrap">
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
                      "px-3.5 py-1.5 text-xs font-mono rounded-full border transition-colors cursor-pointer",
                      cardTheme === t.id
                        ? "bg-[#2D5A3D] text-white border-[#2D5A3D] shadow-xs"
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
                className="px-4 py-2 text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
