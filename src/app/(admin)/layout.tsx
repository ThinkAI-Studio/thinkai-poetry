import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
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
            {/* Con dấu triện son thư pháp */}
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-vermilion)] text-amber-100 flex items-center justify-center font-serif text-sm font-bold shadow-sm group-hover:scale-105 transition-transform border border-amber-300/30 select-none">
              T
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
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border-subtle)] bg-[var(--bg-card)]/60 px-4 py-2.5 md:p-4 shrink-0 transition-colors duration-200">
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
