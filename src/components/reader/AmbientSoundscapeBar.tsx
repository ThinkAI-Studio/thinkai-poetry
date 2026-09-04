"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { CloudRain, Wind, Bell, Waves, Volume2, VolumeX, X, Heart } from "lucide-react";
import { AMBIENT_SOUNDSCAPES } from "@/constants/soundscapes";
import { SoundscapeType } from "@/types/audio";
import { SPRINGS } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AmbientSoundscapeBarProps {
  poemId: string;
  poemTitle: string;
  onDismiss?: () => void;
  className?: string;
}

export function AmbientSoundscapeBar({
  poemId,
  poemTitle,
  onDismiss,
  className,
}: AmbientSoundscapeBarProps) {
  const [activeSound, setActiveSound] = useState<SoundscapeType | null>(null);
  const [volume, setVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(28);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [notified, setNotified] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleSound = (soundId: SoundscapeType) => {
    if (activeSound === soundId) {
      // Tắt âm cảnh
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setActiveSound(null);
    } else {
      // Bật âm cảnh mới
      const preset = AMBIENT_SOUNDSCAPES.find((s) => s.id === soundId);
      if (preset && audioRef.current) {
        audioRef.current.src = preset.audioSrc;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(() => {});
        setActiveSound(soundId);
      }
    }
  };

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvoteCount((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const currentPreset = AMBIENT_SOUNDSCAPES.find((s) => s.id === activeSound);

  const renderIcon = (name: string, isActive: boolean) => {
    const iconProps = { className: cn("w-4 h-4", isActive ? "text-white" : "text-neutral-600 dark:text-neutral-300") };
    switch (name) {
      case "CloudRain":
        return <CloudRain {...iconProps} />;
      case "Wind":
        return <Wind {...iconProps} />;
      case "Bell":
        return <Bell {...iconProps} />;
      case "Waves":
        return <Waves {...iconProps} />;
      default:
        return <Volume2 {...iconProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={SPRINGS.responsive}
      className={cn(
        "tai-card p-5 sm:p-6 mb-8 border border-[#2D5A3D]/25 dark:border-emerald-500/20 shadow-sm relative overflow-hidden rounded-2xl",
        className
      )}
    >
      <audio ref={audioRef} loop preload="none" />

      {/* Header bar: Tiêu đề + Volume + Nút đóng */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2D5A3D] dark:bg-[#4ade80] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#2D5A3D] dark:text-[#4ade80]">
            Không Gian Thư Giãn Khi Đọc Thơ
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
              title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 sm:w-20 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#2D5A3D] dark:accent-[#4ade80]"
              aria-label="Âm lượng âm cảnh"
            />
          </div>

          {/* Dismiss Button */}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Thu gọn thanh âm cảnh"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Nút Âm Cảnh Zen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
        {AMBIENT_SOUNDSCAPES.map((sound) => {
          const isActive = activeSound === sound.id;
          return (
            <button
              key={sound.id}
              type="button"
              onClick={() => toggleSound(sound.id)}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left relative overflow-hidden group",
                isActive
                  ? "bg-[#2D5A3D] text-white border-[#2D5A3D] shadow-sm font-medium"
                  : "bg-white/70 dark:bg-[#16161a]/70 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "bg-white/20" : "bg-neutral-100 dark:bg-neutral-800"
                )}
              >
                {renderIcon(sound.iconName, isActive)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-serif font-bold truncate leading-tight">
                  {sound.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-mono truncate leading-tight mt-0.5",
                    isActive ? "text-white/80" : "text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  {sound.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dòng trạng thái khi âm thanh đang phát hoặc ghi chú bản ngâm */}
      <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="font-serif italic text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
          {currentPreset ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3D] dark:bg-[#4ade80] animate-ping" />
              Đang phát âm cảnh: <strong>{currentPreset.label}</strong> ({currentPreset.sublabel})
            </span>
          ) : (
            <span>🎙️ Thi phẩm này đang chờ nghệ sĩ thu âm bản ngâm chính thức.</span>
          )}
        </div>

        {/* Nút tương tác cộng đồng: Đề xuất ưu tiên ngâm thơ & Báo khi có bản thu */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleUpvote}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono transition-colors cursor-pointer",
              hasUpvoted
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-semibold"
                : "bg-white dark:bg-[#16161a] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            )}
            title="Độc giả mong muốn có bản ngâm thơ này"
          >
            <Heart className={cn("w-3 h-3", hasUpvoted && "fill-current text-rose-500")} />
            <span>Mong muốn bản ngâm ({upvoteCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setNotified(true)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#16161a] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
          >
            <Bell className="w-3 h-3" />
            <span>{notified ? "Đã ghi nhận ✓" : "Báo tôi khi có"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
