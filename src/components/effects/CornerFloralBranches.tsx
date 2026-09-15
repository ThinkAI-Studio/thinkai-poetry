"use client";

import React, { useState, useEffect, useMemo, memo, useId } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/motion";
import { useSeason, Season } from "@/context/SeasonContext";
import { useReadingZone } from "@/hooks/useReadingZone";
import { playLeafRustleSound, playBranchShakeSound } from "@/lib/nature-audio";
import { cn } from "@/lib/utils";

/* =========================================================================
   1. BẢNG TÀI NGUYÊN SORA LATTICE RASTER 4 MÙA (100% LATTICE ASSETS)
   ========================================================================= */
const seasonalAssetMap: Record<Season, { pink: string; yellow: string; leaf1: string; leaf2: string }> = {
  spring: {
    pink: "/floral/flower-pink.png",
    yellow: "/floral/flower-yellow.png",
    leaf1: "/floral/leaf-1.png",
    leaf2: "/floral/leaf-2.png",
  },
  summer: {
    pink: "/floral/summer-lotus-pink.png",
    yellow: "/floral/summer-flower-yellow.png",
    leaf1: "/floral/summer-leaf-1.png",
    leaf2: "/floral/summer-leaf-2.png",
  },
  autumn: {
    pink: "/floral/autumn-momiji-pink.png",
    yellow: "/floral/autumn-flower-yellow.png",
    leaf1: "/floral/autumn-leaf-1.png",
    leaf2: "/floral/autumn-leaf-2.png",
  },
  winter: {
    pink: "/floral/winter-camellia-pink.png",
    yellow: "/floral/winter-flower-white.png",
    leaf1: "/floral/winter-leaf-1.png",
    leaf2: "/floral/winter-leaf-2.png",
  },
};

/* =========================================================================
   2. CÀNH HOA THƯ PHÁP THANH NHÃ (DELICATE CALLIGRAPHIC FLORAL BRANCH)
   - Thân cành thanh mảnh (stroke 1.5px - 2.5px), uốn lượn phong cách thủy mặc
   - Trên các nhánh dăm gắn trực tiếp các đóa hoa và lá Sora Lattice raster
   - Đồng bộ hoàn toàn với phong cách Sora Lattice 100%
   ========================================================================= */
interface BranchSvgProps {
  side: "left" | "right";
  season: Season;
}

