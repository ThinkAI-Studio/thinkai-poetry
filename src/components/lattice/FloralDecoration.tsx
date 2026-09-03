"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface BurstPetal {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
}

interface FloralItem {
  id: string;
  type: "pink" | "yellow" | "leaf1" | "leaf2";
  bottom: string;
  left?: string;
  right?: string;
  size: number;
  initialRotate: number;
  zIndex: number;
  duration: number;
}

// Cụm hoa góc trái dày dặn phong cách Sora Lattice (như trong ảnh mẫu)
const leftClusterItems: FloralItem[] = [
  { id: "l1", type: "pink", bottom: "10px", left: "-20px", size: 120, initialRotate: -15, zIndex: 12, duration: 4.8 },
  { id: "l2", type: "yellow", bottom: "40px", left: "60px", size: 110, initialRotate: 10, zIndex: 11, duration: 4.2 },
  { id: "l3", type: "pink", bottom: "110px", left: "10px", size: 95, initialRotate: -25, zIndex: 10, duration: 5.1 },
  { id: "l4", type: "yellow", bottom: "90px", left: "120px", size: 85, initialRotate: -5, zIndex: 9, duration: 4.4 },
  { id: "l5", type: "pink", bottom: "160px", left: "50px", size: 75, initialRotate: 20, zIndex: 8, duration: 3.9 },
  { id: "l6", type: "leaf1", bottom: "5px", left: "150px", size: 90, initialRotate: 30, zIndex: 7, duration: 5.5 },
  { id: "l7", type: "leaf2", bottom: "130px", left: "-10px", size: 80, initialRotate: -35, zIndex: 6, duration: 4.6 },
  { id: "l8", type: "yellow", bottom: "200px", left: "10px", size: 65, initialRotate: -15, zIndex: 5, duration: 3.7 },
  { id: "l9", type: "pink", bottom: "170px", left: "130px", size: 70, initialRotate: 15, zIndex: 7, duration: 4.5 },
  { id: "l10", type: "leaf1", bottom: "80px", left: "-25px", size: 85, initialRotate: -45, zIndex: 6, duration: 5.0 },
  { id: "l11", type: "pink", bottom: "-10px", left: "80px", size: 100, initialRotate: 5, zIndex: 10, duration: 4.3 },
  { id: "l12", type: "yellow", bottom: "230px", left: "70px", size: 55, initialRotate: -10, zIndex: 4, duration: 3.5 },
];

// Cụm hoa góc phải dày dặn phong cách Sora Lattice (như trong ảnh mẫu)
const rightClusterItems: FloralItem[] = [
  { id: "r1", type: "pink", bottom: "15px", right: "-15px", size: 125, initialRotate: 15, zIndex: 12, duration: 4.7 },
  { id: "r2", type: "yellow", bottom: "45px", right: "70px", size: 105, initialRotate: -10, zIndex: 11, duration: 4.3 },
  { id: "r3", type: "pink", bottom: "115px", right: "15px", size: 90, initialRotate: 25, zIndex: 10, duration: 5.0 },
  { id: "r4", type: "yellow", bottom: "95px", right: "130px", size: 85, initialRotate: 10, zIndex: 9, duration: 4.1 },
  { id: "r5", type: "pink", bottom: "165px", right: "60px", size: 80, initialRotate: -20, zIndex: 8, duration: 3.8 },
  { id: "r6", type: "leaf1", bottom: "10px", right: "150px", size: 90, initialRotate: -30, zIndex: 7, duration: 5.3 },
  { id: "r7", type: "leaf2", bottom: "135px", right: "-10px", size: 80, initialRotate: 40, zIndex: 6, duration: 4.9 },
  { id: "r8", type: "yellow", bottom: "205px", right: "15px", size: 65, initialRotate: 15, zIndex: 5, duration: 3.6 },
  { id: "r9", type: "pink", bottom: "175px", right: "140px", size: 70, initialRotate: -15, zIndex: 7, duration: 4.4 },
  { id: "r10", type: "leaf1", bottom: "85px", right: "-25px", size: 85, initialRotate: 35, zIndex: 6, duration: 5.2 },
  { id: "r11", type: "yellow", bottom: "-10px", right: "75px", size: 95, initialRotate: -8, zIndex: 10, duration: 4.2 },
  { id: "r12", type: "pink", bottom: "235px", right: "75px", size: 55, initialRotate: 12, zIndex: 4, duration: 3.4 },
];

