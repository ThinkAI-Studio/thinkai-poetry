/**
 * Ánh Thịnh Thi Quán - Polished Kindle Corner Page Curl Engine
 * Kết hợp View Transitions API (peeling the REAL DOM snapshot)
 * + Canvas 3D Curled Flap & Crease Drop Shadow + Web Audio Paper Rustle.
 * 60/120 FPS trên GPU Compositor, siêu mượt, chân thực như máy đọc sách Kindle.
 */

export type SiteTheme = "ivory" | "sepia" | "dark";

interface PageCurlOptions {
  targetTheme: SiteTheme;
  direction?: "forward" | "backward";
  onCommit: (theme: SiteTheme) => void;
}

/**
 * Âm thanh lật giấy Dó xào xạc nhẹ nhàng bằng Web Audio API (150ms)
 */
function playPaperRustleSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const duration = 0.15;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (ctx.sampleRate * 0.038));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1050;
    filter.Q.value = 1.35;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.045, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
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

  playPaperRustleSound();

  const isGoingDark = targetTheme === "dark";
  const resolvedDirection = direction || (isGoingDark ? "forward" : "backward");
  const duration = 540; // 540ms - Tốc độ lướt lý tưởng của Kindle

  const W = window.innerWidth;
  const H = window.innerHeight;

  // Keyframes clip-path bóc tách trang thật theo góc chéo (Kindle Corner Peel)
  const forwardClipKeyframes = [
    "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 45%, 45% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 10%, 10% 100%, 0% 100%)",
    "polygon(0% 0%, 75% 0%, 0% 75%, 0% 100%, 0% 100%)",
    "polygon(0% 0%, 35% 0%, 0% 35%, 0% 100%, 0% 100%)",
    "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)",
  ];

  const backwardClipKeyframes = [
    "polygon(100% 0%, 100% 100%, 0% 100%, 0% 100%, 0% 0%)",
    "polygon(100% 0%, 100% 100%, 25% 100%, 0% 75%, 0% 0%)",
    "polygon(100% 0%, 100% 100%, 55% 100%, 0% 45%, 0% 0%)",
    "polygon(100% 0%, 100% 100%, 90% 100%, 0% 10%, 0% 0%)",
    "polygon(100% 0%, 100% 100%, 100% 100%, 25% 0%, 100% 0%)",
    "polygon(100% 0%, 100% 100%, 100% 100%, 65% 0%, 100% 0%)",
    "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)",
  ];

  const clipPathKeyframes =
    resolvedDirection === "forward" ? forwardClipKeyframes : backwardClipKeyframes;

  try {
    const transition = (document as any).startViewTransition(() => {
      onCommit(targetTheme);
    });

    if (transition && transition.ready) {
      transition.ready
        .then(() => {
          // 1. Áp dụng Clip-Path lật góc trên ảnh chụp trang cũ (::view-transition-old)
          document.documentElement.animate(
            {
              clipPath: clipPathKeyframes,
              filter: [
                "brightness(1)",
                "brightness(0.96)",
                "brightness(0.9)",
                "brightness(0.8)",
                "brightness(0.7)",
                "brightness(0.5)",
                "brightness(0.3)",
              ],
            },
            {
              duration,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-old(root)",
              fill: "forwards",
            }
          );

          // 2. Trang mới ở dưới nhận ánh sáng và mở rộng nhẹ
          document.documentElement.animate(
            {
              filter: ["brightness(0.85)", "brightness(1)"],
              transform: ["scale(0.988)", "scale(1)"],
            },
            {
              duration,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );

          // 3. CANVAS OVERLAY: Vẽ vành cong giấy (Curled Flap) và bóng đổ nếp gấp (Crease Shadow)
          const canvas = document.createElement("canvas");
          canvas.width = W;
          canvas.height = H;
          canvas.style.position = "fixed";
          canvas.style.inset = "0";
          canvas.style.zIndex = "999999";
          canvas.style.pointerEvents = "none";
          document.body.appendChild(canvas);

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            canvas.remove();
            return;
          }

          const context: CanvasRenderingContext2D = ctx;
          const startTime = performance.now();
          const angle = (48 * Math.PI) / 180;
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const maxDistance = W * cosA + H * sinA + 160;
          const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

          function renderCurlEffects(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = easeOut(progress);

            context.clearRect(0, 0, W, H);

            const dist = eased * maxDistance;
            const curlThickness = Math.sin(progress * Math.PI) * 70 + 20; // Vành cong nở to ở giữa hành trình

            // Tọa độ đường nếp gấp
            const px = resolvedDirection === "forward" ? W - dist * cosA : dist * cosA;
            const py = H - dist * sinA;

            context.save();

            // A. Bóng đổ sâu của nếp gấp trang sách (Crease Cast Shadow)
            const shadowGrad = context.createLinearGradient(
              px,
              py,
              resolvedDirection === "forward" ? px + curlThickness * cosA : px - curlThickness * cosA,
              py + curlThickness * sinA
            );
            shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.5)");
            shadowGrad.addColorStop(0.3, "rgba(0, 0, 0, 0.25)");
            shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

            context.fillStyle = shadowGrad;
            context.fillRect(0, 0, W, H);

            // B. Vành giấy cong 3D (Curled Paper Flap) có dải sáng trụ
            const flapGrad = context.createLinearGradient(
              px,
              py,
              resolvedDirection === "forward" ? px - curlThickness * cosA : px + curlThickness * cosA,
              py - curlThickness * sinA
            );

            if (isGoingDark) {
              // Lật sang tối: Mặt sau trang sáng phản chiếu ánh sáng ngà
              flapGrad.addColorStop(0, "#D8D0C5");
              flapGrad.addColorStop(0.35, "#FBF9F5");
              flapGrad.addColorStop(0.7, "#CBC2B6");
              flapGrad.addColorStop(1, "rgba(203, 194, 182, 0)");
            } else {
              // Lật sang sáng: Mặt sau trang tối có ánh xám huyền
              flapGrad.addColorStop(0, "#1F1F24");
              flapGrad.addColorStop(0.4, "#2E2E36");
              flapGrad.addColorStop(0.7, "#141417");
              flapGrad.addColorStop(1, "rgba(20, 20, 23, 0)");
            }

            context.beginPath();
            const nx = -sinA * 2000;
            const ny = cosA * 2000;

            context.moveTo(px - nx, py - ny);
            context.lineTo(px + nx, py + ny);
            context.lineTo(
              resolvedDirection === "forward" ? px + curlThickness * cosA + nx : px - curlThickness * cosA + nx,
              py + curlThickness * sinA + ny
            );
            context.lineTo(
              resolvedDirection === "forward" ? px + curlThickness * cosA - nx : px - curlThickness * cosA - nx,
              py + curlThickness * sinA - ny
            );
            context.closePath();

            context.fillStyle = flapGrad;
            context.fill();

            context.restore();

            if (progress < 1) {
              requestAnimationFrame(renderCurlEffects);
            } else {
              canvas.remove();
            }
          }

          requestAnimationFrame(renderCurlEffects);
        })
        .catch(() => {
          // Fallback an toàn
        });
    }
  } catch {
    onCommit(targetTheme);
  }
}
