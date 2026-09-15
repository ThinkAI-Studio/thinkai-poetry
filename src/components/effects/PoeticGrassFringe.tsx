"use client";

import React, { useMemo, memo } from "react";
import { useSeason } from "@/context/SeasonContext";
import { useReadingZone } from "@/hooks/useReadingZone";
import { playLeafRustleSound } from "@/lib/nature-audio";
import { cn } from "@/lib/utils";

interface BladePath {
  path: string;
  isBackground: boolean;
  accentType?: "dew" | "seed" | "pampas";
  tipX: number;
  tipY: number;
}

export function PoeticGrassFringe({
  isVisible,
  className,
}: {
  isVisible?: boolean;
  className?: string;
}) {
  const { season } = useSeason();
  const isReadingZone = useReadingZone();
  const active = isVisible !== undefined ? isVisible : true;

  const handleGrassHover = () => {
    playLeafRustleSound("grass", 0.09);
  };

  // Màu sắc thực vật 4 mùa theo cảm hứng thi ca Á Đông
  const palette = useMemo(() => {
    switch (season) {
      case "spring":
        return {
          base: "#166534",
          mid: "#22C55E",
          tip: "#86EFAC",
          accent: "#FFFFFF",
          accentGlow: "rgba(255, 255, 255, 0.6)",
        };
      case "summer":
        return {
          base: "#064E3B",
          mid: "#059669",
          tip: "#6EE7B7",
          accent: "#FEF08A",
          accentGlow: "rgba(254, 240, 138, 0.6)",
        };
      case "autumn":
        return {
          base: "#78350F",
          mid: "#D97706",
          tip: "#FDE68A",
          accent: "#FEF9C3",
          accentGlow: "rgba(254, 249, 195, 0.6)",
        };
      case "winter":
      default:
        return {
          base: "#1E293B",
          mid: "#64748B",
          tip: "#CBD5E1",
          accent: "#FFFFFF",
          accentGlow: "rgba(224, 242, 254, 0.8)",
        };
    }
  }, [season]);

  // Sinh 32 bụi cỏ (grass tufts) đan xen tự nhiên qua chiều ngang 1200px
  const grassPaths = useMemo<BladePath[]>(() => {
    const blades: BladePath[] = [];
    const totalTufts = 32;

    for (let t = 0; t < totalTufts; t++) {
      const tuftCenterX = (t / (totalTufts - 1)) * 1180 + 10;
      // Sinh 3 - 5 lá cỏ cho mỗi bụi cỏ
      const bladeCount = 3 + (t % 3);

      for (let b = 0; b < bladeCount; b++) {
        const seed = Math.sin(t * 17.123 + b * 43.456);
        const randCurve = Math.cos(t * 29.789 + b * 11.234);

        // Chiều cao tự nhiên: 12px đến 30px (viewBox h = 42)
        const height = 13 + Math.abs(seed) * 16;
        const width = 1.8 + Math.abs(randCurve) * 1.4;
        const curveOffset = randCurve * 14;

        const baseX = tuftCenterX + (b - (bladeCount - 1) / 2) * 5;
        const tipX = baseX + curveOffset;
        const tipY = 42 - height;

        const leftBase = baseX - width / 2;
        const rightBase = baseX + width / 2;
        const ctrl1X = baseX + curveOffset * 0.45;
        const ctrl1Y = 42 - height * 0.55;
        const ctrl2X = baseX + curveOffset * 0.55;
        const ctrl2Y = 42 - height * 0.45;

        // Vẽ phiến cỏ vuốt thon hình nét bút lông thư pháp (rộng ở gốc, vuốt nhọn ở chóp)
        const d = `M ${leftBase.toFixed(1)},42 C ${ctrl1X.toFixed(1)},${ctrl1Y.toFixed(1)} ${(tipX - 0.3).toFixed(1)},${(tipY + 1).toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} C ${(tipX + 0.3).toFixed(1)},${(tipY + 1).toFixed(1)} ${ctrl2X.toFixed(1)},${ctrl2Y.toFixed(1)} ${rightBase.toFixed(1)},42 Z`;

        const isBg = b % 2 === 0 && height < 20;

        // Điểm xuyết bông cỏ may / hạt cỏ lau ở các ngọn cỏ cao
        let accentType: "dew" | "seed" | "pampas" | undefined = undefined;
        if (height > 22 && (t + b) % 4 === 0) {
          accentType = season === "autumn" ? "pampas" : season === "spring" ? "dew" : "seed";
        }

        blades.push({
          path: d,
          isBackground: isBg,
          accentType,
          tipX,
          tipY,
        });
      }
    }

    return blades;
  }, [season]);

  return (
    <div
      aria-hidden="true"
      onMouseEnter={handleGrassHover}
      onMouseMove={handleGrassHover}
      title="Dải cỏ thi ca ven đáy (Rê chuột để nghe tiếng cỏ xào xạc)"
      style={{
        transform: active ? "translate3d(0, 0, 0)" : "translate3d(0, 100%, 0)",
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease",
      }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 h-8 sm:h-9 select-none overflow-hidden cursor-pointer pointer-events-none",
        className
      )}
    >
      {/* Lớp sương mỏng chân cỏ tạo độ chuyển mềm mại không gắt đáy */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />

      <svg
        viewBox="0 0 1200 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradient màu phiến cỏ từ gốc sẫm lên chóp tươi */}
          <linearGradient id="poeticGrassBladeGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={palette.base} stopOpacity="0.8" />
            <stop offset="55%" stopColor={palette.mid} stopOpacity="0.95" />
            <stop offset="100%" stopColor={palette.tip} stopOpacity="1" />
          </linearGradient>

          {/* Gradient lá cỏ nền mờ ảo tạo chiều sâu */}
          <linearGradient id="poeticGrassBgGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={palette.base} stopOpacity="0.55" />
            <stop offset="100%" stopColor={palette.mid} stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* TẦNG 1: LỚP CỎ NỀN ĐAN XEN TẠO ĐỘ DÀY (BACKGROUND) */}
        <g opacity="0.75">
          {grassPaths
            .filter((b) => b.isBackground)
            .map((blade, idx) => (
              <path key={`bg-${idx}`} d={blade.path} fill="url(#poeticGrassBgGrad)" />
            ))}
        </g>

        {/* TẦNG 2: CÁC PHIẾN CỎ TIỀN CẢNH VUỐT THON MỀM MẠI (FOREGROUND) */}
        <g>
          {grassPaths
            .filter((b) => !b.isBackground)
            .map((blade, idx) => (
              <g key={`fg-${idx}`}>
                <path d={blade.path} fill="url(#poeticGrassBladeGrad)" />

                {/* Điểm xuyết: Giọt sương mai / Hạt cỏ may / Bông cỏ lau mềm */}
                {blade.accentType === "dew" && (
                  <circle
                    cx={blade.tipX}
                    cy={blade.tipY - 0.5}
                    r="1.2"
                    fill={palette.accent}
                    opacity="0.9"
                  />
                )}
                {blade.accentType === "seed" && (
                  <ellipse
                    cx={blade.tipX}
                    cy={blade.tipY - 0.8}
                    rx="1.1"
                    ry="2.0"
                    transform={`rotate(${blade.tipX % 20 - 10} ${blade.tipX} ${blade.tipY})`}
                    fill={palette.accent}
                    opacity="0.88"
                  />
                )}
                {blade.accentType === "pampas" && (
                  <g transform={`translate(${blade.tipX}, ${blade.tipY}) rotate(${blade.tipX % 24 - 12})`}>
                    <ellipse cx="0" cy="-2.5" rx="1.4" ry="3.5" fill={palette.accent} opacity="0.85" />
                    <circle cx="-0.8" cy="-1.5" r="0.8" fill={palette.tip} opacity="0.75" />
                    <circle cx="0.8" cy="-3.5" r="0.8" fill={palette.tip} opacity="0.75" />
                  </g>
                )}
              </g>
            ))}
        </g>
      </svg>
    </div>
  );
}
