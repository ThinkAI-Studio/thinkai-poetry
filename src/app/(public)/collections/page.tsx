import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/lib/data-service";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { TiltCard } from "@/components/tai-ui/TiltCard";
import { BookMarked, Feather } from "lucide-react";

export const metadata = {
  title: "Tuyển Tập Thi Ca | Thịnh và Thơ",
  description: "Khám phá các tập thơ, thi tuyển chọn lọc đặc sắc. Thịnh và Thơ.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] dark:text-[var(--accent-gold)] text-xs font-serif uppercase tracking-wider mb-4 border border-[var(--accent-green)]/20 dark:border-[var(--accent-gold)]/20 font-medium">
          <span>Bộ Sưu Tập Thơ</span>
        </div>
        <h1 className="font-poem-heading text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-[#EAE6DF] tracking-tight mb-4">
          Tuyển Tập <span className="font-normal text-[var(--accent-green)] dark:text-[var(--accent-gold)]">Thi Ca Chọn Lọc</span>
        </h1>
        <p className="font-poem-verse text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
          Mỗi tập thơ là một chuyến hành trình của tâm thức, nơi từng câu chữ được kết tinh từ những rung cảm chân thành nhất.
        </p>
      </div>

      {/* Collections Grid với Tilt 3D */}
      {collections.length === 0 ? (
        <div className="tai-card p-12 text-center max-w-lg mx-auto rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <BookMarked className="w-10 h-10 mx-auto text-[var(--accent-gold)] mb-3 opacity-80" />
          <h2 className="font-poem-heading text-xl font-bold text-[var(--text-primary)] mb-2">
            Chưa có tuyển tập nào
          </h2>
          <p className="font-poem-verse text-sm text-[var(--text-muted)]">
            Các tuyển tập thơ mới sẽ xuất hiện tại đây sau khi được biên soạn và công bố trong trang quản trị.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col) => (
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
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-white/90 dark:bg-black/90 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono uppercase tracking-wider rounded-full border border-neutral-200 dark:border-neutral-800">
                      {col.poems_count} bài thơ
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h2 className="font-poem-heading font-bold text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-[#2D5A3D] dark:group-hover:text-[#4ade80] transition-colors mb-2 line-clamp-1">
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
          ))}
        </div>
      )}
    </div>
  );
}
