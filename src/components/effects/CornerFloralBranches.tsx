"use client";

import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/lib/motion";

/* =========================================================================
   1. ĐỊNH NGHĨA VECTOR LÁ PHONG ĐỎ & HOA ĐÀO NGHỆ THUẬT (JAPANESE MOMIJI & SAKURA)
   Được thiết kế tinh xảo theo ảnh mẫu Kage: Nhánh cây gân guốc có đốt sần,
   các chùm lá phong 7 thùy xòe đa tầng và cụm hoa đào nở rộ cùng nụ non.
   ========================================================================= */

// Chiếc lá phong đơn lẻ 7 thùy chuẩn xác (Momiji Single Leaf)
const MomijiLeaf = memo(
  ({
    x,
    y,
    scale = 1,
    rotate = 0,
    variant = "crimson",
    opacity = 0.96,
  }: {
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
    variant?: "crimson" | "scarlet" | "amber" | "ruby" | "coral";
    opacity?: number;
  }) => {
    return (
      <g
        transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
        opacity={opacity}
      >
        {/* Cuống lá phong cong tự nhiên */}
        <path
          d="M 0,0 C -0.8,7 -1.2,16 0,23"
          stroke="url(#momijiStemGrad)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Thân lá phong 7 thùy xẻ sâu tinh xảo */}
        <path
          d="M 0,2
             C -2,-3 -4,-8 -7,-14 C -6,-10 -5,-7 -4,-4
             C -7,-8 -12,-12 -17,-13 C -13,-9 -10,-6 -8,-3
             C -13,-5 -19,-5 -24,-2 C -19,0 -15,1 -11,3
             C -17,7 -21,13 -22,19 C -18,15 -14,11 -10,8
             C -13,14 -12,21 -8,25 C -6,19 -5,14 -4,9
             L 0,27
             L 4,9 C 5,14 6,19 8,25 C 12,21 13,14 10,8
             C 14,11 18,15 22,19 C 21,13 17,7 11,3
             C 15,1 19,0 24,-2 C 19,-5 13,-5 8,-3
             C 10,-6 13,-9 17,-13 C 12,-12 7,-8 4,-4
             C 5,-7 6,-10 7,-14 C 4,-8 2,-3 0,2 Z"
          fill={`url(#momiji-grad-${variant})`}
          stroke="rgba(0,0,0,0.22)"
          strokeWidth="0.5"
          filter="url(#leafSoftGlow)"
        />
        {/* Gân lá phát sáng tinh tế */}
        <path
          d="M 0,22 L 0,1
             M 0,17 L -10,4
             M 0,17 L 10,4
             M 0,13 L -13,-4
             M 0,13 L 13,-4
             M 0,8 L -8,-9
             M 0,8 L 8,-9"
          stroke="rgba(255, 240, 210, 0.42)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </g>
    );
  }
);
MomijiLeaf.displayName = "MomijiLeaf";

// Chiếc lá phong nghiêng góc 3/4 (Perspective Momiji Leaf - tạo độ lồi lõm chân thực)
const MomijiLeafAngle = memo(
  ({
    x,
    y,
    scale = 1,
    rotate = 0,
    variant = "scarlet",
  }: {
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
    variant?: "crimson" | "scarlet" | "amber" | "ruby" | "coral";
  }) => {
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
        <path
          d="M 0,0 C 1,6 1.5,14 0,20"
          stroke="url(#momijiStemGrad)"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 0,2
             C -2,-3 -3,-7 -5,-13 C -4,-9 -3,-6 -2,-4
             C -4,-7 -7,-10 -11,-11 C -8,-8 -6,-5 -5,-3
             C -8,-4 -12,-4 -15,-2 C -12,0 -9,1 -7,2
             C -10,6 -12,11 -12,16 C -10,13 -8,10 -6,7
             C -7,12 -6,17 -4,21 C -3,16 -2,12 -1,8
             L 0,22
             L 3,8 C 4,12 5,16 6,20 C 8,16 9,11 7,7
             C 9,9 12,12 14,14 C 13,10 11,6 8,3
             C 10,2 12,1 15,-1 C 12,-3 9,-3 6,-2
             C 7,-4 9,-7 11,-9 C 8,-9 5,-6 3,-3
             C 3,-6 4,-8 5,-11 C 3,-7 2,-3 0,2 Z"
          fill={`url(#momiji-grad-${variant})`}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.45"
          filter="url(#leafSoftGlow)"
        />
        <path
          d="M 0,18 L 0,2 M 0,14 L -8,3 M 0,14 L 7,3 M 0,10 L -10,-4 M 0,10 L 9,-4"
          stroke="rgba(255, 235, 200, 0.35)"
          strokeWidth="0.65"
          strokeLinecap="round"
        />
      </g>
    );
  }
);
MomijiLeafAngle.displayName = "MomijiLeafAngle";

// Cụm 3-4 lá phong đan cài tự nhiên (Momiji Foliage Cluster - triệt tiêu sự đơn điệu)
const MomijiCluster = memo(
  ({
    x,
    y,
    scale = 1,
    rotate = 0,
    mainVariant = "crimson",
  }: {
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
    mainVariant?: "crimson" | "scarlet" | "amber" | "ruby";
  }) => {
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
        {/* Lá phụ góc sau (đậm hơn, tạo chiều sâu 3D) */}
        <MomijiLeaf
          x={-14}
          y={-6}
          scale={0.78}
          rotate={-38}
          variant="ruby"
          opacity={0.88}
        />
        {/* Lá phụ bên phải (sáng màu hơn, như đón nắng trăng) */}
        <MomijiLeafAngle
          x={16}
          y={-4}
          scale={0.82}
          rotate={35}
          variant={mainVariant === "crimson" ? "scarlet" : "amber"}
        />
        {/* Lá non nhỏ ở đọt */}
        <MomijiLeaf
          x={2}
          y={-18}
          scale={0.58}
          rotate={-12}
          variant="coral"
          opacity={0.92}
        />
        {/* Lá chính nở rộ ở tiền cảnh */}
        <MomijiLeaf
          x={0}
          y={0}
          scale={1.05}
          rotate={6}
          variant={mainVariant}
          opacity={0.98}
        />
      </g>
    );
  }
);
MomijiCluster.displayName = "MomijiCluster";

