"use client";

import React from "react";
import Link from "next/link";
import { Feather, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-[#FAF8F5]/60 dark:bg-[#08080A]/60 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand & Quote */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-[#2D5A3D]" />
            <span className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100">
              Ánh Thịnh Thi Quán
            </span>
          </div>
          <p className="font-serif italic text-sm text-neutral-500 max-w-sm">
            “Thơ là rượu của thế gian, là sự kết tinh của cảm xúc và trí tuệ.”
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <Link href="/tuyen-tap" className="hover:text-black dark:hover:text-white transition-colors">
            Tuyển Tập
          </Link>
          <Link href="/tac-gia" className="hover:text-black dark:hover:text-white transition-colors">
            Tác Giả
          </Link>
          <Link href="/dien-dan" className="hover:text-black dark:hover:text-white transition-colors">
            Diễn Đàn
          </Link>
          <Link href="/khu-vuc-quan-tri" className="hover:text-black dark:hover:text-white transition-colors opacity-70">
            Quản Trị
          </Link>
        </div>

        {/* Credit ThinkAI Studio */}
        <div className="flex flex-col items-center md:items-end gap-1 text-xs font-mono text-neutral-500">
          <span>© {new Date().getFullYear()} Ánh Thịnh. Mọi quyền được bảo lưu.</span>
          <span className="flex items-center gap-1">
            Phát triển bởi{" "}
            <a
              href="https://binhminh.thinkai.id.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2D5A3D] dark:text-[#4ade80] hover:underline font-bold"
            >
              ThinkAI Studio
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
