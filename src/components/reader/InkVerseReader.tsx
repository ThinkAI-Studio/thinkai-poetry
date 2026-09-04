"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { EASINGS, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface VerseItem {
  id: string;
  text: string;
  className: string;
}

interface StanzaItem {
  id: string;
  verses: VerseItem[];
}

interface InkVerseReaderProps {
  contentHtml: string;
  fontSize: number;
  className?: string;
}

export function InkVerseReader({ contentHtml, fontSize, className }: InkVerseReaderProps) {
  const prefersReduced = usePrefersReducedMotion();

  // Phân giải HTML thành cấu trúc Khổ thơ (Stanza) & Câu thơ (Verse)
  const stanzas = useMemo<StanzaItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentHtml, "text/html");
    const stanzaEls = Array.from(doc.querySelectorAll(".stanza"));

    if (stanzaEls.length === 0) {
      // Fallback nếu bài thơ chỉ chứa các thẻ <p>
      const pEls = Array.from(doc.querySelectorAll("p"));
      return [
        {
          id: "stanza-0",
          verses: pEls.map((p, idx) => ({
            id: `v-${idx}`,
            text: p.textContent || "",
            className: p.className || "verse",
          })),
        },
      ];
    }

    return stanzaEls.map((stanza, sIdx) => ({
      id: `stanza-${sIdx}`,
      verses: Array.from(stanza.querySelectorAll(".verse")).map((v, vIdx) => ({
        id: `v-${sIdx}-${vIdx}`,
        text: v.textContent || "",
        className: v.className || "verse",
      })),
    }));
  }, [contentHtml]);

  if (stanzas.length === 0) {
    // Fallback SSR an toàn
    return (
      <div
        className={cn("font-poem-verse poem-body max-w-lg mx-auto select-text", className)}
        style={{ fontSize: `${fontSize}px`, color: "var(--text-primary)" }}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    );
  }

  return (
    <div
      className={cn("font-poem-verse poem-body max-w-lg mx-auto space-y-10 select-text", className)}
      style={{ fontSize: `${fontSize}px`, color: "var(--text-primary)" }}
    >
      {stanzas.map((stanza, sIdx) => (
        <StanzaGroup
          key={stanza.id}
          stanza={stanza}
          stanzaIndex={sIdx}
          prefersReduced={prefersReduced}
        />
      ))}
    </div>
  );
}

function StanzaGroup({
  stanza,
  stanzaIndex,
  prefersReduced,
}: {
  stanza: StanzaItem;
  stanzaIndex: number;
  prefersReduced: boolean;
}) {
  return (
    <motion.div
      initial={prefersReduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px -10% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReduced ? 0 : 0.12,
            delayChildren: stanzaIndex === 0 ? 0.05 : 0.02,
          },
        },
      }}
      className="stanza space-y-2 relative"
    >
      {stanza.verses.map((verse) => (
        <motion.p
          key={verse.id}
          variants={{
            hidden: {
              opacity: 0,
              y: 8,
              filter: "blur(5px)",
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.65,
                ease: EASINGS.inkWash,
              },
            },
          }}
          className={cn("poem-verse tracking-wide transition-colors", verse.className)}
        >
          {verse.text}
        </motion.p>
      ))}
    </motion.div>
  );
}
