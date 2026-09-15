"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Singleton State Store cho "Khu Vực Đọc Sách" (Reading Zone)
 * - TỐI ƯU HIỆU NĂNG ZERO-REFLOW: Tuyệt đối không gọi getBoundingClientRect() trong vòng lặp cuộn
 * - Chỉ tính toán và cache tọa độ triggerY 1 lần duy nhất khi mount hoặc window resize
 * - 1 Scroll Listener duy nhất cho toàn bộ ứng dụng (chia sẻ cho SiteHeader, CornerFloralBranches, PoeticGrassFringe)
 * - Đồng bộ tức thì trong 1 microtask, loại bỏ triệt để 100% hiện tượng khựng lag
 */

let globalInZone = false;
let cachedTriggerY = 750;
let cachedExitThreshold = 700;
let isStoreInitialized = false;
let currentPathname = "";

const subscribers = new Set<(inZone: boolean) => void>();

function recalculateTriggerThreshold() {
  if (typeof window === "undefined") return;

  if (currentPathname !== "/") {
    cachedTriggerY = 999999;
    cachedExitThreshold = 999999;
    if (globalInZone) {
      globalInZone = false;
      subscribers.forEach((cb) => cb(false));
    }
    return;
  }

  const scrollY = window.scrollY || window.pageYOffset || 0;
  const bookElem = document.getElementById("khong-gian-sach-tho");

  let triggerY = window.innerHeight * 0.65;
  if (bookElem) {
    const rect = bookElem.getBoundingClientRect();
    const elemTopAbs = rect.top + scrollY;
    triggerY = Math.max(100, elemTopAbs - 140);
  }

  cachedTriggerY = triggerY;
  cachedExitThreshold = Math.max(0, triggerY - 120);

  // Cập nhật ngay trạng thái hiện tại
  const nextInZone = globalInZone
    ? scrollY >= cachedExitThreshold
    : scrollY >= cachedTriggerY;

  if (nextInZone !== globalInZone) {
    globalInZone = nextInZone;
    subscribers.forEach((cb) => cb(globalInZone));
  }
}

let scrollTicking = false;
function onGlobalScroll() {
  if (scrollTicking) return;
  scrollTicking = true;

  window.requestAnimationFrame(() => {
    if (currentPathname !== "/") {
      scrollTicking = false;
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const nextInZone = globalInZone
      ? scrollY >= cachedExitThreshold
      : scrollY >= cachedTriggerY;

    if (nextInZone !== globalInZone) {
      globalInZone = nextInZone;
      subscribers.forEach((cb) => cb(globalInZone));
    }

    scrollTicking = false;
  });
}

let resizeTimer: NodeJS.Timeout | null = null;
function onGlobalResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    recalculateTriggerThreshold();
  }, 120);
}

function initGlobalStore() {
  if (isStoreInitialized || typeof window === "undefined") return;
  isStoreInitialized = true;

  window.addEventListener("scroll", onGlobalScroll, { passive: true });
  window.addEventListener("resize", onGlobalResize, { passive: true });

  // Đo đạc ban đầu và sau khi DOM hydrate xong
  recalculateTriggerThreshold();
  setTimeout(recalculateTriggerThreshold, 150);
  setTimeout(recalculateTriggerThreshold, 500);
}

export function useReadingZone(): boolean {
  const pathname = usePathname();
  const [inZone, setInZone] = useState(() => (pathname === "/" ? globalInZone : false));

  useEffect(() => {
    currentPathname = pathname;
    initGlobalStore();

    if (pathname !== "/") {
      setInZone(false);
      return;
    }

    // Luôn đồng bộ ngay state hiện tại
    setInZone(globalInZone);
    recalculateTriggerThreshold();

    const handler = (val: boolean) => setInZone(val);
    subscribers.add(handler);

    return () => {
      subscribers.delete(handler);
    };
  }, [pathname]);

  return inZone;
}
