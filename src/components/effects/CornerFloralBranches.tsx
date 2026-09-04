"use client";

import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/lib/motion";

/* =========================================================================
   1. ĐỊNH NGHĨA VECTOR LÁ PHONG ĐỎ & HOA ĐÀO (JAPANESE MAPLE & CHERRY BLOSSOM)
   Chuẩn mực thẩm mỹ Á Đông theo hình ảnh tham khảo: Nhành cây gân guốc,
   lá phong đỏ nhiều thùy (Momiji) và hoa đào e ấp nở.
   ========================================================================= */

// Chiếc lá phong đỏ Nhật Bản (Momiji Leaf) với 7 thùy xẻ tinh xảo
const MomijiLeaf = memo(
  ({
    x,
    y,
    scale = 1,
    rotate = 0,
    variant = "crimson",
    opacity = 0.95,
  }: {
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
    variant?: "crimson" | "scarlet" | "amber" | "ruby";
    opacity?: number;
  }) => {
    const gradientId = `momiji-grad-${variant}`;
    return (
      <g
        transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
        opacity={opacity}
        className="transition-transform duration-300"
      >
        {/* Cuống lá mảnh mai */}
        <path
          d="M 0,0 Q -1,14 0,22"
          stroke="url(#momijiStemGrad)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Thân lá phong 7 thùy chuẩn xác */}
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
          fill={`url(#${gradientId})`}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="0.5"
          filter="url(#leafSoftGlow)"
        />
        {/* Gân lá tỏa nhẹ */}
        <path
          d="M 0,20 L 0,0
             M 0,16 L -10,3
             M 0,16 L 10,3
             M 0,12 L -13,-6
             M 0,12 L 13,-6"
          stroke="rgba(255, 235, 200, 0.35)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
      </g>
    );
  }
);
MomijiLeaf.displayName = "MomijiLeaf";

// Hoa đào / Hoa mơ 5 cánh thanh tao
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
      // Nụ hoa đào e ấp
      return (
        <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
          <path
            d="M 0,0 C -3,-4 -4,-9 -1,-13 C 2,-9 3,-4 0,0 Z"
            fill="url(#sakuraBudGrad)"
            stroke="rgba(120,20,30,0.4)"
            strokeWidth="0.6"
          />
          <path
            d="M -1,-1 C -4,-6 -2,-11 2,-12 C 1,-7 1,-3 -1,-1 Z"
            fill="url(#sakuraPetalGrad)"
            opacity="0.9"
          />
          <circle cx="0" cy="1" r="2" fill="#3D201A" />
        </g>
      );
    }

    return (
      <g
        transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
        filter="url(#sakuraDropShadow)"
      >
        {/* 5 Cánh hoa đào */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <path
            key={idx}
            transform={`rotate(${angle})`}
            d="M 0,0 C -5,-8 -9,-14 -6,-19 C -2,-21 2,-21 6,-19 C 9,-14 5,-8 0,0 Z"
            fill="url(#sakuraPetalGrad)"
            stroke="rgba(240, 160, 180, 0.4)"
            strokeWidth="0.5"
          />
        ))}
        {/* Nhụy hoa vàng kim */}
        <circle cx="0" cy="0" r="3.2" fill="#D97706" />
        <circle cx="0" cy="0" r="1.8" fill="#FEF3C7" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
          <line
            key={idx}
            x1="0"
            y1="0"
            x2={Math.cos((angle * Math.PI) / 180) * 5.2}
            y2={Math.sin((angle * Math.PI) / 180) * 5.2}
            stroke="#B45309"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        ))}
      </g>
    );
  }
);
CherryBlossomFlower.displayName = "CherryBlossomFlower";

/* =========================================================================
   2. BỘ ĐỊNH NGHĨA GRADIENT VÀ FILTER SVG TOÀN CỤC
   ========================================================================= */
