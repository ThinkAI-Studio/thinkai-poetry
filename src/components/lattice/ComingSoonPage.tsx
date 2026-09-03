"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FloralDecoration } from "@/components/lattice/FloralDecoration";
import { WipeButton } from "@/components/tai-ui/WipeButton";
import { ArrowRoll } from "@/components/tai-ui/ArrowRoll";
import { Bell, Sparkles } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  badge: string;
  description: string;
}

export function ComingSoonPage({
  title,
  badge,
  description,
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">
      {/* Khung hoa lá đung đưa Sora Lattice */}
      <FloralDecoration />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#131316]/90 border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs font-mono tracking-wider uppercase text-[#2D5A3D]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>

        {/* Tiêu đề Serif kết hợp Italic */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
          Một góc tĩnh lặng <br />
          <span className="italic font-normal text-[#2D5A3D]">đang được ươm mầm...</span>
        </h1>

        {/* Mô tả */}
        <p className="text-base sm:text-lg font-serif text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed">
          {description}
        </p>

        {/* Form đăng ký nhận tin */}
        {isSubscribed ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-serif text-sm rounded-xl">
            ✓ Cảm ơn bạn! Chúng tôi sẽ gửi thông báo đến bạn ngay khi không gian này mở cửa.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md pt-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn..."
              required
              className="w-full px-5 py-3 text-sm font-serif bg-white dark:bg-[#131316] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-full focus:outline-none focus:border-[#2D5A3D] shadow-xs"
            />
            <WipeButton
              type="submit"
              wipeColor="#2D5A3D"
              textColor="#ffffff"
              hoverTextColor="#ffffff"
              className="bg-[#2D5A3D] text-white px-6 py-3 shrink-0 w-full sm:w-auto text-xs"
            >
              <Bell className="w-3.5 h-3.5 mr-1" />
              Đăng ký nhận tin
            </WipeButton>
          </form>
        )}

        {/* Quay lại trang chủ */}
        <div className="pt-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span>Trở về Vườn Thơ</span>
            <ArrowRoll size="sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}
