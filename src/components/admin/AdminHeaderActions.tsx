"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ExternalLink, Menu, X, ShieldCheck, BookOpen, Plus, BookMarked, User, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng Quan", icon: ShieldCheck, exact: true },
  { href: "/admin/poems", label: "Thi Phẩm & Tản Văn", icon: BookOpen, exact: true },
  { href: "/admin/poems/new", label: "Soạn Tác Phẩm Mới", icon: Plus, highlight: true },
  { href: "/admin/collections", label: "Tuyển Tập Thơ", icon: BookMarked },
  { href: "/admin/authors", label: "Hồ Sơ Tác Giả", icon: User },
  { href: "/admin/logs", label: "Nhật Ký Audit", icon: History },
];

export function AdminHeaderActions() {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
      {/* Theme Switch đồng bộ trải nghiệm Ngày/Đêm */}
      <ThemeSwitch id="admin-theme-switch" />

      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[var(--text-primary)]/5 border border-transparent hover:border-[var(--border-subtle)]"
      >
        <span className="hidden sm:inline">Xem thi quán</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>

      {/* Nút Đăng Xuất */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        title="Đăng xuất khỏi phiên quản trị"
        className="flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 cursor-pointer active:scale-95"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{loggingOut ? "Đang thoát..." : "Đăng xuất"}</span>
      </button>

      {/* Nút Mở Menu 3 Gạch - Nằm sát cùng bên phải kế bên nút Logout (Chỉ hiện trên Mobile) */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden p-1.5 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 rounded-lg transition-all active:scale-90 cursor-pointer border border-[var(--border-subtle)] bg-[var(--bg-card)] shrink-0 ml-1"
        aria-label="Mở menu quản trị"
        title="Mở menu quản trị admin"
      >
        <motion.div
          key={mobileOpen ? "close" : "menu"}
          initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {mobileOpen ? <X className="w-4 h-4 text-red-500" /> : <Menu className="w-4 h-4 text-[var(--accent-green)] dark:text-emerald-400" />}
        </motion.div>
      </button>

      {/* Mobile Drawer Menu khi bấm nút 3 gạch */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-full left-0 right-0 overflow-hidden bg-[var(--bg-card)]/98 backdrop-blur-2xl border-b border-[var(--border-subtle)] shadow-2xl px-5 py-4 flex flex-col gap-2 z-50 text-xs font-mono uppercase tracking-wider"
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] pb-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <span>Menu Quản Trị Admin</span>
              <span className="text-[var(--accent-green)] dark:text-emerald-400 font-bold">Thịnh và Thơ Studio</span>
            </div>

            {NAV_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.035, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl flex items-center justify-between transition-all select-none",
                      item.highlight && !isActive && "text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-600/30",
                      isActive
                        ? "bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)] dark:text-emerald-300 font-bold shadow-2xs"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <span className="text-xs">✓</span>}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
