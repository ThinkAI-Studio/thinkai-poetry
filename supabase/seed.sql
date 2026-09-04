-- ==============================================================================
-- HỮU THỊNH THI QUÁN (THỊNH VÀ THƠ) — SUPABASE INITIAL SETUP
-- Organization: ThinkAI Studio
-- Tác giả: Hữu Thịnh
-- ==============================================================================

-- 1. SEED TÁC GIẢ (AUTHORS) — DUY NHẤT HỮU THỊNH
INSERT INTO public.authors (id, name, pen_name, slug, period, bio, avatar_url)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Hữu Thịnh',
    'Hữu Thịnh',
    'huu-thinh',
    'Văn học đương đại',
    'Người gieo vần cho những miền ký ức. Tác giả của nhiều thi phẩm trữ tình đương đại, gắn liền với tình yêu thiên nhiên, triết lý nhân sinh và vẻ đẹp sâu lắng của tâm hồn người Việt.',
    '/floral/flower-pink.png'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url;

-- 2. SEED THỂ LOẠI (CATEGORIES)
INSERT INTO public.categories (id, name, slug, description, sort_order)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Thơ Lục Bát', 'tho-luc-bat', 'Điệu hồn dân tộc, niêm luật 6-8 truyền thống mượt mà, sâu lắng', 1),
  ('c0000000-0000-0000-0000-000000000002', 'Thơ Tự Do', 'tho-tu-do', 'Phóng khoáng, khai mở nhịp điệu nội tâm và cảm xúc đương đại', 2),
  ('c0000000-0000-0000-0000-000000000003', 'Thơ Đường Luật', 'tho-duong-luat', 'Thất ngôn bát cú trang trọng, niêm đối nghiêm cẩn, cốt cách thi thư', 3),
  ('c0000000-0000-0000-0000-000000000004', 'Thơ Thiền & Tĩnh Tâm', 'tho-thien', 'Lắng đọng, an nhiên, chiêm nghiệm giữa dòng đời hối hả', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- GHI CHÚ: Dữ liệu mẫu (Sample Poems, Collections, Annotations) đã được dọn sạch hoàn toàn theo yêu cầu.
-- Người dùng sẽ tạo mới qua Cổng Quản Trị /admin.