// Hoa đào nở nhìn nghiêng 3/4 (Profile Sakura)
const SakuraProfile = memo(
  ({
    x,
    y,
    scale = 1,
    rotate = 0,
  }: {
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
  }) => {
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
        {/* Đài hoa đỏ sẫm ở cuống */}
        <path
          d="M 0,0 C -3,3 -4,7 0,10 C 4,7 3,3 0,0 Z"
          fill="#4A0E17"
        />
        <circle cx="-3" cy="4" r="1.5" fill="#6B1322" />
        <circle cx="3" cy="4" r="1.5" fill="#6B1322" />
        {/* Cánh hoa nhìn nghiêng uốn lượn */}
        <path
          d="M -1,2 C -7,-3 -12,-9 -8,-16 C -3,-18 2,-15 5,-9 C 6,-3 2,1 -1,2 Z"
          fill="url(#sakuraPetalGrad)"
          stroke="rgba(240,160,180,0.5)"
          strokeWidth="0.5"
        />
        <path
          d="M 2,1 C 7,-3 12,-7 11,-15 C 6,-18 0,-16 -3,-10 C -4,-4 0,0 2,1 Z"
          fill="url(#sakuraPetalGrad)"
          opacity="0.95"
          stroke="rgba(240,160,180,0.4)"
          strokeWidth="0.5"
        />
        {/* Nhụy vươn ra khỏi cánh */}
        <line x1="0" y1="-2" x2="-4" y2="-12" stroke="#B45309" strokeWidth="0.8" />
        <line x1="1" y1="-2" x2="3" y2="-13" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="-4" cy="-12" r="1.2" fill="#FBBF24" />
        <circle cx="3" cy="-13" r="1.2" fill="#FBBF24" />
      </g>
    );
  }
);
SakuraProfile.displayName = "SakuraProfile";

// Hoa đào chính diện 5 cánh thanh tao với chi tiết nhụy tinh xảo
const CherryBlossomFlower = memo(
  ({
    x,
    y,
    scale = 1,
    rotate = 0,
    isOpen = true,
  }: {
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
    isOpen?: boolean;
  }) => {
    if (!isOpen) {
      // Nụ hoa đào e ấp nở
      return (
        <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
          {/* Cuống nụ */}
          <path d="M 0,2 C -1,5 -1,9 0,12" stroke="#3D1A16" strokeWidth="1.2" fill="none" />
          <circle cx="0" cy="2" r="2.2" fill="#4C0D17" />
          {/* Cánh nụ màu hồng thắm hé mở */}
          <path
            d="M 0,1 C -4,-3 -4,-8 -1,-13 C 2,-9 3,-4 0,1 Z"
            fill="url(#sakuraBudGrad)"
            stroke="rgba(120,20,30,0.5)"
            strokeWidth="0.6"
          />
          <path
            d="M -1,-1 C -4,-5 -2,-10 2,-11 C 1,-6 1,-2 -1,-1 Z"
            fill="url(#sakuraPetalGrad)"
            opacity="0.9"
          />
        </g>
      );
    }

    return (
      <g
        transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
        filter="url(#sakuraDropShadow)"
      >
        {/* 5 Cánh hoa đào với rãnh chẻ nhẹ ở đầu cánh */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <path
            key={idx}
            transform={`rotate(${angle})`}
            d="M 0,0 C -5,-7 -9,-13 -7,-18 C -3,-20 0,-18 0,-16 C 0,-18 3,-20 7,-18 C 9,-13 5,-7 0,0 Z"
            fill="url(#sakuraPetalGrad)"
            stroke="rgba(240, 160, 180, 0.45)"
            strokeWidth="0.5"
          />
        ))}
        {/* Tâm hoa đào & Nhụy hoa vàng kim */}
        <circle cx="0" cy="0" r="3.4" fill="#D97706" />
        <circle cx="0" cy="0" r="1.8" fill="#FEF3C7" />
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, idx) => (
          <g key={idx} transform={`rotate(${angle})`}>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-6"
              stroke="#B45309"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            <circle cx="0" cy="-6.2" r="0.9" fill="#FEF08A" />
          </g>
        ))}
      </g>
    );
  }
);
CherryBlossomFlower.displayName = "CherryBlossomFlower";

// Cụm hoa đào gắn trực tiếp lên thân cành (đặc trưng tranh thủy mặc Á Đông)
const BlossomTwigCluster = memo(
  ({
    x,
    y,
    scale = 1,
    rotate = 0,
  }: {
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
  }) => {
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
        {/* Mắt gỗ nâu nơi hoa mọc */}
        <ellipse cx="0" cy="0" rx="3.5" ry="2" fill="#2E1D16" />
        {/* Nụ nhỏ cạnh hoa */}
        <CherryBlossomFlower x={-14} y={-5} scale={0.7} rotate={-30} isOpen={false} />
        {/* Hoa nhìn nghiêng */}
        <SakuraProfile x={13} y={-6} scale={0.82} rotate={25} />
        {/* Hoa nở bung chính diện */}
        <CherryBlossomFlower x={0} y={0} scale={1.05} rotate={15} isOpen={true} />
      </g>
    );
  }
);
BlossomTwigCluster.displayName = "BlossomTwigCluster";

