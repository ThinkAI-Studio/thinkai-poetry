import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { mockCollections, mockPoems } from "@/data/mock-poetry";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { TiltCard } from "@/components/tai-ui/TiltCard";
import { ArrowLeft, BookOpen, Feather, Volume2, Sparkles } from "lucide-react";

interface CollectionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionDetailPageProps) {
  const { slug } = await params;
  const col = mockCollections.find((c) => c.slug === slug);
  if (!col) return { title: "Không tìm thấy tuyển tập" };
  return {
    title: `${col.title} | Ánh Thịnh Thi Quán`,
    description: col.description,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;
  const collection = mockCollections.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  const poems = mockPoems;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Back button */}
      <Link
        href="/tuyen-tap"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Tất cả tuyển tập</span>
      </Link>

      {/* Header Tuyển Tập */}
      <div className="tai-card p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-[#2D5A3D] rounded-2xl shadow-sm">
        {collection.cover_image_url && (
          <div className="w-36 h-36 shrink-0 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl flex items-center justify-center p-4 shadow-xs">
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
          <div className="inline-flex items-center justify-center md:justify-start gap-2 text-xs font-mono uppercase tracking-wider text-[#2D5A3D] dark:text-[#4ade80]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tuyển Tập Thi Tuyển • {collection.poems_count} Tác phẩm</span>
          </div>

          <h1 className="font-poem-heading text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {collection.title}
          </h1>

          <p className="font-poem-verse text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Danh sách các bài thơ trong Tuyển Tập */}
      <div className="flex flex-col gap-4">
        <h2 className="font-poem-heading text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
          <Feather className="w-4 h-4 text-[#2D5A3D] dark:text-[#4ade80]" />
          <span>Mục lục thi phẩm</span>
        </h2>

        {poems.map((poem, index) => (
          <TiltCard key={poem.id} maxTilt={2} className="p-0 border-0 shadow-none bg-transparent">
            <Link
              href={`/tho/${poem.slug}`}
              className="tai-card p-5 group flex items-center justify-between hover:border-[#2D5A3D]/50 dark:hover:border-emerald-500/50 hover:shadow-md transition-all rounded-2xl block"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-neutral-400 w-6">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-poem-heading font-bold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-[#2D5A3D] dark:group-hover:text-[#4ade80] transition-colors">
                      {poem.title}
                    </span>
                    {poem.audio_url ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">
                        <Volume2 className="w-2.5 h-2.5" />
                        <span>Ngâm thơ</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#2D5A3D] dark:text-[#4ade80] bg-[#2D5A3D]/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Âm cảnh</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
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
        ))}
      </div>
    </div>
  );
}
