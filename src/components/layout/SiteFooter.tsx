"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-page)]/80 py-12 px-4 sm:px-6 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand & Quote */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 shrink-0">
              <Image
                src="/thinh-va-tho-symbol.png"
                alt="Thịnh và Thơ Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-serif font-bold text-lg text-neutral-900 dark:text-[#EAE6DF] tracking-tight">
              Thịnh và Thơ
            </span>
          </div>
          <p className="font-serif italic text-sm text-neutral-600 dark:text-[#A6A39C] max-w-sm">
            “Thơ là rượu của thế gian, là sự kết tinh của cảm xúc và trí tuệ.”
          </p>
        </div>

        {/* Links (Hallmark Gate 49: Wrapping and single-line affordance) */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs font-sans uppercase tracking-wider text-neutral-700 dark:text-[#A6A39C]">
          <Link href="/collections" className="hover:text-[var(--accent-green)] dark:hover:text-[var(--accent-gold)] transition-colors py-1">
            Tuyển Tập
          </Link>
          <Link href="/authors" className="hover:text-[var(--accent-green)] dark:hover:text-[var(--accent-gold)] transition-colors py-1">
            Tác Giả
          </Link>
          <Link href="/forum" className="hover:text-[var(--accent-green)] dark:hover:text-[var(--accent-gold)] transition-colors py-1">
            Diễn Đàn
          </Link>
          <Link href="/admin" className="hover:text-[var(--accent-green)] dark:hover:text-[var(--accent-gold)] transition-colors py-1 opacity-80">
            Quản Trị
          </Link>
        </div>

        {/* Credit */}
        <div className="flex flex-col items-center md:items-end gap-1 text-xs font-sans text-neutral-500 dark:text-[#7E7B74]">
          <span>© {new Date().getFullYear()} Thịnh và Thơ. Mọi quyền được bảo lưu.</span>
          <span className="flex items-center gap-1">
            Thiết kế bởi{" "}
            <span className="text-[var(--accent-green)] dark:text-[var(--accent-gold)] font-medium">
              ThinkAI Studio
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
