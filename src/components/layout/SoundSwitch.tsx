"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  isPageTurnSoundEnabled,
  setPageTurnSoundEnabled,
  playPageTurnSound,
} from "@/lib/book-audio";

export interface SoundSwitchProps {
  className?: string;
  id?: string;
}

export function SoundSwitch({ className, id }: SoundSwitchProps) {
  const [mounted, setMounted] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wind-sound-enabled");
    if (saved !== null) {
      const enabled = saved === "true";
      setPageTurnSoundEnabled(enabled);
      setSoundOn(enabled);
    } else {
      setSoundOn(isPageTurnSoundEnabled());
    }
  }, []);

  const handleToggle = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setPageTurnSoundEnabled(nextState);
    try {
      localStorage.setItem("wind-sound-enabled", String(nextState));
    } catch {}

    if (nextState) {
      // Gentle auditory preview confirmation
      playPageTurnSound(0.2);
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-full border border-neutral-300/60 dark:border-white/10 opacity-60",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={soundOn}
      aria-label={soundOn ? "Tắt âm thanh lật trang sách" : "Bật âm thanh lật trang sách"}
      title={
        soundOn
          ? "Âm thanh giấy lật đang BẬT — Nhấn để tắt"
          : "Âm thanh giấy lật đang TẮT — Nhấn để nghe tiếng sột soạt lật trang"
      }
      onClick={handleToggle}
      className={cn(
        "impeccable-touch-target relative inline-flex items-center justify-center w-8 h-8 rounded-full border select-none cursor-pointer transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
        "active:scale-90",
        soundOn
          ? "border-amber-900/20 dark:border-[var(--accent-gold)]/30 bg-white/90 dark:bg-[#181816]/90 text-[var(--accent-green)] dark:text-[var(--accent-gold)] shadow-2xs hover:shadow-xs"
          : "border-neutral-300/70 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300",
        className
      )}
    >
      {soundOn ? (
        <Volume2 className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 group-hover:scale-110" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 stroke-[2] opacity-75" />
      )}
    </button>
  );
}
