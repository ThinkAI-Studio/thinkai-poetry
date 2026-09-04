"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Feather, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo matching ThinkAI Thơ reference */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 flex items-center justify-center bg-[#2D5A3D] text-white rounded-full transition-transform duration-300 group-hover:scale-105 shadow-sm">
            <Feather className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              ThinkAI Thơ
            </span>
            <span className="hidden sm:inline text-xs font-serif italic text-neutral-500">
              • Ánh Thịnh
            </span>
          </div>
        </Link>

        {/* Desktop Nav matching reference: Tuyển Tập, Tác Giả, Diễn Đàn, Tủ Sách */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-serif text-neutral-700 dark:text-neutral-300 hover:text-[#2D5A3D] dark:hover:text-[#4ade80] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Theme Toggle & Mobile Hamburger */}
        <div className="flex items-center gap-3.5">
          {/* Sora Labs Style Theme Switcher */}
          <ThemeToggle />

          <Link
            href="/poems/vuon-xua-hoa-no"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-mono uppercase tracking-wider text-white bg-[#2D5A3D] hover:bg-[#244831] rounded-full transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer select-none"
          >
            Bắt Đầu Đọc
          </Link>

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
            <ThemeToggle />
          </div>
          <Link
            href="/poems/vuon-xua-hoa-no"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-[#2D5A3D] rounded-full shadow-sm"
          >
            Bắt Đầu Đọc
          </Link>
        </div>
      )}
    </header>
  );
}
