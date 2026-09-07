import { createClient } from "@supabase/supabase-js";
import {
  Author,
  Category,
  Collection,
  Poem,
  PoemFormType,
} from "@/types/database";
import {
  mockAuthors,
  mockCategories,
  mockCollections,
  mockPoems,
} from "@/data/mock-poetry";

import fs from "fs";
import path from "path";

function getLocalStoredPoems(): Poem[] {
  try {
    const filePath = path.join(process.cwd(), "src/data/local-poems.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) || [];
    }
  } catch {}
  return [];
}

function saveLocalStoredPoem(poem: Poem) {
  try {
    const filePath = path.join(process.cwd(), "src/data/local-poems.json");
    const existing = getLocalStoredPoems();
    const updated = [poem, ...existing.filter((p) => p.slug !== poem.slug)];
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  } catch {}
}

function getLocalStoredAuthors(): Author[] {
  try {
    const filePath = path.join(process.cwd(), "src/data/local-authors.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [...mockAuthors];
}

function saveLocalStoredAuthor(author: Author) {
  try {
    const filePath = path.join(process.cwd(), "src/data/local-authors.json");
    const existing = getLocalStoredAuthors();
    const updated = [author, ...existing.filter((a) => a.id !== author.id)];
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");

    // Đồng bộ vào local-poems.json nếu có bài thơ thuộc tác giả này
    const poemsFilePath = path.join(process.cwd(), "src/data/local-poems.json");
    if (fs.existsSync(poemsFilePath)) {
      const poems = JSON.parse(fs.readFileSync(poemsFilePath, "utf-8")) || [];
      const updatedPoems = poems.map((p: Poem) => {
        if (p.author_id === author.id || (!p.author_id && p.author?.id === author.id)) {
          return {
            ...p,
            author,
          };
        }
        return p;
      });
      fs.writeFileSync(poemsFilePath, JSON.stringify(updatedPoems, null, 2), "utf-8");
    }
  } catch {}
}

function getAllFallbackPoems(): Poem[] {
  const custom = getLocalStoredPoems();
  const customSlugs = new Set(custom.map((p) => p.slug));
  return [...custom, ...mockPoems.filter((p) => !customSlugs.has(p.slug))];
}

// In-memory runtime cache
const localCollections: Collection[] = [...mockCollections];
const localAuthors: Author[] = [...mockAuthors];
const localCategories: Category[] = [...mockCategories];

/**
 * Kiểm tra xem Supabase đã được cấu hình khóa API thực tế hay chưa
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !url.startsWith("https://")) return false;
  if (!anonKey || anonKey.includes("placeholder") || anonKey.length < 15) return false;
  return true;
}

export function hasSupabaseServiceRoleKey(): boolean {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY;
  return Boolean(serviceKey && !serviceKey.includes("placeholder") && serviceKey.length > 20);
}

/**
 * Khởi tạo client Supabase với fallback an toàn
 */
function getSupabaseClient(useServiceRole: boolean = false) {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)!;
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY
  )!;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    anonKey;
  const key = useServiceRole ? serviceKey : anonKey;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// UUID validation helper
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_AUTHOR_UUID = "a0000000-0000-0000-0000-000000000001";

// Map various category slugs/keys to valid Supabase category UUIDs
const CATEGORY_UUID_MAP: Record<string, string> = {
  "luc_bat": "c0000000-0000-0000-0000-000000000001",
  "tho-luc-bat": "c0000000-0000-0000-0000-000000000001",
  "cat-1": "c0000000-0000-0000-0000-000000000001",
  "song_that_luc_bat": "c0000000-0000-0000-0000-000000000001",
  "tu_do": "c0000000-0000-0000-0000-000000000002",
  "tho-tu-do": "c0000000-0000-0000-0000-000000000002",
  "cat-2": "c0000000-0000-0000-0000-000000000002",
  "tho_4_5_chu": "c0000000-0000-0000-0000-000000000002",
  "that_ngon": "c0000000-0000-0000-0000-000000000003",
  "tho-duong-luat": "c0000000-0000-0000-0000-000000000003",
  "duong_luat": "c0000000-0000-0000-0000-000000000003",
  "tho_7_chu": "c0000000-0000-0000-0000-000000000003",
  "cat-3": "c0000000-0000-0000-0000-000000000003",
  "tho_thien": "c0000000-0000-0000-0000-000000000004",
  "tho-thien": "c0000000-0000-0000-0000-000000000004",
  "thien": "c0000000-0000-0000-0000-000000000004",
  "cat-4": "c0000000-0000-0000-0000-000000000004",
  "tan_van": "c0000000-0000-0000-0000-000000000005",
  "tan-van": "c0000000-0000-0000-0000-000000000005",
  "van_xuoi": "c0000000-0000-0000-0000-000000000005",
  "but_ky": "c0000000-0000-0000-0000-000000000005",
  "doan_van": "c0000000-0000-0000-0000-000000000005",
  "cat-tan-van": "c0000000-0000-0000-0000-000000000005",
};

// Map form_type to PostgreSQL check constraint allowed values ('luc_bat', 'song_that_luc_bat', 'that_ngon', 'tu_do')
const FORM_TYPE_MAP: Record<string, string> = {
  "tho-luc-bat": "luc_bat",
  "luc_bat": "luc_bat",
  "song_that_luc_bat": "song_that_luc_bat",
  "that_ngon": "that_ngon",
  "tho-duong-luat": "that_ngon",
  "duong_luat": "that_ngon",
  "tho_7_chu": "that_ngon",
  "tu_do": "tu_do",
  "tho-tu-do": "tu_do",
  "tho_thien": "tu_do",
  "tho-thien": "tu_do",
  "thien": "tu_do",
  "tan_van": "tu_do",
  "tan-van": "tu_do",
  "van_xuoi": "tu_do",
  "but_ky": "tu_do",
  "doan_van": "tu_do",
  "tho_4_5_chu": "tu_do",
};

// ==============================================================================
// 1. POEMS (THI PHẨM)
// ==============================================================================

export async function getPoems(options?: {
  formType?: PoemFormType | "all";
  categorySlug?: string;
  collectionSlug?: string;
  limit?: number;
}): Promise<Poem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      let query = supabase
        .from("poems")
        .select(`
          *,
          author:authors(*),
          category:categories(*),
          annotations(*)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (options?.formType && options.formType !== "all") {
        query = query.eq("form_type", options.formType);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Poem[];
      }
    } catch (e) {
      console.warn("Lỗi khi truy vấn Supabase getPoems, dùng local fallback:", e);
    }
  }

  // Fallback
  let results = getAllFallbackPoems();
  if (options?.formType && options.formType !== "all") {
    results = results.filter((p) => p.form_type === options.formType);
  }
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }
  return results;
}

export async function getPoemBySlug(slug: string): Promise<Poem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("poems")
        .select(`
          *,
          author:authors(*),
          category:categories(*),
          annotations(*)
        `)
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data as Poem;
      }
    } catch (e) {
      console.warn("Lỗi khi truy vấn Supabase getPoemBySlug, dùng local fallback:", e);
    }
  }

  // Fallback
  return getAllFallbackPoems().find((p) => p.slug === slug) || null;
}

export async function createPoem(
  poemData: Partial<Poem>
): Promise<{ data: Poem | null; error: string | null }> {
  // Resolve valid UUID for author
  const rawAuthorId = poemData.author_id || localAuthors[0]?.id;
  const authorId = (rawAuthorId && UUID_REGEX.test(rawAuthorId)) ? rawAuthorId : DEFAULT_AUTHOR_UUID;

  // Resolve valid UUID for category
  const rawCatId = poemData.category_id || poemData.form_type || "luc_bat";
  const categoryId = (rawCatId && UUID_REGEX.test(rawCatId))
    ? rawCatId
    : (CATEGORY_UUID_MAP[rawCatId] || CATEGORY_UUID_MAP[poemData.form_type || "luc_bat"] || "c0000000-0000-0000-0000-000000000001");

  // Resolve valid DB form_type
  const rawFormType = poemData.form_type || "luc_bat";
  const dbFormType = FORM_TYPE_MAP[rawFormType] || "tu_do";

  const newPoem: Poem = {
    id: poemData.id && UUID_REGEX.test(poemData.id)
      ? poemData.id
      : `f0000000-0000-0000-0000-${Date.now().toString(16).slice(-12).padStart(12, "0")}`,
    title: poemData.title || "Chưa đặt tên",
    slug: poemData.slug || `bai-tho-${Date.now()}`,
    form_type: dbFormType as PoemFormType,
    excerpt: poemData.excerpt || null,
    content_json: poemData.content_json || {},
    content_html: poemData.content_html || "",
    raw_text: poemData.raw_text || "",
    author_id: authorId,
    show_author_info: poemData.show_author_info ?? true,
    category_id: categoryId,
    cover_image_url: poemData.cover_image_url || "/floral/flower-pink.png",
    audio_url: poemData.audio_url || null,
    status: poemData.status || "published",
    is_featured: poemData.is_featured ?? false,
    view_count: 0,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: localAuthors.find((a) => a.id === authorId) || localAuthors[0],
    category: localCategories.find((c) => c.id === categoryId) || localCategories[0],
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient(true);
      const { data, error } = await supabase
        .from("poems")
        .insert({
          title: newPoem.title,
          slug: newPoem.slug,
          form_type: dbFormType,
          excerpt: newPoem.excerpt,
          content_json: newPoem.content_json,
          content_html: newPoem.content_html,
          raw_text: newPoem.raw_text,
          author_id: authorId,
          show_author_info: newPoem.show_author_info,
          category_id: categoryId,
          cover_image_url: newPoem.cover_image_url,
          audio_url: newPoem.audio_url,
          status: newPoem.status,
          is_featured: newPoem.is_featured,
        })
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .single();

      if (error) {
        console.error("Lỗi Supabase createPoem:", error);
        if (error.code === "42501") {
          return {
            data: null,
            error: "Thiếu biến SUPABASE_SERVICE_ROLE_KEY trên Vercel: Supabase RLS yêu cầu Service Role Key để cấp quyền thêm bài thơ mới từ Cổng Quản Trị.",
          };
        }
        if (error.code === "23505") {
          return {
            data: null,
            error: "Đường dẫn tĩnh (slug) của bài thơ này đã tồn tại trên hệ thống. Vui lòng đổi slug khác.",
          };
        }
        return {
          data: null,
          error: `Lỗi Supabase (${error.code || "DB"}): ${error.message}`,
        };
      }

      if (data) {
        saveLocalStoredPoem(data as Poem);
        return { data: data as Poem, error: null };
      }
    } catch (e: any) {
      console.error("Lỗi kết nối Supabase createPoem:", e);
      return {
        data: null,
        error: `Không thể kết nối đến Supabase: ${e.message}`,
      };
    }
  }

  // Fallback lưu local khi không cấu hình Supabase (offline dev)
  saveLocalStoredPoem(newPoem);
  return { data: newPoem, error: null };
}

// ==============================================================================
// 2. COLLECTIONS (TUYỂN TẬP)
// ==============================================================================

export async function getCollections(): Promise<Collection[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("collections")
        .select(`
          *,
          collection_poems(
            sort_order,
            poem:poems(*)
          )
        `)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((col: any) => ({
          ...col,
          poems_count: col.collection_poems?.length || 0,
          poems: col.collection_poems?.map((cp: any) => cp.poem) || [],
        }));
      }
    } catch (e) {
      console.warn("Lỗi getCollections từ Supabase:", e);
    }
  }

  return localCollections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("collections")
        .select(`
          *,
          collection_poems(
            sort_order,
            poem:poems(
              *,
              author:authors(*),
              category:categories(*)
            )
          )
        `)
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return {
          ...data,
          poems_count: data.collection_poems?.length || 0,
          poems: data.collection_poems
            ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
            ?.map((cp: any) => cp.poem) || [],
        };
      }
    } catch (e) {
      console.warn("Lỗi getCollectionBySlug từ Supabase:", e);
    }
  }

  const col = localCollections.find((c) => c.slug === slug);
  if (!col) return null;

  return {
    ...col,
    poems: getAllFallbackPoems().slice(0, 4),
  };
}

// ==============================================================================
// 3. AUTHORS (TÁC GIẢ)
// ==============================================================================

export async function getAuthors(): Promise<Author[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Author[];
      }
    } catch (e) {
      console.warn("Lỗi getAuthors từ Supabase:", e);
    }
  }

  return getLocalStoredAuthors();
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data as Author;
      }
    } catch (e) {
      console.warn("Lỗi getAuthorBySlug từ Supabase:", e);
    }
  }

  return getLocalStoredAuthors().find((a) => a.slug === slug) || null;
}

export async function getAuthorById(id: string): Promise<Author | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as Author;
      }
    } catch (e) {
      console.warn("Lỗi getAuthorById từ Supabase:", e);
    }
  }

  return getLocalStoredAuthors().find((a) => a.id === id) || null;
}

export async function updateAuthor(
  id: string,
  authorData: Partial<Omit<Author, "id" | "created_at">>
): Promise<Author> {
  let updatedAuthor: Author | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = hasSupabaseServiceRoleKey()
        ? getSupabaseClient(true)
        : getSupabaseClient();

      const payload: Record<string, any> = {};
      if (authorData.name !== undefined) payload.name = authorData.name;
      if (authorData.pen_name !== undefined) payload.pen_name = authorData.pen_name;
      if (authorData.slug !== undefined) payload.slug = authorData.slug;
      if (authorData.period !== undefined) payload.period = authorData.period;
      if (authorData.bio !== undefined) payload.bio = authorData.bio;
      if (authorData.avatar_url !== undefined) payload.avatar_url = authorData.avatar_url;

      const { data, error } = await supabase
        .from("authors")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        updatedAuthor = data as Author;
      } else if (error) {
        console.warn("Lỗi updateAuthor trên Supabase:", error);
      }
    } catch (e) {
      console.warn("Lỗi ngoại lệ updateAuthor trên Supabase:", e);
    }
  }

  // Cập nhật và lưu vào file local fallback
  const authors = getLocalStoredAuthors();
  const existing = authors.find((a) => a.id === id) || authors[0] || mockAuthors[0];
  const merged: Author = {
    ...existing,
    ...authorData,
    id: existing.id || id,
    created_at: existing.created_at || new Date().toISOString(),
  };

  const finalAuthor = updatedAuthor || merged;
  saveLocalStoredAuthor(finalAuthor);

  return finalAuthor;
}

// ==============================================================================
// 4. CATEGORIES (THỂ LOẠI)
// ==============================================================================

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn("Lỗi getCategories từ Supabase:", e);
    }
  }

  return localCategories;
}

export async function createCategory(
  catData: Partial<Category>
): Promise<{ data: Category | null; error: string | null }> {
  const name = catData.name?.trim() || "Thể loại mới";
  const slug =
    catData.slug ||
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const newCat: Category = {
    id: catData.id || `cat-${Date.now()}`,
    name,
    slug,
    description: catData.description || null,
    sort_order: catData.sort_order || localCategories.length + 1,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient(true);
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCat.name,
          slug: newCat.slug,
          description: newCat.description,
          sort_order: newCat.sort_order,
        })
        .select()
        .single();

      if (!error && data) {
        localCategories.push(data as Category);
        return { data: data as Category, error: null };
      } else if (error) {
        console.warn("Lỗi createCategory từ Supabase:", error.message);
      }
    } catch (e: any) {
      console.warn("Lỗi kết nối Supabase:", e.message);
    }
  }

  localCategories.push(newCat);
  return { data: newCat, error: null };
}
