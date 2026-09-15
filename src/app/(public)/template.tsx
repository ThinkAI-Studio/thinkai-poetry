"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/motion";

/**
 * Public Page Transition Template
 * Sử dụng quy chuẩn template.tsx của Next.js App Router:
 * - Tạo instance mới cho mỗi route navigation
 * - Kích hoạt animation trượt êm mượt mà và tự nhiên (Poetic Ease-out)
 * - Tự động thích ứng với prefers-reduced-motion
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
