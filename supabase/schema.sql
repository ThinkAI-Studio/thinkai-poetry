-- ==============================================================================
-- THỊNH VÀ THƠ — SUPABASE DATABASE SCHEMA DDL
-- Tác giả: Hữu Thịnh
-- Nền tảng: ThinkAI Studio / Next.js + Supabase PostgreSQL
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS (TIỆN ÍCH MỞ RỘNG CƠ SỞ DỮ LIỆU)
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ------------------------------------------------------------------------------
-- 2. HÀM DÙNG CHUNG & TRIGGERS
-- ------------------------------------------------------------------------------

-- Tự động cập nhật cột updated_at khi có sự thay đổi dữ liệu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hàm RPC tăng lượt xem bài thơ nguyên tử (Atomic View Count Increment)
CREATE OR REPLACE FUNCTION increment_poem_view(p_slug TEXT)
RETURNS INT AS $$
DECLARE
  v_count INT;
BEGIN
  UPDATE public.poems
  SET view_count = view_count + 1
  WHERE slug = p_slug
  RETURNING view_count INTO v_count;

  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- BẢNG 1: TÁC GIẢ (AUTHORS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pen_name TEXT,
  slug TEXT UNIQUE NOT NULL,
  period TEXT DEFAULT 'Văn học đương đại',
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_update_authors_updated_at ON public.authors;
CREATE TRIGGER trigger_update_authors_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- BẢNG 2: THỂ LOẠI / DANH MỤC THƠ (CATEGORIES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- BẢNG 3: TUYỂN TẬP / BỘ SƯU TẬP (COLLECTIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_update_collections_updated_at ON public.collections;
CREATE TRIGGER trigger_update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- BẢNG 4: THI PHẨM / BÀI THƠ (POEMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  form_type TEXT NOT NULL DEFAULT 'luc_bat',
  excerpt TEXT,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_html TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  show_author_info BOOLEAN NOT NULL DEFAULT true,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  cover_image_url TEXT,
  audio_url TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_update_poems_updated_at ON public.poems;
CREATE TRIGGER trigger_update_poems_updated_at
BEFORE UPDATE ON public.poems
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- BẢNG 5: LIÊN KẾT TUYỂN TẬP VÀ BÀI THƠ (COLLECTION_POEMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collection_poems (
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, poem_id)
);

-- ------------------------------------------------------------------------------
-- BẢNG 6: CHÚ GIẢI THI CA (ANNOTATIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  explanation TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- BẢNG 7: TỦ THƠ YÊU THÍCH / DẤU ẤN (SAVED_POEMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- BẢNG 8: BÌNH THƠ & ĐÀM ĐẠO VĂN CHƯƠNG (COMMENTS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- BẢNG 9: NHẬT KÝ KIỂM TOÁN QUẢN TRỊ BẤT BIẾN (ADMIN_AUDIT_LOGS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_name TEXT,
  diff_json JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CHỈ MỤC TỐC ĐỘ CAO (PERFORMANCE INDEXES)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_poems_slug ON public.poems(slug);
CREATE INDEX IF NOT EXISTS idx_poems_status ON public.poems(status);
CREATE INDEX IF NOT EXISTS idx_poems_form_type ON public.poems(form_type);
CREATE INDEX IF NOT EXISTS idx_poems_category ON public.poems(category_id);
CREATE INDEX IF NOT EXISTS idx_poems_author ON public.poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_is_featured ON public.poems(is_featured);
CREATE INDEX IF NOT EXISTS idx_poems_created_at ON public.poems(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON public.collections(is_featured);
CREATE INDEX IF NOT EXISTS idx_collections_sort ON public.collections(sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_collection_poems_sort ON public.collection_poems(collection_id, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON public.authors(slug);
CREATE INDEX IF NOT EXISTS idx_annotations_poem ON public.annotations(poem_id, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_saved_poems_device ON public.saved_poems(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_saved_poems_user ON public.saved_poems(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_poem ON public.comments(poem_id, created_at DESC);

-- GIN Index tìm kiếm toàn văn tiếng Việt (Full-text Search)
CREATE INDEX IF NOT EXISTS idx_poems_fts ON public.poems USING gin(to_tsvector('simple', title || ' ' || raw_text));

-- ------------------------------------------------------------------------------
-- 4. BẢO MẬT CẤP HÀNG (ROW LEVEL SECURITY - RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 4.1. Policies Công Khai (Public Read - Khách & Người đọc)
DROP POLICY IF EXISTS "Public Read Authors" ON public.authors;
CREATE POLICY "Public Read Authors" ON public.authors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Collections" ON public.collections;
CREATE POLICY "Public Read Collections" ON public.collections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Published Poems" ON public.poems;
CREATE POLICY "Public Read Published Poems" ON public.poems FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public Read Collection Poems" ON public.collection_poems;
CREATE POLICY "Public Read Collection Poems" ON public.collection_poems FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Annotations" ON public.annotations;
CREATE POLICY "Public Read Annotations" ON public.annotations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Approved Comments" ON public.comments;
CREATE POLICY "Public Read Approved Comments" ON public.comments FOR SELECT USING (is_approved = true);

-- 4.2. Policies Tủ Thơ Yêu Thích (Guest & User Bookmarks)
DROP POLICY IF EXISTS "Public Insert Saved Poems" ON public.saved_poems;
CREATE POLICY "Public Insert Saved Poems" ON public.saved_poems FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Own Saved Poems" ON public.saved_poems;
CREATE POLICY "Public Read Own Saved Poems" ON public.saved_poems FOR SELECT USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (device_fingerprint IS NOT NULL)
);

DROP POLICY IF EXISTS "Public Delete Own Saved Poems" ON public.saved_poems;
CREATE POLICY "Public Delete Own Saved Poems" ON public.saved_poems FOR DELETE USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (device_fingerprint IS NOT NULL)
);

-- 4.3. Policies Bình Thơ Công Khai
DROP POLICY IF EXISTS "Public Insert Comments" ON public.comments;
CREATE POLICY "Public Insert Comments" ON public.comments FOR INSERT WITH CHECK (true);

-- 4.4. Policies Toàn Quyền Cho Backend Admin (Service Role & Authenticated)
DROP POLICY IF EXISTS "Service Role All Authors" ON public.authors;
CREATE POLICY "Service Role All Authors" ON public.authors FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service Role All Categories" ON public.categories;
CREATE POLICY "Service Role All Categories" ON public.categories FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service Role All Collections" ON public.collections;
CREATE POLICY "Service Role All Collections" ON public.collections FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service Role All Poems" ON public.poems;
CREATE POLICY "Service Role All Poems" ON public.poems FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service Role All Collection Poems" ON public.collection_poems;
CREATE POLICY "Service Role All Collection Poems" ON public.collection_poems FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service Role All Annotations" ON public.annotations;
CREATE POLICY "Service Role All Annotations" ON public.annotations FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service Role All Saved Poems" ON public.saved_poems;
CREATE POLICY "Service Role All Saved Poems" ON public.saved_poems FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service Role All Comments" ON public.comments;
CREATE POLICY "Service Role All Comments" ON public.comments FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service Role All Logs" ON public.admin_audit_logs;
CREATE POLICY "Service Role All Logs" ON public.admin_audit_logs FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 5. CẤU HÌNH SUPABASE STORAGE (LƯU TRỮ TỆP MEDIA)
-- ------------------------------------------------------------------------------
-- Tự động khởi tạo 3 Buckets chính nếu chưa có
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('covers', 'covers', true),
  ('audio', 'audio', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Cho phép công chúng tải / nghe tệp từ 3 bucket này
DROP POLICY IF EXISTS "Public Read Covers" ON storage.objects;
CREATE POLICY "Public Read Covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "Public Read Audio" ON storage.objects;
CREATE POLICY "Public Read Audio" ON storage.objects FOR SELECT USING (bucket_id = 'audio');

DROP POLICY IF EXISTS "Public Read Avatars" ON storage.objects;
CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Cho phép Admin tải lên tệp vào buckets
DROP POLICY IF EXISTS "Admin Upload Covers" ON storage.objects;
CREATE POLICY "Admin Upload Covers" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'covers' AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);

DROP POLICY IF EXISTS "Admin Upload Audio" ON storage.objects;
CREATE POLICY "Admin Upload Audio" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'audio' AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);

DROP POLICY IF EXISTS "Admin Upload Avatars" ON storage.objects;
CREATE POLICY "Admin Upload Avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);
