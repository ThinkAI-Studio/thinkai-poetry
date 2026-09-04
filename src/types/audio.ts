export type SoundscapeType = "rain" | "bamboo_wind" | "temple_bell" | "stream";

export interface SoundscapePreset {
  id: SoundscapeType;
  label: string;
  sublabel: string;
  iconName: string;
  audioSrc: string;
  defaultVolume: number;
}

export interface ReciterInfo {
  name: string;
  roleTitle?: string;
  style?: string;
  avatarUrl?: string;
}

export interface PoetryAudioProps {
  poemId: string;
  poemTitle: string;
  poemSlug: string;
  audioUrl?: string | null;
  reciter?: ReciterInfo;
  className?: string;
}