const SharedBranchDefs = memo(() => (
  <svg width="0" height="0" className="absolute pointer-events-none">
    <defs>
      {/* Vỏ thân cành cây gỗ mun / trà trầm Á Đông */}
      <linearGradient id="branchBarkGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1B1410" />
        <stop offset="35%" stopColor="#2E211A" />
        <stop offset="70%" stopColor="#423026" />
        <stop offset="100%" stopColor="#1E1612" />
      </linearGradient>

      {/* Vỏ thân nhành con mảnh */}
      <linearGradient id="twigBarkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3B2A20" />
        <stop offset="100%" stopColor="#1C140E" />
      </linearGradient>

      {/* Cuống lá phong */}
      <linearGradient id="momijiStemGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7F1D1D" />
        <stop offset="100%" stopColor="#381E1E" />
      </linearGradient>

      {/* Biến thể màu lá phong: Crimson (Đỏ thắm kinh điển) */}
      <linearGradient id="momiji-grad-crimson" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#7F1D1D" />
        <stop offset="45%" stopColor="#B91C1C" />
        <stop offset="85%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#F87171" />
      </linearGradient>

      {/* Biến thể màu lá phong: Scarlet (Đỏ tươi rực ánh lửa) */}
      <linearGradient id="momiji-grad-scarlet" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#991B1B" />
        <stop offset="50%" stopColor="#DC2626" />
        <stop offset="85%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#FBAA50" />
      </linearGradient>

      {/* Biến thể màu lá phong: Amber (Hổ phách lá thu ngả vàng) */}
      <linearGradient id="momiji-grad-amber" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#854D0E" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="85%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>

      {/* Biến thể màu lá phong: Ruby (Hồng ngọc trầm mặc) */}
      <linearGradient id="momiji-grad-ruby" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#4C0519" />
        <stop offset="45%" stopColor="#831843" />
        <stop offset="80%" stopColor="#BE185D" />
        <stop offset="100%" stopColor="#FB7185" />
      </linearGradient>

      {/* Gradient cánh hoa đào (Sakura Blush) */}
      <radialGradient id="sakuraPetalGrad" cx="50%" cy="80%" r="70%">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="40%" stopColor="#FFE4E6" />
        <stop offset="80%" stopColor="#FDA4AF" />
        <stop offset="100%" stopColor="#F43F5E" />
      </radialGradient>

      {/* Gradient nụ hoa đào */}
      <linearGradient id="sakuraBudGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#881337" />
        <stop offset="60%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#FDA4AF" />
      </linearGradient>

      {/* Đổ bóng nhẹ cho cánh hoa */}
      <filter id="sakuraDropShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#000" floodOpacity="0.25" />
      </filter>

      {/* Phát sáng dịu nhẹ cho lá phong đỏ */}
      <filter id="leafSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1.5" floodColor="#450A0A" floodOpacity="0.3" />
      </filter>

      {/* Đổ bóng tự nhiên cho toàn bộ thân cành */}
      <filter id="branchDepthShadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="1" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.35" />
      </filter>
    </defs>
  </svg>
));
SharedBranchDefs.displayName = "SharedBranchDefs";

/* =========================================================================
   3. CÀNH HOA BÊN GÓC TRÁI HEADER (LEFT CORNER BRANCH)
   Xuất phát từ góc trên bên trái header, vươn tự nhiên xuống dưới & vào trong
   ========================================================================= */
