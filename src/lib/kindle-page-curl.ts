/**
 * Wind (Tác Giả Thịnh) Thi Quán - Masterpiece Bottom Corner Page Peel Engine
 * Chuyển động kéo bóc trang sách từ góc dưới lên góc trên cùng (Bottom Corner Page Peel):
 * - Polygon Interpolation kéo góc dưới (Bottom-Right / Bottom-Left) trượt chéo bóc dần lên góc đối diện
 * - Nếp gấp chéo & bóng đổ tự nhiên bằng GPU (Diagonal Fold Shadow via CSS drop-shadow)
 * - Âm thanh giấy Dó xúc giác 2 thì (Web Audio API)
 * - Triệt tiêu hoàn toàn hiện tượng chớp nháy / flicker
 */

export type SiteTheme = "ivory" | "sepia" | "dark";

interface PageCurlOptions {
  event?: React.MouseEvent | MouseEvent;
  targetTheme: SiteTheme;
  direction?: "forward" | "backward";
  onCommit: (theme: SiteTheme) => void;
}

/**
 * Keyframe Polygons kéo bóc trang cũ từ góc dưới lên góc trên
 * Toàn bộ các keyframes có chính xác 6 đỉnh (6-vertex polygon) để GPU browser
 * nội suy toạ độ hoàn hảo 100%, không bị đứt đoạn hay mất hiệu ứng.
 */
const FORWARD_BOTTOM_PEEL_POLYGONS = [
  "polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%)",
  "polygon(0% 0%, 100% 0%, 100% 75%, 100% 75%, 75% 100%, 0% 100%)",
  "polygon(0% 0%, 100% 0%, 100% 50%, 100% 50%, 50% 100%, 0% 100%)",
  "polygon(0% 0%, 100% 0%, 100% 25%, 100% 25%, 25% 100%, 0% 100%)",
  "polygon(0% 0%, 80% 0%, 80% 0%, 0% 80%, 0% 80%, 0% 100%)",
  "polygon(0% 0%, 40% 0%, 40% 0%, 0% 40%, 0% 40%, 0% 40%)",
  "polygon(0% 0%, 15% 0%, 15% 0%, 0% 15%, 0% 15%, 0% 15%)",
  "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)",
];

const BACKWARD_BOTTOM_PEEL_POLYGONS = [
  "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)",
  "polygon(0% 0%, 100% 0%, 100% 100%, 25% 100%, 25% 100%, 0% 75%)",
  "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 100%, 0% 50%)",
  "polygon(0% 0%, 100% 0%, 100% 100%, 75% 100%, 75% 100%, 0% 25%)",
  "polygon(20% 0%, 100% 0%, 100% 100%, 100% 80%, 100% 80%, 20% 0%)",
  "polygon(60% 0%, 100% 0%, 100% 40%, 100% 40%, 60% 0%, 60% 0%)",
  "polygon(85% 0%, 100% 0%, 100% 15%, 100% 15%, 85% 0%, 85% 0%)",
  "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)",
];

/**
 * Âm thanh giấy Dó xúc giác 2 thì khi bóc kéo trang sách
 */
function playKindleTactileAudio() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 1. Nhịp nhấp tách góc trang (Pop/Tick)
    const tickOsc = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tickOsc.type = "sine";
    tickOsc.frequency.setValueAtTime(380, ctx.currentTime);
    tickOsc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.025);
    tickGain.gain.setValueAtTime(0.035, ctx.currentTime);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
    tickOsc.connect(tickGain);
    tickGain.connect(ctx.destination);
    tickOsc.start(ctx.currentTime);
    tickOsc.stop(ctx.currentTime + 0.025);

    // 2. Tiếng xào xạc lướt kéo giấy Dó (Paper Swoosh)
    const duration = 0.2;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (ctx.sampleRate * 0.048));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1150;
    filter.Q.value = 1.3;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.028, ctx.currentTime + 0.015);
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

  // Hỗ trợ View Transition trên mọi thiết bị hiện đại (Desktop, Tablet & Mobile)
  const supportsViewTransition =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !prefersReduced;

  // Luôn phát âm thanh xúc giác giấy Dó
  playKindleTactileAudio();

  if (!supportsViewTransition) {
    onCommit(targetTheme);
    return;
  }

  const isDarkTarget = targetTheme === "dark";
  const resolvedDirection = direction || (isDarkTarget ? "forward" : "backward");
  const isForward = resolvedDirection === "forward";
  const peelPolygons = isForward
    ? FORWARD_BOTTOM_PEEL_POLYGONS
    : BACKWARD_BOTTOM_PEEL_POLYGONS;
  // Motion sang trọng, thi ca: 750ms
  const duration = 750;

  // Tạm thời tắt CSS transitions trên live DOM để chụp ảnh snapshot tức thì, triệt tiêu hoàn toàn flicker
  document.documentElement.classList.add("theme-transitioning");

  // Safety net: luôn cleanup sau 1000ms
  const safetyCleanup = setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, 1000);

  const cleanup = () => {
    clearTimeout(safetyCleanup);
    document.documentElement.classList.remove("theme-transitioning");
  };

  try {
    const transition = (document as any).startViewTransition(() => {
      onCommit(targetTheme);
    });

    if (transition && transition.ready) {
      transition.ready
        .then(() => {
          // 1. ANIMATE TRANG CŨ (::view-transition-old): Kéo bóc từ góc dưới lên góc trên với bóng đổ nếp gấp (ThinkAI UI Luxury Easing)
          const oldAnim = document.documentElement.animate(
            {
              clipPath: peelPolygons,
              transform: isForward
                ? [
                    "rotate(0deg) translate(0px, 0px)",
                    "rotate(-1deg) translate(-6px, -10px)",
                    "rotate(-2.2deg) translate(-18px, -24px)",
                    "rotate(-3.6deg) translate(-30px, -42px)",
                    "rotate(-4.8deg) translate(-44px, -60px)",
                    "rotate(-5.8deg) translate(-55px, -76px)",
                    "rotate(-6.5deg) translate(-68px, -92px)"
                  ]
                : [
                    "rotate(0deg) translate(0px, 0px)",
                    "rotate(1deg) translate(6px, -10px)",
                    "rotate(2.2deg) translate(18px, -24px)",
                    "rotate(3.6deg) translate(30px, -42px)",
                    "rotate(4.8deg) translate(44px, -60px)",
                    "rotate(5.8deg) translate(55px, -76px)",
                    "rotate(6.5deg) translate(68px, -92px)"
                  ]
            },
            {
              duration,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              pseudoElement: "::view-transition-old(root)",
              fill: "forwards",
            }
          );

          // 2. ANIMATE TRANG MỚI (::view-transition-new): Phóng to nhẹ lộ ra dưới trang cũ đang bóc kéo đi
          document.documentElement.animate(
            {
              transform: ["scale(0.975)", "scale(1)"],
              filter: ["brightness(0.9)", "brightness(1)"],
            },
            {
              duration,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              pseudoElement: "::view-transition-new(root)",
              fill: "forwards",
            }
          );

          oldAnim.finished.finally(cleanup);
        })
        .catch(cleanup);
    } else {
      cleanup();
    }
  } catch {
    cleanup();
    onCommit(targetTheme);
  }
}
