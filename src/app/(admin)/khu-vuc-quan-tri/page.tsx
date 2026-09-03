import React from "react";
import Link from "next/link";
import { mockPoems, mockCollections } from "@/data/mock-poetry";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { BookOpen, BookMarked, Eye, Plus, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  const totalPoems = mockPoems.length;
  const totalCollections = mockCollections.length;
  const totalViews = mockPoems.reduce((acc, p) => acc + p.view_count, 0);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Hệ thống quản lý nội dung thi ca Ánh Thịnh Thi Quán • ThinkAI Studio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/khu-vuc-quan-tri/tho/moi">
            <TaiButton variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Soạn Thơ Mới
            </TaiButton>
          </Link>
          <Link href="/khu-vuc-quan-tri/tuyen-tap">
            <TaiButton variant="secondary" size="sm">
              Tạo Tuyển Tập
            </TaiButton>
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-[#0D0D10] border border-white/10 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Tổng Thi Phẩm</span>
            <BookOpen className="w-4 h-4 text-[#2D5A3D]" />
          </div>
          <span className="text-3xl font-mono font-bold text-white">{totalPoems}</span>
          <span className="text-[11px] font-mono text-emerald-400 mt-2">
            Đã xuất bản 100%
          </span>
        </div>

        <div className="p-5 bg-[#0D0D10] border border-white/10 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Tuyển Tập Thơ</span>
            <BookMarked className="w-4 h-4 text-[#2D5A3D]" />
          </div>
          <span className="text-3xl font-mono font-bold text-white">{totalCollections}</span>
          <span className="text-[11px] font-mono text-neutral-400 mt-2">
            Đang hoạt động
          </span>
        </div>

        <div className="p-5 bg-[#0D0D10] border border-white/10 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Lượt Thưởng Thức</span>
            <Eye className="w-4 h-4 text-[#2D5A3D]" />
          </div>
          <span className="text-3xl font-mono font-bold text-white">
            {totalViews.toLocaleString("vi-VN")}
          </span>
          <span className="text-[11px] font-mono text-emerald-400 mt-2">
            Tương tác độc giả ổn định
          </span>
        </div>
      </div>

      {/* Bảng Bài thơ gần đây */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-white">
            Các thi phẩm gần đây
          </h2>
          <Link
            href="/khu-vuc-quan-tri/tho"
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRoll size="sm" />
          </Link>
        </div>

        <div className="overflow-x-auto border border-white/10 bg-[#0D0D10] rounded-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="py-3 px-4">Tiêu đề bài thơ</th>
                <th className="py-3 px-4">Thể loại</th>
                <th className="py-3 px-4">Hiện tác giả</th>
                <th className="py-3 px-4">Lượt đọc</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockPoems.map((poem) => (
                <tr key={poem.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-sm text-white">
                    {poem.title}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {poem.form_type === "luc_bat" ? "Lục Bát" : poem.form_type === "that_ngon" ? "Đường Luật" : "Tự Do"}
                  </td>
                  <td className="py-3.5 px-4">
                    {poem.show_author_info ? (
                      <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] rounded-full">
                        Bật (Hiện)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-neutral-800 text-neutral-400 text-[10px] rounded-full">
                        Tắt (Ẩn)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300 font-mono">
                    {poem.view_count}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500">
                    {new Date(poem.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/tho/${poem.slug}`}
                      target="_blank"
                      className="text-neutral-400 hover:text-white mr-3"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/khu-vuc-quan-tri/tho`}
                      className="text-[#4ade80] hover:underline"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
