/**
 * Ánh Thịnh Thi Quán - Poetic Theme Transition Engine
 * Tối ưu 60 FPS trên GPU Compositor, hỗ trợ tọa độ thực tế, kiểm soát fallback và an toàn cho accessibility.
 */

export type SiteTheme = "ivory" | "sepia" | "dark";

interface TransitionOptions {
  event?: React.MouseEvent | MouseEvent;
  targetTheme: SiteTheme;
  onCommit: (theme: SiteTheme) => void;
}

export function executePoeticTransition({
  event,
  targetTheme,
  onCommit,
}: TransitionOptions) {
  // 1. Kiểm tra prefers-reduced-motion (tôn trọng người dùng nhạy cảm chuyển động)
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

  // 3. Xác định tọa độ tâm điểm lan tỏa (gốc click chuột hoặc tâm màn hình)
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  if (event) {
    x = event.clientX;
    y = event.clientY;
  }

  // 4. Tính toán bán kính cực đại để vành mực/ánh sáng phủ kín 4 góc màn hình
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const isGoingDark = targetTheme === "dark";

  // 5. Khởi tạo View Transition của trình duyệt
  try {
    const transition = (document as any).startViewTransition(() => {
      onCommit(targetTheme);
    });

    if (transition && transition.ready) {
      transition.ready.then(() => {
        // Keyframes dạng hình tròn loang mực
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        // Sử dụng Web Animations API để chạy trực tiếp trên GPU Compositor Thread
        document.documentElement.animate(
          {
            clipPath: isGoingDark ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: isGoingDark
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
          }
        );
      }).catch(() => {
        // Fallback nếu animation promise bị ngắt
      });
    }
  } catch {
    onCommit(targetTheme);
  }
}
