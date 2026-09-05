"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { BookSearchBar } from "@/components/book/BookSearchBar";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookSectionActive, setIsBookSectionActive] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openBook } = usePoeticBook();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 20);

          const bookElem = document.getElementById("khong-gian-sach-tho");
          if (bookElem) {
            const rect = bookElem.getBoundingClientRect();
            // Lướt xuống phần sách -> Header ẩn đi với motion thu vào nhẹ
            const inBookZone = rect.top <= 140 || scrollY > 380;
            const atTopIntro = scrollY < 200 && rect.top > 140;

            if (atTopIntro) {
              setIsBookSectionActive(false);
            } else if (inBookZone) {
              setIsBookSectionActive(true);
            }
          } else {
            setIsBookSectionActive(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý motion back cuộn mượt mà khi nhấp vào Logo từ bất kỳ đâu trên website
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);

    const scrollToTop = () => {
      const lenis = (window as unknown as { __lenis?: any }).__lenis;
      if (lenis) {
        lenis.scrollTo(0, {
          offset: 0,
          duration: 1.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    if (pathname === "/") {
      scrollToTop();
    } else {
      router.push("/");
      setTimeout(scrollToTop, 350);
    }
  };

  const navLinks = [
    { href: "/collections", label: "Tuyển Tập" },
    { href: "/authors", label: "Tác Giả" },
    { href: "/forum", label: "Diễn Đàn" },
    { href: "/saved", label: "Tủ Sách" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out transform",
        isScrolled
          ? "bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] py-3 shadow-xs"
          : "bg-transparent py-5",
        isBookSectionActive
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100 pointer-events-auto"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
        {/* Logo: Biểu tượng Thịnh và Thơ + Tên thương hiệu */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 group select-none cursor-pointer shrink-0"
          title="Trở về đầu trang Thịnh và Thơ"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-200 group-hover:scale-105 active:scale-95 drop-shadow-xs">
            <Image
              src="/thinh-va-tho-symbol.png"
              alt="Thịnh và Thơ Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-[#EAE6DF] leading-none group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors">
              Thịnh và Thơ
            </span>
            <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-neutral-500 dark:text-neutral-400 mt-0.5">
              Thi Quán Đương Đại
            </span>
          </div>
        </Link>

        {/* Desktop Nav: Tuyển Tập, Tác Giả, Diễn Đàn, Tủ Sách */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-sans font-medium text-neutral-800 dark:text-[#A6A39C] hover:text-[var(--accent-green)] dark:hover:text-[var(--accent-gold)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions: Search Bar + Theme Switch + CTA Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Thanh tìm kiếm kẹp sách ẩn trên mobile, hiện từ màn hình sm trở lên */}
          <BookSearchBar className="hidden sm:block" />

          {/* Công tắc trượt Light / Dark Mode */}
          <div className="shrink-0">
            <ThemeSwitch />
          </div>

          {/* Nút CTA "Bắt Đầu Đọc" */}
          <button
            type="button"
            onClick={() => openBook()}
            className="hidden md:inline-flex items-center justify-center px-4 sm:px-5 py-2 text-xs sm:text-sm font-sans font-medium text-white bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] dark:bg-[var(--accent-green)] dark:border dark:border-emerald-500/30 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] shrink-0 whitespace-nowrap"
          >
            <span>Bắt Đầu Đọc</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--bg-page)] border-b border-[var(--border-subtle)] rounded-b-2xl shadow-xl px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {/* Thanh tìm kiếm mobile */}
          <BookSearchBar className="w-full sm:hidden mb-2" />

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