/* =========================================================================
   2. BỘ ĐỊNH NGHĨA GRADIENT VÀ FILTER SVG ĐA TẦNG (RICH SHADERS)
   ========================================================================= */
const SharedBranchDefs = memo(() => (
  <svg width="0" height="0" className="absolute pointer-events-none">
    <defs>
      {/* Vỏ thân cành cây gỗ mun / trà trầm Á Đông */}
      <linearGradient id="branchBarkGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#18120E" />
        <stop offset="25%" stopColor="#2A1E17" />
        <stop offset="55%" stopColor="#3E2C22" />
        <stop offset="85%" stopColor="#251A14" />
        <stop offset="100%" stopColor="#140E0A" />
      </linearGradient>

      {/* Ánh trăng viền sống cành (Rim Light Highlight) */}
      <linearGradient id="branchRimLightGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(255,245,225,0.22)" />
        <stop offset="50%" stopColor="rgba(255,230,190,0.12)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </linearGradient>

      {/* Vỏ thân nhành con mảnh gân guốc */}
      <linearGradient id="twigBarkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38261C" />
        <stop offset="60%" stopColor="#221711" />
        <stop offset="100%" stopColor="#120C08" />
      </linearGradient>

      {/* Cuống lá phong */}
      <linearGradient id="momijiStemGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#3B1515" />
      </linearGradient>

      {/* Biến thể 1: Crimson (Đỏ thắm kinh điển ngả rượu vang) */}
      <linearGradient id="momiji-grad-crimson" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#681014" />
        <stop offset="40%" stopColor="#991B1B" />
        <stop offset="75%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#F87171" />
      </linearGradient>

      {/* Biến thể 2: Scarlet (Đỏ tươi rực ánh lửa) */}
      <linearGradient id="momiji-grad-scarlet" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#831414" />
        <stop offset="45%" stopColor="#DC2626" />
        <stop offset="80%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>

      {/* Biến thể 3: Amber (Hổ phách lá thu ngả vàng nghệ) */}
      <linearGradient id="momiji-grad-amber" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="45%" stopColor="#D97706" />
        <stop offset="80%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>

      {/* Biến thể 4: Ruby (Hồng ngọc trầm mặc) */}
      <linearGradient id="momiji-grad-ruby" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#4C0519" />
        <stop offset="45%" stopColor="#831843" />
        <stop offset="80%" stopColor="#BE185D" />
        <stop offset="100%" stopColor="#FB7185" />
      </linearGradient>

      {/* Biến thể 5: Coral (Cam đào đọt non tươi mát) */}
      <linearGradient id="momiji-grad-coral" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#9A3412" />
        <stop offset="50%" stopColor="#EA580C" />
        <stop offset="85%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#FED7AA" />
      </linearGradient>

      {/* Gradient cánh hoa đào (Sakura Blush mềm mại) */}
      <radialGradient id="sakuraPetalGrad" cx="50%" cy="85%" r="75%">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="35%" stopColor="#FFE4E6" />
        <stop offset="75%" stopColor="#FDA4AF" />
        <stop offset="100%" stopColor="#F43F5E" />
      </radialGradient>

      {/* Gradient nụ hoa đào */}
      <linearGradient id="sakuraBudGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#881337" />
        <stop offset="60%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#FDA4AF" />
      </linearGradient>

      {/* Đổ bóng tự nhiên cho cánh hoa */}
      <filter id="sakuraDropShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#000" floodOpacity="0.28" />
      </filter>

      {/* Phát sáng tự nhiên dịu nhẹ cho lá phong đỏ */}
      <filter id="leafSoftGlow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="1.4" stdDeviation="2" floodColor="#3B0505" floodOpacity="0.32" />
      </filter>

      {/* Đổ bóng tự nhiên nhiều tầng cho thân cành */}
      <filter id="branchDepthShadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="1.5" dy="3.5" stdDeviation="4.5" floodColor="#000" floodOpacity="0.42" />
      </filter>
    </defs>
  </svg>
));
SharedBranchDefs.displayName = "SharedBranchDefs";

/* =========================================================================
   3. CÀNH HOA GÓC TRÁI HEADER (LEFT CORNER BRANCH)
   Thân cành gân guốc, đốt sần, nhiều nhánh con vươn tự nhiên,
   không đơn điệu với sự phối hợp giữa chùm lá Momiji và hoa đào nở rộ.
   ========================================================================= */
