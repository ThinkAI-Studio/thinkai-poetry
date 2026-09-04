"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  BookOpen,
  Plus,
  BookMarked,
  User,
  History,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng Quan", icon: ShieldCheck, exact: true },
  { href: "/admin/poems", label: "Quản Lý Thơ", icon: BookOpen, exact: true },
  { href: "/admin/poems/new", label: "Soạn Thơ Mới", icon: Plus, highlight: true },
  { href: "/admin/collections", label: "Tuyển Tập Thơ", icon: BookMarked },
  { href: "/admin/authors", label: "Hồ Sơ Tác Giả", icon: User },
  { href: "/admin/logs", label: "Nhật Ký Audit", icon: History },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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
    <div className="flex flex-col justify-between h-full">
      <nav className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs font-mono uppercase tracking-wider">
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
                "px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl flex items-center gap-2 md:gap-3 transition-all select-none whitespace-nowrap shrink-0 md:shrink",
                item.highlight && !isActive && "text-amber-800 dark:text-amber-300 border border-amber-600/30 dark:border-amber-400/30 hover:bg-amber-500/10",
                isActive
                  ? "bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)] dark:text-emerald-300 font-bold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 transition-colors",
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

      {/* Footer Sidebar với Trạng thái bảo mật & Nút Đăng xuất (chỉ hiện trên desktop) */}
      <div className="hidden md:flex pt-6 border-t border-[var(--border-subtle)] flex-col gap-4">
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
  );
}
