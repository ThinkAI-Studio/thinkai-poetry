"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/types/database";
import { PoeticMultiTierBookshelf } from "@/components/bookshelf/PoeticMultiTierBookshelf";
import { TiltCard } from "@/components/tai-ui/TiltCard";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { BookMarked, Library, LayoutGrid } from "lucide-react";

interface CollectionsClientViewProps {
  collections: Collection[];
}

export function CollectionsClientView({ collections }: CollectionsClientViewProps) {
  const [viewMode, setViewMode] = useState<"shelf" | "grid">("shelf");

  return (
    <div className="flex flex-col gap-10">
      {/* Nút chuyển đổi giao diện: Kệ Sách Thư Viện vs Danh Sách Thẻ */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("shelf")}
            className={`impeccable-touch-target flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] ${
              viewMode === "shelf"
                ? "bg-[var(--accent-green)] text-white shadow-xs font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Kệ Sách Thư Viện</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`impeccable-touch-target flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] ${
              viewMode === "grid"
                ? "bg-[var(--accent-green)] text-white shadow-xs font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Trưng Bày Bìa Sách</span>
          </button>
        </div>
      </div>

      {/* Nội dung tương ứng với chế độ xem */}
      {viewMode === "shelf" ? (
        <PoeticMultiTierBookshelf collections={collections} />
      ) : collections.length === 0 ? (
        <div className="tai-card p-12 text-center max-w-lg mx-auto rounded-2xl border border-[var(--border-subtle)] shadow-xs">
          <BookMarked className="w-10 h-10 mx-auto text-[var(--accent-gold)] mb-3 opacity-80" />
          <h2 className="font-poem-heading text-xl font-bold text-[var(--text-primary)] mb-2 [text-wrap:balance]">
            Chưa có tuyển tập nào
          </h2>
          <p className="font-poem-verse text-sm text-[var(--text-muted)]">
            Các tuyển tập thơ mới sẽ xuất hiện tại đây sau khi được biên soạn và công bố trong trang quản trị.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col) => {
            const isProse = col.type === "prose";

            return (
              <TiltCard key={col.id} maxTilt={4} className="p-0 border-0 shadow-none bg-transparent">
                <Link
                  href={`/collections/${col.slug}`}
                  className="tai-card group flex flex-col justify-between overflow-hidden p-6 hover:shadow-xl transition-all duration-300 rounded-2xl h-full block"
                >
                  <div>
                    {/* Cover / Icon */}
                    <div className="w-full h-44 bg-neutral-100 dark:bg-neutral-900 mb-6 flex items-center justify-center relative overflow-hidden rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                      {col.cover_image_url ? (
                        <Image
                          src={col.cover_image_url}
                          alt={col.title}
                          width={96}
                          height={96}
                          className="object-contain group-hover:scale-110 transition-transform duration-500 opacity-85"
                        />
                      ) : (
                        <BookMarked className="w-12 h-12 text-neutral-400" />
                      )}
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-serif border bg-white/90 dark:bg-black/90 text-neutral-800 dark:text-neutral-200">
                        {isProse ? "Tản Văn" : "Thơ Ca"}
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-white/90 dark:bg-black/90 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono uppercase tracking-wider rounded-full border border-neutral-200 dark:border-neutral-800">
                        {col.poems_count} {isProse ? "bài tản văn" : "bài thơ"}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="font-poem-heading font-bold text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors mb-2 line-clamp-1 [text-wrap:balance]">
                      {col.title}
                    </h2>
                    <p className="font-poem-verse text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6">
                      {col.description}
                    </p>
                  </div>

                  {/* Footer card */}
                  <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Xem chi tiết
                    </span>
                    <ArrowRoll size="sm" />
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
