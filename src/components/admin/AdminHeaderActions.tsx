"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";

export function AdminHeaderActions() {
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
    </div>
  );
}
