import React from "react";
import Link from "next/link";
import { getPoems, getCollections } from "@/lib/data-service";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { RecentPoemsTable } from "@/components/admin/RecentPoemsTable";

export default async function AdminDashboardPage() {
  const poems = await getPoems();
  const collections = await getCollections();
  const totalPoems = poems.length;
  const totalCollections = collections.length;
  const totalViews = poems.reduce((acc, p) => acc + p.view_count, 0);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Hệ thống quản lý nội dung thi ca Wind • ThinkAI Studio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/poems/new">
            <TaiButton variant="primary" size="sm">
              Soạn Thơ Mới
            </TaiButton>
          </Link>
          <Link href="/admin/collections">
            <TaiButton variant="secondary" size="sm">
              Tạo Tuyển Tập
            </TaiButton>
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col justify-between hover:border-[var(--accent-green)]/40 transition-colors">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Tổng Thi Phẩm</span>
          </div>
          <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">{totalPoems}</span>
          <span className="text-[11px] font-mono text-[var(--accent-green)] dark:text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đã xuất bản 100%
          </span>
        </div>

        <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col justify-between hover:border-[var(--accent-gold)]/40 transition-colors">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Tuyển Tập Thơ</span>
          </div>
          <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">{totalCollections}</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)] mt-2">
            Đang hoạt động trong thư viện
          </span>
        </div>

        <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col justify-between hover:border-[var(--accent-green)]/40 transition-colors">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Lượt Thưởng Thức</span>
          </div>
          <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">
            {totalViews.toLocaleString("vi-VN")}
          </span>
          <span className="text-[11px] font-mono text-[var(--accent-green)] dark:text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Tương tác độc giả ổn định
          </span>
        </div>
      </div>

      {/* Bảng Các thi phẩm gần đây (Interactive Client Component với Toggle 1-click & Toast) */}
      <RecentPoemsTable initialPoems={poems} />
    </div>
  );
}
