"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  BookOpen,
  Plus,
  BookMarked,
  User,
  History,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng Quan", icon: ShieldCheck, exact: true },
  { href: "/admin/poems", label: "Thi Phẩm & Tản Văn", icon: BookOpen, exact: true },
  { href: "/admin/poems/new", label: "Soạn Tác Phẩm Mới", icon: Plus, highlight: true },
  { href: "/admin/collections", label: "Tuyển Tập Thơ", icon: BookMarked },
  { href: "/admin/authors", label: "Hồ Sơ Tác Giả", icon: User },
  { href: "/admin/logs", label: "Nhật Ký Audit", icon: History },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const activeItem =
    NAV_ITEMS.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href)
    ) || NAV_ITEMS[0];

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
    <div className="w-full h-full flex flex-col">
      {/* ========================================================= */}
      {/* 1. MOBILE TOGGLE BAR & EXPANDABLE DRAWER (< MD)            */}
      {/* ========================================================= */}
      <div className="md:hidden w-full flex flex-col">
        {/* Nút Toggle mở rộng / thu gọn Menu Admin */}
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between shadow-2xs cursor-pointer select-none active:scale-98 transition-all"
        >
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-green)] dark:text-emerald-400">
            <activeItem.icon className="w-4 h-4 shrink-0" />
            <span>{activeItem.label}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)]">
            <span>{mobileExpanded ? "Thu gọn" : "Mở rộng menu"}</span>
            <motion.div
              animate={{ rotate: mobileExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </button>

        {/* Dynamic Motion Drawer Menu khi Expand */}
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mt-2 p-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xl flex flex-col gap-1 text-xs font-mono uppercase tracking-wider"
            >
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
                      onClick={() => setMobileExpanded(false)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl flex items-center justify-between transition-all select-none",
                        item.highlight && !isActive && "text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-600/30",
                        isActive
                          ? "bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)] dark:text-emerald-300 font-bold"
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

              <div className="pt-2 mt-1 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-mono text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>{loggingOut ? "Đang đăng xuất..." : "Đăng Xuất Phiên"}</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP SIDEBAR NAV (>= MD)                             */}
      {/* ========================================================= */}
      <div className="hidden md:flex flex-col justify-between h-full">
        <nav className="flex flex-col gap-1.5 text-xs font-mono uppercase tracking-wider">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-all select-none",
                  item.highlight && !isActive && "text-amber-800 dark:text-amber-300 border border-amber-600/30 dark:border-amber-400/30 hover:bg-amber-500/10",
                  isActive
                    ? "bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)] dark:text-emerald-300 font-bold shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 border border-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive
                      ? "text-[var(--accent-green)] dark:text-emerald-400"
                      : item.highlight
                      ? "text-amber-700 dark:text-amber-300"
                      : "text-[var(--text-secondary)]"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar với Trạng thái bảo mật & Nút Đăng xuất */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col gap-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full px-3 py-2 rounded-xl text-left text-xs font-mono text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{loggingOut ? "Đang đăng xuất..." : "Đăng Xuất Phiên"}</span>
          </button>

          <div className="text-[11px] font-mono text-[var(--text-muted)] leading-relaxed px-1">
            <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Phiên làm việc bảo mật</span>
            </span>
            <span className="block mt-0.5">Thịnh và Thơ • Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
