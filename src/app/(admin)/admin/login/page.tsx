"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Feather, Lock, ArrowRight, ShieldCheck, Key } from "lucide-react";
import { TaiButton } from "@/components/tai-ui/TaiButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Mật khẩu không đúng");
      }
    } catch {
      // Client-side fallback if fetch fails
      if (password === "anhthinh") {
        document.cookie = "admin_session=authenticated; path=/; max-age=604800";
        router.push("/admin");
      } else {
        setError("Mật khẩu không đúng");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-[#0D0D10] border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-[#2D5A3D] text-white flex items-center justify-center rounded-xl shadow-md">
            <Feather className="w-6 h-6" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            Ánh Thịnh Admin Studio
          </h1>

          <p className="text-xs font-mono text-neutral-400">
            Khu vực quản trị nội dung thi ca và tuyển tập
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono text-center rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#2D5A3D]" />
              <span>Mật khẩu quản trị</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (anhthinh)..."
              className="p-3.5 bg-[#08080A] border border-white/15 text-white font-mono text-sm rounded-xl focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          <div className="p-3 bg-white/[0.03] border border-white/5 flex items-center gap-2 text-[11px] font-mono text-neutral-400 rounded-lg">
            <Key className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
            <span>Gợi ý test nhanh: Mật khẩu là <strong>anhthinh</strong></span>
          </div>

          <TaiButton
            variant="primary"
            size="default"
            type="submit"
            disabled={loading}
            className="w-full mt-2"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {loading ? "Đang xác thực..." : "Đăng Nhập"}
          </TaiButton>
        </form>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-500">
          <Link href="/" className="hover:text-white transition-colors">
            ← Về trang thơ
          </Link>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ThinkAI Security</span>
          </span>
        </div>
      </div>
    </div>
  );
}
