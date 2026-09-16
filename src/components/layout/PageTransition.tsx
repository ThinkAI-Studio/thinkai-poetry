"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion, EASINGS } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();

  // Đảm bảo cuộn lên đầu trang tự nhiên khi chuyển trang
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 1. Thanh chỉ thị tiến trình chu du thi ca (Top Ink Route Transition Indicator) */}
      <motion.div
        key={`page-progress-${pathname}`}
        initial={{ scaleX: 0, opacity: 0.95 }}
        animate={{ scaleX: 1, opacity: [0.95, 1, 0] }}
        transition={{
          scaleX: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.58, times: [0, 0.7, 1], ease: "easeOut" },
        }}
        style={{ transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none bg-gradient-to-r from-[var(--accent-green)] via-[var(--accent-gold)] to-emerald-400 shadow-[0_0_10px_rgba(46,125,50,0.45)]"
      />

      {/* 2. Motion chuyển cảnh mượt mà chuẩn Sora Labs / Luxury (Poetic Page Enter Glide) */}
      <motion.div
        key={`page-content-${pathname}`}
        initial={{
          opacity: 0,
          y: 14,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.38,
          ease: EASINGS.luxury,
        }}
        className="w-full flex-1 flex flex-col min-h-full"
      >
        {children}
      </motion.div>
    </>
  );
}


