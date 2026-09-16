"use client";

import React, { memo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSeason, Season } from "@/context/SeasonContext";
import { useReducedMotion } from "@/lib/motion";
import { playWhirlwindLeavesSound, playFrostCrunchSound } from "@/lib/nature-audio";
import { cn } from "@/lib/utils";

/* =========================================================================
   1. GLOBAL SEASONAL TONE OVERLAY (LỚP PHỦ TONE MÀU 4 MÙA NÂNG CAO)
   - Dual-layer: Perimeter Vignette đậm nét bao quanh viền màn hình + Ambient Wash
   - Không gian trung tâm trong trẻo tuyệt đối, bảo vệ tương phản đọc thơ (WCAG AAA)
   - Chuyển tiếp màu mượt mà 1200ms
   ========================================================================= */
const toneConfig: Record<Season, { vignette: string; ambient: string }> = {
  spring: {
    vignette:
      "bg-[radial-gradient(ellipse_120%_90%_at_50%_15%,transparent_35%,rgba(254,205,211,0.48)_78%,rgba(244,114,182,0.26)_100%)] dark:bg-[radial-gradient(ellipse_120%_90%_at_50%_20%,transparent_50%,rgba(244,114,182,0.12)_85%,rgba(225,29,72,0.08)_100%)]",
    ambient:
      "bg-[linear-gradient(180deg,rgba(255,228,230,0.34)_0%,rgba(254,242,242,0.16)_50%,transparent_100%)] dark:bg-[linear-gradient(180deg,rgba(244,114,182,0.06)_0%,transparent_100%)]",
  },
  summer: {
    vignette:
      "bg-[radial-gradient(ellipse_120%_95%_at_80%_10%,transparent_30%,rgba(254,240,138,0.52)_75%,rgba(245,158,11,0.30)_100%)] dark:bg-[radial-gradient(ellipse_120%_95%_at_80%_10%,transparent_45%,rgba(251,191,36,0.10)_80%,rgba(217,119,6,0.08)_100%)]",
    ambient:
      "bg-[linear-gradient(135deg,rgba(254,249,195,0.38)_0%,rgba(254,243,199,0.22)_45%,transparent_80%)] dark:bg-[linear-gradient(135deg,rgba(245,158,11,0.07)_0%,transparent_70%)]",
  },
  autumn: {
    vignette:
      "bg-[radial-gradient(ellipse_120%_95%_at_20%_20%,transparent_30%,rgba(254,215,170,0.54)_75%,rgba(234,88,12,0.32)_100%)] dark:bg-[radial-gradient(ellipse_120%_95%_at_20%_20%,transparent_45%,rgba(251,146,60,0.12)_80%,rgba(194,65,12,0.08)_100%)]",
    ambient:
      "bg-[linear-gradient(180deg,rgba(255,237,213,0.40)_0%,rgba(254,215,170,0.24)_45%,transparent_85%)] dark:bg-[linear-gradient(180deg,rgba(234,88,12,0.06)_0%,transparent_85%)]",
  },
  winter: {
    vignette:
      "bg-[radial-gradient(ellipse_120%_95%_at_50%_10%,transparent_30%,rgba(186,230,253,0.56)_75%,rgba(56,189,248,0.30)_100%)] dark:bg-[radial-gradient(ellipse_120%_95%_at_50%_10%,transparent_45%,rgba(56,189,248,0.12)_80%,rgba(14,165,233,0.08)_100%)]",
    ambient:
      "bg-[linear-gradient(180deg,rgba(224,242,254,0.44)_0%,rgba(186,230,253,0.24)_50%,transparent_90%)] dark:bg-[linear-gradient(180deg,rgba(14,165,233,0.07)_0%,transparent_90%)]",
  },
};

const SEASONS_LIST: Season[] = ["spring", "summer", "autumn", "winter"];

