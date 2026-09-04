"use client";

import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import Image from "next/image";
import { motion, useSpring, useMotionValue, AnimatePresence } from "motion/react";

interface FloralPosition {
  x: number;
  y: number;
  type: "pink" | "yellow" | "leaf1" | "leaf2" | "bubble";
  scale: number;
  rotation: number;
  delay: number;
  token?: {
    name: string;
    color: string;
  };
}

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

// 41 vị trí hoa & lá bên trái chuẩn xác theo Sora Lattice (lattice.soralabs.studio)
const leftClusterPositions: FloralPosition[] = [
  { delay: 0.05, rotation: -10, scale: 0.95, type: "pink", x: 1, y: 98 },
  { delay: 0.08, rotation: 15, scale: 1.1, type: "yellow", x: 2, y: 88 },
  { delay: 0.12, rotation: -20, scale: 0.85, type: "pink", x: 0, y: 78 },
  { delay: 0.15, rotation: 30, scale: 1.05, type: "yellow", x: 3, y: 68 },
  { delay: 0.18, rotation: -5, scale: 0.9, type: "pink", x: 1, y: 58 },
  { delay: 0.22, rotation: 10, scale: 0.8, type: "yellow", x: 4, y: 48 },
  { delay: 0.25, rotation: -15, scale: 0.75, type: "pink", x: 2, y: 38 },
  { delay: 0.28, rotation: 25, scale: 0.85, type: "yellow", x: 3, y: 32 },
  { delay: 0.28, rotation: 5, scale: 1.2, type: "pink", x: 8, y: 95 },
  { delay: 0.31, rotation: -10, scale: 0.9, type: "yellow", x: 7, y: 82 },
  { delay: 0.34, rotation: 20, scale: 1.15, type: "pink", x: 9, y: 72 },
  { delay: 0.3, rotation: 10, scale: 0.85, type: "pink", x: 20, y: 60 },
  { delay: 0.4, rotation: -25, scale: 0.85, type: "yellow", x: 10, y: 52 },
  { delay: 0.43, rotation: 15, scale: 0.7, type: "pink", x: 11, y: 42 },
  { delay: 0.46, rotation: -15, scale: 0.75, type: "pink", x: 9, y: 35 },
  { delay: 0.46, rotation: -15, scale: 1, type: "yellow", x: 18, y: 92 },
  { delay: 0.49, rotation: 10, scale: 0.85, type: "pink", x: 22, y: 80 },
  { delay: 0.52, rotation: -5, scale: 1.1, type: "yellow", x: 25, y: 96 },
  { delay: 0.55, rotation: 25, scale: 0.9, type: "pink", x: 20, y: 70 },
  { delay: 0.61, rotation: -10, scale: 0.8, type: "yellow", x: 24, y: 55 },
  { delay: 0.64, rotation: 20, scale: 0.7, type: "pink", x: 21, y: 45 },
  { delay: 0.64, rotation: 20, scale: 1.2, type: "pink", x: 35, y: 94 },
  { delay: 0.67, rotation: -5, scale: 0.95, type: "yellow", x: 42, y: 85 },
  { delay: 0.7, rotation: 15, scale: 1.05, type: "pink", x: 48, y: 98 },
  { delay: 0.73, rotation: -10, scale: 0.8, type: "yellow", x: 55, y: 88 },
  { delay: 0.79, rotation: 10, scale: 1.1, type: "pink", x: 65, y: 95 },
  { delay: 0.82, rotation: -5, scale: 0.9, type: "yellow", x: 75, y: 98 },
  { delay: 0.85, rotation: 35, scale: 0.75, type: "yellow", x: 15, y: 88 },
  { delay: 0.88, rotation: -15, scale: 0.8, type: "pink", x: 32, y: 78 },
  { delay: 0.94, rotation: -20, scale: 0.85, type: "pink", x: 50, y: 92 },
  { delay: 0.1, rotation: 45, scale: 0.8, type: "leaf1", x: 5, y: 92 },
  { delay: 0.2, rotation: -10, scale: 0.75, type: "leaf2", x: 12, y: 85 },
  { delay: 0.3, rotation: 20, scale: 0.9, type: "leaf1", x: 28, y: 96 },
  { delay: 0.65, rotation: -15, scale: 0.8, type: "pink", x: 60, y: 80 },
  { delay: 0.55, rotation: -5, scale: 0.85, type: "pink", x: 30, y: 50 },
  { delay: 0.65, rotation: 15, scale: 0.95, type: "yellow", x: 40, y: 70 },
  { delay: 0.3, rotation: 10, scale: 0.8, type: "pink", x: 4, y: 45 },
  { delay: 0.4, rotation: -5, scale: 0.85, type: "yellow", x: 18, y: 52 },
  { delay: 0.5, rotation: 15, scale: 0.9, type: "pink", x: 32, y: 59 },
  { delay: 0.6, rotation: -10, scale: 0.8, type: "yellow", x: 46, y: 66 },
];

