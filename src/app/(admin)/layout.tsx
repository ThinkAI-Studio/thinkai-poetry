import React from "react";
import Link from "next/link";
import { Feather, BookOpen, BookMarked, User, ShieldCheck, History, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Admin Studio | Ánh Thịnh Thi Quán",
  description: "Trung tâm quản trị nội dung thi ca và tuyển tập.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#08080A] text-[#F4F4F5] flex flex-col font-sans selection:bg-[#2D5A3D] selection:text-white">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-white/10 bg-[#0D0D10] px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2D5A3D] flex items-center justify-center text-white">
              <Feather className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-sm tracking-wide text-white">
              ÁNH THỊNH • ADMIN STUDIO
            </span>
          </Link>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            2FA Active
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
          >
            <span>Xem trang web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-60 border-r border-white/10 bg-[#0A0A0D] p-4 flex flex-col justify-between shrink-0">
          <nav className="flex flex-col gap-1 text-xs font-mono uppercase tracking-wider">
            <Link
              href="/admin"
              className="px-3 py-2.5 flex items-center gap-2.5 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <ShieldCheck className="w-4 h-4 text-[#2D5A3D]" />
              <span>Tổng Quan</span>
            </Link>

            <Link
              href="/admin/poems"
              className="px-3 py-2.5 flex items-center gap-2.5 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <BookOpen className="w-4 h-4 text-[#2D5A3D]" />
              <span>Quản Lý Thơ</span>
            </Link>

            <Link
              href="/admin/poems/new"
              className="px-3 py-2.5 flex items-center gap-2.5 text-white bg-[#2D5A3D]/20 border border-[#2D5A3D]/40 font-bold transition-colors"
            >
              <span className="text-[#4ade80]">+</span>
              <span>Soạn Thơ Mới</span>
            </Link>

            <Link
              href="/admin/collections"
              className="px-3 py-2.5 flex items-center gap-2.5 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <BookMarked className="w-4 h-4 text-[#2D5A3D]" />
              <span>Tuyển Tập Thơ</span>
            </Link>

            <Link
              href="/admin/authors"
              className="px-3 py-2.5 flex items-center gap-2.5 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <User className="w-4 h-4 text-[#2D5A3D]" />
              <span>Hồ Sơ Tác Giả</span>
            </Link>

            <Link
              href="/admin/logs"
              className="px-3 py-2.5 flex items-center gap-2.5 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <History className="w-4 h-4 text-[#2D5A3D]" />
              <span>Nhật Ký Audit</span>
            </Link>
          </nav>

          <div className="pt-6 border-t border-white/10 text-[11px] font-mono text-neutral-500">
            <span>Bảo mật Supabase RLS</span>
            <br />
            <span>ThinkAI Studio Ecosystem</span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 bg-[#08080A] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
