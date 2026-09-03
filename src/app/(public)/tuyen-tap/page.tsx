import React from "react";
import Link from "next/link";
import Image from "next/image";
import { mockCollections } from "@/data/mock-poetry";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { BookMarked, Sparkles } from "lucide-react";

export const metadata = {
  title: "Tuyển Tập Thi Ca | Ánh Thịnh Thi Quán",
  description: "Khám phá các tập thơ, thi tuyển chọn lọc đặc sắc.",
};

export default function CollectionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D5A3D]/10 text-[#2D5A3D] text-xs font-mono uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bộ Sưu Tập Thơ</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
          Tuyển Tập <span className="italic font-normal text-[#2D5A3D]">Thi Ca Chọn Lọc</span>
        </h1>
        <p className="font-serif text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
          Mỗi tập thơ là một chuyến hành trình của tâm thức, nơi từng câu chữ được kết tinh từ những rung cảm chân thành nhất.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mockCollections.map((col) => (
          <Link
            key={col.id}
            href={`/tuyen-tap/${col.slug}`}
            className="tai-card group flex flex-col justify-between overflow-hidden p-6 hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              {/* Cover / Icon */}
              <div className="w-full h-44 bg-neutral-100 dark:bg-neutral-900 mb-6 flex items-center justify-center relative overflow-hidden border border-neutral-200/60 dark:border-neutral-800">
                {col.cover_image_url ? (
                  <Image
                    src={col.cover_image_url}
                    alt={col.title}
                    width={96}
                    height={96}
                    className="object-contain group-hover:scale-110 transition-transform duration-500 opacity-80"
                  />
                ) : (
                  <BookMarked className="w-12 h-12 text-neutral-400" />
                )}
                <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-white/90 dark:bg-black/90 text-[11px] font-mono uppercase tracking-wider border border-neutral-200 dark:border-neutral-800">
                  {col.poems_count} bài thơ
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="font-serif font-bold text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-[#2D5A3D] transition-colors mb-2 line-clamp-1">
                {col.title}
              </h2>
              <p className="font-serif text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6">
                {col.description}
              </p>
            </div>

            {/* Footer card */}
            <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-500">
                Xem chi tiết
              </span>
              <ArrowRoll size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
