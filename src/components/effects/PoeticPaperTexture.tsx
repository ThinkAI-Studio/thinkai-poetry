"use client";

import React from "react";

export function PoeticPaperTexture() {
  return (
    <>
      {/* 1. Bộ lọc SVG ẩn dùng để làm gợn sóng và rách mép mực loang mao dẫn trên giấy Dó */}
      <svg
        className="sr-only pointer-events-none absolute"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="ink-bleed-filter"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            {/* Sinh vân sợi giấy Dó ngẫu nhiên */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.045"
              numOctaves="4"
              result="paperNoise"
            />
            {/* Bẻ cong đường biên hình tròn thành mép loang thấm thớ sợi */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="paperNoise"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            {/* Làm nhòa nhẹ mép ngoài mô phỏng mực ngấm nước */}
            <feGaussianBlur in="displaced" stdDeviation="1.5" result="softInk" />
            <feMerge>
              <feMergeNode in="softInk" />
              <feMergeNode in="displaced" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* 2. Lớp Texture sần sùi của thớ giấy Dó trên toàn trang */}
      <div
        className="pointer-events-none fixed inset-0 z-[60] select-none opacity-[0.032] dark:opacity-[0.022] mix-blend-multiply dark:mix-blend-screen transition-opacity duration-700"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
