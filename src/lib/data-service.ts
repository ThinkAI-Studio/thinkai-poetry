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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !url.startsWith("https://")) return false;
  if (!anonKey || anonKey.includes("placeholder") || anonKey.length < 25) return false;
  return true;
}

/**
 * Khởi tạo client Supabase với fallback an toàn
 */
function getSupabaseClient(useServiceRole: boolean = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

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
  const newPoem: Poem = {
    id: poemData.id || `poem-${Date.now()}`,
    title: poemData.title || "Chưa đặt tên",
    slug: poemData.slug || `bai-tho-${Date.now()}`,
    form_type: poemData.form_type || "luc_bat",
    excerpt: poemData.excerpt || null,
    content_json: poemData.content_json || {},
    content_html: poemData.content_html || "",
    raw_text: poemData.raw_text || "",
    author_id: poemData.author_id || localAuthors[0].id,
    show_author_info: poemData.show_author_info ?? true,
    category_id: poemData.category_id || localCategories[0].id,
    cover_image_url: poemData.cover_image_url || "/floral/flower-pink.png",
    audio_url: poemData.audio_url || null,
    status: poemData.status || "published",
    is_featured: poemData.is_featured ?? false,
    view_count: 0,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: localAuthors.find((a) => a.id === poemData.author_id) || localAuthors[0],
    category: localCategories.find((c) => c.id === poemData.category_id) || localCategories[0],
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient(true);
      const { data, error } = await supabase
        .from("poems")
        .insert({
          title: newPoem.title,
          slug: newPoem.slug,
          form_type: newPoem.form_type,
          excerpt: newPoem.excerpt,
          content_json: newPoem.content_json,
          content_html: newPoem.content_html,
          raw_text: newPoem.raw_text,
          author_id: newPoem.author_id,
          show_author_info: newPoem.show_author_info,
          category_id: newPoem.category_id,
          cover_image_url: newPoem.cover_image_url,
          audio_url: newPoem.audio_url,
          status: newPoem.status,
          is_featured: newPoem.is_featured,
        })
        .select()
        .single();

      if (!error && data) {
        saveLocalStoredPoem(data as Poem);
        return { data: data as Poem, error: null };
      } else if (error) {
        console.warn("Lỗi Supabase createPoem:", error.message);
      }
    } catch (e: any) {
      console.warn("Lỗi kết nối Supabase:", e.message);
    }
  }

  // Luôn cập nhật vào local storage để thao tác admin thành công và bền vững
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
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Author[];
      }
    } catch (e) {
      console.warn("Lỗi getAuthors từ Supabase:", e);
    }
  }

  return localAuthors;
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

  return localAuthors.find((a) => a.slug === slug) || null;
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
