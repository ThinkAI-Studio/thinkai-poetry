import { SoundscapePreset } from "@/types/audio";

export const AMBIENT_SOUNDSCAPES: SoundscapePreset[] = [
  {
    id: "rain",
    label: "Hiên Mưa",
    sublabel: "Mưa rơi hiên ngói",
    iconName: "CloudRain",
    audioSrc: "https://actions.google.com/sounds/v1/weather/rain_heavy.ogg",
    defaultVolume: 0.35,
  },
  {
    id: "bamboo_wind",
    label: "Trúc Phong",
    sublabel: "Gió lay cành trúc",
    iconName: "Wind",
    audioSrc: "https://actions.google.com/sounds/v1/weather/light_wind_leaf_rustle.ogg",
    defaultVolume: 0.3,
  },
  {
    id: "temple_bell",
    label: "Chuông Chiều",
    sublabel: "Chuông chùa ngân xa",
    iconName: "Bell",
    audioSrc: "https://actions.google.com/sounds/v1/household/clock_chime.ogg",
    defaultVolume: 0.25,
  },
  {
    id: "stream",
    label: "Suối Reo",
    sublabel: "Nước chảy khe đá",
    iconName: "Waves",
    audioSrc: "https://actions.google.com/sounds/v1/water/creek_flowing.ogg",
    defaultVolume: 0.28,
  },
];
