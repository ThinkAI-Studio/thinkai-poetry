"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SPRINGS } from "@/lib/motion";
import { useMagnetic } from "@/lib/useMagnetic";

export const taiButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-mono text-xs tracking-wider uppercase transition-colors duration-200 group cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A3D]/40",
  {
    variants: {
      variant: {
        primary:
          "bg-[#2D5A3D] text-white hover:bg-[#234730] font-semibold shadow-[0_2px_8px_-2px_rgba(45,90,61,0.3)]",
        secondary:
          "bg-white text-neutral-900 hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 font-medium shadow-xs",
        outline:
          "bg-transparent text-neutral-900 border border-neutral-300 hover:border-neutral-900 hover:bg-black/[0.02] font-medium",
        ghost:
          "bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-black/[0.04] font-medium",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-3.5 py-1.5 text-[11px]",
        lg: "px-7 py-3.5 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface TaiButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof taiButtonVariants> {
  asChild?: boolean;
  href?: string;
  icon?: React.ReactNode;
}

export const TaiButton = React.forwardRef<HTMLButtonElement, TaiButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      href,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const prefersReduced = useReducedMotion();
    const { ref: magneticRef, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(0.2);

    if (asChild) {
      return (
        <Slot
          className={cn(taiButtonVariants({ variant, size, className }))}
          ref={ref as any}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const Component = href ? motion.a : motion.button;

    return (
      <Component
        ref={(node: any) => {
          // Sync internal magnetic ref & forwarded ref
          magneticRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        // @ts-ignore
        href={href}
        style={prefersReduced ? undefined : { x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(taiButtonVariants({ variant, size, className }))}
        whileHover={{ scale: prefersReduced ? 1 : 1.03 }}
        whileTap={{ scale: prefersReduced ? 1 : 0.94 }}
        transition={SPRINGS.responsive}
        {...(props as any)}
      >
        <span className="relative flex items-center justify-center gap-2">
          <span>{children}</span>
          {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
        </span>
      </Component>
    );
  }
);

TaiButton.displayName = "TaiButton";
