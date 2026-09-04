"use client";

import React from "react";
import { Realistic3DPageFlip } from "./Realistic3DPageFlip";
import { usePoeticBook } from "@/context/PoeticBookContext";
import { Poem } from "@/types/database";
import { cn } from "@/lib/utils";

export function PoeticOpenBook({
  className,
  onPoemSelect,
}: {
  className?: string;
  onPoemSelect?: (poem: Poem) => void;
}) {
  const {
    poems,
    currentPageIndex,
    highlightedText,
    goToPage,
  } = usePoeticBook();

  return (
    <div className={cn("relative w-full max-w-5xl mx-auto select-none py-2", className)}>
      <Realistic3DPageFlip
        poems={poems}
        currentIndex={currentPageIndex}
        highlightedText={highlightedText}
        onPageChange={goToPage}
      />
    </div>
  );
}
