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
            title="Nhấp vào đóa hoa để mở Cổng Quản Trị Viên (Thịnh và Thơ)"
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

          {/* Huy hiệu Triện Son nhỏ nhắn gắn mép hoa */}
          <div
            onClick={() => setIsModalOpen(true)}
            title="Cổng Quản Trị"
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--accent-vermilion)] text-white flex items-center justify-center shadow-md border-2 border-[var(--bg-card)] cursor-pointer hover:scale-110 transition-transform active:scale-95"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Thông tin tác giả */}
        <div className="flex flex-col gap-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center justify-center md:justify-start text-xs font-serif uppercase tracking-widest text-[var(--accent-green)] dark:text-[var(--accent-gold)] font-medium">
            <span>{author.period || "Văn Học Đương Đại"}</span>
          </div>

          <h1 className="font-poem-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
            {author.name}
          </h1>

          <p className="font-poem-verse text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
            {author.bio || "Một ngòi bút thầm lặng ghi chép những chuyển động vi tế của tâm hồn qua từng thi khúc đương đại."}
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start gap-3 text-xs font-mono text-[var(--text-muted)]">
            <span>Chủ Quán & Tác Quyền: Ánh Thịnh</span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. HỘP ĐĂNG NHẬP NỔI BẢO MẬT CHUẨN CHỈNH (ADMIN FLOAT BOX)           */}
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
              transition={{ duration: 0.25 }}
              onClick={() => !loading && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
            />

            {/* Hộp thoại nổi (Float Box) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={SPRINGS.bouncy}
              className="relative z-10 w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.45)] flex flex-col gap-6 text-[var(--text-primary)] backdrop-blur-xl"
            >
              {/* Nút đóng */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
                className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent-gold)]"
                aria-label="Đóng hộp thoại"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Cổng Quản Trị */}
              <div className="flex flex-col items-center text-center gap-3 pt-2">
                {/* Con dấu Triện Son Khắc Chữ T */}
                <div className="relative w-14 h-14 rounded-2xl bg-[var(--accent-vermilion)] text-amber-100 flex items-center justify-center shadow-lg border-2 border-amber-300/40 select-none">
                  <span className="font-serif text-2xl font-bold tracking-tight">T</span>
                  <div className="absolute inset-1 border border-amber-200/20 rounded-xl pointer-events-none" />
                </div>

                <div>
                  <h2
                    id="admin-dialog-title"
                    className="font-poem-heading text-2xl font-bold text-[var(--text-primary)] tracking-tight"
                  >
                    Cổng Quản Trị Thi Quán
                  </h2>
                  <p className="text-xs font-mono text-[var(--text-secondary)] mt-1 tracking-wider">
                    Thịnh và Thơ • Không gian biên tập tác phẩm
                  </p>
                </div>
              </div>

              {/* Thông báo lỗi / Khóa bảo mật */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5",
                    lockoutSeconds > 0
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-200"
                      : "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-200"
                  )}
                >
                  {lockoutSeconds > 0 ? (
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 leading-relaxed">
                    <span>{error}</span>
                    {lockoutSeconds > 0 && (
                      <span className="block font-bold text-amber-600 dark:text-amber-300 mt-1">
                        Thời gian mở lại: {lockoutSeconds}s
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Thông báo thành công */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs font-mono flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Xác thực thành công! Đang mở cửa thư phòng...</span>
                </motion.div>
              )}

              {/* Form nhập mật khẩu */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] flex items-center justify-between"
                  >
                    <span>Mật khẩu quản trị</span>
                    {remainingAttempts !== null && remainingAttempts > 0 && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 lowercase">
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
                      placeholder="Nhập mật khẩu quản trị..."
                      className="w-full py-3.5 pl-4 pr-11 bg-[var(--bg-page)] border border-[var(--border-strong)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] text-[var(--text-primary)] font-mono text-sm rounded-xl outline-none transition-colors disabled:opacity-50 placeholder:text-[var(--text-muted)]/70"
                    />

                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Nút Submit */}
                <button
                  type="submit"
                  disabled={loading || lockoutSeconds > 0 || success || !password}
                  className={cn(
                    "w-full py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold)]",
                    success
                      ? "bg-emerald-600 text-white"
                      : "bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang đối chiếu khóa mật...</span>
                    </span>
                  ) : success ? (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Mở khóa thành công</span>
                    </span>
                  ) : (
                    <>
                      <span>Tiến Vào Quản Trị</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
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
