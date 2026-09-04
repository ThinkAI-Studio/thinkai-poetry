/**
 * Ánh Thịnh Thi Quán - 3D Book Page Flip Theme Transition Engine
 * Hiệu ứng Lật Trang Sách Thơ 3D (3D Page Turn with Perspective, Spine Shadows & Paper Sound).
 * Tối ưu 60/120 FPS trên GPU Compositor luồng Web Animations API.
 */

export type SiteTheme = "ivory" | "sepia" | "dark";

interface TransitionOptions {
  event?: React.MouseEvent | MouseEvent;
  targetTheme: SiteTheme;
  onCommit: (theme: SiteTheme) => void;
}

/**
 * Tạo âm thanh lật trang giấy Dó xào xạc nhẹ nhàng bằng Web Audio API (Zero external assets)
 */
function playPaperRustleSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const duration = 0.14; // 140ms
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Tiếng xào xạc giấy tự nhiên với hàm suy giảm mũ
      const decay = Math.exp(-i / (ctx.sampleRate * 0.035));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1100;
    filter.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch {
    // Không bắt buộc nếu trình duyệt chặn audio
  }
}

export function executePoeticTransition({
  event,
  targetTheme,
  onCommit,
}: TransitionOptions) {
  // 1. Kiểm tra prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 2. Kiểm tra hỗ trợ View Transition API
  const supportsViewTransition =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !prefersReducedMotion;

  if (!supportsViewTransition) {
    onCommit(targetTheme);
    return;
  }

  // Phát âm thanh lật trang giấy xào xạc nhẹ nhàng
  playPaperRustleSound();

  const isGoingDark = targetTheme === "dark";

  // 3. Khởi tạo View Transition của trình duyệt
  try {
    const transition = (document as any).startViewTransition(() => {
      onCommit(targetTheme);
    });

    if (transition && transition.ready) {
      transition.ready
        .then(() => {
          if (isGoingDark) {
            // ========================================================
            // 📖 LẬT TRANG SÁCH TIẾN TỚI (PAGE FLIP FORWARD: PHẢI QUA TRÁI)
            // Trang sáng cũ lật sang trái như lật trang một cuốn sách thơ
            // ========================================================
            document.documentElement.animate(
              [
                {
                  transform: "perspective(2200px) rotateY(0deg) translateZ(0)",
                  transformOrigin: "left center",
                  filter: "brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0))",
                  opacity: 1,
                },
                {
                  filter: "brightness(0.65) drop-shadow(-35px 0 45px rgba(0,0,0,0.65))",
                  offset: 0.5,
                },
                {
                  transform: "perspective(2200px) rotateY(-105deg) translateZ(60px)",
                  transformOrigin: "left center",
                  filter: "brightness(0.25) drop-shadow(-70px 0 70px rgba(0,0,0,0))",
                  opacity: 0,
                },
              ],
              {
                duration: 720,
                easing: "cubic-bezier(0.25, 1, 0.4, 1)",
                pseudoElement: "::view-transition-old(root)",
                fill: "forwards",
              }
            );

            // Trang đêm mới ở bên dưới xuất hiện với độ sáng tăng dần
            document.documentElement.animate(
              [
                {
                  filter: "brightness(0.7)",
                  transform: "scale(0.985)",
                },
                {
                  filter: "brightness(1)",
                  transform: "scale(1)",
                },
              ],
              {
                duration: 720,
                easing: "cubic-bezier(0.25, 1, 0.4, 1)",
                pseudoElement: "::view-transition-new(root)",
              }
            );
          } else {
            // ========================================================
            // 📖 LẬT TRANG SÁCH LÙI LẠI (PAGE FLIP BACKWARD: TRÁI QUA PHẢI)
            // Trang tối cũ lật sang phải trở lại trang giấy ngà ban ngày
            // ========================================================
            document.documentElement.animate(
              [
                {
                  transform: "perspective(2200px) rotateY(0deg) translateZ(0)",
                  transformOrigin: "right center",
                  filter: "brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0))",
                  opacity: 1,
                },
                {
                  filter: "brightness(0.65) drop-shadow(35px 0 45px rgba(0,0,0,0.65))",
                  offset: 0.5,
                },
                {
                  transform: "perspective(2200px) rotateY(105deg) translateZ(60px)",
                  transformOrigin: "right center",
                  filter: "brightness(0.25) drop-shadow(70px 0 70px rgba(0,0,0,0))",
                  opacity: 0,
                },
              ],
              {
                duration: 720,
                easing: "cubic-bezier(0.25, 1, 0.4, 1)",
                pseudoElement: "::view-transition-old(root)",
                fill: "forwards",
              }
            );

            // Trang sáng mới ở bên dưới xuất hiện đón ánh bình minh
            document.documentElement.animate(
              [
                {
                  filter: "brightness(0.7)",
                  transform: "scale(0.985)",
                },
                {
                  filter: "brightness(1)",
                  transform: "scale(1)",
                },
              ],
              {
                duration: 720,
                easing: "cubic-bezier(0.25, 1, 0.4, 1)",
                pseudoElement: "::view-transition-new(root)",
              }
            );
          }
        })
        .catch(() => {
          // Fallback an toàn
        });
    }
  } catch {
    onCommit(targetTheme);
  }
}
