"use client";

import React, { useState } from "react";
import { AudioReciterBar } from "./AudioReciterBar";
import { AmbientSoundscapeBar } from "./AmbientSoundscapeBar";
import { PoetryAudioProps } from "@/types/audio";

export function PoetryAudioZone({
  poemId,
  poemTitle,
  poemSlug,
  audioUrl,
  reciter,
  className,
}: PoetryAudioProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // 1. NẾU CÓ BẢN NGÂM THƠ: Hiển thị Trình phát ngâm thơ diễn cảm
  if (audioUrl) {
    return (
      <div className={className}>
        <AudioReciterBar
          audioUrl={audioUrl}
          title={`Ngâm thơ: ${poemTitle}`}
        />
      </div>
    );
  }

  // 2. NẾU CHƯA CÓ BẢN NGÂM & ĐỘC GIẢ CHƯA THU GỌN:
  // Hiển thị Trình phát Âm Cảnh Thư Giãn (Hiên Mưa, Trúc Phong, Chuông Chiều, Suối Reo)
  if (!isDismissed) {
    return (
      <div className={className}>
        <AmbientSoundscapeBar
          poemId={poemId}
          poemTitle={poemTitle}
          onDismiss={() => setIsDismissed(true)}
        />
      </div>
    );
  }

  // 3. NẾU ĐÃ THU GỌN: Hiển thị vạch hoa văn chỉ mảnh tao nhã cân đối bố cục
  return (
    <div className="flex items-center justify-center gap-3 my-8 opacity-45 hover:opacity-100 transition-opacity">
      <div className="h-[1px] w-14 bg-neutral-300 dark:bg-neutral-700" />
      <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500">
        ❖ ❀ ❖
      </span>
      <div className="h-[1px] w-14 bg-neutral-300 dark:bg-neutral-700" />
    </div>
  );
}