const LeftCornerBranchSvg = memo(() => {
  return (
    <svg
      viewBox="0 0 460 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none pointer-events-none drop-shadow-md"
      preserveAspectRatio="xMinYMin meet"
    >
      <g filter="url(#branchDepthShadow)">
        {/* THÂN CHÍNH (Main Trunk): Xuất phát từ (-10, -5) lượn uốn khúc tự nhiên */}
        <path
          d="M -10,-5 
             C 45,25 95,45 150,70 
             C 205,95 260,115 315,150 
             C 345,170 375,195 405,225"
          stroke="url(#branchBarkGrad)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Nếp vỏ cây và khớp đốt */}
        <path
          d="M 5,3 C 35,22 80,40 135,62"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 1 (Vươn ngang trên - Upper Lateral Twig) */}
        <path
          d="M 115,55 
             C 145,35 185,25 225,22 
             C 255,20 280,28 305,42"
          stroke="url(#branchBarkGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 215,23 C 240,8 270,5 295,10"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 2 (Rủ xuống phía góc dưới trái - Drooping Left Twig) */}
        <path
          d="M 75,38 
             C 65,85 55,130 45,175 
             C 38,210 42,245 52,275"
          stroke="url(#branchBarkGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 52,145 C 70,180 82,215 90,250"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 3 (Trung tâm vươn xuống - Center Droop) */}
        <path
          d="M 210,95 
             C 230,135 240,175 235,215 
             C 230,245 215,275 200,305"
          stroke="url(#branchBarkGrad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 235,160 C 265,185 285,220 300,255"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 4 (Ngọn vươn vào lòng thi ca - Tapering Inward Tip) */}
        <path
          d="M 315,150 
             C 355,160 395,175 430,195 
             C 445,205 455,215 460,225"
          stroke="url(#twigBarkGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 365,185 C 385,220 405,250 425,275"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* CỤM LÁ PHONG ĐỎ & HOA ĐÀO BỐ TRÍ HÀI HÒA TRÊN CÀNH TRÁI */}
      {/* Cụm lá đỉnh trên */}
      <MomijiLeaf x={240} y={18} scale={0.9} rotate={-15} variant="crimson" />
      <MomijiLeaf x={275} y={15} scale={0.8} rotate={20} variant="scarlet" />
      <MomijiLeaf x={305} y={35} scale={0.7} rotate={45} variant="ruby" />
      <CherryBlossomFlower x={215} y={23} scale={0.85} rotate={10} isOpen={true} />
      <CherryBlossomFlower x={290} y={12} scale={0.65} rotate={-25} isOpen={false} />

      {/* Cụm nhánh rủ bên trái */}
      <MomijiLeaf x={50} y={135} scale={1.05} rotate={-65} variant="scarlet" />
      <MomijiLeaf x={42} y={185} scale={0.95} rotate={-45} variant="crimson" />
      <MomijiLeaf x={55} y={240} scale={0.85} rotate={-30} variant="ruby" />
      <MomijiLeaf x={85} y={220} scale={0.75} rotate={15} variant="amber" />
      <MomijiLeaf x={52} y={285} scale={0.68} rotate={-10} variant="crimson" />
      <CherryBlossomFlower x={46} y={160} scale={0.9} rotate={-20} isOpen={true} />
      <CherryBlossomFlower x={78} y={205} scale={0.75} rotate={35} isOpen={true} />
      <CherryBlossomFlower x={50} y={270} scale={0.6} rotate={-10} isOpen={false} />

      {/* Cụm nhánh chính giữa vươn xuống */}
      <MomijiLeaf x={155} y={75} scale={1.15} rotate={10} variant="crimson" />
      <MomijiLeaf x={185} y={85} scale={0.95} rotate={-20} variant="scarlet" />
      <MomijiLeaf x={235} y={135} scale={1.0} rotate={35} variant="ruby" />
      <MomijiLeaf x={238} y={190} scale={0.88} rotate={-15} variant="crimson" />
      <MomijiLeaf x={215} y={255} scale={0.8} rotate={25} variant="amber" />
      <MomijiLeaf x={198} y={310} scale={0.7} rotate={-5} variant="scarlet" />
      <MomijiLeaf x={280} y={205} scale={0.85} rotate={40} variant="scarlet" />
      <MomijiLeaf x={300} y={260} scale={0.72} rotate={20} variant="crimson" />

      {/* Hoa đào điểm xuyết thân giữa */}
      <CherryBlossomFlower x={145} y={68} scale={1.1} rotate={-12} isOpen={true} />
      <CherryBlossomFlower x={230} y={115} scale={0.95} rotate={28} isOpen={true} />
      <CherryBlossomFlower x={236} y={170} scale={0.85} rotate={-18} isOpen={true} />
      <CherryBlossomFlower x={275} y={190} scale={0.7} rotate={15} isOpen={false} />
      <CherryBlossomFlower x={210} y={280} scale={0.75} rotate={-8} isOpen={true} />

      {/* Cụm ngọn vươn vào khung sách thơ */}
      <MomijiLeaf x={330} y={155} scale={1.05} rotate={-10} variant="crimson" />
      <MomijiLeaf x={375} y={175} scale={0.9} rotate={25} variant="scarlet" />
      <MomijiLeaf x={425} y={195} scale={0.82} rotate={-15} variant="ruby" />
      <MomijiLeaf x={455} y={225} scale={0.65} rotate={30} variant="crimson" />
      <MomijiLeaf x={415} y={250} scale={0.78} rotate={10} variant="amber" />
      <CherryBlossomFlower x={350} y={160} scale={1.05} rotate={14} isOpen={true} />
      <CherryBlossomFlower x={405} y={185} scale={0.9} rotate={-24} isOpen={true} />
      <CherryBlossomFlower x={440} y={210} scale={0.65} rotate={15} isOpen={false} />
    </svg>
  );
});
LeftCornerBranchSvg.displayName = "LeftCornerBranchSvg";

