import React from "react";
import Link from "next/link";
import { getPoems, getCollections } from "@/lib/data-service";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { BookOpen, BookMarked, Eye, Plus, ShieldCheck } from "lucide-react";

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
            Hệ thống quản lý nội dung thi ca Thịnh và Thơ • ThinkAI Studio
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

      {/* Bảng Bài thơ gần đây */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[var(--text-primary)]">
            Các thi phẩm gần đây
          </h2>
          <Link
            href="/admin/poems"
            className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRoll size="sm" />
          </Link>
        </div>

        <div className="overflow-x-auto border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded-2xl shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[var(--text-primary)]/[0.04] border-b border-[var(--border-subtle)] uppercase tracking-wider text-[var(--text-secondary)]">
              <tr>
                <th className="py-3 px-4">Tiêu đề bài thơ</th>
                <th className="py-3 px-4">Thể loại</th>
                <th className="py-3 px-4">Hiện tác giả</th>
                <th className="py-3 px-4">Lượt đọc</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {poems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--text-muted)] font-serif">
                    Chưa có thi phẩm nào. Hãy bấm &ldquo;Soạn Thơ Mới&rdquo; để bắt đầu đăng tác phẩm đầu tiên.
                  </td>
                </tr>
              ) : (
                poems.map((poem) => (
                <tr key={poem.id} className="hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-sm text-[var(--text-primary)]">
                    {poem.title}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                    {poem.form_type === "luc_bat" ? "Lục Bát" : poem.form_type === "that_ngon" ? "Đường Luật" : "Tự Do"}
                  </td>
                  <td className="py-3.5 px-4">
                    {poem.show_author_info ? (
                      <span className="px-2.5 py-0.5 bg-[var(--accent-green)]/15 text-[var(--accent-green)] dark:text-emerald-400 border border-[var(--accent-green)]/30 text-[10px] rounded-full font-medium">
                        Bật (Hiện)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-[var(--text-primary)]/10 text-[var(--text-secondary)] text-[10px] rounded-full font-medium">
                        Tắt (Ẩn)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono">
                    {poem.view_count}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">
                    {new Date(poem.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/poems/${poem.slug}`}
                      target="_blank"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mr-3"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/admin/poems`}
                      className="text-[var(--accent-green)] dark:text-emerald-400 hover:underline"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
