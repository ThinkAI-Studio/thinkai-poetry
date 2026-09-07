import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...vals] = trimmed.split("=");
    env[key.trim()] = vals.join("=").trim();
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase URL or Service Key!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Map categories
const CATEGORY_MAP = {
  "tho-luc-bat": "c0000000-0000-0000-0000-000000000001",
  "cat-1": "c0000000-0000-0000-0000-000000000001",
  "tho-tu-do": "c0000000-0000-0000-0000-000000000002",
  "tu_do": "c0000000-0000-0000-0000-000000000002",
  "cat-2": "c0000000-0000-0000-0000-000000000002",
  "tho-duong-luat": "c0000000-0000-0000-0000-000000000003",
  "cat-3": "c0000000-0000-0000-0000-000000000003",
  "tho-thien": "c0000000-0000-0000-0000-000000000004",
  "cat-4": "c0000000-0000-0000-0000-000000000004",
  "tan-van": "c0000000-0000-0000-0000-000000000005",
  "tan_van": "c0000000-0000-0000-0000-000000000005",
  "cat-tan-van": "c0000000-0000-0000-0000-000000000005",
};

const AUTHOR_ID = "a0000000-0000-0000-0000-000000000001";

async function sync() {
  console.log("🚀 Syncing local poems to Supabase database...");

  // 1. Ensure category 'Tản Văn' exists
  const { error: catErr } = await supabase.from("categories").upsert([
    {
      id: "c0000000-0000-0000-0000-000000000005",
      name: "Tản Văn",
      slug: "tan-van",
      description: "Tùy bút & cảm xúc văn xuôi lắng đọng",
      sort_order: 5,
    },
  ]);
  if (catErr) console.warn("Category upsert notice:", catErr.message);

  // 2. Read local poems JSON
  const localPoemsPath = path.join(rootDir, "src/data/local-poems.json");
  if (!fs.existsSync(localPoemsPath)) {
    console.log("No local-poems.json found.");
    return;
  }

  const localPoems = JSON.parse(fs.readFileSync(localPoemsPath, "utf-8"));
  console.log(`Found ${localPoems.length} poems in local-poems.json`);

  // UUID generator helper
  function toUUID(str, idx) {
    if (str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return str;
    }
    const pad = (idx + 1).toString(16).padStart(12, "0");
    return `f0000000-0000-0000-0000-${pad}`;
  }

const FORM_TYPE_MAP = {
  "tho-luc-bat": "luc_bat",
  "luc_bat": "luc_bat",
  "tho-tu-do": "tu_do",
  "tu_do": "tu_do",
  "tho-duong-luat": "that_ngon",
  "duong_luat": "that_ngon",
  "tho-thien": "tu_do",
  "thien": "tu_do",
  "tan-van": "tu_do",
  "tan_van": "tu_do",
};

  const dbRows = localPoems.map((p, idx) => {
    const categoryId = CATEGORY_MAP[p.category_id] || CATEGORY_MAP[p.form_type] || CATEGORY_MAP["tho-luc-bat"];
    const formType = FORM_TYPE_MAP[p.form_type] || "luc_bat";
    return {
      id: toUUID(p.id, idx),
      title: p.title,
      slug: p.slug,
      form_type: formType,
      excerpt: p.excerpt || "",
      content_json: p.content_json || {},
      content_html: p.content_html,
      raw_text: p.raw_text,
      author_id: AUTHOR_ID,
      show_author_info: p.show_author_info ?? true,
      category_id: categoryId,
      cover_image_url: p.cover_image_url || "/floral/flower-pink.png",
      audio_url: p.audio_url || null,
      status: p.status || "published",
      is_featured: p.is_featured ?? false,
      view_count: p.view_count || 0,
      published_at: p.published_at || new Date().toISOString(),
      created_at: p.created_at || new Date().toISOString(),
      updated_at: p.updated_at || new Date().toISOString(),
    };
  });

  // 3. Upsert to Supabase
  const { data, error } = await supabase.from("poems").upsert(dbRows, { onConflict: "slug" }).select();

  if (error) {
    console.error("❌ Error upserting poems:", error);
  } else {
    console.log(`✅ Successfully synced ${data.length} poems to Supabase poems table!`);
    console.log("Synced poems:", data.map((d) => ({ id: d.id, title: d.title, slug: d.slug })));
  }
}

sync();
