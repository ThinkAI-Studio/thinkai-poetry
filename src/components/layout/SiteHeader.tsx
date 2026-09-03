"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Feather, Menu, X } from "lucide-react";
import { TaiButton } from "@/components/tai-ui/TaiButton";
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
    { href: "/tuyen-tap", label: "Tuyển Tập" },
    { href: "/#tho-moi", label: "Tác Phẩm Mới" },
    { href: "/tac-gia", label: "Tác Giả" },
    { href: "/dien-dan", label: "Diễn Đàn" },
    { href: "/yeu-thich", label: "Yêu Thích" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-[#FAF8F5]/90 dark:bg-[#08080A]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 py-3.5 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 flex items-center justify-center bg-[#2D5A3D] text-white rounded-none transition-transform duration-300 group-hover:scale-105 shadow-sm">
            <Feather className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-none">
              Ánh Thịnh Thi Quán
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 mt-0.5">
              ThinkAI Studio
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
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
        <div className="flex items-center gap-3">
          {/* Sora Labs Style Theme Switcher */}
          <ThemeToggle />

          <Link href="/tuyen-tap" className="hidden sm:inline-flex">
            <TaiButton variant="primary" size="sm">
              Khám Phá Thơ
            </TaiButton>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FAF8F5] dark:bg-[#08080A] border-b border-neutral-200 dark:border-neutral-800 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
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
          <Link href="/tuyen-tap" onClick={() => setMobileOpen(false)} className="pt-2">
            <TaiButton variant="primary" size="default" className="w-full">
              Khám Phá Thơ
            </TaiButton>
          </Link>
        </div>
      )}
    </header>
  );
}
