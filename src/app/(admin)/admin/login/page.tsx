"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng sang trang Tác giả với Hộp Đăng Nhập Nổi
    router.replace("/authors?login=admin");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-8 h-8 border-2 border-[var(--accent-gold)]/40 border-t-[var(--accent-gold)] rounded-full animate-spin mb-4" />
      <p className="font-mono text-xs text-[var(--text-secondary)]">
        Đang chuyển hướng sang Cổng Đăng Nhập Quản Trị Viên...
      </p>
    </div>
  );
}


