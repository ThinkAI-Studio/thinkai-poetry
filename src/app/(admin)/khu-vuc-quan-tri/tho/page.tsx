"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockPoems } from "@/data/mock-poetry";
import { TaiButton } from "@/components/tai-ui/TaiButton";
import { Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react";

export default function AdminPoemsListPage() {
  const [poems, setPoems] = useState(mockPoems);
  const [search, setSearch] = useState("");

  const filteredPoems = poems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAuthorInfo = (id: string) => {
    setPoems(
      poems.map((p) =>
        p.id === id ? { ...p, show_author_info: !p.show_author_info } : p
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">
            Danh Sách Thi Phẩm Đã Sáng Tác
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Quản lý toàn bộ bài thơ, tùy chỉnh hiển thị thông tin tác giả và lượt đọc
          </p>
        </div>

        <Link href="/khu-vuc-quan-tri/tho/moi">
          <TaiButton variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Soạn Thơ Mới
          </TaiButton>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 p-3 bg-[#0D0D10] border border-white/10">
        <Search className="w-4 h-4 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tiêu đề bài thơ..."
          className="bg-transparent border-none text-white text-xs font-mono focus:outline-none w-full"
        />
      </div>

      {/* Bảng Thi phẩm */}
      <div className="overflow-x-auto border border-white/10 bg-[#0D0D10]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-neutral-400">
            <tr>
              <th className="py-3 px-4">Bài thơ</th>
              <th className="py-3 px-4">Thể loại</th>
              <th className="py-3 px-4">Tác giả</th>
              <th className="py-3 px-4">Hiện thẻ tác giả</th>
              <th className="py-3 px-4">Lượt đọc</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredPoems.map((poem) => (
              <tr key={poem.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-base text-white">
                      {poem.title}
                    </span>
                    <span className="text-[11px] text-neutral-500 line-clamp-1 italic">
                      “{poem.excerpt}”
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-neutral-400">
                  {poem.form_type === "luc_bat" ? "Lục Bát" : poem.form_type === "that_ngon" ? "Đường Luật" : "Tự Do"}
                </td>
                <td className="py-3.5 px-4 text-neutral-300">
                  {poem.author?.name}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => toggleAuthorInfo(poem.id)}
                    className="cursor-pointer"
                    title="Bấm để bật/tắt hiển thị tác giả trên bài thơ này"
                  >
                    {poem.show_author_info ? (
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                        Bật (Hiện)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[10px]">
                        Tắt (Ẩn)
                      </span>
                    )}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-neutral-300 font-mono">
                  {poem.view_count}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/tho/${poem.slug}`}
                      target="_blank"
                      className="text-neutral-400 hover:text-white"
                      title="Xem bài đăng"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/khu-vuc-quan-tri/tho/moi"
                      className="text-[#4ade80] hover:text-white"
                      title="Sửa bài thơ"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
