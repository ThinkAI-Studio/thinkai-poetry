"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion, EASINGS } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();
  const [isNavigating, setIsNavigating] = useState(false);

  // Đảm bảo cuộn lên đầu trang tự nhiên và kết thúc trạng thái chuyển hướng khi route đã đến
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo(0, 0);
    }
    setIsNavigating(false);
  }, [pathname]);

  // Bắt sự kiện click link nội bộ để kích hoạt thanh chỉ thị tức thì (0ms phản hồi trực quan)
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        target.target !== "_blank" &&
        href !== pathname
      ) {
        setIsNavigating(true);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => document.removeEventListener("click", handleLinkClick, { capture: true });
  }, [pathname]);

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 1. Thanh chỉ thị tiến trình chu du thi ca (Top Ink Route Transition Indicator) */}
      <motion.div
        key={`page-progress-${pathname}-${isNavigating ? "nav" : "idle"}`}
        initial={{ scaleX: 0, opacity: 0.95 }}
        animate={{
          scaleX: isNavigating ? 0.7 : 1,
          opacity: isNavigating ? 1 : [0.95, 1, 0],
        }}
        transition={{
          scaleX: isNavigating
            ? { duration: 0.35, ease: "easeOut" }
            : { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
          opacity: isNavigating
            ? { duration: 0.1 }
            : { duration: 0.45, times: [0, 0.6, 1], ease: "easeOut" },
        }}
        style={{ transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none bg-gradient-to-r from-[var(--accent-green)] via-[var(--accent-gold)] to-emerald-400 shadow-[0_0_10px_rgba(46,125,50,0.45)]"
      />

      {/* 2. Motion chuyển cảnh mượt mà chuẩn Sora Labs / Luxury (Poetic Page Enter Glide) */}
      <motion.div
        key={`page-content-${pathname}`}
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.32,
          ease: EASINGS.luxury,
        }}
        className="w-full flex-1 flex flex-col min-h-full"
      >
        {children}
      </motion.div>
    </>
  );
}



