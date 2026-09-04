import React from "react";
import Link from "next/link";
import Image from "next/image";
import { mockAuthor, mockPoems } from "@/data/mock-poetry";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { TiltCard } from "@/components/tai-ui/TiltCard";
import { User, Feather, BookOpen, Volume2, Sparkles } from "lucide-react";

export const metadata = {
  title: "Tác Giả | Ánh Thịnh Thi Quán",
  description: "Hồ sơ tác giả Ánh Thịnh và các cây bút thi ca đương đại.",
};

export default function AuthorsPage() {
  const author = mockAuthor;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Header Hồ sơ tác giả */}
      <div className="tai-card p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-[#2D5A3D] rounded-2xl shadow-sm">
        <div className="w-32 h-32 shrink-0 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center overflow-hidden shadow-md">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.name}
              width={112}
              height={112}
              className="object-cover rounded-full"
            />
          ) : (
            <User className="w-12 h-12 text-neutral-400" />
          )}
        </div>

        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="inline-flex items-center justify-center md:justify-start gap-2 text-xs font-mono uppercase tracking-wider text-[#2D5A3D] dark:text-[#4ade80]">
            <Feather className="w-3.5 h-3.5" />
            <span>{author.period}</span>
          </div>

          <h1 className="font-poem-heading text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            {author.name}
          </h1>

          <p className="font-poem-verse text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
            {author.bio}
          </p>
        </div>
      </div>

      {/* Danh sách các tác phẩm của Tác giả */}
      <div className="flex flex-col gap-4">
        <h2 className="font-poem-heading text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#2D5A3D] dark:text-[#4ade80]" />
          <span>Thi phẩm đã xuất bản</span>
        </h2>

        {mockPoems.map((poem, index) => (
          <TiltCard key={poem.id} maxTilt={2} className="p-0 border-0 shadow-none bg-transparent">
            <Link
              href={`/tho/${poem.slug}`}
              className="tai-card p-6 flex items-center justify-between group hover:border-[#2D5A3D]/50 dark:hover:border-emerald-500/50 hover:shadow-md transition-all rounded-2xl block"
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-sm text-neutral-400 dark:text-neutral-600 w-6">
                  0{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-poem-heading font-bold text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-[#2D5A3D] dark:group-hover:text-[#4ade80] transition-colors">
                      {poem.title}
                    </h3>
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
                  <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {poem.form_type === "luc_bat" ? "Thơ Lục Bát" : poem.form_type === "that_ngon" ? "Thơ Đường Luật" : "Thơ Tự Do"} • {poem.view_count} lượt đọc
                  </p>
                </div>
              </div>

              <ArrowRoll size="sm" />
            </Link>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
