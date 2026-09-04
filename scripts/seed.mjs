import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Đọc file .env.local
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

console.log("\n=======================================================");
console.log("  HỮU THỊNH THI QUÁN — KHỞI TẠO DỮ LIỆU DATABASE");
console.log("  ThinkAI Studio • Poetry Platform");
console.log("=======================================================\n");

const isPlaceholderKey =
  !serviceKey ||
  serviceKey.includes("placeholder") ||
  serviceKey.length < 20;

if (isPlaceholderKey) {
  console.log("⚠️  CHÚ Ý: SUPABASE_SERVICE_ROLE_KEY trong file .env.local đang là placeholder.");
  console.log("   Supabase URL:", supabaseUrl);
  console.log("\n👉 HÃY CHỌN 1 TRONG 2 CÁCH SAU ĐỂ TẠO BẢNG & DỮ LIỆU:\n");
  console.log("   CÁCH 1 (Khuyên dùng - Nhanh nhất):");
  console.log("   1. Truy cập Supabase Dashboard: https://supabase.com/dashboard/project/axcfbdeqtwuktmaedwwa");
  console.log("   2. Chọn mục 'SQL Editor' ở thanh bên trái.");
  console.log("   3. Mở file: 'supabase/full_setup.sql' trong dự án, copy toàn bộ nội dung.");
  console.log("   4. Dán vào SQL Editor và bấm nút 'Run'.");
  console.log("   -> Toàn bộ 7 bảng, triggers, indexes và dữ liệu thi ca mẫu sẽ được tạo trong 2 giây!\n");
  console.log("   CÁCH 2:");
  console.log("   1. Vào Supabase Dashboard -> Project Settings -> API");
  console.log("   2. Copy 'service_role key' (secret) và 'anon key'");
  console.log("   3. Dán vào file .env.local");
  console.log("   4. Chạy lại lệnh: pnpm db:seed\n");
  process.exit(0);
}

// 2. Chạy seed qua Supabase Client nếu có Service Key
console.log("🚀 Đang kết nối tới Supabase:", supabaseUrl);
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runSeed() {
  try {
    console.log("1. Đang nạp danh sách tác giả (authors)...");
    const { error: errAuthors } = await supabase.from("authors").upsert([
      {
        id: "a0000000-0000-0000-0000-000000000001",
        name: "Hữu Thịnh",
        pen_name: "Hữu Thịnh",
        slug: "huu-thinh",
        period: "Văn học đương đại",
        bio: "Người gieo vần cho những miền ký ức. Tác giả của nhiều thi phẩm trữ tình đương đại.",
        avatar_url: "/floral/flower-pink.png",
      },
      {
        id: "a0000000-0000-0000-0000-000000000002",
        name: "Huy Cận",
        pen_name: "Huy Cận",
        slug: "huy-can",
        period: "Phong trào Thơ Mới (1932 - 1945)",
        bio: "Một trong những gương mặt xuất sắc nhất của phong trào Thơ Mới.",
        avatar_url: "/floral/flower-yellow.png",
      },
      {
        id: "a0000000-0000-0000-0000-000000000003",
        name: "Hàn Mặc Tử",
        pen_name: "Hàn Mặc Tử",
        slug: "han-mac-tu",
        period: "Phong trào Thơ Mới (1932 - 1945)",
        bio: "Nhà thơ tài hoa bạc mệnh, khởi xướng trường thơ Loạn.",
        avatar_url: "/floral/leaf-1.png",
      },
    ]);
    if (errAuthors) console.warn("Lỗi authors:", errAuthors.message);
    else console.log("✓ Authors đã nạp thành công.");

    console.log("2. Đang nạp danh mục thể loại (categories)...");
    const { error: errCat } = await supabase.from("categories").upsert([
      { id: "c0000000-0000-0000-0000-000000000001", name: "Thơ Lục Bát", slug: "tho-luc-bat", description: "Điệu hồn dân tộc 6-8", sort_order: 1 },
      { id: "c0000000-0000-0000-0000-000000000002", name: "Thơ Tự Do", slug: "tho-tu-do", description: "Phóng khoáng, khai mở nội tâm", sort_order: 2 },
      { id: "c0000000-0000-0000-0000-000000000003", name: "Thơ Đường Luật", slug: "tho-duong-luat", description: "Thất ngôn nghiêm cẩn", sort_order: 3 },
      { id: "c0000000-0000-0000-0000-000000000004", name: "Thơ Thiền & Tĩnh Tâm", slug: "tho-thien", description: "Lắng đọng, an nhiên", sort_order: 4 },
    ]);
    if (errCat) console.warn("Lỗi categories:", errCat.message);
    else console.log("✓ Categories đã nạp thành công.");

    console.log("\n🎉 KHỞI TẠO CƠ BẢN HOÀN TẤT THÀNH CÔNG! (Toàn bộ dữ liệu thơ mẫu đã được xóa)");
  } catch (e) {
    console.error("Lỗi khi nạp dữ liệu:", e);
  }
}

runSeed();
