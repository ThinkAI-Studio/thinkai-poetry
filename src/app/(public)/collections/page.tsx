import React from "react";
import { getCollections } from "@/lib/data-service";
import { CollectionsClientView } from "./CollectionsClientView";

export const revalidate = 60;

export const metadata = {
  title: "Tuyển Tập Thi Ca & Tản Văn | Wind",
  description: "Khám phá các tập thơ và tản văn chọn lọc đặc sắc của tác giả Thịnh (Wind).",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] dark:text-[var(--accent-gold)] text-xs font-serif uppercase tracking-wider mb-4 border border-[var(--accent-green)]/20 dark:border-[var(--accent-gold)]/20 font-medium">
          <span>Thư Viện Tác Phẩm</span>
        </div>
        <h1 className="font-poem-heading text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-[#EAE6DF] tracking-tight mb-4">
          Tuyển Tập <span className="font-normal text-[var(--accent-green)] dark:text-[var(--accent-gold)]">Thơ & Tản Văn</span>
        </h1>
        <p className="font-poem-verse text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
          Mỗi kệ sách là một tuyển tập kết tinh từ những rung cảm chân thành, nơi từng câu thơ và trang văn được trân trọng lưu giữ.
        </p>
      </div>

      {/* Interactive Bookshelf View with Shelf/Grid Switch */}
      <CollectionsClientView collections={collections} />
    </div>
  );
}