const SeasonToneOverlay = memo(({ season }: { season: Season }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed -top-[25vh] -bottom-[25vh] -left-[10vw] -right-[10vw] w-[120vw] min-h-[150vh] z-[1] overflow-hidden"
      style={{
        // Tối ưu GPU layer, không dùng contain:strict để tránh bị browser hoãn paint khi cuộn nhanh
        transform: "translateZ(0)",
        willChange: "opacity",
      }}
    >
      {SEASONS_LIST.map((s) => {
        const isActive = s === season;
        const current = toneConfig[s];
        return (
          <div
            key={s}
            className={cn(
              "absolute inset-0 transition-opacity duration-300 ease-out pointer-events-none",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
            style={{
              transform: "translateZ(0)",
              willChange: "opacity",
            }}
          >
            <div className={`absolute inset-0 ${current.ambient}`} />
            <div className={`absolute inset-0 ${current.vignette}`} />
          </div>
        );
      })}
    </div>
  );
});
SeasonToneOverlay.displayName = "SeasonToneOverlay";

/* =========================================================================
   2. MÙA HẠ: NẮNG CHIẾU TỎA RỘNG (EXPANDED SUMMER SUNBEAMS & GOLDEN MOTES)
   - Chùm nắng fanning phủ 75-80% viewport từ góc trên bên phải
   - Các luồng sáng volumetric ray mềm mại không gây lóa mắt
   - 12 hạt bụi phấn nắng bay lượn tạo không gian mùa hạ rực rỡ
   ========================================================================= */
const ExpandedSummerSunbeams = memo(({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden select-none"
    >
      {/* Vùng chùm nắng lan tỏa mượt mà toàn màn hình, triệt tiêu hoàn toàn viền hộp/ô vuông */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-90 transition-opacity duration-1000"
        style={{
          animation: prefersReducedMotion ? "none" : "sunbeam-pulse 10s ease-in-out infinite",
        }}
      >
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Tâm phát sáng mặt trời từ góc trên phải (1440, 0) tan dần về trong suốt */}
            <radialGradient id="expandedSunGlow" cx="100%" cy="0%" r="85%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.28" />
              <stop offset="25%" stopColor="#FDE047" stopOpacity="0.14" />
              <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.04" />
              <stop offset="90%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>

            {/* Các dải gradient tia nắng xiên tỏa rộng */}
            <linearGradient id="wideBeam1" x1="100%" y1="0%" x2="0%" y2="85%">
              <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.20" />
              <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.10" />
              <stop offset="75%" stopColor="#FBBF24" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="wideBeam2" x1="100%" y1="0%" x2="25%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.08" />
              <stop offset="85%" stopColor="#FDE68A" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="wideBeam3" x1="100%" y1="0%" x2="55%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.24" />
              <stop offset="45%" stopColor="#FEF08A" stopOpacity="0.09" />
              <stop offset="85%" stopColor="#FEF08A" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="wideBeam4" x1="100%" y1="0%" x2="75%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.16" />
              <stop offset="55%" stopColor="#FBBF24" stopOpacity="0.05" />
              <stop offset="90%" stopColor="#FBBF24" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Hào quang nền lan tỏa toàn màn hình */}
          <rect width="1440" height="900" fill="url(#expandedSunGlow)" />

          {/* Tia 1: Tia lớn tỏa rộng sang tận góc dưới trái */}
          <polygon
            points="1440,0 1280,0 0,680 0,900"
            fill="url(#wideBeam1)"
          />

          {/* Tia 2: Tia trung tâm rực rỡ */}
          <polygon
            points="1440,0 1360,0 200,900 500,900"
            fill="url(#wideBeam2)"
          />

          {/* Tia 3: Tia phụ giữa */}
          <polygon
            points="1440,0 1410,0 580,900 840,900"
            fill="url(#wideBeam3)"
          />

          {/* Tia 4: Tia góc phải */}
          <polygon
            points="1440,0 1440,140 920,900 1180,900"
            fill="url(#wideBeam4)"
          />

          {/* Tia 5: Dải mỏng lấp lánh */}
          <polygon
            points="1440,0 1440,320 1060,900 1220,900"
            fill="url(#wideBeam2)"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* 12 hạt bụi phấn nắng bay lượn đa tầng */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { id: "mote-1", right: "15%", top: "18%", size: 3.5, dur: "6.5s", del: "0s" },
            { id: "mote-2", right: "28%", top: "28%", size: 2.5, dur: "7.8s", del: "1.2s" },
            { id: "mote-3", right: "36%", top: "15%", size: 3.0, dur: "8.2s", del: "2.5s" },
            { id: "mote-4", right: "22%", top: "38%", size: 2.0, dur: "6.0s", del: "3.8s" },
            { id: "mote-5", right: "48%", top: "42%", size: 3.2, dur: "9.0s", del: "0.8s" },
            { id: "mote-6", right: "35%", top: "55%", size: 2.2, dur: "7.2s", del: "2.0s" },
            { id: "mote-7", right: "58%", top: "25%", size: 2.8, dur: "8.5s", del: "4.2s" },
            { id: "mote-8", right: "62%", top: "48%", size: 2.4, dur: "7.0s", del: "1.8s" },
            { id: "mote-9", right: "44%", top: "68%", size: 3.0, dur: "8.8s", del: "3.0s" },
            { id: "mote-10", right: "20%", top: "62%", size: 2.6, dur: "6.8s", del: "0.5s" },
            { id: "mote-11", right: "72%", top: "35%", size: 2.2, dur: "9.5s", del: "2.8s" },
            { id: "mote-12", right: "52%", top: "12%", size: 3.4, dur: "8.0s", del: "4.8s" },
          ].map((mote) => (
            <span
              key={mote.id}
              className="absolute rounded-full bg-amber-300/85 dark:bg-yellow-200/75 shadow-[0_0_8px_rgba(253,224,71,0.85)]"
              style={{
                right: mote.right,
                top: mote.top,
                width: `${mote.size}px`,
                height: `${mote.size}px`,
                animation: `sun-mote-drift ${mote.dur} ease-in-out ${mote.del} infinite`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});
ExpandedSummerSunbeams.displayName = "ExpandedSummerSunbeams";

/* =========================================================================
   3. MÙA THU: GIÓ THU MẠNH THỔI LÁ (AUTUMN STRONG GUSTS & SWIRLING LEAVES)
   - Luồng gió thu cuộn xoáy mạnh mẽ hơn qua màn hình
   - 7 chiếc lá Momiji, ngân hạnh, hổ phách chao liệng xoay tròn tự nhiên
   ========================================================================= */
const AutumnWindGusts = memo(({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden select-none"
    >
      {/* Các vệt gió cuộn xoáy phong cách thi ca */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M -150,140 C 280,240 680,60 1180,240 C 1380,310 1560,280 1680,300"
          stroke="rgba(251, 146, 60, 0.28)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="260 420"
          style={{
            animation: prefersReducedMotion ? "none" : "autumn-wind-dash 11s linear infinite",
          }}
        />
        <path
          d="M -80,340 C 400,240 850,460 1300,320 C 1480,280 1600,360 1700,340"
          stroke="rgba(254, 215, 170, 0.32)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="220 460"
          style={{
            animation: prefersReducedMotion ? "none" : "autumn-wind-dash 13s linear 2.5s infinite",
          }}
        />
        <path
          d="M -120,580 C 350,480 800,660 1240,540 C 1440,500 1560,600 1660,570"
          stroke="rgba(251, 191, 36, 0.24)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="200 440"
          style={{
            animation: prefersReducedMotion ? "none" : "autumn-wind-dash 12s linear 5s infinite",
          }}
        />
        <path
          d="M -100,760 C 380,680 750,820 1200,720 C 1400,690 1540,750 1640,730"
          stroke="rgba(249, 115, 22, 0.22)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="180 460"
          style={{
            animation: prefersReducedMotion ? "none" : "autumn-wind-dash 14s linear 7.5s infinite",
          }}
        />
        {/* Vệt gió thứ 5: Cơn gió bạt mạnh mẽ thổi bay lá */}
        <path
          d="M -200,450 C 300,520 720,380 1160,490 C 1360,540 1520,490 1680,510"
          stroke="rgba(251, 146, 60, 0.24)"
          strokeWidth="2.0"
          strokeLinecap="round"
          strokeDasharray="240 400"
          style={{
            animation: prefersReducedMotion ? "none" : "autumn-wind-dash 9.5s linear 4s infinite",
          }}
        />
      </svg>

      {/* 7 chiếc lá mùa thu chao liệng cuộn theo chiều gió */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Lá 1: Lá phong Momiji đỏ tươi tầng cao */}
          <div
            className="absolute"
            style={{
              top: "8vh",
              animation: "autumn-leaf-sweep-1 13s cubic-bezier(0.25, 1, 0.5, 1) 0s infinite",
            }}
          >
            <Image
              src="/floral/autumn-momiji-pink.png"
              alt=""
              width={34}
              height={32}
              className="drop-shadow-sm select-none"
              style={{ width: "32px", height: "auto" }}
            />
          </div>

          {/* Lá 2: Lá ngân hạnh vàng óng */}
          <div
            className="absolute"
            style={{
              top: "22vh",
              animation: "autumn-leaf-sweep-2 15s cubic-bezier(0.25, 1, 0.5, 1) 2.8s infinite",
            }}
          >
            <Image
              src="/floral/autumn-leaf-1.png"
              alt=""
              width={32}
              height={32}
              className="drop-shadow-sm select-none"
              style={{ width: "30px", height: "auto" }}
            />
          </div>

          {/* Lá 3: Lá phong hổ phách cam cháy */}
          <div
            className="absolute"
            style={{
              top: "38vh",
              animation: "autumn-leaf-sweep-1 17s cubic-bezier(0.25, 1, 0.5, 1) 6s infinite",
            }}
          >
            <Image
              src="/floral/autumn-leaf-2.png"
              alt=""
              width={30}
              height={30}
              className="drop-shadow-sm select-none"
              style={{ width: "28px", height: "auto" }}
            />
          </div>

          {/* Lá 4: Đóa hoa cúc vàng chao liệng mềm */}
          <div
            className="absolute"
            style={{
              top: "52vh",
              animation: "autumn-leaf-sweep-2 14s cubic-bezier(0.25, 1, 0.5, 1) 8.5s infinite",
            }}
          >
            <Image
              src="/floral/autumn-flower-yellow.png"
              alt=""
              width={28}
              height={27}
              className="drop-shadow-sm select-none"
              style={{ width: "27px", height: "auto" }}
            />
          </div>

          {/* Lá 5: Lá phong Momiji nhỏ nhắn chao liệng tầng dưới */}
          <div
            className="absolute"
            style={{
              top: "68vh",
              animation: "autumn-leaf-sweep-1 15s cubic-bezier(0.25, 1, 0.5, 1) 11s infinite",
            }}
          >
            <Image
              src="/floral/autumn-momiji-pink.png"
              alt=""
              width={26}
              height={25}
              className="drop-shadow-sm select-none"
              style={{ width: "25px", height: "auto" }}
            />
          </div>

          {/* Lá 6: Lá ngân hạnh tầng thấp */}
          <div
            className="absolute"
            style={{
              top: "78vh",
              animation: "autumn-leaf-sweep-2 16s cubic-bezier(0.25, 1, 0.5, 1) 13.5s infinite",
            }}
          >
            <Image
              src="/floral/autumn-leaf-1.png"
              alt=""
              width={27}
              height={27}
              className="drop-shadow-sm select-none"
              style={{ width: "25px", height: "auto" }}
            />
          </div>

          {/* Lá 7: Lá phong hổ phách vút qua */}
          <div
            className="absolute"
            style={{
              top: "16vh",
              animation: "autumn-leaf-sweep-1 14s cubic-bezier(0.25, 1, 0.5, 1) 16s infinite",
            }}
          >
            <Image
              src="/floral/autumn-leaf-2.png"
              alt=""
              width={29}
              height={29}
              className="drop-shadow-sm select-none"
              style={{ width: "27px", height: "auto" }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
AutumnWindGusts.displayName = "AutumnWindGusts";

/* =========================================================================
   3b. MÙA THU: VÀI ĐỐNG LÁ ĐỌNG TRÊN THẢM CỎ & ĐỢT GIÓ MẠNH CUỐN BAY HẾT
   - 4 đống lá tự nhiên (vài đống lá) đan xen trực tiếp trên thảm cỏ vàng úa
   - Vị trí thấp sát gốc cỏ (bottom: 2px - 8px), chừa thoáng khu vực trung tâm
   - Tỷ lệ gió mạnh tự nhiên (Probabilistic Gale Wind): Cứ mỗi 14s có tỷ lệ ~65%
     xuất hiện đợt gió mạnh quét sạch, cuốn bay tung tất cả các đống lá lên không trung
   - Âm thanh gió rít xào xạc tự nhiên (Web Audio API: playWhirlwindLeavesSound)
   - Người dùng cũng có thể nhấp chuột vào bất kỳ đống lá nào để kích hoạt tức thì
   ========================================================================= */
interface AutumnGroundLeaf {
  id: string;
  src: string;
  pile: "left" | "mid-left" | "mid-right" | "right";
  pos: { left?: string; right?: string; bottom: string };
  width: number;
  rot: number;
  delay: string;
  name: string;
  hideOnMobile?: boolean;
}

const AUTUMN_GROUND_LEAVES: AutumnGroundLeaf[] = [
  // --- ĐỐNG LÁ 1: GÓC TRÁI (VEN BỤI CỎ MÉP TRÁI) ---
  {
    id: "agl-p1-1",
    src: "/floral/autumn-leaf-1.png",
    pile: "left",
    pos: { left: "14px", bottom: "4px" },
    width: 28,
    rot: -18,
    delay: "0s",
    name: "Lá ngân hạnh vàng",
  },
  {
    id: "agl-p1-2",
    src: "/floral/autumn-momiji-pink.png",
    pile: "left",
    pos: { left: "36px", bottom: "2px" },
    width: 26,
    rot: 24,
    delay: "0.12s",
    name: "Lá phong đỏ",
  },
  {
    id: "agl-p1-3",
    src: "/floral/autumn-leaf-2.png",
    pile: "left",
    pos: { left: "58px", bottom: "6px" },
    width: 27,
    rot: -32,
    delay: "0.06s",
    name: "Lá hổ phách khô",
  },
  {
    id: "agl-p1-4",
    src: "/floral/autumn-flower-yellow.png",
    pile: "left",
    pos: { left: "80px", bottom: "3px" },
    width: 22,
    rot: 38,
    delay: "0.18s",
    name: "Đóa cúc vàng rụng",
  },

  // --- ĐỐNG LÁ 2: TRUNG TẢ (VEN THẢM CỎ PHÍA TRÁI) ---
  {
    id: "agl-p2-1",
    src: "/floral/autumn-momiji-pink.png",
    pile: "mid-left",
    pos: { left: "22%", bottom: "3px" },
    width: 25,
    rot: -12,
    delay: "0.08s",
    name: "Lá phong đỏ ven cỏ",
    hideOnMobile: true,
  },
  {
    id: "agl-p2-2",
    src: "/floral/autumn-leaf-1.png",
    pile: "mid-left",
    pos: { left: "25%", bottom: "5px" },
    width: 26,
    rot: 32,
    delay: "0.15s",
    name: "Lá ngân hạnh ven cỏ",
    hideOnMobile: true,
  },
  {
    id: "agl-p2-3",
    src: "/floral/autumn-flower-yellow.png",
    pile: "mid-left",
    pos: { left: "28%", bottom: "2px" },
    width: 21,
    rot: -20,
    delay: "0.22s",
    name: "Hoa cúc rụng ven cỏ",
    hideOnMobile: true,
  },

  // --- ĐỐNG LÁ 3: TRUNG HỮU (VEN THẢM CỎ PHÍA PHẢI) ---
  {
    id: "agl-p3-1",
    src: "/floral/autumn-leaf-2.png",
    pile: "mid-right",
    pos: { right: "22%", bottom: "3px" },
    width: 26,
    rot: 15,
    delay: "0.10s",
    name: "Lá hổ phách ven cỏ",
    hideOnMobile: true,
  },
  {
    id: "agl-p3-2",
    src: "/floral/autumn-momiji-pink.png",
    pile: "mid-right",
    pos: { right: "25%", bottom: "6px" },
    width: 25,
    rot: -28,
    delay: "0.18s",
    name: "Lá phong đỏ ven cỏ",
    hideOnMobile: true,
  },
  {
    id: "agl-p3-3",
    src: "/floral/autumn-leaf-1.png",
    pile: "mid-right",
    pos: { right: "28%", bottom: "2px" },
    width: 24,
    rot: 20,
    delay: "0.05s",
    name: "Lá ngân hạnh ven cỏ",
    hideOnMobile: true,
  },

  // --- ĐỐNG LÁ 4: GÓC PHẢI (VEN BỤI CỎ MÉP PHẢI) ---
  {
    id: "agl-p4-1",
    src: "/floral/autumn-leaf-2.png",
    pile: "right",
    pos: { right: "14px", bottom: "4px" },
    width: 28,
    rot: 24,
    delay: "0.04s",
    name: "Lá hổ phách",
  },
  {
    id: "agl-p4-2",
    src: "/floral/autumn-momiji-pink.png",
    pile: "right",
    pos: { right: "36px", bottom: "2px" },
    width: 26,
    rot: -18,
    delay: "0.14s",
    name: "Lá phong đỏ",
  },
  {
    id: "agl-p4-3",
    src: "/floral/autumn-leaf-1.png",
    pile: "right",
    pos: { right: "58px", bottom: "6px" },
    width: 27,
    rot: 30,
    delay: "0.10s",
    name: "Lá ngân hạnh vàng",
  },
  {
    id: "agl-p4-4",
    src: "/floral/autumn-flower-yellow.png",
    pile: "right",
    pos: { right: "80px", bottom: "3px" },
    width: 22,
    rot: -25,
    delay: "0.20s",
    name: "Đóa cúc vàng mùa thu",
  },
];

const AutumnGroundLeaves = memo(({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  const [isScattered, setIsScattered] = useState(false);

  const triggerWhirlwind = useCallback(() => {
    if (isScattered) return;
    playWhirlwindLeavesSound();
    setIsScattered(true);
    const timer = setTimeout(() => {
      setIsScattered(false);
    }, 4800);
    return () => clearTimeout(timer);
  }, [isScattered]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    // Kiểm tra ngẫu nhiên xuất hiện đợt gió mạnh mỗi 14 giây (tỷ lệ ~65%)
    const interval = setInterval(() => {
      if (Math.random() < 0.65) {
        triggerWhirlwind();
      }
    }, 14000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, triggerWhirlwind]);

  return (
    <div
      aria-hidden="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-35 h-12 select-none overflow-visible"
    >
      {AUTUMN_GROUND_LEAVES.map((leaf) => {
        let scatterAnimName = "leaf-whirlwind-scatter-center";
        if (leaf.pile === "left") {
          scatterAnimName = "leaf-whirlwind-scatter-left";
        } else if (leaf.pile === "right") {
          scatterAnimName = "leaf-whirlwind-scatter-right";
        }

        return (
          <button
            key={leaf.id}
            type="button"
            onClick={triggerWhirlwind}
            title={`${leaf.name} trên thảm cỏ (Nhấp để gió lốc thổi bay lá)`}
            aria-label={`${leaf.name} trên thảm cỏ, nhấp để thổi bay lá`}
            className={cn(
              "pointer-events-auto absolute transition-transform duration-200 hover:scale-125 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-full",
              leaf.hideOnMobile && "hidden sm:block"
            )}
            style={{
              ...leaf.pos,
              ["--leaf-base-rot" as string]: `${leaf.rot}deg`,
              animationName: prefersReducedMotion
                ? "none"
                : isScattered
                ? scatterAnimName
                : "leaf-drift-settle",
              animationDuration: isScattered ? "2.4s" : "2.0s",
              animationTimingFunction: isScattered
                ? "cubic-bezier(0.25, 1, 0.5, 1)"
                : "cubic-bezier(0.2, 0.8, 0.4, 1)",
              animationDelay: isScattered ? leaf.delay : "0s",
              animationFillMode: "forwards",
            }}
          >
            <Image
              src={leaf.src}
              alt=""
              width={leaf.width}
              height={leaf.width}
              className="drop-shadow-[0_2px_4px_rgba(40,20,0,0.38)] select-none opacity-92 transition-opacity duration-300 hover:opacity-100"
              style={{ width: `${leaf.width}px`, height: "auto" }}
            />
          </button>
        );
      })}
    </div>
  );
});
AutumnGroundLeaves.displayName = "AutumnGroundLeaves";

/* =========================================================================
   4. MÙA ĐÔNG: SƯƠNG LAM BẢNG LẢNG, GIÓ BẤC VÀ LÁ ĐÔNG CỨNG BÁM ĐẤT
   - Thay thế toàn bộ vết nứt băng slop bằng:
     1. Làn sương lam bảng lảng bốc lên êm đềm ở viền dưới (winter-mist-drift)
     2. Màng sương giá viền thanh nhã siêu mảnh ở 2 mép cạnh, trong suốt, hòa sắc với lớp phủ mùa
     3. Luồng gió bấc sương lạnh (blizzard chill gusts) và bụi sương tuyết mịn
     4. 12 chiếc lá đọng nhiều ở đáy màn hình, đông cứng viền sương muối (frost rime),
        bám chặt đất (không bị gió thổi bay). Khi nhấp vào phát ra âm thanh sương băng vỡ
        lách tách giòn tan (playFrostCrunchSound)
   ========================================================================= */
interface WinterFrozenLeaf {
  id: string;
  src: string;
  side: "left" | "right";
  pos: { left?: string; right?: string; bottom: string };
  width: number;
  rot: number;
  name: string;
}

const WINTER_FROZEN_LEAVES: WinterFrozenLeaf[] = [
  // Cụm góc trái nép trên thảm cỏ đông (6 lá)
  {
    id: "wfl-l1",
    src: "/floral/winter-leaf-1.png",
    side: "left",
    pos: { left: "10px", bottom: "3px" },
    width: 27,
    rot: -25,
    name: "Lá khô đông đá",
  },
  {
    id: "wfl-l2",
    src: "/floral/winter-leaf-2.png",
    side: "left",
    pos: { left: "32px", bottom: "2px" },
    width: 25,
    rot: 18,
    name: "Lá bách đông sương",
  },
  {
    id: "wfl-l3",
    src: "/floral/winter-flower-white.png",
    side: "left",
    pos: { left: "54px", bottom: "5px" },
    width: 22,
    rot: -35,
    name: "Cánh hoa tuyết mai rụng",
  },
  {
    id: "wfl-l4",
    src: "/floral/winter-leaf-1.png",
    side: "left",
    pos: { left: "78px", bottom: "3px" },
    width: 26,
    rot: 28,
    name: "Lá phong sương lạnh",
  },
  {
    id: "wfl-l5",
    src: "/floral/winter-leaf-2.png",
    side: "left",
    pos: { left: "102px", bottom: "6px" },
    width: 24,
    rot: -14,
    name: "Lá đọng sương giá",
  },
  {
    id: "wfl-l6",
    src: "/floral/winter-camellia-pink.png",
    side: "left",
    pos: { left: "126px", bottom: "2px" },
    width: 20,
    rot: 36,
    name: "Cánh trà mi đỏ lạnh",
  },
  // Cụm góc phải nép trên thảm cỏ đông (6 lá)
  {
    id: "wfl-r1",
    src: "/floral/winter-leaf-2.png",
    side: "right",
    pos: { right: "12px", bottom: "3px" },
    width: 27,
    rot: 22,
    name: "Lá đông sương",
  },
  {
    id: "wfl-r2",
    src: "/floral/winter-leaf-1.png",
    side: "right",
    pos: { right: "34px", bottom: "5px" },
    width: 25,
    rot: -28,
    name: "Lá khô đông đá",
  },
  {
    id: "wfl-r3",
    src: "/floral/winter-camellia-pink.png",
    side: "right",
    pos: { right: "58px", bottom: "2px" },
    width: 21,
    rot: 16,
    name: "Cánh sơn trà đông lạnh",
  },
  {
    id: "wfl-r4",
    src: "/floral/winter-leaf-2.png",
    side: "right",
    pos: { right: "82px", bottom: "6px" },
    width: 26,
    rot: -36,
    name: "Lá phủ sương muối",
  },
  {
    id: "wfl-r5",
    src: "/floral/winter-flower-white.png",
    side: "right",
    pos: { right: "108px", bottom: "3px" },
    width: 22,
    rot: 24,
    name: "Đóa hoa cúc lạnh rụng",
  },
  {
    id: "wfl-r6",
    src: "/floral/winter-leaf-1.png",
    side: "right",
    pos: { right: "132px", bottom: "5px" },
    width: 24,
    rot: -18,
    name: "Lá khô đóng băng",
  },
];

const WinterFrozenGroundLeaves = memo(({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  const [crunchedId, setCrunchedId] = useState<string | null>(null);

  const handleLeafCrunch = useCallback((id: string) => {
    playFrostCrunchSound();
    setCrunchedId(id);
    setTimeout(() => {
      setCrunchedId(null);
    }, 600);
  }, []);

  return (
    <div
      aria-hidden="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-35 h-12 select-none overflow-visible"
    >
      {WINTER_FROZEN_LEAVES.map((leaf) => {
        const isCrunched = crunchedId === leaf.id;

        return (
          <button
            key={leaf.id}
            type="button"
            onClick={() => handleLeafCrunch(leaf.id)}
            title={`${leaf.name} (Đông cứng - Nhấp để nghe tiếng vỡ giòn tan sương giá)`}
            aria-label={`${leaf.name}, đông cứng, nhấp để phát tiếng giòn tan`}
            className="pointer-events-auto absolute transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-300 rounded-full"
            style={{
              ...leaf.pos,
              ["--leaf-base-rot" as string]: `${leaf.rot}deg`,
              transform: `rotate(${leaf.rot}deg)`,
              animation: !prefersReducedMotion && isCrunched ? "frost-leaf-crunch 0.4s ease-in-out" : "none",
            }}
          >
            <Image
              src={leaf.src}
              alt=""
              width={leaf.width}
              height={leaf.width}
              className="drop-shadow-[0_0_5px_rgba(224,242,254,0.85)] brightness-90 saturate-75 contrast-110 select-none opacity-85 transition-all duration-200 hover:opacity-100 hover:brightness-105"
              style={{ width: `${leaf.width}px`, height: "auto" }}
            />
          </button>
        );
      })}
    </div>
  );
});
WinterFrozenGroundLeaves.displayName = "WinterFrozenGroundLeaves";

const WinterAtmosphericCold = memo(({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden select-none"
    >
      {/* 1. LÀN SƯƠNG LAM BẢNG LẢNG Ở VIỀN DƯỚI (WINTER BOTTOM MIST) */}
      <div
        className="absolute inset-x-0 bottom-0 h-36 bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(224,242,254,0.28)_0%,rgba(186,230,253,0.12)_50%,transparent_100%)] dark:bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(56,189,248,0.16)_0%,rgba(14,165,233,0.06)_50%,transparent_100%)] pointer-events-none"
        style={{
          animation: prefersReducedMotion ? "none" : "winter-mist-drift 14s ease-in-out infinite",
        }}
      />

      {/* 2. VIỀN SƯƠNG GIÁ MỜ MỊN SIÊU NHẸ Ở 2 MÉP CẠNH (TRANSLUCENT FROST VEILS) */}
      <div className="absolute top-0 left-0 bottom-0 w-[45px] sm:w-[65px] bg-gradient-to-r from-sky-100/25 via-sky-200/10 to-transparent dark:from-sky-900/20 dark:via-sky-950/10 dark:to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-[45px] sm:w-[65px] bg-gradient-to-l from-sky-100/25 via-sky-200/10 to-transparent dark:from-sky-900/20 dark:via-sky-950/10 dark:to-transparent pointer-events-none" />

      {/* 3. ĐƯỜNG TƠ SƯƠNG RẠN SIÊU MẢNH MEN GỐM RẠN Á ĐÔNG (HAIRLINE ICE CRAZE) */}
      <svg
        viewBox="0 0 100 1000"
        fill="none"
        className="absolute top-0 left-0 bottom-0 w-[45px] sm:w-[65px] h-full pointer-events-none opacity-40 dark:opacity-30"
        preserveAspectRatio="xMinYMid slice"
      >
        <path
          d="M 0,80 Q 18,160 12,250 T 22,420 T 14,580 T 20,740 T 10,910 L 0,980"
          stroke="rgba(224, 242, 254, 0.6)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <path
          d="M 12,250 Q 24,265 35,260 M 22,420 Q 36,432 46,428 M 14,580 Q 28,570 38,575"
          stroke="rgba(224, 242, 254, 0.4)"
          strokeWidth="0.35"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 100 1000"
        fill="none"
        className="absolute top-0 right-0 bottom-0 w-[45px] sm:w-[65px] h-full pointer-events-none opacity-40 dark:opacity-30"
        preserveAspectRatio="xMaxYMid slice"
      >
        <path
          d="M 100,100 Q 82,190 88,280 T 78,450 T 86,610 T 76,770 T 88,920 L 100,990"
          stroke="rgba(224, 242, 254, 0.6)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        <path
          d="M 88,280 Q 76,295 64,290 M 78,450 Q 64,462 54,458 M 86,610 Q 72,600 62,605"
          stroke="rgba(224, 242, 254, 0.4)"
          strokeWidth="0.35"
          strokeLinecap="round"
        />
      </svg>

      {/* 4. LUỒNG GIÓ BẤC SƯƠNG LẠNH (BLIZZARD CHILL GUSTS) */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M -180,180 C 250,220 680,140 1150,230 C 1350,270 1520,240 1650,250"
          stroke="rgba(224, 242, 254, 0.28)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="180 500"
          style={{
            animation: prefersReducedMotion ? "none" : "autumn-wind-dash 10s linear infinite",
          }}
        />
        <path
          d="M -120,440 C 350,380 780,480 1250,420 C 1450,390 1580,440 1680,430"
          stroke="rgba(186, 230, 253, 0.24)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeDasharray="220 480"
          style={{
            animation: prefersReducedMotion ? "none" : "autumn-wind-dash 12s linear 3s infinite",
          }}
        />
        <path
          d="M -150,680 C 280,620 720,720 1180,660 C 1380,630 1520,670 1620,660"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="200 460"
          style={{
            animation: prefersReducedMotion ? "none" : "autumn-wind-dash 11s linear 6s infinite",
          }}
        />
      </svg>

      {/* 5. BỤI SƯƠNG BĂNG TUYẾT MỊN BAY TRONG GIÓ LẠNH */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { id: "snow-1", left: "12%", top: "16%", size: 3.2, dur: "8.5s", del: "0s" },
            { id: "snow-2", left: "34%", top: "38%", size: 2.2, dur: "10.2s", del: "2s" },
            { id: "snow-3", left: "56%", top: "22%", size: 2.8, dur: "9.2s", del: "4s" },
            { id: "snow-4", left: "76%", top: "46%", size: 2.4, dur: "11.0s", del: "1.5s" },
            { id: "snow-5", left: "22%", top: "66%", size: 3.0, dur: "9.8s", del: "5s" },
            { id: "snow-6", left: "66%", top: "76%", size: 2.2, dur: "8.8s", del: "3.5s" },
            { id: "snow-7", left: "86%", top: "84%", size: 2.6, dur: "10.6s", del: "6s" },
          ].map((snow) => (
            <span
              key={snow.id}
              className="absolute rounded-full bg-white/80 dark:bg-sky-100/70 shadow-[0_0_6px_#BAE6FD]"
              style={{
                left: snow.left,
                top: snow.top,
                width: `${snow.size}px`,
                height: `${snow.size}px`,
                animation: `sun-mote-drift ${snow.dur} ease-in-out ${snow.del} infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* 6. LÁ ĐÔNG CỨNG ĐỌNG NHIỀU DƯỚI ĐÁY */}
      <WinterFrozenGroundLeaves prefersReducedMotion={prefersReducedMotion} />
    </div>
  );
});
WinterAtmosphericCold.displayName = "WinterAtmosphericCold";

/* =========================================================================
   5. MÙA XUÂN: NẮNG MAI & HẠT SƯƠNG SỚM (SPRING MORNING GLOW & DEW SPARKLES)
   ========================================================================= */
const SpringMorningGlow = memo(({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[25] overflow-hidden select-none"
    >
      {/* Vùng ánh hồng mai dịu dàng mép trên */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[88vw] max-w-[1000px] h-[250px] bg-[radial-gradient(ellipse_at_top,rgba(254,205,211,0.22)_0%,rgba(254,240,138,0.08)_50%,transparent_80%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(244,114,182,0.10)_0%,transparent_70%)]" />

      {/* Hạt sương xuân & bụi phấn hoa mai bay lên nhẹ nhàng */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { id: "dew-1", left: "15%", top: "70%", size: 3.0, dur: "7.0s", del: "0s" },
            { id: "dew-2", left: "28%", top: "82%", size: 2.2, dur: "8.5s", del: "1.5s" },
            { id: "dew-3", left: "45%", top: "75%", size: 2.8, dur: "6.8s", del: "3.2s" },
            { id: "dew-4", left: "68%", top: "85%", size: 2.4, dur: "9.0s", del: "0.8s" },
            { id: "dew-5", left: "82%", top: "72%", size: 3.2, dur: "7.5s", del: "2.5s" },
            { id: "dew-6", left: "38%", top: "60%", size: 2.5, dur: "8.0s", del: "4.0s" },
            { id: "dew-7", left: "58%", top: "65%", size: 3.0, dur: "7.2s", del: "2.0s" },
          ].map((dew) => (
            <span
              key={dew.id}
              className="absolute rounded-full bg-rose-200/85 dark:bg-pink-300/65 shadow-[0_0_8px_rgba(251,113,133,0.75)]"
              style={{
                left: dew.left,
                top: dew.top,
                width: `${dew.size}px`,
                height: `${dew.size}px`,
                animation: `spring-dew-float ${dew.dur} ease-in-out ${dew.del} infinite`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});
SpringMorningGlow.displayName = "SpringMorningGlow";

/* =========================================================================
   6. COMPONENT TỔNG HỢP KHÔNG KHÍ 4 MÙA (SEASON ATMOSPHERE)
   - Tách biệt: Layer màu nền (z-[1]) & Layer hiệu ứng động nổi trên trang (z-[25])
   - Hiệu ứng nổi bật khắp trang chủ nhưng không cản trở tương tác click
   ========================================================================= */
export function SeasonAtmosphere() {
  const { season } = useSeason();
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* Lớp phủ tone màu toàn trang web theo mùa (z-[1]) */}
      <SeasonToneOverlay season={season} />

      {/* Hiệu ứng không khí đặc trưng của từng mùa (z-[25] pointer-events-none) */}
      {season === "summer" && <ExpandedSummerSunbeams prefersReducedMotion={prefersReducedMotion} />}
      {season === "autumn" && (
        <>
          <AutumnWindGusts prefersReducedMotion={prefersReducedMotion} />
          <AutumnGroundLeaves prefersReducedMotion={prefersReducedMotion} />
        </>
      )}
      {season === "winter" && <WinterAtmosphericCold prefersReducedMotion={prefersReducedMotion} />}
      {season === "spring" && <SpringMorningGlow prefersReducedMotion={prefersReducedMotion} />}
    </>
  );
}