/* =========================================================================
   4. CÀNH HOA BÊN GÓC PHẢI HEADER (RIGHT CORNER BRANCH)
   Xuất phát từ góc trên bên phải header, vươn tự nhiên xuống dưới & sang trái
   ========================================================================= */
const RightCornerBranchSvg = memo(() => {
  return (
    <svg
      viewBox="0 0 460 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none pointer-events-none drop-shadow-md"
      preserveAspectRatio="xMaxYMin meet"
    >
      <g filter="url(#branchDepthShadow)">
        {/* THÂN CHÍNH (Main Trunk): Xuất phát từ (470, -5) lượn cong sang trái */}
        <path
          d="M 470,-5 
             C 415,25 365,45 310,70 
             C 255,95 200,115 145,150 
             C 115,170 85,195 55,225"
          stroke="url(#branchBarkGrad)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Nếp vỏ cây phản chiếu ánh trăng */}
        <path
          d="M 455,3 C 425,22 380,40 325,62"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 1 (Vươn ngang trên phía phải) */}
        <path
          d="M 345,55 
             C 315,35 275,25 235,22 
             C 205,20 180,28 155,42"
          stroke="url(#branchBarkGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 245,23 C 220,8 190,5 165,10"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 2 (Rủ xuống phía góc phải ngoài) */}
        <path
          d="M 385,38 
             C 395,85 405,130 415,175 
             C 422,210 418,245 408,275"
          stroke="url(#branchBarkGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 408,145 C 390,180 378,215 370,250"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 3 (Trung tâm vươn xuống nghiêng trái) */}
        <path
          d="M 250,95 
             C 230,135 220,175 225,215 
             C 230,245 245,275 260,305"
          stroke="url(#branchBarkGrad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 225,160 C 195,185 175,220 160,255"
          stroke="url(#twigBarkGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* NHÁNH PHỤ 4 (Ngọn vươn vào lòng sách thơ bên phải) */}
        <path
          d="M 145,150 
             C 105,160 65,175 30,195 
             C 15,205 5,215 0,225"
          stroke="url(#twigBarkGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 95,185 C 75,220 55,250 35,275"
          stroke="url(#twigBarkGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* CỤM LÁ PHONG ĐỎ & HOA ĐÀO TRÊN CÀNH PHẢI */}
      {/* Cụm lá đỉnh trên */}
      <MomijiLeaf x={220} y={18} scale={0.9} rotate={15} variant="crimson" />
      <MomijiLeaf x={185} y={15} scale={0.8} rotate={-20} variant="scarlet" />
      <MomijiLeaf x={155} y={35} scale={0.7} rotate={-45} variant="ruby" />
      <CherryBlossomFlower x={245} y={23} scale={0.85} rotate={-10} isOpen={true} />
      <CherryBlossomFlower x={170} y={12} scale={0.65} rotate={25} isOpen={false} />

      {/* Cụm nhánh rủ bên phải */}
      <MomijiLeaf x={410} y={135} scale={1.05} rotate={65} variant="scarlet" />
      <MomijiLeaf x={418} y={185} scale={0.95} rotate={45} variant="crimson" />
      <MomijiLeaf x={405} y={240} scale={0.85} rotate={30} variant="ruby" />
      <MomijiLeaf x={375} y={220} scale={0.75} rotate={-15} variant="amber" />
      <MomijiLeaf x={408} y={285} scale={0.68} rotate={10} variant="crimson" />
      <CherryBlossomFlower x={414} y={160} scale={0.9} rotate={20} isOpen={true} />
      <CherryBlossomFlower x={382} y={205} scale={0.75} rotate={-35} isOpen={true} />
      <CherryBlossomFlower x={410} y={270} scale={0.6} rotate={10} isOpen={false} />

      {/* Cụm nhánh chính giữa */}
      <MomijiLeaf x={305} y={75} scale={1.15} rotate={-10} variant="crimson" />
      <MomijiLeaf x={275} y={85} scale={0.95} rotate={20} variant="scarlet" />
      <MomijiLeaf x={225} y={135} scale={1.0} rotate={-35} variant="ruby" />
      <MomijiLeaf x={222} y={190} scale={0.88} rotate={15} variant="crimson" />
      <MomijiLeaf x={245} y={255} scale={0.8} rotate={-25} variant="amber" />
      <MomijiLeaf x={262} y={310} scale={0.7} rotate={5} variant="scarlet" />
      <MomijiLeaf x={180} y={205} scale={0.85} rotate={-40} variant="scarlet" />
      <MomijiLeaf x={160} y={260} scale={0.72} rotate={-20} variant="crimson" />

      {/* Hoa đào điểm xuyết thân giữa */}
      <CherryBlossomFlower x={315} y={68} scale={1.1} rotate={12} isOpen={true} />
      <CherryBlossomFlower x={230} y={115} scale={0.95} rotate={-28} isOpen={true} />
      <CherryBlossomFlower x={224} y={170} scale={0.85} rotate={18} isOpen={true} />
      <CherryBlossomFlower x={185} y={190} scale={0.7} rotate={-15} isOpen={false} />
      <CherryBlossomFlower x={250} y={280} scale={0.75} rotate={8} isOpen={true} />

      {/* Cụm ngọn vươn vào phía trên bên phải */}
      <MomijiLeaf x={130} y={155} scale={1.05} rotate={10} variant="crimson" />
      <MomijiLeaf x={85} y={175} scale={0.9} rotate={-25} variant="scarlet" />
      <MomijiLeaf x={35} y={195} scale={0.82} rotate={15} variant="ruby" />
      <MomijiLeaf x={5} y={225} scale={0.65} rotate={-30} variant="crimson" />
      <MomijiLeaf x={45} y={250} scale={0.78} rotate={-10} variant="amber" />
      <CherryBlossomFlower x={110} y={160} scale={1.05} rotate={-14} isOpen={true} />
      <CherryBlossomFlower x={55} y={185} scale={0.9} rotate={24} isOpen={true} />
      <CherryBlossomFlower x={20} y={210} scale={0.65} rotate={-15} isOpen={false} />
    </svg>
  );
});
RightCornerBranchSvg.displayName = "RightCornerBranchSvg";

