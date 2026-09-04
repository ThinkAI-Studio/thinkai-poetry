"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openBook } = usePoeticBook();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/collections", label: "Tuyển Tập" },
    { href: "/authors", label: "Tác Giả" },
    { href: "/forum", label: "Diễn Đàn" },
    { href: "/saved", label: "Tủ Sách" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] py-3 shadow-xs"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Logo: Thư pháp tao nhã + Thịnh và Thơ */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <span className="w-8 h-8 rounded-full bg-[var(--accent-green)] text-white dark:bg-[var(--accent-gold)] dark:text-[#121211] flex items-center justify-center font-serif font-bold text-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
            T
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-[22px] font-bold tracking-tight text-neutral-900 dark:text-[#EAE6DF] leading-none">
              Thịnh và Thơ
            </span>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-500 dark:text-neutral-400 mt-0.5">
              Thi Quán Đương Đại
            </span>
          </div>
        </Link>

        {/* Desktop Nav: Tuyển Tập, Tác Giả, Diễn Đàn, Tủ Sách */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-sans font-medium text-neutral-800 dark:text-[#A6A39C] hover:text-[var(--accent-green)] dark:hover:text-[var(--accent-gold)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Theme Switch (Dạng công tắc) */}
        <div className="flex items-center gap-3.5">
          {/* Công tắc trượt Light / Dark Mode */}
          <ThemeSwitch />

          <button
            type="button"
            onClick={() => openBook()}
            className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-sm font-sans font-medium text-white bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] dark:bg-[var(--accent-green)] dark:border dark:border-emerald-500/30 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <span>Bắt Đầu Đọc</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--bg-page)] border-b border-[var(--border-subtle)] rounded-b-2xl shadow-xl px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-base text-neutral-800 dark:text-neutral-200 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-neutral-500 uppercase">Chế độ hiển thị:</span>
            <ThemeSwitch />
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openBook();
            }}
            className="w-full text-center py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] rounded-full shadow-sm flex items-center justify-center transition-colors cursor-pointer active:scale-98"
          >
            <span>Bắt Đầu Đọc</span>
          </button>
        </div>
      )}
    </header>
  );
}