const LeftCornerBranchSvg = memo(() => {
  return (
    <svg
      viewBox="0 0 490 410"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none pointer-events-none drop-shadow-lg"
      preserveAspectRatio="xMinYMin meet"
    >
      {/* 1. TẦNG NHÁNH HẬU CẢNH (Background Depth Twigs - Mờ nhẹ tạo chiều sâu) */}
      <g opacity="0.65" filter="url(#branchDepthShadow)">
        <path
          d="M 120,40 C 150,22 195,15 240,18 C 265,20 285,14 315,8"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 85,75 C 95,120 85,165 70,210 C 60,240 68,275 80,310"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 220,110 C 255,145 285,175 305,215"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Lá phong xa xôi */}
        <MomijiLeaf x={315} y={10} scale={0.65} rotate={20} variant="amber" opacity={0.6} />
        <MomijiLeaf x={80} y={310} scale={0.6} rotate={-25} variant="ruby" opacity={0.6} />
        <MomijiLeaf x={305} y={215} scale={0.65} rotate={40} variant="crimson" opacity={0.6} />
      </g>

      {/* 2. TẦNG THÂN CHÍNH GÂN GUỐC (Main Organic Trunk with knots & ridges) */}
      <g filter="url(#branchDepthShadow)">
        {/* Thân cây dáng bonsai cổ thụ uốn lượn có độ vuốt thon (Tapering) */}
        <path
          d="M -15,-10 
             C 40,20 85,42 140,65 
             C 195,88 250,110 305,148 
             C 345,175 385,205 425,245 
             C 445,265 460,285 475,305"
          stroke="url(#branchBarkGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Khớp đốt sần sùi (Bark Knots) */}
        <ellipse cx="138" cy="64" rx="9" ry="6" fill="#1C130D" transform="rotate(-15 138 64)" />
        <ellipse cx="140" cy="63" rx="6.5" ry="3.8" fill="#3B2A20" transform="rotate(-15 140 63)" />
        <ellipse cx="304" cy="147" rx="8" ry="5.5" fill="#1C130D" transform="rotate(-25 304 147)" />
        <ellipse cx="305" cy="146" rx="5.5" ry="3.2" fill="#3B2A20" transform="rotate(-25 305 146)" />

        {/* Vân sáng phản chiếu dọc sống lưng cành cây */}
        <path
          d="M -5,-5 C 45,22 90,45 138,62 M 145,66 C 200,90 252,112 302,145 M 310,150 C 350,178 390,210 430,250"
          stroke="url(#branchRimLightGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Rãnh nứt vỏ cây tự nhiên */}
        <path
          d="M 50,28 C 75,38 98,48 115,55 M 210,95 C 235,105 260,118 280,132"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 1: Vươn bổng lên phía trên (Upper Arching Twig) */}
        <path
          d="M 140,65 
             C 175,45 220,32 265,30 
             C 295,28 320,38 345,55"
          stroke="url(#branchBarkGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 260,30 C 285,15 315,10 345,15 C 365,18 385,26 400,38"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M 345,55 C 370,68 390,88 405,110"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 2: Rủ xuống thanh thoát góc trái (Weeping Left Shoot) */}
        <path
          d="M 85,42 
             C 70,95 58,145 46,195 
             C 38,235 42,275 55,315"
          stroke="url(#branchBarkGrad)"
          strokeWidth="6.8"
          strokeLinecap="round"
        />
        <path
          d="M 55,160 C 75,200 90,240 98,280 C 102,305 98,330 90,350"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 48,255 C 35,290 28,320 22,345"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 3: Nhánh giữa vươn xuống (Center Drooping Twig) */}
        <path
          d="M 235,102 
             C 255,145 265,190 258,235 
             C 252,270 235,305 215,340"
          stroke="url(#branchBarkGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M 260,175 C 295,205 320,245 338,285"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 4: Ngọn cành vươn vào lòng sách thơ (Inward Sweeping Tip) */}
        <path
          d="M 365,190 
             C 405,202 445,218 478,240"
          stroke="url(#twigBarkGrad)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M 425,245 C 445,280 460,315 470,345"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </g>

      {/* 3. TẦNG CHÙM HOA ĐÀO NỞ RỘ & NỤ XUÂN (Sakura Clusters) */}
      {/* Cụm hoa trên thân cành chính */}
      <BlossomTwigCluster x={140} y={62} scale={1.1} rotate={-10} />
      <BlossomTwigCluster x={305} y={145} scale={1.05} rotate={20} />
      <CherryBlossomFlower x={235} y={100} scale={0.92} rotate={-15} isOpen={true} />
      <CherryBlossomFlower x={365} y={188} scale={0.98} rotate={32} isOpen={true} />
      <SakuraProfile x={200} y={90} scale={0.85} rotate={-25} />
      <SakuraProfile x={335} y={165} scale={0.88} rotate={18} />

      {/* Hoa và nụ trên nhánh vươn lên */}
      <BlossomTwigCluster x={265} y={28} scale={0.95} rotate={15} />
      <CherryBlossomFlower x={345} y={14} scale={0.85} rotate={-12} isOpen={true} />
      <CherryBlossomFlower x={395} y={25} scale={0.7} rotate={40} isOpen={false} />
      <SakuraProfile x={340} y={55} scale={0.8} rotate={-35} />

      {/* Hoa và nụ trên nhánh rủ trái */}
      <BlossomTwigCluster x={52} y={180} scale={0.92} rotate={-25} />
      <CherryBlossomFlower x={95} y={260} scale={0.88} rotate={35} isOpen={true} />
      <CherryBlossomFlower x={50} y={310} scale={0.72} rotate={-10} isOpen={false} />
      <CherryBlossomFlower x={88} y={345} scale={0.68} rotate={15} isOpen={false} />
      <SakuraProfile x={75} y={215} scale={0.82} rotate={-18} />

      {/* Hoa và nụ ở nhánh giữa & ngọn cành */}
      <CherryBlossomFlower x={256} y={225} scale={0.85} rotate={-12} isOpen={true} />
      <CherryBlossomFlower x={220} y={325} scale={0.78} rotate={22} isOpen={true} />
      <CherryBlossomFlower x={335} y={275} scale={0.82} rotate={-28} isOpen={true} />
      <CherryBlossomFlower x={430} y={242} scale={0.95} rotate={-18} isOpen={true} />
      <CherryBlossomFlower x={472} y={238} scale={0.75} rotate={25} isOpen={false} />
      <CherryBlossomFlower x={465} y={335} scale={0.7} rotate={-15} isOpen={false} />

      {/* 4. TẦNG CHÙM LÁ PHONG ĐỎ ĐA SẮC MOMIJI (Foliage Clusters with Overlaps) */}
      {/* Cụm lá vòm trên */}
      <MomijiCluster x={290} y={22} scale={1.05} rotate={12} mainVariant="crimson" />
      <MomijiCluster x={360} y={25} scale={0.9} rotate={-20} mainVariant="scarlet" />
      <MomijiCluster x={385} y={85} scale={0.85} rotate={30} mainVariant="amber" />

      {/* Cụm lá nhánh rủ bên trái */}
      <MomijiCluster x={45} y={130} scale={1.1} rotate={-45} mainVariant="scarlet" />
      <MomijiCluster x={40} y={225} scale={0.98} rotate={-28} mainVariant="crimson" />
      <MomijiCluster x={88} y={210} scale={0.9} rotate={20} mainVariant="ruby" />
      <MomijiCluster x={58} y={300} scale={0.85} rotate={-15} mainVariant="crimson" />
      <MomijiCluster x={92} y={330} scale={0.75} rotate={15} mainVariant="amber" />
      <MomijiLeaf x={24} y={345} scale={0.72} rotate={-35} variant="scarlet" />

      {/* Cụm lá nhánh giữa vươn xuống */}
      <MomijiCluster x={175} y={85} scale={1.15} rotate={-12} mainVariant="crimson" />
      <MomijiCluster x={245} y={150} scale={1.0} rotate={28} mainVariant="ruby" />
      <MomijiCluster x={255} y={205} scale={0.92} rotate={-18} mainVariant="crimson" />
      <MomijiCluster x={215} y={290} scale={0.88} rotate={15} mainVariant="scarlet" />
      <MomijiCluster x={315} y={235} scale={0.9} rotate={35} mainVariant="scarlet" />
      <MomijiCluster x={335} y={295} scale={0.78} rotate={10} mainVariant="amber" />

      {/* Cụm lá ngọn vươn vào khung sách thơ */}
      <MomijiCluster x={355} y={170} scale={1.1} rotate={-10} mainVariant="crimson" />
      <MomijiCluster x={415} y={195} scale={0.98} rotate={25} mainVariant="scarlet" />
      <MomijiCluster x={465} y={225} scale={0.88} rotate={-15} mainVariant="ruby" />
      <MomijiCluster x={445} y={295} scale={0.82} rotate={20} mainVariant="amber" />
      <MomijiLeaf x={478} y={315} scale={0.7} rotate={40} variant="crimson" />
    </svg>
  );
});
LeftCornerBranchSvg.displayName = "LeftCornerBranchSvg";

