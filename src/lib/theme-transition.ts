/**
 * Ánh Thịnh Thi Quán - Kindle-Style Poetic Theme Transition Coordinator
 * Tích hợp hiệu ứng lật trang sách từ góc lên (Kindle / Apple Books Corner Page Curl).
 */

import { executeKindlePageCurl, SiteTheme } from "./kindle-page-curl";

export type { SiteTheme };

interface TransitionOptions {
  event?: React.MouseEvent | MouseEvent;
  targetTheme: SiteTheme;
  direction?: "forward" | "backward";
  onCommit: (theme: SiteTheme) => void;
}

export function executePoeticTransition({
  targetTheme,
  direction,
  onCommit,
}: TransitionOptions) {
  const isGoingDark = targetTheme === "dark";
  const resolvedDirection = direction || (isGoingDark ? "forward" : "backward");

  executeKindlePageCurl({
    targetTheme,
    direction: resolvedDirection,
    onCommit,
  });
}