// 41 vị trí hoa & lá bên phải chuẩn xác theo Sora Lattice (lattice.soralabs.studio)
const rightClusterPositions: FloralPosition[] = [
  { delay: 0.05, rotation: 10, scale: 0.95, type: "yellow", x: 99, y: 98 },
  { delay: 0.08, rotation: -15, scale: 1.1, type: "pink", x: 98, y: 88 },
  { delay: 0.12, rotation: 20, scale: 0.85, type: "yellow", x: 100, y: 78 },
  { delay: 0.15, rotation: -30, scale: 1.05, type: "pink", x: 97, y: 68 },
  { delay: 0.18, rotation: 5, scale: 0.9, type: "yellow", x: 99, y: 58 },
  { delay: 0.22, rotation: -10, scale: 0.8, type: "pink", x: 96, y: 48 },
  { delay: 0.25, rotation: 15, scale: 0.75, type: "pink", x: 98, y: 38 },
  { delay: 0.28, rotation: -25, scale: 0.85, type: "yellow", x: 97, y: 32 },
  { delay: 0.28, rotation: -5, scale: 1.2, type: "yellow", x: 92, y: 95 },
  { delay: 0.31, rotation: 10, scale: 0.9, type: "pink", x: 93, y: 82 },
  { delay: 0.34, rotation: -20, scale: 1.15, type: "yellow", x: 91, y: 72 },
  { delay: 0.3, rotation: -10, scale: 0.9, type: "yellow", x: 82, y: 62 },
  { delay: 0.4, rotation: 25, scale: 0.85, type: "pink", x: 90, y: 52 },
  { delay: 0.43, rotation: -15, scale: 0.7, type: "yellow", x: 89, y: 42 },
  { delay: 0.46, rotation: 15, scale: 0.75, type: "pink", x: 91, y: 35 },
  { delay: 0.46, rotation: 15, scale: 1, type: "pink", x: 82, y: 92 },
  { delay: 0.49, rotation: -10, scale: 0.85, type: "yellow", x: 78, y: 80 },
  { delay: 0.52, rotation: 5, scale: 1.1, type: "pink", x: 75, y: 96 },
  { delay: 0.55, rotation: -25, scale: 0.9, type: "yellow", x: 80, y: 70 },
  { delay: 0.45, rotation: 15, scale: 0.85, type: "pink", x: 66, y: 90 },
  { delay: 0.61, rotation: 10, scale: 0.8, type: "pink", x: 76, y: 55 },
  { delay: 0.64, rotation: -20, scale: 0.7, type: "yellow", x: 79, y: 45 },
  { delay: 0.64, rotation: -20, scale: 1.2, type: "yellow", x: 65, y: 94 },
  { delay: 0.67, rotation: 5, scale: 0.95, type: "pink", x: 58, y: 85 },
  { delay: 0.7, rotation: -15, scale: 1.05, type: "yellow", x: 52, y: 98 },
  { delay: 0.73, rotation: 10, scale: 0.8, type: "pink", x: 45, y: 88 },
  { delay: 0.79, rotation: -10, scale: 1.1, type: "yellow", x: 35, y: 95 },
  { delay: 0.82, rotation: 5, scale: 0.9, type: "pink", x: 25, y: 98 },
  { delay: 0.85, rotation: -35, scale: 0.75, type: "yellow", x: 85, y: 88 },
  { delay: 0.88, rotation: 15, scale: 0.8, type: "yellow", x: 68, y: 78 },
  { delay: 0.94, rotation: 20, scale: 0.85, type: "yellow", x: 50, y: 92 },
  { delay: 0.1, rotation: -45, scale: 0.8, type: "leaf2", x: 95, y: 92 },
  { delay: 0.2, rotation: 10, scale: 0.75, type: "leaf1", x: 88, y: 85 },
  { delay: 0.3, rotation: -20, scale: 0.9, type: "leaf2", x: 72, y: 96 },
  { delay: 0.65, rotation: 15, scale: 0.8, type: "yellow", x: 40, y: 80 },
  { delay: 0.45, rotation: -10, scale: 0.9, type: "pink", x: 80, y: 45 },
  { delay: 0.55, rotation: 5, scale: 0.85, type: "yellow", x: 70, y: 50 },
  { delay: 0.65, rotation: -15, scale: 0.95, type: "pink", x: 60, y: 70 },
  { delay: 0.3, rotation: -10, scale: 0.8, type: "yellow", x: 96, y: 45 },
  { delay: 0.5, rotation: -15, scale: 0.9, type: "yellow", x: 68, y: 59 },
  { delay: 0.6, rotation: 10, scale: 0.8, type: "pink", x: 54, y: 66 },
];

