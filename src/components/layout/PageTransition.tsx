"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion, EASINGS } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          y: 12,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          y: -8,
          filter: "blur(3px)",
        }}
        transition={{
          duration: 0.38,
          ease: EASINGS.inkWash,
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
