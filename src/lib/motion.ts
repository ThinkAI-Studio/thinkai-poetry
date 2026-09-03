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

/**
 * Default transitions & springs for ThinkAI Studio
 */
export const TAI_EASE = {
  luxury: [0.16, 1, 0.3, 1] as const,
  spring: [0.32, 0.72, 0, 1] as const,
  snappy: [0.19, 1, 0.22, 1] as const,
};

export const TAI_SPRING = {
  default: { type: "spring", damping: 32, stiffness: 280, mass: 1 },
  stiff: { type: "spring", damping: 30, stiffness: 400, mass: 0.8 },
  gentle: { type: "spring", damping: 38, stiffness: 200, mass: 1.2 },
} as const;

export const defaultTransition: Transition = {
  duration: 0.5,
  ease: TAI_EASE.luxury,
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