const imageMap = {
  pink: "/floral/flower-pink.png",
  yellow: "/floral/flower-yellow.png",
  leaf1: "/floral/leaf-1.png",
  leaf2: "/floral/leaf-2.png",
};

interface FloralItemProps {
  pos: FloralPosition;
  mouseX: any;
  mouseY: any;
  cluster: "left" | "right";
  onFlowerClick?: (e: React.MouseEvent) => void;
}

const FloralNode = memo(({ pos, mouseX, mouseY, cluster, onFlowerClick }: FloralItemProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<{ x: number; y: number } | null>(null);

  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  // Sinh số giả ngẫu nhiên tất định từ tọa độ pos để Server & Client render đồng nhất 100%, triệt tiêu lỗi Hydration Mismatch
  const seed = useMemo(() => {
    const val = Math.abs(Math.sin(pos.x * 12.9898 + pos.y * 78.233 + (pos.delay || 0.1) * 43.123));
    return val - Math.floor(val);
  }, [pos.x, pos.y, pos.delay]);

  const randomTranslateDelay = useMemo(() => seed * Math.PI, [seed]);
  const swayDuration = useMemo(() => 3.2 + seed * 2, [seed]);
  const swayTranslateDuration = swayDuration * 1.2;
  const swayAmount = useMemo(() => 4 + seed * 4, [seed]);

  // Tính tâm phần tử để phản xạ chuột (Mouse repulsion physics)
  useEffect(() => {
    const updateCenter = () => {
      if (!nodeRef.current) return;
      const rect = nodeRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    const animId = requestAnimationFrame(updateCenter);
    window.addEventListener("resize", updateCenter);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateCenter);
    };
  }, []);

  // Đẩy nhẹ hoa khi chuột đến gần (< 220px)
  useEffect(() => {
    const handleMouseChange = () => {
      const center = centerRef.current;
      if (!center) return;

      const mx = mouseX.get();
      const my = mouseY.get();
      const dx = mx - center.x;
      const dy = my - center.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 220 && dist > 0) {
        const force = (1 - dist / 220) * 26;
        const angle = Math.atan2(dy, dx);
        springX.set(Math.cos(angle) * -force);
        springY.set(Math.sin(angle) * -force);
      } else {
        springX.set(0);
        springY.set(0);
      }
    };

    const unsubX = mouseX.on("change", handleMouseChange);
    const unsubY = mouseY.on("change", handleMouseChange);
    return () => {
      unsubX();
      unsubY();
    };
  }, [mouseX, mouseY, springX, springY]);

  if (pos.type === "bubble" && pos.token) {
    return (
      <div
        ref={nodeRef}
        suppressHydrationWarning
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          zIndex: 25,
          "--floral-sway-amount": `${swayAmount}px`,
          "--floral-sway-duration": `${swayDuration}s`,
          "--floral-sway-translate-duration": `${swayTranslateDuration}s`,
          "--floral-sway-rotate-delay": `${pos.delay}s`,
          "--floral-sway-translate-delay": `${randomTranslateDelay}s`,
        } as any}
      >
        <motion.div
          className="cursor-pointer"
          initial={{ opacity: 0, scale: 0, rotate: pos.rotation - 15 }}
          animate={{ opacity: 1, scale: pos.scale, rotate: pos.rotation }}
          transition={{ delay: pos.delay + 0.3, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ x: springX, y: springY }}
        >
          <div className="floral-hide">
            <div className="floral-sway-rotate">
              <div className="floral-sway-translate">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-neutral-700/70 bg-white/95 dark:bg-[#18181E]/95 px-3.5 py-1.5 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-108 active:scale-95">
                  <div
                    className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: pos.token.color }}
                  />
                  <span className="whitespace-nowrap font-mono text-xs tracking-tight text-neutral-800 dark:text-neutral-200">
                    {pos.token.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const src = imageMap[pos.type as keyof typeof imageMap];
  if (!src) return null;

  return (
    <div
      ref={nodeRef}
      suppressHydrationWarning
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        "--floral-sway-amount": `${swayAmount}px`,
        "--floral-sway-duration": `${swayDuration}s`,
        "--floral-sway-translate-duration": `${swayTranslateDuration}s`,
        "--floral-sway-rotate-delay": `${pos.delay}s`,
        "--floral-sway-translate-delay": `${randomTranslateDelay}s`,
      } as any}
    >
      <motion.div
        className="cursor-pointer select-none"
        initial={{ opacity: 0, scale: 0, rotate: pos.rotation - 20 }}
        animate={{ opacity: 1, scale: pos.scale, rotate: pos.rotation }}
        transition={{ delay: pos.delay + 0.2, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          height: "clamp(60px, 8vw, 105px)",
          width: "clamp(60px, 8vw, 105px)",
          x: springX,
          y: springY,
        }}
        onClick={onFlowerClick}
      >
        <div className="floral-hide">
          <div className="floral-sway-rotate">
            <div className="floral-sway-translate">
              <Image
                src={src}
                alt="Botanical Flower"
                width={95}
                height={91}
                priority
                className="h-full w-full select-none object-contain drop-shadow-sm transition-opacity duration-500 dark:opacity-85 dark:brightness-95 hover:scale-110 active:scale-95 transition-transform"
                style={{ width: "auto", height: "auto" }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

FloralNode.displayName = "FloralNode";

export function FloralDecoration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isPast, setIsPast] = useState(false);
  const [burstPetals, setBurstPetals] = useState<BurstPetal[]>([]);

  // Lắng nghe scroll để ẩn nhẹ hoa khi cuộn xuống dưới (Sora Lattice behavior)
  useEffect(() => {
    const handleScroll = () => {
      const past = window.scrollY > 160;
      setIsPast(past);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Click vào hoa bắn cánh hoa bay nhẹ nhàng
  const handleFlowerClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ["#F8D7DA", "#FDE68A", "#FBCFE8", "#FED7AA", "#FEF08A"];
    const newPetals: BurstPetal[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 160,
      vy: -Math.random() * 120 - 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 14 + 10,
      rotation: Math.random() * 360,
    }));

    setBurstPetals((prev) => [...prev.slice(-18), ...newPetals]);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      data-floral-past={isPast ? "true" : "false"}
      className="floral-root pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      {/* Cụm hoa bên trái (Left Cluster) */}
      <div className="floral-cluster pointer-events-auto absolute bottom-[60px] left-[-20px] md:left-0 h-[580px] w-[34vw] max-w-[460px]">
        {leftClusterPositions.map((pos, idx) => (
          <FloralNode
            key={`left-${idx}`}
            pos={pos}
            cluster="left"
            mouseX={mouseX}
            mouseY={mouseY}
            onFlowerClick={handleFlowerClick}
          />
        ))}
      </div>

      {/* Cụm hoa bên phải (Right Cluster) */}
      <div className="floral-cluster pointer-events-auto absolute right-[-20px] md:right-0 bottom-[60px] h-[580px] w-[34vw] max-w-[460px]">
        <div className="relative h-full w-full">
          {rightClusterPositions.map((pos, idx) => (
            <FloralNode
              key={`right-${idx}`}
              pos={pos}
              cluster="right"
              mouseX={mouseX}
              mouseY={mouseY}
              onFlowerClick={handleFlowerClick}
            />
          ))}
        </div>
      </div>

      {/* ĐỊNH NGHĨA GRADIENT CÁNH HOA DUY NHẤT */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="driftingCherryPetal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCE4E8" />
            <stop offset="60%" stopColor="#F7BAC3" />
            <stop offset="100%" stopColor="#EE94A2" />
          </linearGradient>
        </defs>
      </svg>

      {/* 5 Cánh hoa đào trôi lãng mạn trên canvas (Pixel-faithful theo example-1.jpg) */}
      {[
        { id: "dp-1", x: "7%", y: "47%", rotate: 25, scale: 1.0, duration: 4.8 },
        { id: "dp-2", x: "16%", y: "53%", rotate: -18, scale: 1.1, duration: 5.2 },
        { id: "dp-3", x: "23%", y: "65%", rotate: 32, scale: 0.9, duration: 4.5 },
        { id: "dp-4", x: "92%", y: "38%", rotate: -22, scale: 1.05, duration: 5.0 },
        { id: "dp-5", x: "78%", y: "68%", rotate: 20, scale: 0.95, duration: 4.6 },
      ].map((petal) => (
        <motion.div
          key={petal.id}
          className="pointer-events-none absolute select-none z-20"
          style={{
            left: petal.x,
            top: petal.y,
          }}
          initial={{
            x: "-50%",
            y: "-50%",
            rotate: petal.rotate,
            scale: petal.scale,
          }}
          animate={{
            y: ["-50%", "calc(-50% - 9px)", "-50%"],
            rotate: [petal.rotate, petal.rotate + 6, petal.rotate],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="26" height="34" viewBox="0 0 28 36" fill="none" className="drop-shadow-xs">
            <path
              d="M14 2C8.5 9 1 17 1 25.5C1 31.3 6.8 35 14 35C21.2 35 27 31.3 27 25.5C27 17 19.5 9 14 2Z"
              fill="url(#driftingCherryPetal)"
              fillOpacity="0.88"
            />
          </svg>
        </motion.div>
      ))}

      {/* Cánh hoa bay khi click */}
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
              opacity: 1,
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