const DelicateFloralBranchSvg = memo(({ side, season }: BranchSvgProps) => {
  const assets = seasonalAssetMap[season] || seasonalAssetMap.spring;
  const isLeft = side === "left";
  const gradId = useId();

  // Bảng màu thân cành theo mùa (Mực tàu cổ, cành liễu, cành phong, cành tuyết mai)
  const barkConfig = {
    spring: {
      start: "#23120C",
      mid: "#452418",
      end: "#653723",
      ridge: "#8D533A",
      calyx: "#26130D",
      bud: "#F472B6",
      frost: null,
    },
    summer: {
      start: "#0F2012",
      mid: "#18361E",
      end: "#274D2D",
      ridge: "#3E7346",
      calyx: "#102313",
      bud: "#F43F5E",
      frost: null,
    },
    autumn: {
      start: "#22100A",
      mid: "#3C1D13",
      end: "#552B1C",
      ridge: "#7E432E",
      calyx: "#220F09",
      bud: "#F59E0B",
      frost: null,
    },
    winter: {
      start: "#121720",
      mid: "#1E2938",
      end: "#2F3E50",
      ridge: "#5A6E85",
      calyx: "#131A24",
      bud: "#E2E8F0",
      frost: "rgba(226, 232, 240, 0.75)",
    },
  }[season];

  return (
    <svg
      viewBox="0 0 490 410"
      fill="none"
      className="w-full h-full select-none pointer-events-none drop-shadow-sm"
      preserveAspectRatio={isLeft ? "xMinYMin meet" : "xMaxYMin meet"}
    >
      <defs>
        <linearGradient id={`branchBark-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={barkConfig.start} />
          <stop offset="50%" stopColor={barkConfig.mid} />
          <stop offset="100%" stopColor={barkConfig.end} />
        </linearGradient>
        <linearGradient id={`branchRidge-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={barkConfig.ridge} stopOpacity="0.85" />
          <stop offset="100%" stopColor={barkConfig.ridge} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Nhóm lật gương cho bên phải */}
      <g transform={isLeft ? undefined : "scale(-1, 1) translate(-490, 0)"}>
        {/* --- TẦNG 1: HẬU CẢNH MỜ ẢO TẠO CHIỀU SÂU (BACKGROUND DEPTH TWIGS) --- */}
        <g opacity="0.4">
          <path
            d="M 35,-8 Q 140,16 250,6 T 390,-8"
            stroke={`url(#branchBark-${gradId})`}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 55,38 Q 45,140 22,230"
            stroke={`url(#branchBark-${gradId})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Hoa hậu cảnh mờ */}
          <image href={assets.yellow} x={235} y={-8} width={22} height={22} opacity="0.75" />
          <image href={assets.pink} x={375} y={-22} width={24} height={24} opacity="0.7" />
          <image href={assets.leaf1} x={18} y={220} width={20} height={20} opacity="0.65" />
        </g>

        {/* --- TẦNG 2: THÂN CHÍNH KHÉP KÍN CỔ THỤ CÓ ĐỘ THUÔN SINH HỌC (TAPERED TRUNK) --- */}
        {/* Thân cành mẹ: gốc dày 14px thuôn mượt về 3.5px ở ngọn */}
        <path
          d="M -15,4 C 45,6 115,28 185,72 C 255,116 320,178 395,218 C 435,236 462,233 485,232
             C 485,236 460,241 425,228 C 355,188 290,126 220,82 C 150,38 80,18 -15,18 Z"
          fill={`url(#branchBark-${gradId})`}
        />

        {/* Sống lưng khối 3D (Top-Ridge Highlight) */}
        <path
          d="M -10,8 C 50,9 120,31 190,75 C 260,119 324,181 398,221 C 432,237 458,234 480,233"
          stroke={`url(#branchRidge-${gradId})`}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Viền băng tuyết phủ trên sống cành mùa đông */}
        {barkConfig.frost && (
          <path
            d="M -10,7 C 50,8 120,30 190,74 C 260,118 324,180 398,220 C 432,236 458,233 480,232"
            stroke={barkConfig.frost}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        )}

        {/* --- TẦNG 3: NHÁNH THỨ CẤP VỮNG CHÃI & CÀNH DĂM SẮC NÉT --- */}
        {/* 1. Nhánh thứ cấp vươn ngang trên (4.8px -> 3.2px) */}
        <path
          d="M 115,38 Q 165,18 235,16 Q 295,14 365,5"
          stroke={`url(#branchBark-${gradId})`}
          strokeWidth="4.8"
          strokeLinecap="round"
        />
        <path
          d="M 235,16 Q 275,-5 335,-8"
          stroke={`url(#branchBark-${gradId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 285,50 Q 335,34 390,38"
          stroke={`url(#branchBark-${gradId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* 2. Nhánh thứ cấp giữa thân (4.2px -> 3.0px) */}
        <path
          d="M 195,76 Q 235,55 305,62"
          stroke={`url(#branchBark-${gradId})`}
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M 330,178 Q 365,215 375,275"
          stroke={`url(#branchBark-${gradId})`}
          strokeWidth="3.0"
          strokeLinecap="round"
        />

        {/* 3. Nhánh thứ cấp rủ xuống dưới (5.0px -> 3.0px) */}
        <path
          d="M 260,126 C 248,175 224,220 200,265 C 180,300 170,340 165,385"
          stroke={`url(#branchBark-${gradId})`}
          strokeWidth="4.8"
          strokeLinecap="round"
        />
        <path
          d="M 224,220 Q 255,255 260,305"
          stroke={`url(#branchBark-${gradId})`}
          strokeWidth="3.0"
          strokeLinecap="round"
        />
        <path
          d="M 200,265 Q 170,285 145,335"
          stroke={`url(#branchBark-${gradId})`}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* --- TẦNG 4: CUỐNG HOA & ĐÀI HOA THỰC VẬT HỌC (PEDICELS & CALYXES) --- */}
        {/* Cuống nối vào hoa đỉnh */}
        <path d="M 345,6 Q 348,0 350,-8" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M 347,-6 Q 350,-9 353,-6" stroke={barkConfig.calyx} strokeWidth="2.2" strokeLinecap="round" />

        {/* Cuống nối hoa ngang */}
        <path d="M 230,16 Q 232,11 235,6" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M 372,36 Q 376,31 380,26" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />

        {/* Cuống nối hoa giữa thân */}
        <path d="M 135,33 Q 140,31 145,30" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M 288,58 Q 291,55 295,52" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />

        {/* Cuống & Đài hoa chính đại trung tâm */}
        <path d="M 215,82 Q 220,87 225,92" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 221,94 Q 225,89 229,94" stroke={barkConfig.calyx} strokeWidth="2.4" strokeLinecap="round" />

        {/* Cuống cụm ngọn */}
        <path d="M 318,152 Q 321,148 325,145" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M 405,224 Q 410,221 415,218" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M 462,231 Q 466,228 470,226" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />

        {/* Cuống cụm nhánh rủ */}
        <path d="M 238,192 Q 241,188 245,185" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M 252,301 Q 253,298 255,295" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M 164,372 Q 163,376 162,380" stroke={`url(#branchBark-${gradId})`} strokeWidth="2.6" strokeLinecap="round" />

        {/* --- TẦNG 5: NỤ HOA SINH THÁI ĐIỂM XUYẾT (ECOLOGICAL BUDS) --- */}
        {/* Nụ 1: Đầu cành ngang trên */}
        <g transform="translate(370, 4) rotate(15)">
          <circle cx="0" cy="0" r="3.2" fill={barkConfig.bud} opacity="0.95" />
          <path d="M -2,2 Q 0,4 2,2" stroke={barkConfig.calyx} strokeWidth="1.4" fill="none" />
        </g>
        {/* Nụ 2: Chồi hé trên nhánh dăm */}
        <g transform="translate(395, 41) rotate(-20)">
          <circle cx="0" cy="0" r="2.8" fill={barkConfig.bud} opacity="0.9" />
          <path d="M -1.8,1.8 Q 0,3.5 1.8,1.8" stroke={barkConfig.calyx} strokeWidth="1.2" fill="none" />
        </g>
        {/* Nụ 3: Đầu nhánh rủ dưới */}
        <g transform="translate(138, 342) rotate(35)">
          <circle cx="0" cy="0" r="3.0" fill={barkConfig.bud} opacity="0.92" />
          <path d="M -2,2 Q 0,3.8 2,2" stroke={barkConfig.calyx} strokeWidth="1.3" fill="none" />
        </g>

        {/* --- TẦNG 6: HOA & LÁ SORA LATTICE GẮN CHẮC CHẮN TRÊN MẤU CÀNH --- */}
        {/* 1. Cặp hoa đỉnh trên */}
        <g transform="translate(350, -8) rotate(15)">
          <image href={assets.pink} x={-16} y={-16} width={34} height={34} />
        </g>
        {season !== "winter" && (
          <g transform="translate(325, -20) rotate(-25)">
            <image href={assets.leaf1} x={-11} y={-11} width={24} height={24} />
          </g>
        )}

        {/* 2. Cụm nhánh ngang trên */}
        <g transform="translate(235, 6) rotate(-12)">
          <image href={assets.yellow} x={-14} y={-14} width={30} height={30} />
        </g>
        <g transform="translate(380, 26) rotate(22)">
          <image href={assets.pink} x={-15} y={-15} width={32} height={32} />
        </g>
        {season !== "winter" && (
          <g transform="translate(400, 36) rotate(45)">
            <image href={assets.leaf2} x={-10} y={-10} width={22} height={22} />
          </g>
        )}

        {/* 3. Cụm nhánh giữa thân */}
        <g transform="translate(145, 30) rotate(8)">
          <image href={assets.pink} x={-15} y={-15} width={32} height={32} />
        </g>
        {season !== "winter" && (
          <g transform="translate(125, 46) rotate(-30)">
            <image href={assets.leaf1} x={-11} y={-11} width={23} height={23} />
          </g>
        )}
        <g transform="translate(295, 52) rotate(18)">
          <image href={assets.yellow} x={-14} y={-14} width={30} height={30} />
        </g>

        {/* 4. Đóa hoa lớn nở rộ trung tâm cành */}
        <g transform="translate(225, 92) rotate(-10)">
          <image href={assets.pink} x={-18} y={-18} width={38} height={38} />
        </g>
        {season !== "winter" && (
          <g transform="translate(252, 105) rotate(35)">
            <image href={assets.leaf2} x={-12} y={-12} width={25} height={25} />
          </g>
        )}

        {/* 5. Cụm ngọn cành vươn ra khung màn hình */}
        <g transform="translate(325, 145) rotate(14)">
          <image href={assets.yellow} x={-15} y={-15} width={32} height={32} />
        </g>
        <g transform="translate(415, 218) rotate(-16)">
          <image href={assets.pink} x={-17} y={-17} width={36} height={36} />
        </g>
        <g transform="translate(470, 226) rotate(25)">
          <image href={assets.yellow} x={-13} y={-13} width={28} height={28} />
        </g>
        {/* Duy nhất 1 chiếc lá khô co quắp bám sót lại trên cành mùa đông, các mùa khác hiển thị đầy đặn */}
        <g transform="translate(490, 230) rotate(-10)">
          <image
            href={assets.leaf1}
            x={-11}
            y={-11}
            width={season === "winter" ? 17 : 23}
            height={season === "winter" ? 17 : 23}
            opacity={season === "winter" ? 0.6 : 1}
          />
        </g>

        {/* 6. Cụm nhánh rủ xuống tao nhã */}
        <g transform="translate(245, 185) rotate(-25)">
          <image href={assets.pink} x={-15} y={-15} width={32} height={32} />
        </g>
        {season !== "winter" && (
          <g transform="translate(268, 202) rotate(40)">
            <image href={assets.leaf2} x={-11} y={-11} width={24} height={24} />
          </g>
        )}
        <g transform="translate(255, 295) rotate(16)">
          <image href={assets.yellow} x={-14} y={-14} width={30} height={30} />
        </g>
        {season !== "winter" && (
          <g transform="translate(142, 330) rotate(-35)">
            <image href={assets.leaf1} x={-11} y={-11} width={24} height={24} />
          </g>
        )}
        <g transform="translate(162, 380) rotate(12)">
          <image href={assets.pink} x={-16} y={-16} width={33} height={33} />
        </g>
      </g>
    </svg>
  );
});
DelicateFloralBranchSvg.displayName = "DelicateFloralBranchSvg";

/* =========================================================================
   3. HỆ THỐNG HẠT VÀ HOA LÁ RƠI THEO MÙA (LIVING DRIFTING BOTANICAL PARTICLES)
   ========================================================================= */
interface DriftingParticle {
  id: string;
  imgSrc: string;
  startX: string;
  driftX: number;
  duration: number;
  delay: number;
  scale: number;
  initialRotate: number;
  mobileVisible?: boolean;
}

const FallingDriftingParticle = memo(({ p }: { p: DriftingParticle }) => {
  return (
    <div
      className={`absolute top-[-48px] pointer-events-none select-none z-10 ${!p.mobileVisible ? "hidden sm:block" : ""}`}
      style={{
        left: p.startX,
        animation: `fallingLeavesCascade ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s infinite`,
        ["--leaf-drift-x" as any]: `${p.driftX}px`,
        ["--leaf-rot-start" as any]: `${p.initialRotate}deg`,
        ["--leaf-rot-end" as any]: `${p.initialRotate + 360}deg`,
      }}
    >
      <div style={{ transform: `scale(${p.scale})` }}>
        <Image
          src={p.imgSrc}
          alt=""
          width={36}
          height={36}
          className="drop-shadow-xs select-none object-contain transition-opacity duration-300"
          style={{ width: "32px", height: "auto" }}
        />
      </div>
    </div>
  );
});
FallingDriftingParticle.displayName = "FallingDriftingParticle";

const FallingBurstParticle = memo(({ p }: { p: DriftingParticle }) => {
  return (
    <div
      className="absolute top-[-35px] pointer-events-none select-none z-15"
      style={{
        left: p.startX,
        animation: `fallingBurstCascade ${p.duration}s cubic-bezier(0.22, 0.61, 0.36, 1) ${p.delay}s forwards`,
        ["--burst-drift-x" as any]: `${p.driftX}px`,
        ["--burst-rot-start" as any]: `${p.initialRotate}deg`,
        ["--burst-rot-end" as any]: `${p.initialRotate + 360}deg`,
      }}
    >
      <div style={{ transform: `scale(${p.scale})` }}>
        <Image
          src={p.imgSrc}
          alt=""
          width={36}
          height={36}
          className="drop-shadow-xs select-none object-contain"
          style={{ width: "32px", height: "auto" }}
        />
      </div>
    </div>
  );
});
FallingBurstParticle.displayName = "FallingBurstParticle";

/* =========================================================================
   4. COMPONENT CHÍNH: CORNER FLORAL BRANCHES (GỌN GÀNG, TỐI ƯU 120FPS ZERO-LAG)
   ========================================================================= */
export function CornerFloralBranches() {
  const isReadingZone = useReadingZone();
  const isActive = isReadingZone;
  const [shakeSide, setShakeSide] = useState<"left" | "right" | null>(null);
  const [burstParticles, setBurstParticles] = useState<DriftingParticle[]>([]);
  const { season } = useSeason();
  const prefersReduced = useReducedMotion();

  // Khi đổi mùa: lập tức dọn sạch các cánh hoa/lá cũ để chuyển đổi hoa theo chủ đề mùa mới
  useEffect(() => {
    setBurstParticles([]);
  }, [season]);

  // Hạt hoa rụng lững lờ tự nhiên từ 2 cành theo chủ đề mùa hiện tại (Ambient Gentle Drift)
  const ambientParticles: DriftingParticle[] = useMemo(() => {
    const assets = seasonalAssetMap[season] || seasonalAssetMap.spring;
    return [
      // 1. Cành bên trái (Top-Left Branch)
      {
        id: `amb-${season}-l1`,
        imgSrc: assets.pink,
        startX: "7%",
        driftX: 55,
        duration: 8.8,
        delay: 0.5,
        scale: 1.0,
        initialRotate: 20,
        mobileVisible: true,
      },
      {
        id: `amb-${season}-l2`,
        imgSrc: assets.leaf1,
        startX: "13%",
        driftX: 80,
        duration: 10.2,
        delay: 3.5,
        scale: 0.9,
        initialRotate: -35,
        mobileVisible: true,
      },
      {
        id: `amb-${season}-l3`,
        imgSrc: assets.yellow,
        startX: "18%",
        driftX: 50,
        duration: 8.2,
        delay: 6.8,
        scale: 0.95,
        initialRotate: 45,
        mobileVisible: false,
      },
      {
        id: `amb-${season}-l4`,
        imgSrc: assets.leaf2,
        startX: "10%",
        driftX: 70,
        duration: 9.5,
        delay: 1.8,
        scale: 0.88,
        initialRotate: -15,
        mobileVisible: false,
      },
      // 2. Cành bên phải (Top-Right Branch)
      {
        id: `amb-${season}-r1`,
        imgSrc: assets.pink,
        startX: "93%",
        driftX: -60,
        duration: 9.0,
        delay: 2.0,
        scale: 1.05,
        initialRotate: -25,
        mobileVisible: true,
      },
      {
        id: `amb-${season}-r2`,
        imgSrc: assets.leaf1,
        startX: "86%",
        driftX: -85,
        duration: 10.5,
        delay: 5.2,
        scale: 0.92,
        initialRotate: 35,
        mobileVisible: true,
      },
      {
        id: `amb-${season}-r3`,
        imgSrc: assets.yellow,
        startX: "80%",
        driftX: -55,
        duration: 8.5,
        delay: 8.0,
        scale: 0.95,
        initialRotate: -40,
        mobileVisible: false,
      },
      {
        id: `amb-${season}-r4`,
        imgSrc: assets.leaf2,
        startX: "90%",
        driftX: -75,
        duration: 9.8,
        delay: 4.2,
        scale: 0.86,
        initialRotate: 15,
        mobileVisible: false,
      },
    ];
  }, [season]);

  const handleBranchHover = () => {
    playLeafRustleSound("leaves", 0.10);
  };

  const handleBranchClick = (side: "left" | "right", e: React.MouseEvent) => {
    e.stopPropagation();

    playBranchShakeSound(0.18);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([18, 35, 20]);
      } catch {}
    }

    setShakeSide(side);
    setTimeout(() => setShakeSide(null), 550);

    const count = 16;
    const isLeft = side === "left";
    const startXBase = isLeft ? 12 : 88;
    const assets = seasonalAssetMap[season] || seasonalAssetMap.spring;
    // Đầy đủ 4 loài hoa & lá theo đúng mùa đã chọn
    const assetChoices = [assets.pink, assets.yellow, assets.leaf1, assets.leaf2];

    const newParticles: DriftingParticle[] = Array.from({ length: count }).map((_, i) => {
      return {
        id: `burst-${season}-${Date.now()}-${i}`,
        imgSrc: assetChoices[i % assetChoices.length],
        startX: `${Math.max(2, Math.min(96, startXBase + (Math.random() - 0.5) * 16))}%`,
        driftX: (isLeft ? 1 : -1) * (Math.random() * 75 + 25) + (Math.random() - 0.5) * 35,
        duration: 5.2 + Math.random() * 2.5,
        delay: Math.random() * 0.4,
        scale: 0.85 + Math.random() * 0.35,
        initialRotate: Math.random() * 360,
        mobileVisible: true,
      };
    });

    setBurstParticles(newParticles);

    // Tự động dọn sạch hạt burst sau khi chu trình rơi hoàn tất (7.8s)
    setTimeout(() => {
      setBurstParticles((prev) => (prev === newParticles ? [] : prev));
    }, 7800);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fallingLeavesCascade {
          0% {
            transform: translate3d(0, -35px, 0) rotate(var(--leaf-rot-start, 0deg));
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          50% {
            transform: translate3d(var(--leaf-drift-x, 40px), 48vh, 0)
              rotate(calc(var(--leaf-rot-start, 0deg) + 160deg));
            opacity: 0.9;
          }
          85% {
            opacity: 0.75;
          }
          100% {
            transform: translate3d(calc(var(--leaf-drift-x, 40px) * 1.4), 105vh, 0)
              rotate(var(--leaf-rot-end, 360deg));
            opacity: 0;
          }
        }

        @keyframes fallingBurstCascade {
          0% {
            transform: translate3d(0, -35px, 0) rotate(var(--burst-rot-start, 0deg));
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          50% {
            transform: translate3d(var(--burst-drift-x, 40px), 48vh, 0)
              rotate(calc(var(--burst-rot-start, 0deg) + 180deg));
            opacity: 0.9;
          }
          85% {
            opacity: 0.75;
          }
          100% {
            transform: translate3d(calc(var(--burst-drift-x, 40px) * 1.4), 105vh, 0)
              rotate(var(--burst-rot-end, 360deg));
            opacity: 0;
          }
        }

        @keyframes organicBranchBreezeLeft {
          0%, 100% { transform: rotate(0deg) translate3d(0, 0, 0); }
          25% { transform: rotate(0.7deg) translate3d(1.2px, 0.8px, 0); }
          50% { transform: rotate(-0.3deg) translate3d(-0.6px, 0.4px, 0); }
          75% { transform: rotate(0.4deg) translate3d(0.8px, -0.3px, 0); }
        }

        @keyframes organicBranchBreezeRight {
          0%, 100% { transform: rotate(0deg) translate3d(0, 0, 0); }
          25% { transform: rotate(-0.7deg) translate3d(-1.2px, 0.8px, 0); }
          50% { transform: rotate(0.3deg) translate3d(0.6px, 0.4px, 0); }
          75% { transform: rotate(-0.4deg) translate3d(-0.8px, -0.3px, 0); }
        }

        @keyframes branchSpringShakeLeft {
          0% { transform: rotate(0deg) scale(1); }
          22% { transform: rotate(3.0deg) scale(1.02) translate3d(2px, 2px, 0); }
          45% { transform: rotate(-1.8deg) scale(0.99) translate3d(-1.2px, -0.8px, 0); }
          72% { transform: rotate(0.8deg) scale(1.01); }
          100% { transform: rotate(0deg) scale(1); }
        }

        @keyframes branchSpringShakeRight {
          0% { transform: rotate(0deg) scale(1); }
          22% { transform: rotate(-3.0deg) scale(1.02) translate3d(-2px, 2px, 0); }
          45% { transform: rotate(1.8deg) scale(0.99) translate3d(1.2px, -0.8px, 0); }
          72% { transform: rotate(-0.8deg) scale(1.01); }
          100% { transform: rotate(0deg) scale(1); }
        }

        .branch-organic-sway-left {
          animation: organicBranchBreezeLeft 12.6s ease-in-out infinite;
          transform-origin: 0% 0%;
        }

        .branch-organic-sway-right {
          animation: organicBranchBreezeRight 13.2s ease-in-out infinite;
          transform-origin: 100% 0%;
        }

        .branch-spring-shake-left {
          animation: branchSpringShakeLeft 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 0% 0%;
        }

        .branch-spring-shake-right {
          animation: branchSpringShakeRight 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 100% 0%;
        }
      `}</style>

      {/* KHUNG CÀNH HOA CỐ ĐỊNH - TỐI ƯU COMPOSITOR GPU THREAD */}
      <div
        className={cn(
          "fixed inset-0 z-35 overflow-hidden select-none pointer-events-none transition-opacity duration-400 ease-out transform-gpu",
          isActive ? "opacity-100" : "opacity-0"
        )}
        aria-hidden={!isActive}
      >
        {/* --- CÀNH HOA GÓC TRÁI (TOP-LEFT CORNER) --- */}
        <div
          onClick={(e) => handleBranchClick("left", e)}
          onMouseEnter={handleBranchHover}
          onMouseMove={handleBranchHover}
          role="button"
          tabIndex={0}
          title="Chạm vào cành cây để nghe xào xạc và lá rụng dạt dào"
          aria-label="Cành cây thi ca góc trái"
          style={{
            transform: isActive
              ? "translate3d(0, 0, 0) scale(1)"
              : "translate3d(-50px, -30px, 0) scale(0.88)",
            transition: prefersReduced ? "none" : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="absolute top-[-10px] sm:top-[-15px] left-[-15px] sm:left-[-25px] md:left-[-35px] w-[130px] xs:w-[155px] sm:w-[190px] md:w-[230px] lg:w-[265px] xl:w-[290px] max-w-[34vw] h-[115px] xs:h-[135px] sm:h-[160px] md:h-[195px] lg:h-[225px] xl:h-[245px] pointer-events-auto cursor-pointer origin-top-left transform-gpu will-change-transform group"
        >
          <div
            className={cn(
              "w-full h-full transition-transform duration-200",
              shakeSide === "left"
                ? "branch-spring-shake-left"
                : isActive
                ? "branch-organic-sway-left group-hover:scale-[1.025]"
                : ""
            )}
          >
            <DelicateFloralBranchSvg side="left" season={season} />
          </div>
        </div>

        {/* --- CÀNH HOA GÓC PHẢI (TOP-RIGHT CORNER) --- */}
        <div
          onClick={(e) => handleBranchClick("right", e)}
          onMouseEnter={handleBranchHover}
          onMouseMove={handleBranchHover}
          role="button"
          tabIndex={0}
          title="Chạm vào cành cây để nghe xào xạc và lá rụng dạt dào"
          aria-label="Cành cây thi ca góc phải"
          style={{
            transform: isActive
              ? "translate3d(0, 0, 0) scale(1)"
              : "translate3d(50px, -30px, 0) scale(0.88)",
            transition: prefersReduced ? "none" : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className="absolute top-[-10px] sm:top-[-15px] right-[-15px] sm:right-[-25px] md:right-[-35px] w-[130px] xs:w-[155px] sm:w-[190px] md:w-[230px] lg:w-[265px] xl:w-[290px] max-w-[34vw] h-[115px] xs:h-[135px] sm:h-[160px] md:h-[195px] lg:h-[225px] xl:h-[245px] pointer-events-auto cursor-pointer origin-top-right transform-gpu will-change-transform group"
        >
          <div
            className={cn(
              "w-full h-full transition-transform duration-200",
              shakeSide === "right"
                ? "branch-spring-shake-right"
                : isActive
                ? "branch-organic-sway-right group-hover:scale-[1.025]"
                : ""
            )}
          >
            <DelicateFloralBranchSvg side="right" season={season} />
          </div>
        </div>

        {/* --- HỆ THỐNG LÁ & CÁNH HOA RƠI LÃNG MẠN (CHỈ RENDER KHI ACTIVE) --- */}
        {!prefersReduced && isActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* 1. Hoa & lá rụng tự nhiên từ 2 cành theo mùa (Ambient Cascade) */}
            {ambientParticles.map((particle) => (
              <FallingDriftingParticle key={particle.id} p={particle} />
            ))}

            {/* 2. Chùm hoa & lá bay ra khi chạm vào cành theo mùa (Burst Cascade) */}
            {burstParticles.map((particle) => (
              <FallingBurstParticle key={particle.id} p={particle} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