export function FloralDecoration() {
  const [burstPetals, setBurstPetals] = useState<BurstPetal[]>([]);

  // Tương tác khi người dùng click vào hoa: Phun cánh hoa màu nước bay nhẹ nhàng
  const handleFlowerClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ["#F8D7DA", "#FDE68A", "#FBCFE8", "#FED7AA", "#FEF08A"];
    const newPetals: BurstPetal[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 140,
      vy: -Math.random() * 90 - 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.floor(Math.random() * 10) + 12,
      rotation: Math.random() * 360,
    }));

    setBurstPetals((prev) => [...prev.slice(-18), ...newPetals]);

    // Xóa cánh hoa sau khi hoạt ảnh kết thúc
    setTimeout(() => {
      setBurstPetals((prev) => prev.filter((p) => !newPetals.some((np) => np.id === p.id)));
    }, 2000);
  };

  const renderFloralItem = (item: FloralItem, side: "left" | "right") => {
    const imgSrc =
      item.type === "pink"
        ? "/floral/flower-pink.png"
        : item.type === "yellow"
        ? "/floral/flower-yellow.png"
        : item.type === "leaf1"
        ? "/floral/leaf-1.png"
        : "/floral/leaf-2.png";

    const isLeaf = item.type.startsWith("leaf");

    return (
      <motion.div
        key={item.id}
        onClick={!isLeaf ? handleFlowerClick : undefined}
        className={`absolute select-none ${isLeaf ? "pointer-events-none" : "cursor-pointer pointer-events-auto"}`}
        style={{
          bottom: item.bottom,
          ...(side === "left" ? { left: item.left } : { right: item.right }),
          width: item.size,
          height: item.size,
          zIndex: item.zIndex,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          rotate: [item.initialRotate - 4, item.initialRotate + 4, item.initialRotate - 4],
          y: [0, -6, 0],
        }}
        transition={{
          rotate: { duration: item.duration, repeat: Infinity, ease: "easeInOut" },
          y: { duration: item.duration * 1.1, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.6, ease: "easeOut" },
        }}
        whileHover={
          !isLeaf
            ? {
                scale: 1.25,
                rotate: item.initialRotate + (side === "left" ? -8 : 8),
                transition: { type: "spring", stiffness: 400, damping: 12 },
              }
            : undefined
        }
        whileTap={!isLeaf ? { scale: 0.88 } : undefined}
        title={!isLeaf ? "Bấm vào hoa để bung cánh hoa bay trong gió" : undefined}
      >
        <Image
          src={imgSrc}
          alt="Hoa thi ca"
          width={item.size}
          height={item.size}
          className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 pointer-events-none"
          draggable={false}
          priority
        />
      </motion.div>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* CÁNH HOA BAY TRÔI TỰ DO TRONG GIÓ (SORA LATTICE AMBIENT PETALS) */}
      <div className="absolute inset-0 overflow-hidden">
        {[
          { id: "p1", top: "18%", left: "8%", size: 14, rotate: 25, duration: 16, delay: 0 },
          { id: "p2", top: "45%", left: "18%", size: 16, rotate: -40, duration: 20, delay: 3 },
          { id: "p3", top: "25%", right: "12%", size: 15, rotate: 35, duration: 18, delay: 1.5 },
          { id: "p4", top: "60%", right: "22%", size: 18, rotate: -15, duration: 22, delay: 4 },
          { id: "p5", top: "75%", left: "38%", size: 12, rotate: 50, duration: 15, delay: 2 },
        ].map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute rounded-full opacity-60"
            style={{
              top: petal.top,
              ...(petal.left ? { left: petal.left } : { right: petal.right }),
              width: petal.size,
              height: petal.size * 1.3,
              background: "radial-gradient(ellipse at center, #F8D7DA 0%, #F5C6CB 80%, rgba(248, 215, 218, 0) 100%)",
              borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
            }}
            animate={{
              y: [0, -18, 0],
              x: [0, 12, 0],
              rotate: [petal.rotate, petal.rotate + 25, petal.rotate],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: petal.delay,
            }}
          />
        ))}
      </div>

      {/* CỤM HOA GÓC DƯỚI BÊN TRÁI (THICK BOTANICAL BUSH) */}
      <div className="absolute -bottom-6 -left-8 sm:left-0 w-[280px] sm:w-[380px] md:w-[460px] lg:w-[520px] h-[340px] sm:h-[420px] md:h-[480px]">
        {leftClusterItems.map((item) => renderFloralItem(item, "left"))}
      </div>

      {/* CỤM HOA GÓC DƯỚI BÊN PHẢI (THICK BOTANICAL BUSH) */}
      <div className="absolute -bottom-6 -right-8 sm:right-0 w-[280px] sm:w-[380px] md:w-[460px] lg:w-[520px] h-[340px] sm:h-[420px] md:h-[480px]">
        {rightClusterItems.map((item) => renderFloralItem(item, "right"))}
      </div>

      {/* CÁNH HOA BUNG RA KHI CLICK (BURST PARTICLES) */}
      <AnimatePresence>
        {burstPetals.map((petal) => (
          <motion.div
            key={petal.id}
            className="fixed pointer-events-none z-50"
            style={{
              left: petal.x,
              top: petal.y,
              width: petal.size,
              height: petal.size * 1.25,
              backgroundColor: petal.color,
              borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
            }}
            initial={{ opacity: 1, scale: 0.6, rotate: petal.rotation }}
            animate={{
              opacity: 0,
              x: petal.vx,
              y: petal.vy + 120,
              rotate: petal.rotation + 180,
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