/* =========================================================================
   4. CÀNH HOA GÓC PHẢI HEADER (RIGHT CORNER BRANCH)
   Bố cục bất đối xứng tự nhiên, vươn thanh thoát từ góc trên bên phải,
   nhiều nhánh con đan xen, hoa và lá phong đỏ rực rỡ phong vị Á Đông.
   ========================================================================= */
const RightCornerBranchSvg = memo(() => {
  return (
    <svg
      viewBox="0 0 490 410"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none pointer-events-none drop-shadow-lg"
      preserveAspectRatio="xMaxYMin meet"
    >
      {/* 1. TẦNG NHÁNH HẬU CẢNH (Background Depth Twigs) */}
      <g opacity="0.65" filter="url(#branchDepthShadow)">
        <path
          d="M 370,40 C 340,22 295,15 250,18 C 225,20 205,14 175,8"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 405,75 C 395,120 405,165 420,210 C 430,240 422,275 410,310"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 270,110 C 235,145 205,175 185,215"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Lá phong xa xôi */}
        <MomijiLeaf x={175} y={10} scale={0.65} rotate={-20} variant="amber" opacity={0.6} />
        <MomijiLeaf x={410} y={310} scale={0.6} rotate={25} variant="ruby" opacity={0.6} />
        <MomijiLeaf x={185} y={215} scale={0.65} rotate={-40} variant="crimson" opacity={0.6} />
      </g>

      {/* 2. TẦNG THÂN CHÍNH GÂN GUỐC PHÍA PHẢI */}
      <g filter="url(#branchDepthShadow)">
        {/* Thân chính vươn cong từ góc phải trên vào trung tâm */}
        <path
          d="M 505,-10 
             C 450,20 405,42 350,65 
             C 295,88 240,110 185,148 
             C 145,175 105,205 65,245 
             C 45,265 30,285 15,305"
          stroke="url(#branchBarkGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Khớp đốt sần sùi thân phải */}
        <ellipse cx="352" cy="64" rx="9" ry="6" fill="#1C130D" transform="rotate(15 352 64)" />
        <ellipse cx="350" cy="63" rx="6.5" ry="3.8" fill="#3B2A20" transform="rotate(15 350 63)" />
        <ellipse cx="186" cy="147" rx="8" ry="5.5" fill="#1C130D" transform="rotate(25 186 147)" />
        <ellipse cx="185" cy="146" rx="5.5" ry="3.2" fill="#3B2A20" transform="rotate(25 185 146)" />

        {/* Vân sáng phản chiếu sống cành */}
        <path
          d="M 495,-5 C 445,22 400,45 352,62 M 345,66 C 290,90 238,112 188,145 M 180,150 C 140,178 100,210 60,250"
          stroke="url(#branchRimLightGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Rãnh nứt vỏ cây */}
        <path
          d="M 440,28 C 415,38 392,48 375,55 M 280,95 C 255,105 230,118 210,132"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 1 PHẢI: Vươn ngang lên trên */}
        <path
          d="M 350,65 
             C 315,45 270,32 225,30 
             C 195,28 170,38 145,55"
          stroke="url(#branchBarkGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 230,30 C 205,15 175,10 145,15 C 125,18 105,26 90,38"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M 145,55 C 120,68 100,88 85,110"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 2 PHẢI: Rủ xuống thanh thoát góc phải */}
        <path
          d="M 405,42 
             C 420,95 432,145 444,195 
             C 452,235 448,275 435,315"
          stroke="url(#branchBarkGrad)"
          strokeWidth="6.8"
          strokeLinecap="round"
        />
        <path
          d="M 435,160 C 415,200 400,240 392,280 C 388,305 392,330 400,350"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 442,255 C 455,290 462,320 468,345"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 3 PHẢI: Nhánh giữa vươn xuống */}
        <path
          d="M 255,102 
             C 235,145 225,190 232,235 
             C 238,270 255,305 275,340"
          stroke="url(#branchBarkGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M 230,175 C 195,205 170,245 152,285"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 4 PHẢI: Ngọn cành vươn vào lòng sách thơ bên phải */}
        <path
          d="M 125,190 
             C 85,202 45,218 12,240"
          stroke="url(#twigBarkGrad)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M 65,245 C 45,280 30,315 20,345"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </g>

      {/* 3. TẦNG CHÙM HOA ĐÀO NỞ RỘ TRÊN CÀNH PHẢI */}
      <BlossomTwigCluster x={350} y={62} scale={1.1} rotate={10} />
      <BlossomTwigCluster x={185} y={145} scale={1.05} rotate={-20} />
      <CherryBlossomFlower x={255} y={100} scale={0.92} rotate={15} isOpen={true} />
      <CherryBlossomFlower x={125} y={188} scale={0.98} rotate={-32} isOpen={true} />
      <SakuraProfile x={290} y={90} scale={0.85} rotate={25} />
      <SakuraProfile x={155} y={165} scale={0.88} rotate={-18} />

      {/* Hoa và nụ nhánh trên phải */}
      <BlossomTwigCluster x={225} y={28} scale={0.95} rotate={-15} />
      <CherryBlossomFlower x={145} y={14} scale={0.85} rotate={12} isOpen={true} />
      <CherryBlossomFlower x={95} y={25} scale={0.7} rotate={-40} isOpen={false} />
      <SakuraProfile x={150} y={55} scale={0.8} rotate={35} />

      {/* Hoa và nụ nhánh rủ phải */}
      <BlossomTwigCluster x={438} y={180} scale={0.92} rotate={25} />
      <CherryBlossomFlower x={395} y={260} scale={0.88} rotate={-35} isOpen={true} />
      <CherryBlossomFlower x={440} y={310} scale={0.72} rotate={10} isOpen={false} />
      <CherryBlossomFlower x={402} y={345} scale={0.68} rotate={-15} isOpen={false} />
      <SakuraProfile x={415} y={215} scale={0.82} rotate={18} />

      {/* Hoa và nụ nhánh giữa & ngọn cành phải */}
      <CherryBlossomFlower x={234} y={225} scale={0.85} rotate={12} isOpen={true} />
      <CherryBlossomFlower x={270} y={325} scale={0.78} rotate={-22} isOpen={true} />
      <CherryBlossomFlower x={155} y={275} scale={0.82} rotate={28} isOpen={true} />
      <CherryBlossomFlower x={60} y={242} scale={0.95} rotate={18} isOpen={true} />
      <CherryBlossomFlower x={18} y={238} scale={0.75} rotate={-25} isOpen={false} />
      <CherryBlossomFlower x={25} y={335} scale={0.7} rotate={15} isOpen={false} />

      {/* 4. TẦNG CHÙM LÁ PHONG ĐỎ MOMIJI CÀNH PHẢI */}
      <MomijiCluster x={200} y={22} scale={1.05} rotate={-12} mainVariant="crimson" />
      <MomijiCluster x={130} y={25} scale={0.9} rotate={20} mainVariant="scarlet" />
      <MomijiCluster x={105} y={85} scale={0.85} rotate={-30} mainVariant="amber" />

      {/* Cụm lá nhánh rủ phải */}
      <MomijiCluster x={445} y={130} scale={1.1} rotate={45} mainVariant="scarlet" />
      <MomijiCluster x={450} y={225} scale={0.98} rotate={28} mainVariant="crimson" />
      <MomijiCluster x={402} y={210} scale={0.9} rotate={-20} mainVariant="ruby" />
      <MomijiCluster x={432} y={300} scale={0.85} rotate={15} mainVariant="crimson" />
      <MomijiCluster x={398} y={330} scale={0.75} rotate={-15} mainVariant="amber" />
      <MomijiLeaf x={466} y={345} scale={0.72} rotate={35} variant="scarlet" />

      {/* Cụm lá nhánh giữa phải */}
      <MomijiCluster x={315} y={85} scale={1.15} rotate={12} mainVariant="crimson" />
      <MomijiCluster x={245} y={150} scale={1.0} rotate={-28} mainVariant="ruby" />
      <MomijiCluster x={235} y={205} scale={0.92} rotate={18} mainVariant="crimson" />
      <MomijiCluster x={275} y={290} scale={0.88} rotate={-15} mainVariant="scarlet" />
      <MomijiCluster x={175} y={235} scale={0.9} rotate={-35} mainVariant="scarlet" />
      <MomijiCluster x={155} y={295} scale={0.78} rotate={-10} mainVariant="amber" />

      {/* Cụm lá ngọn vươn vào khung sách thơ bên phải */}
      <MomijiCluster x={135} y={170} scale={1.1} rotate={10} mainVariant="crimson" />
      <MomijiCluster x={75} y={195} scale={0.98} rotate={-25} mainVariant="scarlet" />
      <MomijiCluster x={25} y={225} scale={0.88} rotate={15} mainVariant="ruby" />
      <MomijiCluster x={45} y={295} scale={0.82} rotate={-20} mainVariant="amber" />
      <MomijiLeaf x={12} y={315} scale={0.7} rotate={-40} variant="crimson" />
    </svg>
  );
});
RightCornerBranchSvg.displayName = "RightCornerBranchSvg";

