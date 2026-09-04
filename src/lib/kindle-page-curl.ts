/**
 * Ánh Thịnh Thi Quán - Masterpiece Kindle & Apple Books Page Curl Engine
 * Mô phỏng chính xác chuyển động gập giấy vật lý 3D (Physical Paper Folding & Reflection Math).
 * - Phản xạ góc giấy thực tế (Geometric Corner Reflection Math: P_reflected = 2Q - P_corner)
 * - Nếp uốn cong hình sin (Parabolic Tension Crease)
 * - Đổ bóng 2 lớp: Ambient Occlusion + Diffuse Penumbra Shadow
 * - Dải sáng hình trụ phản quang mặt sau giấy Dó (Cylindrical Specular Sheen)
 * - Âm thanh giấy Dó 2 thì: Click nhấc mép giấy + Vuốt giấy xào xạc (Web Audio API)
 */

export type SiteTheme = "ivory" | "sepia" | "dark";

interface PageCurlOptions {
  targetTheme: SiteTheme;
  direction?: "forward" | "backward";
  onCommit: (theme: SiteTheme) => void;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Phản xạ một điểm qua đường thẳng nếp gấp (L1 -> L2) theo hình học giải tích
 */
function reflectPoint(P: Point, L1: Point, L2: Point): Point {
  const dx = L2.x - L1.x;
  const dy = L2.y - L1.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return { x: P.x, y: P.y };
  const t = ((P.x - L1.x) * dx + (P.y - L1.y) * dy) / lenSq;
  const qx = L1.x + t * dx;
  const qy = L1.y + t * dy;
  return {
    x: 2 * qx - P.x,
    y: 2 * qy - P.y,
  };
}

/**
 * Âm thanh lật giấy Dó 2 giai đoạn (2-Phase Tactile Paper Audio):
 * Giai đoạn 1: Tiếng nhấc mép giấy tách khỏi mặt bàn (1800Hz Click)
 * Giai đoạn 2: Tiếng giấy xào xạc lướt ngang (Bandpass 950Hz Noise)
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
    tickGain.gain.setValueAtTime(0.02, ctx.currentTime);
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
    noiseGain.gain.setValueAtTime(0.045, ctx.currentTime + 0.015);
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
  const duration = 520; // 520ms - Nhịp lướt vàng của Apple Books / Kindle

  const W = window.innerWidth;
  const H = window.innerHeight;

  // Keyframes clip-path bóc tách trang thật theo góc chéo (Kindle Corner Peel)
  const forwardClipKeyframes = [
    "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 45%, 45% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 12%, 12% 100%, 0% 100%)",
    "polygon(0% 0%, 75% 0%, 0% 75%, 0% 100%, 0% 100%)",
    "polygon(0% 0%, 35% 0%, 0% 35%, 0% 100%, 0% 100%)",
    "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)",
  ];

  const backwardClipKeyframes = [
    "polygon(100% 0%, 100% 100%, 0% 100%, 0% 100%, 0% 0%)",
    "polygon(100% 0%, 100% 100%, 25% 100%, 0% 75%, 0% 0%)",
    "polygon(100% 0%, 100% 100%, 55% 100%, 0% 45%, 0% 0%)",
    "polygon(100% 0%, 100% 100%, 88% 100%, 0% 12%, 0% 0%)",
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
                "brightness(0.97)",
                "brightness(0.92)",
                "brightness(0.84)",
                "brightness(0.72)",
                "brightness(0.55)",
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
              transform: ["scale(0.99)", "scale(1)"],
            },
            {
              duration,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );

          // 3. CANVAS OVERLAY: Vẽ cánh giấy gập 3D thực thụ (Reflected Paper Flap)
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

          // Góc nghiêng tự nhiên của nếp lật (~47 độ)
          const angle = (47 * Math.PI) / 180;
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const maxDistance = W * cosA + H * sinA + 160;

          // Quartic Easing lướt trang cực êm và nảy nhẹ ở đuôi
          const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.5);

          function renderMasterpieceCurl(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = easeOut(progress);

            context.clearRect(0, 0, W, H);

            const dist = eased * maxDistance;

            // Tính 2 giao điểm của nếp gấp với cạnh màn hình
            let P1: Point; // Điểm trên cạnh dưới/trái
            let P2: Point; // Điểm trên cạnh phải/trên
            let cornerOrigin: Point;

            if (resolvedDirection === "forward") {
              // Lật từ góc dưới bên phải (W, H)
              cornerOrigin = { x: W, y: H };

              const xBot = W - (dist - 0 * sinA) / cosA;
              const yRight = H - (dist - 0 * cosA) / sinA;

              P1 = { x: Math.max(0, Math.min(W, xBot)), y: H };
              P2 = { x: W, y: Math.max(0, Math.min(H, yRight)) };

              // Nếu nếp gấp vượt qua mép trên/trái
              if (xBot < 0) {
                P1 = { x: 0, y: Math.max(0, H - (dist - W * cosA) / sinA) };
              }
              if (yRight < 0) {
                P2 = { x: Math.max(0, W - (dist - H * sinA) / cosA), y: 0 };
              }
            } else {
              // Lật lùi từ góc dưới bên trái (0, H)
              cornerOrigin = { x: 0, y: H };

              const xBot = (dist - 0 * sinA) / cosA;
              const yLeft = H - (dist - 0 * cosA) / sinA;

              P1 = { x: Math.max(0, Math.min(W, xBot)), y: H };
              P2 = { x: 0, y: Math.max(0, Math.min(H, yLeft)) };

              if (xBot > W) {
                P1 = { x: W, y: Math.max(0, H - (dist - W * cosA) / sinA) };
              }
              if (yLeft < 0) {
                P2 = { x: Math.min(W, (dist - H * sinA) / cosA), y: 0 };
              }
            }

            // Điểm đỉnh góc giấy được gập lộn ngược lại (Geometric Reflection Point)
            const reflectedCorner = reflectPoint(cornerOrigin, P1, P2);

            // Điểm uốn cong nếp gấp ở giữa chịu lực căng (Parabolic Bulge)
            const midX = (P1.x + P2.x) / 2;
            const midY = (P1.y + P2.y) / 2;
            const bulge = Math.sin(progress * Math.PI) * 28;
            const ctrlX = resolvedDirection === "forward" ? midX - bulge * cosA : midX + bulge * cosA;
            const ctrlY = midY - bulge * sinA;

            // =========================================================
            // LỚP 1: BÓNG ĐỔ 2 TẦNG (DUAL-LAYER CAST SHADOWS)
            // =========================================================
            context.save();

            // Tầng A: Bóng mềm khuếch tán diện rộng (Soft Penumbra Shadow)
            context.shadowColor = "rgba(0, 0, 0, 0.42)";
            context.shadowBlur = Math.min(48, 14 + progress * 35);
            context.shadowOffsetX = resolvedDirection === "forward" ? -14 * Math.sin(progress * Math.PI) : 14 * Math.sin(progress * Math.PI);
            context.shadowOffsetY = 12 * Math.sin(progress * Math.PI);

            context.beginPath();
            context.moveTo(P1.x, P1.y);
            context.quadraticCurveTo(ctrlX, ctrlY, P2.x, P2.y);
            context.lineTo(reflectedCorner.x, reflectedCorner.y);
            context.closePath();
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fill();

            context.restore();

            // =========================================================
            // LỚP 2: CÁNH GIẤY GẬP 3D (3D CURLED PAPER FLAP)
            // =========================================================
            context.save();

            // Gradient mặt sau giấy theo trục từ nếp gấp ra đỉnh góc
            const flapGrad = context.createLinearGradient(
              midX,
              midY,
              reflectedCorner.x,
              reflectedCorner.y
            );

            if (isGoingDark) {
              // Lật sang Dark: Mặt sau giấy ngà ấm áp đón ánh sáng phản chiếu
              flapGrad.addColorStop(0, "rgba(215, 206, 194, 0.95)");
              flapGrad.addColorStop(0.18, "#E6DDD2");
              flapGrad.addColorStop(0.42, "#FAF7F2"); // Dải highlight lụa óng ở đỉnh nếp uốn
              flapGrad.addColorStop(0.75, "#D8CEBE");
              flapGrad.addColorStop(1, "#EAE2D7");
            } else {
              // Lật sang Light: Mặt sau giấy đen tuyền huyền bí có ánh kim
              flapGrad.addColorStop(0, "rgba(18, 18, 22, 0.95)");
              flapGrad.addColorStop(0.2, "#24242C");
              flapGrad.addColorStop(0.45, "#3D3D48"); // Highlight kim loại nhẹ
              flapGrad.addColorStop(0.75, "#18181D");
              flapGrad.addColorStop(1, "#282830");
            }

            // Vẽ cánh giấy gập với đường uốn cong tự nhiên
            context.beginPath();
            context.moveTo(P1.x, P1.y);
            context.quadraticCurveTo(ctrlX, ctrlY, P2.x, P2.y);
            context.lineTo(reflectedCorner.x, reflectedCorner.y);
            context.closePath();

            context.fillStyle = flapGrad;
            context.fill();

            // Viền mép giấy mỏng thanh nhã (Paper Rim Stroke)
            context.strokeStyle = isGoingDark
              ? "rgba(255, 255, 255, 0.45)"
              : "rgba(255, 255, 255, 0.2)";
            context.lineWidth = 0.85;
            context.stroke();

            // =========================================================
            // LỚP 3: NẾP HẰN SÂU KHE GẬP (AMBIENT OCCLUSION CREASE)
            // =========================================================
            context.beginPath();
            context.moveTo(P1.x, P1.y);
            context.quadraticCurveTo(ctrlX, ctrlY, P2.x, P2.y);
            context.strokeStyle = "rgba(0, 0, 0, 0.35)";
            context.lineWidth = 2.2;
            context.stroke();

            context.restore();

            if (progress < 1) {
              requestAnimationFrame(renderMasterpieceCurl);
            } else {
              canvas.remove();
            }
          }

          requestAnimationFrame(renderMasterpieceCurl);
        })
        .catch(() => {
          // Fallback an toàn
        });
    }
  } catch {
    onCommit(targetTheme);
  }
}
