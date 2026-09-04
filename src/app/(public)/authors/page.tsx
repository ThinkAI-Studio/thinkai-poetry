import React, { Suspense } from "react";
import Link from "next/link";
import { getAuthors, getPoems } from "@/lib/data-service";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { TiltCard } from "@/components/tai-ui/TiltCard";
import { AuthorHeroWithAdminAccess } from "@/components/author/AuthorHeroWithAdminAccess";

export const metadata = {
  title: "Tác Giả | Thịnh và Thơ",
  description: "Hồ sơ tác giả Hữu Thịnh và các cây bút thi ca đương đại. Thịnh và Thơ.",
};

export default async function AuthorsPage() {
  const authors = await getAuthors();
  const poems = await getPoems();
  const author = authors[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Header Hồ sơ tác giả tích hợp Cổng Quản Trị qua Đóa Hoa */}
      <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-[var(--bg-card)]/50" />}>
        <AuthorHeroWithAdminAccess author={author} />
      </Suspense>

      {/* Danh sách các tác phẩm của Tác giả */}
      <div className="flex flex-col gap-4">
        <h2 className="font-poem-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
          <span>Thi phẩm đã xuất bản</span>
        </h2>

        {poems.length === 0 ? (
          <div className="tai-card p-8 text-center rounded-2xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-serif text-sm">
            Tác giả đang trong quá trình sáng tác và hoàn thiện các thi phẩm mới.
          </div>
        ) : (
          poems.map((poem, index) => (
            <TiltCard key={poem.id} maxTilt={2} className="p-0 border-0 shadow-none bg-transparent">
              <Link
                href={`/poems/${poem.slug}`}
                className="tai-card p-6 flex items-center justify-between group hover:border-[var(--accent-green)] dark:hover:border-[var(--accent-gold)] hover:shadow-md transition-all rounded-2xl block"
              >
                <div className="flex items-center gap-5">
                  <span className="font-mono text-sm text-[var(--text-muted)] w-6">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-poem-heading font-bold text-xl text-[var(--text-primary)] group-hover:text-[var(--accent-green)] dark:group-hover:text-[var(--accent-gold)] transition-colors mb-1">
                      {poem.title}
                    </h3>
                    <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      {poem.form_type === "luc_bat"
                        ? "Thơ Lục Bát"
                        : poem.form_type === "that_ngon"
                        ? "Thơ Đường Luật"
                        : poem.form_type === "song_that_luc_bat"
                        ? "Song Thất Lục Bát"
                        : poem.form_type === "tu_do"
                        ? "Thơ Tự Do"
                        : poem.category?.name || poem.form_type}{" "}
                      • {poem.view_count} lượt đọc
                    </p>
                  </div>
                </div>

                <ArrowRoll size="sm" />
              </Link>
            </TiltCard>
          ))
        )}
      </div>
    </div>
  );
}
