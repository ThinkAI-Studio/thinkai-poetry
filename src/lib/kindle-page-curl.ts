/**
 * Hữu Thịnh Thi Quán - Playful Stickman Theme Pusher Engine
 * Chuyển động người que đẩy khung hình theme cũ trượt khỏi màn hình:
 * - Người que (Stickman) gồng mình đẩy mép màn hình theme CŨ (::view-transition-old)
 * - Màn hình CŨ trượt dần ra khỏi màn hình (translateX 0 -> 100%)
 * - Màn hình MỚI (::view-transition-new) lộ ra mượt mà ở bên dưới
 * - Âm thanh xúc giác & tiếng đẩy trượt sinh động (Web Audio API)
 */

export type SiteTheme = "ivory" | "sepia" | "dark";

interface PageCurlOptions {
  event?: React.MouseEvent | MouseEvent;
  targetTheme: SiteTheme;
  direction?: "forward" | "backward";
  onCommit: (theme: SiteTheme) => void;
}

/**
 * Âm thanh xúc giác người que đẩy màn hình (Stickman Push Audio)
 */
function playStickmanPushAudio() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 1. Nhịp chạm tay gồng mình đẩy (Pop / Tap)
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = "sine";
    popOsc.frequency.setValueAtTime(420, ctx.currentTime);
    popOsc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);
    popGain.gain.setValueAtTime(0.04, ctx.currentTime);
    popGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(ctx.currentTime);
    popOsc.stop(ctx.currentTime + 0.04);

    // 2. Tiếng trượt màn hình kéo dài (Sliding Friction Sound)
    const duration = 0.65;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (ctx.sampleRate * 0.16));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 650;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.03, ctx.currentTime + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(ctx.currentTime + 0.02);
  } catch {}
}

/**
 * Tạo & Animate người que (Stickman) đẩy mép màn hình theme cũ
 */
function spawnStickmanPusher(pushDirection: "left" | "right", duration: number) {
  if (typeof document === "undefined") return;

  // Xóa overlay cũ nếu có
  const existing = document.getElementById("stickman-theme-pusher");
  if (existing) {
    try {
      existing.remove();
    } catch {}
  }

  const isPushLeft = pushDirection === "left";
  const overlay = document.createElement("div");
  overlay.id = "stickman-theme-pusher";
  overlay.style.cssText = `
    position: fixed;
    top: 45vh;
    ${isPushLeft ? "right: -10px;" : "left: -10px;"}
    width: 110px;
    height: 135px;
    z-index: 99999;
    pointer-events: none;
    user-select: none;
    transform: translateY(-50%) ${isPushLeft ? "" : "scaleX(-1)"};
  `;

  // SVG Người que gồng người đẩy màn hình sinh động
  overlay.innerHTML = `
    <div style="width:100%;height:100%;position:relative;">
      <svg viewBox="0 0 100 120" fill="none" style="width:100%;height:100%;overflow:visible;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.35));">
        <!-- Bụi mờ dưới chân bước chạy -->
        <path d="M 68 108 Q 82 104 78 115 Q 92 110 86 118" stroke="#E05A47" stroke-width="2.5" stroke-linecap="round" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.18s" repeatCount="indefinite" />
        </path>

        {/* Đầu người que với mắt quyết tâm ( >:D ) */}
        <circle cx="56" cy="24" r="14" fill="#2D5A3D" stroke="#FFFFFF" stroke-width="3" />
        <path d="M 50 20 L 55 23 M 59 23 L 64 20 M 52 30 Q 57 34 62 30" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" fill="none" />
        {/* Giọt mồ hôi hột e ấp */}
        <path d="M 39 18 Q 35 22 39 26 Q 43 22 39 18 Z" fill="#38BDF8" />

        {/* Thân nghiêng 35 độ gồng mình đẩy */}
        <line x1="56" y1="38" x2="42" y2="76" stroke="#2D5A3D" stroke-width="5.5" stroke-linecap="round" />

        {/* 2 Tay áp sát mép bức tường màn hình đẩy mạnh */}
        <path d="M 52 46 L 24 42 L 0 42" stroke="#2D5A3D" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <path d="M 52 52 L 26 55 L 0 55" stroke="#2D5A3D" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />

        {/* 2 Chân bước chạy đẩy đạp đất liên tục (Animated Pacing) */}
        <path d="M 42 76 L 65 94 L 80 114" stroke="#2D5A3D" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <animate attributeName="d" values="M 42 76 L 65 94 L 80 114; M 42 76 L 50 96 L 60 116; M 42 76 L 65 94 L 80 114" dur="0.22s" repeatCount="indefinite" />
        </path>
        <path d="M 42 76 L 24 94 L 36 116" stroke="#2D5A3D" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <animate attributeName="d" values="M 42 76 L 24 94 L 36 116; M 42 76 L 38 92 L 52 114; M 42 76 L 24 94 L 36 116" dur="0.22s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate người que di chuyển đồng bộ cùng bức tường màn hình trượt đi
  const anim = overlay.animate(
    isPushLeft
      ? [
          { transform: "translateY(-50%) translateX(0px)" },
          { transform: "translateY(-50%) translateX(-100vw)" },
        ]
      : [
          { transform: "translateY(-50%) scaleX(-1) translateX(0px)" },
          { transform: "translateY(-50%) scaleX(-1) translateX(100vw)" },
        ],
    {
      duration,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    }
  );

  anim.finished.finally(() => {
    try {
      overlay.remove();
    } catch {}
  });
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

  playStickmanPushAudio();

  const isDarkTarget = targetTheme === "dark";
  const resolvedDirection = direction || (isDarkTarget ? "forward" : "backward");
  const pushDirection = resolvedDirection === "forward" ? "left" : "right";
  const duration = 1150;

  // Tạm thời tắt CSS transitions trên live DOM để chụp ảnh snapshot tức thì, triệt tiêu hoàn toàn flicker
  document.documentElement.classList.add("theme-transitioning");

  // Safety net: luôn cleanup sau 1400ms, kể cả khi View Transition bị stuck trên mobile
  const safetyCleanup = setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, 1400);

  try {
    const transition = (document as any).startViewTransition(() => {
      onCommit(targetTheme);
    });

    if (transition && transition.ready) {
      transition.ready
        .then(() => {
          // Bật người que gồng người đẩy màn hình
          spawnStickmanPusher(pushDirection, duration);

          // 1. ANIMATE MÀN HÌNH THEME CŨ (::view-transition-old): Trượt hoàn toàn khỏi màn hình
          const oldAnim = document.documentElement.animate(
            {
              transform: pushDirection === "left"
                ? ["translateX(0%)", "translateX(-100%)"]
                : ["translateX(0%)", "translateX(100%)"],
            },
            {
              duration,
              easing: "cubic-bezier(0.3, 1, 0.35, 1)",
              pseudoElement: "::view-transition-old(root)",
            }
          );

          // 2. ANIMATE MÀN HÌNH THEME MỚI (::view-transition-new): Phóng to nhẹ lộ ra mượt mà ở dưới
          document.documentElement.animate(
            {
              transform: ["scale(0.96)", "scale(1)"],
              filter: ["brightness(0.9)", "brightness(1)"],
            },
            {
              duration,
              easing: "cubic-bezier(0.3, 1, 0.35, 1)",
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
