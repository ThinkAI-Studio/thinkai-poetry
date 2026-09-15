"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Feather,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Clock,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { SPRINGS } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Author } from "@/types/database";

interface AuthorHeroProps {
  author: Partial<Author> & { name: string };
}

export function AuthorHeroWithAdminAccess({ author }: AuthorHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Mở modal nếu URL có tham số ?login=admin hoặc phím tắt Ctrl+Shift+A
  useEffect(() => {
    if (searchParams.get("login") === "admin") {
      setIsModalOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchParams]);

  // Bộ đếm lùi thời gian khóa khi bị rate-limit
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Focus vào input mật khẩu khi mở modal
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => passwordInputRef.current?.focus(), 150);
    } else {
      setPassword("");
      setError(null);
      setSuccess(false);
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || lockoutSeconds > 0) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 800);
      } else {
        setError(data.error || "Mật khẩu không chính xác.");
        if (data.locked && data.remainingSeconds) {
          setLockoutSeconds(data.remainingSeconds);
        } else if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
      }
    } catch {
      setError("Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* =================================================================== */}
      {/* 1. THẺ HỒ SƠ TÁC GIẢ VỚI HOA TRANG TRÍ MỞ CỔNG QUẢN TRỊ             */}
      {/* =================================================================== */}
      <div className="tai-card p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 rounded-3xl shadow-sm relative overflow-hidden border border-[var(--border-subtle)]">
        {/* Nút Logo Hoa Tác Giả (Easter Egg Trigger Admin Access) */}
        <div className="relative group select-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            title="Nhấp vào đóa hoa để mở Cổng Quản Trị Viên (Wind)"
            className={cn(
              "w-32 h-32 shrink-0 bg-[var(--bg-elevated)] border-2 border-[var(--border-subtle)] rounded-full flex items-center justify-center overflow-hidden shadow-md",
              "group-hover:border-[var(--accent-gold)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(197,160,89,0.3)] transition-all duration-300 cursor-pointer active:scale-95",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            )}
            aria-label="Đóa hoa thi ca - Nhấp để mở cổng quản trị tác giả"
          >
            <div className="relative w-20 h-20 group-hover:rotate-12 transition-transform duration-500">
              <Image
                src={author.avatar_url || "/floral/flower-pink.png"}
                alt={author.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>

          {/* Nút biểu tượng bảo mật nhỏ nhắn cạnh ảnh đại diện */}
          <div
            onClick={() => setIsModalOpen(true)}
            title="Cổng Quản Trị Wind"
            className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
          >
            <Lock className="w-3.5 h-3.5 opacity-70" />
          </div>
        </div>

        {/* Thông tin tác giả */}
        <div className="flex flex-col gap-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center justify-center md:justify-start text-xs font-serif uppercase tracking-widest text-[var(--accent-green)] dark:text-[var(--accent-gold)] font-medium">
            <span>{author.period || "Văn Học Đương Đại"}</span>
          </div>

          <h1 className="font-poem-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight flex flex-wrap items-baseline justify-center md:justify-start gap-2 sm:gap-3">
            <span>{author.name}</span>
            {author.pen_name && (
              <span className="text-xl sm:text-2xl font-serif text-[var(--accent-gold)] font-normal">
                (Ký danh: {author.pen_name})
              </span>
            )}
          </h1>

          <p className="font-poem-verse text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
            {author.bio || "Một ngòi bút thầm lặng ghi chép những chuyển động vi tế của tâm hồn qua từng thi khúc đương đại."}
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start gap-3 text-xs font-mono text-[var(--text-muted)]">
            <span>Tác Quyền: {author.name} {author.pen_name ? `(${author.pen_name})` : ""} • Wind</span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. HỘP ĐĂNG NHẬP NỔI BẢO MẬT (QUIET LUXURY ADMIN FLOAT BOX)         */}
      {/* =================================================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-dialog-title"
          >
            {/* Lớp nền mờ sâu Blur Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !loading && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Hộp thoại nổi (Float Box) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-[360px] bg-[#FAF8F5] dark:bg-[#181816] border border-amber-950/10 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 text-[var(--text-primary)]"
            >
              {/* Nút đóng */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                aria-label="Đóng hộp thoại"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Cổng Quản Trị */}
              <div className="flex flex-col items-center text-center gap-2.5 pt-1">
                {/* Biểu tượng thương hiệu Wind thanh lịch */}
                <div className="relative w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs select-none">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/thinh-va-tho-symbol.png"
                      alt="Wind"
                      fill
                      className="object-contain invert dark:invert-0"
                    />
                  </div>
                </div>

                <div>
                  <h2
                    id="admin-dialog-title"
                    className="font-serif text-lg font-bold text-neutral-900 dark:text-[#EAE6DF] tracking-tight"
                  >
                    Xác thực quản trị
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Nhập mật khẩu để truy cập bảng quản trị Wind
                  </p>
                </div>
              </div>

              {/* Thông báo lỗi / Khóa bảo mật */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-3 rounded-xl border text-xs flex items-start gap-2 leading-relaxed",
                    lockoutSeconds > 0
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200"
                      : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                  )}
                >
                  {lockoutSeconds > 0 ? (
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span>{error}</span>
                    {lockoutSeconds > 0 && (
                      <span className="block font-semibold mt-0.5">
                        Thử lại sau {lockoutSeconds} giây
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Thông báo thành công */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Xác thực thành công. Đang chuyển hướng...</span>
                </motion.div>
              )}

              {/* Form nhập mật khẩu */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center justify-between"
                  >
                    <span>Mật khẩu</span>
                    {remainingAttempts !== null && remainingAttempts > 0 && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-normal">
                        ({remainingAttempts} lần thử còn lại)
                      </span>
                    )}
                  </label>

                  <div className="relative">
                    <input
                      ref={passwordInputRef}
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={loading || lockoutSeconds > 0 || success}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full py-2.5 pl-3.5 pr-10 bg-white dark:bg-[#121211] border border-neutral-300/80 dark:border-white/15 focus:border-neutral-900 dark:focus:border-white focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white text-neutral-900 dark:text-neutral-100 font-mono text-sm tracking-wider rounded-xl outline-none transition-all disabled:opacity-50 placeholder:text-neutral-400 placeholder:font-sans placeholder:tracking-normal"
                    />

                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1 cursor-pointer"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Nút Submit */}
                <button
                  type="submit"
                  disabled={loading || lockoutSeconds > 0 || success || !password}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                    success
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Đang kiểm tra...</span>
                    </span>
                  ) : success ? (
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Đã xác thực</span>
                    </span>
                  ) : (
                    <span>Đăng nhập</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
