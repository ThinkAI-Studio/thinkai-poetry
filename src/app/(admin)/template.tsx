"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/motion";

/**
 * Admin Workspace Page Transition Template
 * Chuyển động nhẹ nhàng, dứt khoát và chuyên nghiệp giữa các trang quản trị
 */
export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
