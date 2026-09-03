"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioReciterBarProps {
  audioUrl: string;
  title?: string;
  className?: string;
}

export function AudioReciterBar({
  audioUrl,
  title = "Bản thu âm ngâm thơ",
  className,
}: AudioReciterBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const target = Number(e.target.value);
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  return (
    <div
      className={cn(
        "tai-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none my-6",
        "border-l-4 border-l-[#2D5A3D]",
        className
      )}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Thông tin bài ngâm & Sóng âm */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={togglePlay}
          className="w-11 h-11 flex items-center justify-center bg-[#2D5A3D] hover:bg-[#234730] text-white rounded-none transition-transform active:scale-95 shrink-0 shadow-md cursor-pointer"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#2D5A3D] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-600 dark:text-neutral-400">
              Ngâm Thơ Diễn Cảm
            </span>
          </div>
          <span className="text-sm font-serif font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">
            {title}
          </span>
        </div>
      </div>

      {/* Waveform Equalizer Visualizer */}
      <div className="flex items-center gap-1 h-6 shrink-0 px-2">
        {[40, 75, 100, 60, 90, 45, 80, 50, 70, 95].map((h, i) => (
          <span
            key={i}
            className="w-1 bg-[#2D5A3D] rounded-full transition-all duration-200"
            style={{
              height: isPlaying ? `${Math.max(15, (h * (Math.sin(currentTime * 4 + i) + 1.2)) / 2.2)}%` : "20%",
              opacity: isPlaying ? 0.9 : 0.35,
            }}
          />
        ))}
      </div>

      {/* Thanh tiến độ & Thời gian */}
      <div className="flex items-center gap-3 w-full sm:w-64">
        <span className="text-[11px] font-mono text-neutral-500 w-8 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 accent-[#2D5A3D] cursor-pointer"
        />
        <span className="text-[11px] font-mono text-neutral-500 w-8">
          {formatTime(duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
