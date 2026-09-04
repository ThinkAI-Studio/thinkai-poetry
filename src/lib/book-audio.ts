/**
 * Web Audio API Paper Turn Sound Synthesizer
 * Tạo âm thanh sột soạt lật giấy chân thực, không phụ thuộc tài nguyên ngoài, không trễ
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setPageTurnSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isPageTurnSoundEnabled(): boolean {
  return soundEnabled;
}

export function playPageTurnSound(volume = 0.22) {
  if (typeof window === "undefined" || !soundEnabled) return;

  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const ctx = audioCtx;
    const duration = 0.18; // 180ms
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Tạo Brown noise mô phỏng thớ giấy cọ xát
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.025 * white) / 1.02;
      lastOut = output[i];
      // Tăng biên độ tự nhiên
      output[i] *= 4.2;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Filter bandpass quét tần số từ thấp lên cao rồi xuống mô phỏng tiếng vẫy trang sách
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.07);
    filter.frequency.exponentialRampToValueAtTime(350, now + duration);
    filter.Q.setValueAtTime(1.6, now);

    // Envelope âm lượng
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.005, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  } catch {
    // Trình duyệt có thể chặn autoplay nếu chưa có user gesture, bỏ qua nhẹ nhàng
  }
}
