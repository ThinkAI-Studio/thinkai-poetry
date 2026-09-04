import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/lib/data-service";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { TiltCard } from "@/components/tai-ui/TiltCard";
import { ArrowLeft, BookOpen, Feather, Volume2, Wind } from "lucide-react";

interface CollectionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionDetailPageProps) {
  const { slug } = await params;
  const col = await getCollectionBySlug(slug);
  if (!col) return { title: "Không tìm thấy tuyển tập" };
  return {
    title: `${col.title} | Thịnh và Thơ`,
    description: col.description,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const poems = collection.poems || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Back button */}
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Tất cả tuyển tập</span>
      </Link>

      {/* Header Tuyển Tập */}
      <div className="tai-card p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center gap-8 border border-[var(--border-subtle)] rounded-2xl shadow-sm">
        {collection.cover_image_url && (
          <div className="w-36 h-36 shrink-0 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center p-4 shadow-xs">
            <Image
              src={collection.cover_image_url}
              alt={collection.title}
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="inline-flex items-center justify-center md:justify-start text-xs font-mono uppercase tracking-wider text-[var(--accent-green)] dark:text-[var(--accent-gold)]">
            <span>Tuyển Tập Thi Tuyển • {collection.poems_count} Tác phẩm</span>
          </div>

          <h1 className="font-poem-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            {collection.title}
          </h1>

          <p className="font-poem-verse text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Danh sách các bài thơ trong Tuyển Tập */}
      <div className="flex flex-col gap-4">
        <h2 className="font-poem-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
          <span>Mục lục thi phẩm</span>
        </h2>

        {poems.length === 0 ? (
          <div className="tai-card p-8 text-center rounded-2xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-serif text-sm">
            Tuyển tập này hiện chưa có bài thơ nào.
          </div>
        ) : (
          poems.map((poem, index) => (
          <TiltCard key={poem.id} maxTilt={2} className="p-0 border-0 shadow-none bg-transparent">
            <Link
              href={`/poems/${poem.slug}`}
              className="tai-card p-5 group flex items-center justify-between hover:border-[var(--accent-green)] hover:shadow-md transition-all rounded-2xl block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-green)]"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-[var(--text-muted)] w-6">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-poem-heading font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors">
                      {poem.title}
                    </span>
                    {poem.audio_url ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-0.5 rounded-full">
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>Ngâm thơ</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--accent-green)] bg-[var(--accent-green)]/10 px-2 py-0.5 rounded-full">
                        <Wind className="w-2.5 h-2.5" />
                        <span>Âm cảnh</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {poem.form_type === "luc_bat" ? "Thơ Lục Bát" : poem.form_type === "that_ngon" ? "Thơ Đường Luật" : "Thơ Tự Do"} • {poem.view_count} lượt đọc
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider text-neutral-500 group-hover:text-black dark:group-hover:text-white">
                  Đọc thơ
                </span>
                <ArrowRoll size="sm" />
              </div>
            </Link>
          </TiltCard>
        ))
        )}
      </div>
    </div>
  );
}