/* =========================================================================
   5. HỆ THỐNG LÁ VÀ CÁNH HOA RƠI TỰ NHIÊN ("bắt đầu rụng lá hoa")
   Rơi chậm rãi, chao lượn trong gió thi ca, biến hóa 3D tự nhiên
   ========================================================================= */
interface FallingParticleConfig {
  id: string;
  type: "maple" | "sakura-petal";
  startX: string; // Tỷ lệ phần trăm từ cạnh
  driftX: number; // Dao động gió ngang
  duration: number; // Thời gian rơi (giây)
  delay: number; // Độ trễ âm để xuất hiện ngay lập tức
  scale: number;
  initialRotate: number;
  variant?: "crimson" | "scarlet" | "amber" | "ruby";
  mobileVisible?: boolean;
}

// 12 hạt lá & cánh hoa với quỹ đạo ngẫu nhiên phong phú
const FALLING_PARTICLES: FallingParticleConfig[] = [
  // Hạt rơi từ cành bên trái
  { id: "fp-1", type: "sakura-petal", startX: "6%", driftX: 45, duration: 8.5, delay: -2.0, scale: 0.95, initialRotate: 25, mobileVisible: true },
  { id: "fp-2", type: "maple", startX: "13%", driftX: 65, duration: 11.2, delay: -6.4, scale: 0.75, initialRotate: -35, variant: "crimson", mobileVisible: true },
  { id: "fp-3", type: "sakura-petal", startX: "20%", driftX: 35, duration: 9.0, delay: -4.1, scale: 0.85, initialRotate: 50, mobileVisible: false },
  { id: "fp-4", type: "maple", startX: "9%", driftX: 55, duration: 12.5, delay: -9.8, scale: 0.65, initialRotate: 15, variant: "amber", mobileVisible: true },
  { id: "fp-5", type: "sakura-petal", startX: "27%", driftX: -30, duration: 7.8, delay: -1.2, scale: 1.1, initialRotate: -20, mobileVisible: false },
  { id: "fp-6", type: "maple", startX: "17%", driftX: 40, duration: 10.4, delay: -5.0, scale: 0.8, initialRotate: 70, variant: "scarlet", mobileVisible: false },

  // Hạt rơi từ cành bên phải
  { id: "fp-7", type: "sakura-petal", startX: "92%", driftX: -45, duration: 8.8, delay: -3.2, scale: 0.9, initialRotate: -30, mobileVisible: true },
  { id: "fp-8", type: "maple", startX: "84%", driftX: -60, duration: 11.8, delay: -7.5, scale: 0.72, initialRotate: 45, variant: "ruby", mobileVisible: true },
  { id: "fp-9", type: "sakura-petal", startX: "77%", driftX: -35, duration: 9.5, delay: -1.8, scale: 1.05, initialRotate: 15, mobileVisible: false },
  { id: "fp-10", type: "maple", startX: "89%", driftX: -50, duration: 13.0, delay: -10.2, scale: 0.68, initialRotate: -55, variant: "scarlet", mobileVisible: true },
  { id: "fp-11", type: "sakura-petal", startX: "70%", driftX: 30, duration: 8.2, delay: -4.8, scale: 0.8, initialRotate: -10, mobileVisible: false },
  { id: "fp-12", type: "maple", startX: "80%", driftX: -40, duration: 10.8, delay: -8.0, scale: 0.78, initialRotate: 30, variant: "amber", mobileVisible: false },
];

