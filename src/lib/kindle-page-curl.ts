/**
 * Hữu Thịnh Thi Quán - Masterpiece Kindle & Apple Books Page Curl Engine
 * Chuyển động lật trang sách thơ chuẩn xác, tự nhiên:
 * - Polygon interpolation lật trang chéo từ góc sách (Top-Right / Top-Left Corner Page Curl)
 * - Đổ bóng gấp nếp trang sách tự nhiên bằng GPU (Paper Fold Shadow via CSS drop-shadow)
 * - Âm thanh giấy Dó xúc giác 2 thì (Web Audio API)
 */

export type SiteTheme = "ivory" | "sepia" | "dark";

interface PageCurlOptions {
  event?: React.MouseEvent | MouseEvent;
  targetTheme: SiteTheme;
  direction?: "forward" | "backward";
  onCommit: (theme: SiteTheme) => void;
}

/**
 * 5-Keyframe Page Curl Polygons:
 * Mô phỏng chuyển động gấp nếp lật góc trang sách chéo tự nhiên (Apple Books / Kindle)
 */
const FORWARD_CURL_POLYGONS = [
  "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)",
  "polygon(70% 0%, 100% 0%, 100% 30%, 100% 30%, 70% 0%)",
  "polygon(35% 0%, 100% 0%, 100% 65%, 65% 100%, 0% 35%)",
  "polygon(0% 0%, 100% 0%, 100% 100%, 35% 100%, 0% 65%)",
  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%)",
];

const BACKWARD_CURL_POLYGONS = [
  "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)",
  "polygon(0% 0%, 30% 0%, 0% 30%, 0% 30%, 0% 0%)",
  "polygon(0% 0%, 65% 0%, 0% 65%, 35% 100%, 0% 35%)",
  "polygon(0% 0%, 100% 0%, 65% 100%, 0% 100%, 0% 0%)",
  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%)",
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

    // 2. Tiếng xào xạc lướt giấy (Swoosh) sau 15ms
    const duration = 0.18;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (ctx.sampleRate * 0.045));
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
  direction,
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

  const isDarkTarget = targetTheme === "dark";
  const resolvedDirection = direction || (isDarkTarget ? "forward" : "backward");
  const keyframes = resolvedDirection === "forward" ? FORWARD_CURL_POLYGONS : BACKWARD_CURL_POLYGONS;
  const duration = 520;

  // Tạm thời tắt CSS transitions trên live DOM để chụp ảnh snapshot tức thì, triệt tiêu hoàn toàn flicker
  document.documentElement.classList.add("theme-transitioning");

  // Safety net: luôn cleanup sau 850ms, kể cả khi View Transition bị stuck trên mobile
  const safetyCleanup = setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, 850);

  try {
    const transition = (document as any).startViewTransition(() => {
      onCommit(targetTheme);
    });

    if (transition && transition.ready) {
      transition.ready
        .then(() => {
          // Hoạt ảnh lật trang sách chéo từ góc màn hình (Apple Books / Kindle Page Curl)
          const anim = document.documentElement.animate(
            {
              clipPath: keyframes,
            },
            {
              duration,
              easing: "cubic-bezier(0.25, 1, 0.35, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );

          anim.finished.finally(() => {
            clearTimeout(safetyCleanup);
            document.documentElement.classList.remove("theme-transitioning");
          });
        })
        .catch(() => {
          clearTimeout(safetyCleanup);
          document.documentElement.classList.remove("theme-transitioning");
        });
    } else {
      clearTimeout(safetyCleanup);
      document.documentElement.classList.remove("theme-transitioning");
    }
  } catch {
    clearTimeout(safetyCleanup);
    document.documentElement.classList.remove("theme-transitioning");
    onCommit(targetTheme);
  }
}


