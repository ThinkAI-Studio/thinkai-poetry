"use client";

import { useEffect, useState } from "react";
import { type Variants, type Transition } from "motion/react";

/**
 * Check if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

export const usePrefersReducedMotion = useReducedMotion;

/**
 * HỆ THỐNG VẬT LÝ LÒ XO THI CA (SPRING PHYSICS TOKENS)
 */
export const SPRINGS = {
  // Lò xo êm đềm: Dành cho hoa lá đung đưa, capsule mở rộng, thẻ trôi
  gentle: {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 1.2,
  } as const,

  // Lò xo nảy xúc giác (Bouncy): Dành cho modal pop-up, icon flip, đổi theme, quote card
  bouncy: {
    type: "spring",
    stiffness: 420,
    damping: 18,
    mass: 0.8,
  } as const,

  // Lò xo phản hồi cực nhạy (Responsive): Dành cho nam châm nút bấm (magnetic), tab indicator
  responsive: {
    type: "spring",
    stiffness: 350,
    damping: 28,
    mass: 0.6,
  } as const,

  // Lò xo trôi phiêu lãng (Poetic Float): Dành cho cánh hoa bay, hạt bụi thơ, floating pills
  poeticFloat: {
    type: "spring",
    stiffness: 45,
    damping: 15,
    mass: 2.2,
  } as const,

  // Lò xo mực loang (Ink Spread): Mô phỏng giọt mực đặc loang dần trên thớ giấy dó
  inkSpread: {
    type: "spring",
    stiffness: 160,
    damping: 26,
    mass: 1.4,
  } as const,
};

/**
 * HỆ THỐNG EASING CUBIC-BEZIER (EASING TOKENS)
 */
export const EASINGS = {
  // Mực loang thẩm thấu tự nhiên vào giấy dó (giảm tốc mượt mà)
  inkWash: [0.22, 1, 0.36, 1] as const,

  // Phong cách sang trọng chuẩn Sora Labs / Lattice
  luxury: [0.16, 1, 0.3, 1] as const,

  // Chuyển động lướt dịu dàng
  gentle: [0.25, 0.1, 0.25, 1] as const,

  // Lướt quét màu (Wipe button)
  wipe: [0.65, 0, 0.35, 1] as const,
};

// Backward compatibility
export const TAI_EASE = EASINGS;
export const TAI_SPRING = {
  default: SPRINGS.responsive,
  stiff: SPRINGS.bouncy,
  gentle: SPRINGS.gentle,
};

export const defaultTransition: Transition = {
  duration: 0.5,
  ease: EASINGS.luxury,
};

export const inkSpreadTransition: Transition = {
  duration: 0.85,
  ease: EASINGS.inkWash,
};

/**
 * Stagger children animation variants
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 16,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: defaultTransition,
  },
};

/**
 * Fade in animation variants
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: defaultTransition,
  },
};

/**
 * Slide up animation variants
 */
export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 24,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: defaultTransition,
  },
};

/**
 * Get variants with reduced motion support
 */
export function getVariantsWithReducedMotion(
  variants: Variants,
  reducedMotion: boolean
): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0 } },
    };
  }
  return variants;
}
