"use client";

import React from "react";
import Image from "next/image";
import { FloatingVersePill } from "./FloatingVersePill";

export function FloralDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* CỤM HOA GÓC DƯỚI BÊN TRÁI (BOTTOM-LEFT CLUSTER) */}
      <div className="absolute -bottom-10 -left-12 md:left-0 w-[280px] sm:w-[380px] md:w-[480px] h-[350px] sm:h-[450px] pointer-events-auto">
        {/* Flower Pink 1 */}
        <div
          className="absolute bottom-6 left-6 w-20 h-20 sm:w-28 sm:h-28 floral-sway-rotate cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
          style={{ "--sway-duration": "4.6s", "--sway-rotate-from": "-15deg", "--sway-rotate-to": "12deg" } as any}
        >
          <div className="floral-sway-translate" style={{ "--sway-duration": "5.1s" } as any}>
            <Image
              src="/floral/flower-pink.png"
              alt="Hoa anh đào"
              width={112}
              height={112}
              className="w-full h-full object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Flower Yellow 1 */}
        <div
          className="absolute bottom-24 left-24 w-16 h-16 sm:w-24 sm:h-24 floral-sway-rotate cursor-pointer transition-transform duration-300 hover:scale-110"
          style={{ "--sway-duration": "3.9s", "--sway-rotate-from": "10deg", "--sway-rotate-to": "-20deg" } as any}
        >
          <div className="floral-sway-translate" style={{ "--sway-duration": "4.4s" } as any}>
            <Image
              src="/floral/flower-yellow.png"
              alt="Hoa vàng"
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Leaf 1 */}
        <div
          className="absolute bottom-2 left-28 w-14 h-14 sm:w-20 sm:h-20 floral-sway-rotate"
          style={{ "--sway-duration": "5.2s", "--sway-rotate-from": "-5deg", "--sway-rotate-to": "25deg" } as any}
        >
          <Image
            src="/floral/leaf-1.png"
            alt="Lá biếc"
            width={80}
            height={80}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>

        {/* Leaf 2 */}
        <div
          className="absolute bottom-28 left-4 w-12 h-12 sm:w-16 sm:h-16 floral-sway-rotate"
          style={{ "--sway-duration": "4.8s", "--sway-rotate-from": "20deg", "--sway-rotate-to": "-15deg" } as any}
        >
          <Image
            src="/floral/leaf-2.png"
            alt="Nhành lá"
            width={64}
            height={64}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>

        {/* Flower Pink Mini */}
        <div
          className="absolute bottom-40 left-16 w-12 h-12 sm:w-16 sm:h-16 floral-sway-rotate cursor-pointer hover:scale-110"
          style={{ "--sway-duration": "3.5s", "--sway-rotate-from": "-30deg", "--sway-rotate-to": "5deg" } as any}
        >
          <Image
            src="/floral/flower-pink.png"
            alt="Hoa nhỏ"
            width={64}
            height={64}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>

        {/* Floating Pills góc trái */}
        <div className="absolute bottom-36 left-28 z-20 hidden sm:block">
          <FloatingVersePill label="--thơ-lục-bát" iconDotColor="#2D5A3D" delay={0.2} />
        </div>
        <div className="absolute bottom-12 left-44 z-20 hidden md:block">
          <FloatingVersePill label="--tuyển-tập-ánh-thịnh" iconDotColor="#D97706" delay={0.8} />
        </div>
      </div>

      {/* CỤM HOA GÓC DƯỚI BÊN PHẢI (BOTTOM-RIGHT CLUSTER) */}
      <div className="absolute -bottom-10 -right-12 md:right-0 w-[280px] sm:w-[380px] md:w-[480px] h-[350px] sm:h-[450px] pointer-events-auto">
        {/* Flower Pink Right */}
        <div
          className="absolute bottom-8 right-8 w-20 h-20 sm:w-28 sm:h-28 floral-sway-rotate cursor-pointer transition-transform duration-300 hover:scale-110"
          style={{ "--sway-duration": "4.3s", "--sway-rotate-from": "15deg", "--sway-rotate-to": "-10deg" } as any}
        >
          <div className="floral-sway-translate" style={{ "--sway-duration": "4.9s" } as any}>
            <Image
              src="/floral/flower-pink.png"
              alt="Hoa anh đào"
              width={112}
              height={112}
              className="w-full h-full object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Flower Yellow Right */}
        <div
          className="absolute bottom-28 right-24 w-16 h-16 sm:w-24 sm:h-24 floral-sway-rotate cursor-pointer transition-transform duration-300 hover:scale-110"
          style={{ "--sway-duration": "4.0s", "--sway-rotate-from": "-15deg", "--sway-rotate-to": "15deg" } as any}
        >
          <div className="floral-sway-translate" style={{ "--sway-duration": "5.4s" } as any}>
            <Image
              src="/floral/flower-yellow.png"
              alt="Hoa vàng"
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Leaf 1 Right */}
        <div
          className="absolute bottom-4 right-28 w-14 h-14 sm:w-20 sm:h-20 floral-sway-rotate"
          style={{ "--sway-duration": "5.5s", "--sway-rotate-from": "10deg", "--sway-rotate-to": "-20deg" } as any}
        >
          <Image
            src="/floral/leaf-1.png"
            alt="Lá biếc"
            width={80}
            height={80}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>

        {/* Leaf 2 Right */}
        <div
          className="absolute bottom-32 right-6 w-12 h-12 sm:w-16 sm:h-16 floral-sway-rotate"
          style={{ "--sway-duration": "4.1s", "--sway-rotate-from": "-25deg", "--sway-rotate-to": "10deg" } as any}
        >
          <Image
            src="/floral/leaf-2.png"
            alt="Nhành lá"
            width={64}
            height={64}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>

        {/* Floating Pills góc phải */}
        <div className="absolute bottom-44 right-20 z-20 hidden sm:block">
          <FloatingVersePill label="--ngâm-thơ-audio" iconDotColor="#7C3AED" delay={0.5} />
        </div>
        <div className="absolute bottom-14 right-44 z-20 hidden md:block">
          <FloatingVersePill label="--điển-cố-văn-học" iconDotColor="#2563EB" delay={1.1} />
        </div>
      </div>
    </div>
  );
}
