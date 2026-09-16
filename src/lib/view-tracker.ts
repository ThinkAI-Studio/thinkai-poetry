/**
 * Bộ ghi nhận lượt đọc thi phẩm (Poem View Tracker)
 * Ghi nhận lượt đọc thực tế của độc giả, chống spam và trùng lặp trong một phiên đọc.
 */

const trackedInSession = new Set<string>();

export function trackPoemView(poemId: string, slug?: string): void {
  if (typeof window === "undefined" || !poemId) return;

  const sessionKey = `viewed_poem_${poemId}`;

  // Kiểm tra in-memory cache hoặc sessionStorage
  if (trackedInSession.has(poemId)) return;

  try {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      const timestamp = parseInt(saved, 10);
      // Nếu đã đọc trong vòng 15 phút thì không đếm lặp
      if (Date.now() - timestamp < 15 * 60 * 1000) {
        trackedInSession.add(poemId);
        return;
      }
    }
  } catch {}

  // Đánh dấu đã đọc
  trackedInSession.add(poemId);
  try {
    sessionStorage.setItem(sessionKey, Date.now().toString());
  } catch {}

  // Gửi request ngầm ghi nhận lượt đọc
  fetch("/api/poems/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: poemId, slug }),
    keepalive: true,
  }).catch(() => {
    // Không làm gián đoạn trải nghiệm đọc nếu mạng chập chờn
  });
}
