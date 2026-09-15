"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface SeasonMetadata {
  id: Season;
  name: string;
  fullName: string;
  tagline: string;
  flower: string;
  grass: string;
  icon: string;
  accentColor: string;
  accentLight: string;
  petalColors: string[];
}

export const SEASONS_META: Record<Season, SeasonMetadata> = {
  spring: {
    id: "spring",
    name: "Xuân",
    fullName: "Mùa Xuân",
    tagline: "Lộc biếc, hoa đào & mầm non đón gió",
    flower: "Hoa Đào & Hoa Mai",
    grass: "Mầm Xanh Mơn Mởn",
    icon: "🌸",
    accentColor: "#E11D48",
    accentLight: "#FDA4AF",
    petalColors: ["#FCE4E8", "#F7BAC3", "#EE94A2", "#FECDD3", "#F43F5E"],
  },
  summer: {
    id: "summer",
    name: "Hạ",
    fullName: "Mùa Hạ",
    tagline: "Hương sen thanh khiết, ngập tràn nắng rạng",
    flower: "Hoa Sen Hồng & Phượng Vĩ",
    grass: "Cỏ Xanh Thắm Đung Đưa",
    icon: "🪷",
    accentColor: "#1E5E3A",
    accentLight: "#86EFAC",
    petalColors: ["#FCE7F3", "#F472B6", "#DB2777", "#D1FAE5", "#34D399"],
  },
  autumn: {
    id: "autumn",
    name: "Thu",
    fullName: "Mùa Thu",
    tagline: "Lá phong momiji, cúc vàng & heo may",
    flower: "Lá Phong Đỏ & Cúc Vàng",
    grass: "Cỏ May Hổ Phách",
    icon: "🍁",
    accentColor: "#D97706",
    accentLight: "#FDE68A",
    petalColors: ["#FDE68A", "#FBBF24", "#F97316", "#DC2626", "#991B1B"],
  },
  winter: {
    id: "winter",
    name: "Đông",
    fullName: "Mùa Đông",
    tagline: "Tuyết mai trắng ngần, tĩnh mặc & an nhiên",
    flower: "Tuyết Mai & Hoa Trà Đỏ",
    grass: "Cỏ Phủ Bụi Băng Sương",
    icon: "❄️",
    accentColor: "#0284C7",
    accentLight: "#BAE6FD",
    petalColors: ["#F8FAFC", "#E2E8F0", "#94A3B8", "#BAE6FD", "#E0F2FE"],
  },
};

export function getDefaultSeason(): Season {
  if (typeof window === "undefined") return "autumn";
  const month = new Date().getMonth(); // 0 = Jan, 8 = Sep
  if (month >= 1 && month <= 3) return "spring";
  if (month >= 4 && month <= 6) return "summer";
  if (month >= 7 && month <= 9) return "autumn";
  return "winter";
}

interface SeasonContextType {
  season: Season;
  setSeason: (season: Season) => void;
  metadata: SeasonMetadata;
  allSeasons: SeasonMetadata[];
}

const SeasonContext = createContext<SeasonContextType | null>(null);

export function SeasonProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeasonState] = useState<Season>("autumn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("site-season") as Season | null;
    const initialSeason = (saved && ["spring", "summer", "autumn", "winter"].includes(saved))
      ? saved
      : getDefaultSeason();

    setSeasonState(initialSeason);
    document.documentElement.setAttribute("data-season", initialSeason);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "site-season" && e.newValue) {
        const next = e.newValue as Season;
        setSeasonState(next);
        document.documentElement.setAttribute("data-season", next);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setSeason = useCallback((nextSeason: Season) => {
    setSeasonState(nextSeason);
    try {
      localStorage.setItem("site-season", nextSeason);
      document.documentElement.setAttribute("data-season", nextSeason);
      window.dispatchEvent(new Event("seasonchange"));
    } catch {}
  }, []);

  const metadata = useMemo(() => SEASONS_META[season], [season]);
  const allSeasons = useMemo(() => Object.values(SEASONS_META), []);

  return (
    <SeasonContext.Provider value={{ season, setSeason, metadata, allSeasons }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonContext);
  if (!context) {
    // Fallback safe nếu dùng ngoài provider
    return {
      season: "autumn" as Season,
      setSeason: () => {},
      metadata: SEASONS_META.autumn,
      allSeasons: Object.values(SEASONS_META),
    };
  }
  return context;
}