const FallingDriftingParticle = memo(({ p }: { p: FallingParticleConfig }) => {
  return (
    <div
      className={`absolute top-[-40px] pointer-events-none select-none z-10 ${
        !p.mobileVisible ? "hidden sm:block" : ""
      }`}
      style={{
        left: p.startX,
        animation: `fallingLeavesCascade ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
        animationDelay: `${p.delay}s`,
        // Biến số gió ngang tùy chỉnh
        ["--leaf-drift-x" as any]: `${p.driftX}px`,
        ["--leaf-rot-start" as any]: `${p.initialRotate}deg`,
        ["--leaf-rot-end" as any]: `${p.initialRotate + 360}deg`,
      }}
    >
      {p.type === "maple" ? (
        <svg
          width="26"
          height="30"
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
            opacity={0.88}
          />
        </svg>
      ) : (
        /* Cánh hoa đào lãng mạn */
        <svg
          width="18"
          height="24"
          viewBox="0 0 24 30"
          className="drop-shadow-xs"
          style={{ transform: `scale(${p.scale})` }}
        >
          <path
            d="M 12,2 C 7,8 1,15 1,22 C 1,27 6,30 12,30 C 18,30 23,27 23,22 C 23,15 17,8 12,2 Z"
            fill="url(#sakuraPetalGrad)"
            opacity="0.9"
          />
        </svg>
      )}
    </div>
  );
});
FallingDriftingParticle.displayName = "FallingDriftingParticle";

/* =========================================================================
   6. COMPONENT CHÍNH: CORNER FLORAL BRANCHES (GÓC HEADER CÀNH HOA)
   - Theo dõi scroll: Khi vào phần sách (#khong-gian-sach-tho) -> Mọc ra 2 cành
   - Bắt đầu rụng lá và cánh hoa bay lượn
   - Khi cuộn ngược lên top giới thiệu -> Tự động co cành và ẩn đi
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
        // Ngưỡng vào phần sách: khi phần sách tiến vào gần viewport (top < 82% chiều cao màn hình)
        // hoặc khi đã cuộn qua hơn 280px
        const inBookZone = rect.top < window.innerHeight * 0.82 || currentScroll > 280;
        // Ngưỡng cuộn ngược lại top giới thiệu: khi người dùng lướt hẳn về phía trên (scroll < 180px)
        const atTopIntro = currentScroll < 180 && rect.top >= window.innerHeight * 0.8;

        if (atTopIntro) {
          setIsActive(false);
        } else if (inBookZone) {
          setIsActive(true);
        }
      } else {
        // Fallback pixel
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
    checkScrollState(); // Khởi chạy ngay khi mount

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* 1. ĐỊNH NGHĨA GLOBAL SVG DEFS (GRADIENTS & SHADOWS) */}
      <SharedBranchDefs />

      {/* 2. STYLE TỐI ƯU CHO HOẠT ẢNH RỤNG LÁ & ĐUNG ĐƯA THEO GIÓ */}
      <style jsx global>{`
        @keyframes fallingLeavesCascade {
          0% {
            transform: translate3d(0, -30px, 0) rotate(var(--leaf-rot-start, 0deg)) rotateY(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          45% {
            transform: translate3d(var(--leaf-drift-x, 40px), 48vh, 0)
              rotate(calc(var(--leaf-rot-start, 0deg) + 140deg))
              rotateY(180deg);
            opacity: 0.88;
          }
          85% {
            opacity: 0.75;
          }
          100% {
            transform: translate3d(calc(var(--leaf-drift-x, 40px) * 1.6), 105vh, 0)
              rotate(var(--leaf-rot-end, 360deg))
              rotateY(360deg);
            opacity: 0;
          }
        }

        @keyframes subtleBranchBreezeLeft {
          0%, 100% {
            transform: rotate(0deg) translate3d(0, 0, 0);
          }
          50% {
            transform: rotate(1.4deg) translate3d(1.5px, 2px, 0);
          }
        }

        @keyframes subtleBranchBreezeRight {
          0%, 100% {
            transform: rotate(0deg) translate3d(0, 0, 0);
          }
          50% {
            transform: rotate(-1.4deg) translate3d(-1.5px, 2px, 0);
          }
        }

        .branch-wind-sway-left {
          animation: subtleBranchBreezeLeft 7.2s ease-in-out infinite;
          transform-origin: top left;
        }

        .branch-wind-sway-right {
          animation: subtleBranchBreezeRight 7.6s ease-in-out infinite;
          transform-origin: top right;
        }
      `}</style>

      {/* 3. KHUNG CÀNH HOA & LÁ RƠI: CỐ ĐỊNH PHÍA GÓC HEADER (FIXED Z-35) */}
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
                  : { opacity: 0, x: -70, y: -50, scale: 0.85, rotate: -10 }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: -60, y: -40, scale: 0.88, rotate: -8 }
              }
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1], // Cubic-bezier loang mực thanh thoát
              }}
              className="absolute top-0 left-[-6px] sm:left-0 w-[150px] xs:w-[175px] sm:w-[260px] md:w-[340px] lg:w-[410px] xl:w-[460px] max-w-[46vw] h-[125px] xs:h-[145px] sm:h-[215px] md:h-[280px] lg:h-[335px] xl:h-[375px] pointer-events-none origin-top-left"
            >
              <div className="w-full h-full branch-wind-sway-left">
                <LeftCornerBranchSvg />
              </div>
            </motion.div>

            {/* --- CÀNH HOA GÓC PHẢI (TOP-RIGHT CORNER) --- */}
            <motion.div
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: 70, y: -50, scale: 0.85, rotate: 10 }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: 60, y: -40, scale: 0.88, rotate: 8 }
              }
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute top-0 right-[-6px] sm:right-0 w-[150px] xs:w-[175px] sm:w-[260px] md:w-[340px] lg:w-[410px] xl:w-[460px] max-w-[46vw] h-[125px] xs:h-[145px] sm:h-[215px] md:h-[280px] lg:h-[335px] xl:h-[375px] pointer-events-none origin-top-right"
            >
              <div className="w-full h-full branch-wind-sway-right">
                <RightCornerBranchSvg />
              </div>
            </motion.div>

            {/* --- HỆ THỐNG CÁNH HOA & LÁ PHONG RƠI (FALLING LEAVES CASCADE) --- */}
            {!prefersReduced && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
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
