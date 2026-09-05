import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminHeaderActions } from "@/components/admin/AdminHeaderActions";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export const metadata = {
  title: "Admin Studio | Thịnh và Thơ",
  description: "Trung tâm quản trị nội dung thi ca và tuyển tập Thịnh và Thơ.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  // Nếu chưa đăng nhập -> Chuyển hướng sang trang Tác giả để mở Hộp Đăng Nhập Nổi
  if (session?.value !== "authenticated") {
    redirect("/authors?login=admin");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[var(--accent-green)] selection:text-white transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/90 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            {/* Logo Biểu tượng Thịnh và Thơ */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 group-hover:scale-105 transition-transform select-none">
              <Image
                src="/thinh-va-tho-symbol.png"
                alt="Thịnh và Thơ Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm tracking-wide text-[var(--text-primary)]">
                THỊNH VÀ THƠ
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] -mt-0.5">
                Admin Studio
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex text-[10px] font-mono px-2.5 py-0.5 bg-[var(--accent-green)]/15 text-[var(--accent-green)] dark:text-emerald-400 border border-[var(--accent-green)]/30 rounded-full uppercase tracking-wider items-center gap-1.5 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Bảo Mật Kép
          </span>
        </div>

        {/* Header Actions: Theme switch, Xem web & Đăng xuất */}
        <AdminHeaderActions />
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar (Chỉ hiển thị thanh dọc cố định trên Desktop, trên Mobile tích hợp trực tiếp vào Header chính) */}
        <aside className="hidden md:block w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-card)]/60 p-4 shrink-0 transition-colors duration-200">
          <AdminSidebarNav />
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 bg-[var(--bg-page)] overflow-y-auto overflow-x-clip transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
