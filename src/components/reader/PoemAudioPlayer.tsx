"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PoemAudioPlayerProps {
  audioUrl?: string;
  poemTitle?: string;
  authorName?: string;
  className?: string;
}

export function PoemAudioPlayer({
  audioUrl,
  poemTitle = "Ngâm Thơ",
  authorName = "Thịnh (Wind)",
  className,
}: PoemAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        // Autoplay may be restricted
      });
      setIsPlaying(true);
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#181816]/90 border border-amber-950/10 dark:border-white/10 shadow-xs backdrop-blur-md select-none",
        className
      )}
      role="region"
      aria-label={`Bộ phát âm thanh ngâm thơ: ${poemTitle}`}
    >
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}

      {/* Header thông tin bài thơ */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] shrink-0 animate-pulse" />
          <span className="font-poem-heading text-sm font-semibold text-neutral-800 dark:text-[#EAE6DF] truncate">
            {poemTitle}
          </span>
          <span className="text-[11px] font-serif text-neutral-500 dark:text-neutral-400 truncate">
            · {authorName}
          </span>
        </div>

        <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 tabular-nums shrink-0 ml-2">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Thanh Scrubber thời lượng tương tác */}
      <div
        ref={progressRef}
        onClick={handleSeek}
        className="impeccable-touch-target relative w-full h-2 rounded-full bg-neutral-200/80 dark:bg-white/10 cursor-pointer overflow-hidden group"
        role="progressbar"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-gold)] dark:from-[var(--accent-gold)] dark:to-amber-300 rounded-full transition-[width] duration-100 group-hover:brightness-110"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Hàng điều khiển nút bấm xúc giác Impeccable */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleRestart}
          title="Nghe lại từ đầu"
          className="impeccable-touch-target min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-800 dark:hover:text-[#EAE6DF] hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          aria-label="Nghe lại từ đầu"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Nút Play/Pause trung tâm với cơ học bấm lún */}
        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? "Tạm dừng" : "Phát ngâm thơ"}
          className="impeccable-touch-target min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[var(--accent-green)] dark:bg-[var(--accent-gold)] text-white dark:text-neutral-950 flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          aria-label={isPlaying ? "Tạm dừng ngâm thơ" : "Phát ngâm thơ"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current stroke-[1.5]" />
          ) : (
            <Play className="w-4 h-4 fill-current stroke-[1.5] translate-x-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          className="impeccable-touch-target min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-800 dark:hover:text-[#EAE6DF] hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 opacity-70" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
