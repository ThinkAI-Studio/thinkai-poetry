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

function parsePoemContent(contentHtml: string): StanzaItem[] {
  if (!contentHtml || typeof contentHtml !== "string") return [];

  // Match <div class="...stanza...">...</div>
  const stanzaRegex = /<div[^>]*class="[^"]*stanza[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  const stanzaMatches = Array.from(contentHtml.matchAll(stanzaRegex));

  if (stanzaMatches.length > 0) {
    return stanzaMatches.map((sMatch, sIdx) => {
      const stanzaInner = sMatch[1];
      const verseRegex = /<p[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/p>|<p[^>]*>([\s\S]*?)<\/p>/gi;
      const verseMatches = Array.from(stanzaInner.matchAll(verseRegex));

      const verses = verseMatches.map((vMatch, vIdx) => {
        const text = (vMatch[2] || vMatch[3] || "").replace(/<[^>]+>/g, "").trim();
        const className = vMatch[1] || "verse";
        return { id: `v-${sIdx}-${vIdx}`, text, className };
      });

      return {
        id: `stanza-${sIdx}`,
        verses: verses.length > 0 ? verses : [{ id: `v-${sIdx}-0`, text: stanzaInner.replace(/<[^>]+>/g, "").trim(), className: "verse" }],
      };
    });
  }

  // Match all <p> tags
  const pRegex = /<p[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/p>|<p[^>]*>([\s\S]*?)<\/p>/gi;
  const pMatches = Array.from(contentHtml.matchAll(pRegex));

  if (pMatches.length > 0) {
    return [
      {
        id: "stanza-0",
        verses: pMatches.map((pMatch, idx) => {
          const text = (pMatch[2] || pMatch[3] || "").replace(/<[^>]+>/g, "").trim();
          const className = pMatch[1] || "verse";
          return { id: `v-${idx}`, text, className };
        }),
      },
    ];
  }

  // Fallback cho văn bản thuần dòng
  const lines = contentHtml.replace(/<[^>]+>/g, "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    return [
      {
        id: "stanza-0",
        verses: lines.map((text, idx) => ({ id: `v-${idx}`, text, className: "verse" })),
      },
    ];
  }

  return [];
}

export function InkVerseReader({ contentHtml, fontSize, className }: InkVerseReaderProps) {
  const prefersReduced = usePrefersReducedMotion();

  // Phân giải HTML đồng nhất giữa Server (SSR) và Client để tránh Hydration Mismatch
  const stanzas = useMemo<StanzaItem[]>(() => parsePoemContent(contentHtml), [contentHtml]);

  if (stanzas.length === 0) {
    return (
      <div
        className={cn("font-poem-verse poem-body max-w-lg mx-auto space-y-10 select-text", className)}
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