/* =========================================================================
   5. HỆ THỐNG LÁ & CÁNH HOA RƠI TỰ NHIÊN ĐA DẠNG (LIVING PETAL DRIFT)
   Chao lượn 3D trong không gian, có cả cánh hoa đơn, cặp cánh hoa và lá phong
   nhỏ xoay lật trong luồng gió thi ca.
   ========================================================================= */
interface FallingParticleConfig {
  id: string;
  type: "maple" | "sakura-petal" | "sakura-pair";
  startX: string;
  driftX: number;
  duration: number;
  delay: number;
  scale: number;
  initialRotate: number;
  variant?: "crimson" | "scarlet" | "amber" | "ruby";
  mobileVisible?: boolean;
}

const FALLING_PARTICLES: FallingParticleConfig[] = [
  // Hạt rơi từ cành bên trái (lan tỏa tự nhiên từ 4% đến 32% chiều ngang)
  { id: "fp-1", type: "sakura-petal", startX: "5%", driftX: 50, duration: 8.2, delay: -1.8, scale: 1.0, initialRotate: 25, mobileVisible: true },
  { id: "fp-2", type: "maple", startX: "12%", driftX: 75, duration: 11.5, delay: -5.8, scale: 0.8, initialRotate: -40, variant: "crimson", mobileVisible: true },
  { id: "fp-3", type: "sakura-pair", startX: "19%", driftX: 40, duration: 9.2, delay: -3.5, scale: 0.9, initialRotate: 55, mobileVisible: false },
  { id: "fp-4", type: "maple", startX: "8%", driftX: 60, duration: 12.8, delay: -9.2, scale: 0.68, initialRotate: 18, variant: "amber", mobileVisible: true },
  { id: "fp-5", type: "sakura-petal", startX: "26%", driftX: -35, duration: 7.6, delay: -0.9, scale: 1.15, initialRotate: -25, mobileVisible: false },
  { id: "fp-6", type: "maple", startX: "16%", driftX: 45, duration: 10.6, delay: -4.5, scale: 0.85, initialRotate: 65, variant: "scarlet", mobileVisible: false },
  { id: "fp-7", type: "sakura-petal", startX: "22%", driftX: 30, duration: 8.8, delay: -7.2, scale: 0.75, initialRotate: -15, mobileVisible: true },

  // Hạt rơi từ cành bên phải (lan tỏa tự nhiên từ 68% đến 96% chiều ngang)
  { id: "fp-8", type: "sakura-petal", startX: "93%", driftX: -50, duration: 8.6, delay: -2.8, scale: 0.95, initialRotate: -32, mobileVisible: true },
  { id: "fp-9", type: "maple", startX: "85%", driftX: -70, duration: 12.0, delay: -6.8, scale: 0.78, initialRotate: 48, variant: "ruby", mobileVisible: true },
  { id: "fp-10", type: "sakura-pair", startX: "78%", driftX: -42, duration: 9.8, delay: -1.5, scale: 1.05, initialRotate: 18, mobileVisible: false },
  { id: "fp-11", type: "maple", startX: "90%", driftX: -55, duration: 13.2, delay: -10.5, scale: 0.7, initialRotate: -60, variant: "scarlet", mobileVisible: true },
  { id: "fp-12", type: "sakura-petal", startX: "71%", driftX: 35, duration: 8.0, delay: -4.2, scale: 0.85, initialRotate: -12, mobileVisible: false },
  { id: "fp-13", type: "maple", startX: "81%", driftX: -45, duration: 11.0, delay: -8.5, scale: 0.82, initialRotate: 32, variant: "amber", mobileVisible: false },
  { id: "fp-14", type: "sakura-petal", startX: "75%", driftX: -30, duration: 9.0, delay: -6.1, scale: 0.8, initialRotate: 40, mobileVisible: true },
];

