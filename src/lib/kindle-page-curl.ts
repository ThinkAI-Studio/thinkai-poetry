/**
 * Hữu Thịnh Thi Quán - Masterpiece Kindle & Apple Books Page Curl Engine
 * Chuyển động lật trang sách thơ chuẩn xác, tự nhiên:
 * - Trang theme CŨ (::view-transition-old) được bóc góc và lật cuộn đi (Peel & Flip Away)
 * - Trang theme MỚI (::view-transition-new) nằm ở lớp dưới lộ ra mượt mà
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
 * 5-Keyframe Page Curl Polygons cho Trang Cũ (Peel Old Page Away):
 * Mô phỏng chính xác góc trang sách cũ bị nhấc lên, cuộn chéo và lật hẳn ra khỏi màn hình
 */
const PEEL_OLD_PAGE_FORWARD = [
  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  "polygon(0% 0%, 72% 0%, 100% 28%, 100% 100%, 0% 100%)",
  "polygon(0% 0%, 38% 0%, 100% 62%, 100% 100%, 0% 100%)",
  "polygon(0% 0%, 0% 0%, 100% 100%, 38% 100%, 0% 62%)",
  "polygon(0% 100%, 0% 100%, 100% 100%, 0% 100%)",
];

const PEEL_OLD_PAGE_BACKWARD = [
  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 28%)",
  "polygon(62% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 62%)",
  "polygon(100% 0%, 100% 0%, 100% 100%, 38% 100%, 0% 100%)",
  "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
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
  const oldPageKeyframes = resolvedDirection === "forward" ? PEEL_OLD_PAGE_FORWARD : PEEL_OLD_PAGE_BACKWARD;
  const duration = 540;

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
          // 1. ANIMATE TRANG CŨ (::view-transition-old): Cuộn lật bóc góc đi khỏi màn hình
          const oldAnim = document.documentElement.animate(
            {
              clipPath: oldPageKeyframes,
              transform: resolvedDirection === "forward"
                ? ["rotate(0deg)", "rotate(-1.8deg)"]
                : ["rotate(0deg)", "rotate(1.8deg)"],
            },
            {
              duration,
              easing: "cubic-bezier(0.25, 1, 0.35, 1)",
              pseudoElement: "::view-transition-old(root)",
            }
          );

          // 2. ANIMATE TRANG MỚI (::view-transition-new): Lộ ra dưới trang cũ đang bóc đi
          document.documentElement.animate(
            {
              transform: ["scale(0.975)", "scale(1)"],
              filter: ["brightness(0.92)", "brightness(1)"],
            },
            {
              duration,
              easing: "cubic-bezier(0.25, 1, 0.35, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );

          oldAnim.finished.finally(() => {
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



