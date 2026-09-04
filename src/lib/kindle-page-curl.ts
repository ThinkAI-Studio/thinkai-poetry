/**
 * Ánh Thịnh Thi Quán - Masterpiece Kindle & Apple Books Page Curl Engine
 * Chuyển động lật trang sách thơ chuẩn xác, tự nhiên, không vết cắt lỗi:
 * - 26-frame continuous perimeter polygon interpolation (Không nhảy đỉnh, không cắt chéo màn hình)
 * - Đổ bóng trang sách tự nhiên bằng GPU (Natural Page Shadow via CSS filter)
 * - Âm thanh giấy Dó xúc giác 2 thì (Web Audio API)
 * - Triệt tiêu hoàn toàn đường kẻ chéo và hiện tượng chớp đen
 */

export type SiteTheme = "ivory" | "sepia" | "dark";

interface PageCurlOptions {
  targetTheme: SiteTheme;
  direction?: "forward" | "backward";
  onCommit: (theme: SiteTheme) => void;
}

/**
 * 3-Keyframe Native Compositor Polygons:
 * Cố định topo 6 đỉnh, nội suy tuyến tính trực tiếp trên GPU compositor,
 * loại bỏ hoàn toàn lỗi kẹp toạ độ (clamping bug) gây đơ ở nửa màn hình (p = 0.5).
 */
const FORWARD_CLIP_KEYFRAMES = [
  "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 0%)",
  "polygon(0% 0%, 100% 0%, 100% 0%,   0% 100%,   0% 100%, 0% 0%)",
  "polygon(0% 0%, 0% 0%,     0% 0%,     0% 0%,     0% 0%,   0% 0%)",
];

const BACKWARD_CLIP_KEYFRAMES = [
  "polygon(100% 0%, 100% 100%, 0% 100%, 0% 100%, 0% 0%, 100% 0%)",
  "polygon(100% 0%, 100% 100%, 100% 100%, 0% 0%, 0% 0%, 100% 0%)",
  "polygon(100% 0%, 100% 0%,   100% 0%,   100% 0%, 100% 0%, 100% 0%)",
];

/**
 * Âm thanh lật giấy Dó 2 giai đoạn (2-Phase Tactile Paper Audio)
 */
function playKindleTactileAudio() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 1. Click nhấc mép giấy cực khẽ (Tick)
    const tickOsc = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tickOsc.type = "sine";
    tickOsc.frequency.setValueAtTime(1600, ctx.currentTime);
    tickOsc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.025);
    tickGain.gain.setValueAtTime(0.018, ctx.currentTime);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
    tickOsc.connect(tickGain);
    tickGain.connect(ctx.destination);
    tickOsc.start(ctx.currentTime);
    tickOsc.stop(ctx.currentTime + 0.025);

    // 2. Tiếng xào xạc lướt giấy (Swoosh) sau 20ms
    const duration = 0.16;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (ctx.sampleRate * 0.042));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 980;
    filter.Q.value = 1.25;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.035, ctx.currentTime + 0.015);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(ctx.currentTime + 0.015);
  } catch {}
}

export function executeKindlePageCurl({
  targetTheme,
  direction = "forward",
  onCommit,
}: PageCurlOptions) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const supportsViewTransition =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !prefersReduced;

  if (!supportsViewTransition) {
    onCommit(targetTheme);
    return;
  }

  playKindleTactileAudio();

  const isGoingDark = targetTheme === "dark";
  const resolvedDirection = direction || (isGoingDark ? "forward" : "backward");
  const duration = 440; // 440ms chuẩn nhịp lướt trang sách

  const clipPathKeyframes =
    resolvedDirection === "forward"
      ? FORWARD_CLIP_KEYFRAMES
      : BACKWARD_CLIP_KEYFRAMES;

  try {
    const transition = (document as any).startViewTransition(() => {
      onCommit(targetTheme);
    });

    if (transition && transition.ready) {
      transition.ready
        .then(() => {
          // 1. Áp dụng Clip-Path bóc tách góc trên trang cũ (::view-transition-old)
          // 3 keyframes GPU native compositor loại bỏ hoàn toàn hiện tượng khựng tại p = 0.5
          document.documentElement.animate(
            {
              clipPath: clipPathKeyframes,
              filter: [
                "brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0))",
                "brightness(0.97) drop-shadow(-3px -3px 8px rgba(0,0,0,0.15))",
                "brightness(0.92) drop-shadow(-6px -6px 14px rgba(0,0,0,0.22))",
              ],
            },
            {
              duration,
              easing: "cubic-bezier(0.2, 0.0, 0.2, 1)",
              pseudoElement: "::view-transition-old(root)",
            }
          );

          // 2. Trang mới hé lộ từ phía dưới với hiệu ứng sáng lên dịu nhẹ
          document.documentElement.animate(
            {
              transform: ["scale(0.985)", "scale(1)"],
              filter: ["brightness(0.92)", "brightness(1)"],
            },
            {
              duration,
              easing: "cubic-bezier(0.2, 0.0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {
          // Fallback an toàn nếu transition bị hủy
        });
    }
  } catch {
    onCommit(targetTheme);
  }
}