const FallingDriftingParticle = memo(({ p }: { p: FallingParticleConfig }) => {
  return (
    <div
      className={`absolute top-[-45px] pointer-events-none select-none z-10 ${
        !p.mobileVisible ? "hidden sm:block" : ""
      }`}
      style={{
        left: p.startX,
        animation: `fallingLeavesCascade ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
        animationDelay: `${p.delay}s`,
        ["--leaf-drift-x" as any]: `${p.driftX}px`,
        ["--leaf-rot-start" as any]: `${p.initialRotate}deg`,
        ["--leaf-rot-end" as any]: `${p.initialRotate + 360}deg`,
      }}
    >
      {p.type === "maple" ? (
        <svg
          width="28"
          height="32"
          viewBox="-25 -20 50 50"
          className="drop-shadow-xs"
          style={{ transform: `scale(${p.scale})` }}
        >
          <MomijiLeaf
            x={0}
            y={0}
            scale={1}
            rotate={0}
            variant={p.variant || "crimson"}
            opacity={0.92}
          />
        </svg>
      ) : p.type === "sakura-pair" ? (
        /* Cặp cánh hoa đào quấn quýt chao lượn */
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          className="drop-shadow-xs"
          style={{ transform: `scale(${p.scale})` }}
        >
          <path
            d="M 12,2 C 7,8 1,15 1,22 C 1,27 6,30 12,30 C 18,30 23,27 23,22 C 23,15 17,8 12,2 Z"
            fill="url(#sakuraPetalGrad)"
            opacity="0.92"
            transform="rotate(-15 12 16)"
          />
          <path
            d="M 18,6 C 14,11 9,16 9,21 C 9,25 13,27 18,27 C 23,27 26,25 26,21 C 26,16 22,11 18,6 Z"
            fill="url(#sakuraPetalGrad)"
            opacity="0.85"
            transform="rotate(25 18 17)"
          />
        </svg>
      ) : (
        /* Cánh hoa đào đơn bay lượn */
        <svg
          width="20"
          height="26"
          viewBox="0 0 24 30"
          className="drop-shadow-xs"
          style={{ transform: `scale(${p.scale})` }}
        >
          <path
            d="M 12,2 C 7,8 1,15 1,22 C 1,27 6,30 12,30 C 18,30 23,27 23,22 C 23,15 17,8 12,2 Z"
            fill="url(#sakuraPetalGrad)"
            opacity="0.94"
          />
        </svg>
      )}
    </div>
  );
});
FallingDriftingParticle.displayName = "FallingDriftingParticle";

/* =========================================================================
   6. COMPONENT CHÍNH: CORNER FLORAL BRANCHES (GÓC HEADER CÀNH HOA TỰ NHIÊN)
   - Tối ưu chuyển động mọc cành / thu cành theo nhịp thở hữu cơ
   - Hỗ trợ đa màn hình từ Mobile (<380px) đến Desktop Ultrawide
   ========================================================================= */
export function CornerFloralBranches() {
  const [isActive, setIsActive] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    let ticking = false;

    const checkScrollState = () => {
      const bookElem = document.getElementById("khong-gian-sach-tho");
      const currentScroll = window.scrollY;

      if (bookElem) {
        const rect = bookElem.getBoundingClientRect();
        // Vào phần sách: rect.top tiến sát viewport hoặc scroll đã vượt 280px
        const inBookZone = rect.top < window.innerHeight * 0.82 || currentScroll > 280;
        // Trở về đầu trang top giới thiệu: scroll < 180px và rect.top nằm cách xa viewport
        const atTopIntro = currentScroll < 180 && rect.top >= window.innerHeight * 0.8;

        if (atTopIntro) {
          setIsActive(false);
        } else if (inBookZone) {
          setIsActive(true);
        }
      } else {
        if (currentScroll < 180) {
          setIsActive(false);
        } else if (currentScroll > 280) {
          setIsActive(true);
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScrollState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    checkScrollState();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* 1. TOÀN CỤC SVG SHADERS & FILTERS */}
      <SharedBranchDefs />

      {/* 2. STYLE HOẠT ẢNH THI CA: ĐUNG ĐƯA THEO GIÓ & RỤNG LÁ */}
      <style jsx global>{`
        @keyframes fallingLeavesCascade {
          0% {
            transform: translate3d(0, -35px, 0) rotate(var(--leaf-rot-start, 0deg)) rotateY(0deg);
            opacity: 0;
          }
          8% {
            opacity: 0.98;
          }
          45% {
            transform: translate3d(var(--leaf-drift-x, 45px), 48vh, 0)
              rotate(calc(var(--leaf-rot-start, 0deg) + 160deg))
              rotateY(180deg);
            opacity: 0.92;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translate3d(calc(var(--leaf-drift-x, 45px) * 1.65), 105vh, 0)
              rotate(var(--leaf-rot-end, 360deg))
              rotateY(360deg);
            opacity: 0;
          }
        }

        /* Chuyển động gió thoảng đa hài (Multi-harmonic Natural Breeze) */
        @keyframes organicBranchBreezeLeft {
          0%, 100% {
            transform: rotate(0deg) translate3d(0, 0, 0);
          }
          33% {
            transform: rotate(1.2deg) translate3d(2px, 1.5px, 0);
          }
          66% {
            transform: rotate(-0.6deg) translate3d(-1px, 0.8px, 0);
          }
        }

        @keyframes organicBranchBreezeRight {
          0%, 100% {
            transform: rotate(0deg) translate3d(0, 0, 0);
          }
          33% {
            transform: rotate(-1.2deg) translate3d(-2px, 1.5px, 0);
          }
          66% {
            transform: rotate(0.6deg) translate3d(1px, 0.8px, 0);
          }
        }

        .branch-organic-sway-left {
          animation: organicBranchBreezeLeft 8.4s ease-in-out infinite;
          transform-origin: 0% 0%;
        }

        .branch-organic-sway-right {
          animation: organicBranchBreezeRight 8.8s ease-in-out infinite;
          transform-origin: 100% 0%;
        }
      `}</style>

      {/* 3. KHUNG CÀNH HOA CỐ ĐỊNH GÓC HEADER (FIXED Z-35, POINTER-EVENTS-NONE) */}
      <AnimatePresence>
        {isActive && (
          <div
            className="fixed inset-0 pointer-events-none z-35 overflow-hidden select-none"
            aria-hidden="true"
          >
            {/* --- CÀNH HOA GÓC TRÁI (TOP-LEFT CORNER) --- */}
            <motion.div
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: -85, y: -55, scale: 0.84, rotate: -9 }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: -75, y: -45, scale: 0.86, rotate: -7 }
              }
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1], // Spring-like natural ease
              }}
              className="absolute top-0 left-[-4px] sm:left-0 w-[160px] xs:w-[190px] sm:w-[285px] md:w-[365px] lg:w-[435px] xl:w-[490px] max-w-[46vw] h-[135px] xs:h-[160px] sm:h-[240px] md:h-[305px] lg:h-[365px] xl:h-[410px] pointer-events-none origin-top-left"
            >
              <div className="w-full h-full branch-organic-sway-left">
                <LeftCornerBranchSvg />
              </div>
            </motion.div>

            {/* --- CÀNH HOA GÓC PHẢI (TOP-RIGHT CORNER) --- */}
            <motion.div
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: 85, y: -55, scale: 0.84, rotate: 9 }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: 75, y: -45, scale: 0.86, rotate: 7 }
              }
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute top-0 right-[-4px] sm:right-0 w-[160px] xs:w-[190px] sm:w-[285px] md:w-[365px] lg:w-[435px] xl:w-[490px] max-w-[46vw] h-[135px] xs:h-[160px] sm:h-[240px] md:h-[305px] lg:h-[365px] xl:h-[410px] pointer-events-none origin-top-right"
            >
              <div className="w-full h-full branch-organic-sway-right">
                <RightCornerBranchSvg />
              </div>
            </motion.div>

            {/* --- HỆ THỐNG LÁ & CÁNH HOA RƠI LÃNG MẠN --- */}
            {!prefersReduced && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                {FALLING_PARTICLES.map((particle) => (
                  <FallingDriftingParticle key={particle.id} p={particle} />
                ))}
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
