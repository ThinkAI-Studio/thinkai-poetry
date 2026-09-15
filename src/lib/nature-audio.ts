/**
 * Web Audio API Nature Rustling Sound Synthesizer
 * - Tổng hợp âm thanh gió thổi xào xạc qua tán lá và ngọn cỏ chân thực
 * - Không phụ thuộc file MP3 ngoài, không độ trễ, tự động điều tiết âm lượng nhẹ nhàng
 * - Throttle thông minh chống dồn âm khi rê chuột liên tục
 */

let audioCtx: AudioContext | null = null;
let lastLeafRustleTime = 0;
let lastGrassRustleTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Phát tiếng xào xạc khi rê chuột vào cành hoa ("leaves") hoặc đám cỏ ("grass")
 */
export function playLeafRustleSound(type: "leaves" | "grass" = "leaves", volume = 0.08) {
  const nowMs = Date.now();
  const isGrass = type === "grass";

  // Throttle 280ms chống dồn âm thanh khi di chuột liên tục
  if (isGrass) {
    if (nowMs - lastGrassRustleTime < 280) return;
    lastGrassRustleTime = nowMs;
  } else {
    if (nowMs - lastLeafRustleTime < 280) return;
    lastLeafRustleTime = nowMs;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const duration = isGrass ? 0.22 : 0.26; // Thời lượng ngắn, nhẹ nhàng
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Sinh noise dạng Pink/Brown mềm mô phỏng lá hoặc cỏ cọ xát
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.28;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter Bandpass: Lá cây có tần số đanh hơn, cỏ mềm mại hơn
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const now = ctx.currentTime;

    const baseFreq = isGrass ? 1600 : 2400;
    const peakFreq = isGrass ? 2800 : 3800;
    const endFreq = isGrass ? 1200 : 1800;

    filter.frequency.setValueAtTime(baseFreq, now);
    filter.frequency.exponentialRampToValueAtTime(peakFreq, now + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    filter.Q.setValueAtTime(isGrass ? 1.4 : 1.8, now);

    // Filter Highpass phụ để tạo độ xào xạc giòn tai
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(isGrass ? 800 : 1200, now);

    // Envelope âm lượng: Vuốt lên nhanh và tắt dần êm ái
    const gainNode = ctx.createGain();
    const targetVol = isGrass ? volume * 0.9 : volume;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(targetVol, now + duration * 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(filter);
    filter.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  } catch {
    // Trình duyệt chặn autoplay khi chưa có tương tác người dùng
  }
}

/**
 * Phát âm thanh rung cành dạt dào khi nhấp chuột vào cành hoa
 */
export function playBranchShakeSound(volume = 0.15) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const duration = 0.42;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastVal = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastVal + 0.03 * white) / 1.02;
      lastVal = output[i];
      output[i] *= 3.5;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Quét tần số mô phỏng cành cây rung nảy lò xo và lá cọ vào nhau
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.22);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);
    filter.Q.setValueAtTime(2.2, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.005, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.06);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  } catch {}
}

let lastWhirlwindTime = 0;
/**
 * Phát âm thanh luồng gió lốc mùa thu cuốn tung đám lá khô bay xào xạc dạt dào
 */
export function playWhirlwindLeavesSound(volume = 0.18) {
  const nowMs = Date.now();
  if (nowMs - lastWhirlwindTime < 1200) return;
  lastWhirlwindTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const duration = 1.2;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Dải noise mô phỏng gió cuốn kết hợp lá khô
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.06;
      b1 = 0.985 * b1 + white * 0.08;
      b2 = 0.950 * b2 + white * 0.16;
      output[i] = (b0 + b1 + b2 + white * 0.45) * 0.35;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter mô phỏng gió cuộn từ thấp lên cao rồi thoái trào
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + duration * 0.35);
    filter.frequency.exponentialRampToValueAtTime(1800, now + duration * 0.7);
    filter.frequency.exponentialRampToValueAtTime(350, now + duration);
    filter.Q.setValueAtTime(2.0, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + duration * 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  } catch {}
}

let lastFrostCrunchTime = 0;
/**
 * Phát âm thanh lách tách giòn tan khi chạm vào tinh thể sương băng / lá đông cứng
 */
export function playFrostCrunchSound(volume = 0.14) {
  const nowMs = Date.now();
  if (nowMs - lastFrostCrunchTime < 180) return;
  lastFrostCrunchTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const duration = 0.18;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Xung vi mô tạo tiếng giòn tan lách tách sắc nét
    for (let i = 0; i < bufferSize; i++) {
      const crackle = Math.random() > 0.88 ? (Math.random() * 2 - 1) * 2.2 : (Math.random() * 2 - 1) * 0.2;
      output[i] = crackle;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Highpass filter tần số cao mô phỏng băng mỏng nứt vỡ
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    const now = ctx.currentTime;
    highpass.frequency.setValueAtTime(3600, now);
    highpass.frequency.exponentialRampToValueAtTime(5200, now + duration * 0.5);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  } catch {}
}

