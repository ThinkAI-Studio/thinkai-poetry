import { Poem, PoemFormType } from "@/types/database";

export interface PoemGenreInfo {
  key: "luc_bat" | "tu_do" | "that_ngon" | "song_that_luc_bat" | "tan_van" | "other";
  label: string;
  shortLabel: string;
  sealText: "Thơ" | "Văn";
  isProse: boolean;
  accentColor: string;
  badgeBg: string;
}

/**
 * Chuẩn hóa thể loại thơ & văn từ mọi định dạng (slug, form_type, category name).
 * Khắc phục triệt để lỗi không khớp giữa tho-luc-bat và luc_bat.
 */
export function getPoemGenreInfo(poem?: Partial<Poem> | null): PoemGenreInfo {
  if (!poem) {
    return {
      key: "other",
      label: "Thi Tuyển",
      shortLabel: "Thơ",
      sealText: "Thơ",
      isProse: false,
      accentColor: "var(--accent-green)",
      badgeBg: "rgba(45, 90, 61, 0.1)",
    };
  }

  const rawForm = (poem.form_type || "").toString().toLowerCase().trim();
  const catSlug = (poem.category?.slug || "").toLowerCase().trim();
  const catName = (poem.category?.name || "").toLowerCase().trim();

  // 1. Tản Văn / Văn Xuôi / Tùy Bút
  const isProse =
    rawForm === "tan_van" ||
    rawForm === "tan-van" ||
    rawForm === "van_xuoi" ||
    rawForm === "van-xuoi" ||
    rawForm === "but_ky" ||
    rawForm === "doan_van" ||
    catSlug === "tan-van" ||
    catSlug === "van-xuoi" ||
    /tản văn|văn xuôi|tùy bút|bút ký|truyện ngắn/i.test(catName);

  if (isProse) {
    return {
      key: "tan_van",
      label: "Tản Văn / Tùy Bút",
      shortLabel: "Tản Văn",
      sealText: "Văn",
      isProse: true,
      accentColor: "#8C4A2F",
      badgeBg: "rgba(140, 74, 47, 0.12)",
    };
  }

  // 2. Thơ Lục Bát (hỗ trợ cả luc_bat, tho-luc-bat, tho_luc_bat)
  if (
    rawForm === "luc_bat" ||
    rawForm === "tho-luc-bat" ||
    rawForm === "tho_luc_bat" ||
    catSlug === "tho-luc-bat" ||
    catSlug === "luc-bat" ||
    /lục bát/i.test(catName)
  ) {
    return {
      key: "luc_bat",
      label: "Thơ Lục Bát",
      shortLabel: "Lục Bát",
      sealText: "Thơ",
      isProse: false,
      accentColor: "var(--accent-green)",
      badgeBg: "rgba(45, 90, 61, 0.1)",
    };
  }

  // 3. Thơ Đường Luật / Thất Ngôn
  if (
    rawForm === "that_ngon" ||
    rawForm === "that-ngon" ||
    rawForm === "tho-duong-luat" ||
    rawForm === "tho_duong_luat" ||
    rawForm === "that_ngon_bat_cu" ||
    catSlug === "tho-duong-luat" ||
    catSlug === "that-ngon" ||
    /đường luật|thất ngôn/i.test(catName)
  ) {
    return {
      key: "that_ngon",
      label: "Thơ Đường Luật",
      shortLabel: "Đường Luật",
      sealText: "Thơ",
      isProse: false,
      accentColor: "#756A88",
      badgeBg: "rgba(117, 106, 136, 0.12)",
    };
  }

  // 4. Song Thất Lục Bát
  if (
    rawForm === "song_that_luc_bat" ||
    rawForm === "song-that-luc-bat" ||
    catSlug === "song-that-luc-bat" ||
    /song thất/i.test(catName)
  ) {
    return {
      key: "song_that_luc_bat",
      label: "Song Thất Lục Bát",
      shortLabel: "Song Thất",
      sealText: "Thơ",
      isProse: false,
      accentColor: "#9E2A2B",
      badgeBg: "rgba(158, 42, 43, 0.12)",
    };
  }

  // 5. Thơ Tự Do
  if (
    rawForm === "tu_do" ||
    rawForm === "tho-tu-do" ||
    rawForm === "tho_tu_do" ||
    catSlug === "tho-tu-do" ||
    catSlug === "tu-do" ||
    /tự do/i.test(catName)
  ) {
    return {
      key: "tu_do",
      label: "Thơ Tự Do",
      shortLabel: "Tự Do",
      sealText: "Thơ",
      isProse: false,
      accentColor: "#C87932",
      badgeBg: "rgba(200, 121, 50, 0.12)",
    };
  }

  // 6. Mặc định theo tên danh mục nếu có
  if (poem.category?.name) {
    return {
      key: "other",
      label: poem.category.name,
      shortLabel: poem.category.name,
      sealText: "Thơ",
      isProse: false,
      accentColor: "var(--accent-green)",
      badgeBg: "rgba(45, 90, 61, 0.1)",
    };
  }

  return {
    key: "tu_do",
    label: "Thơ Tự Do",
    shortLabel: "Tự Do",
    sealText: "Thơ",
    isProse: false,
    accentColor: "#C87932",
    badgeBg: "rgba(200, 121, 50, 0.12)",
  };
}

/**
 * Kiểm tra xem bài thơ/văn có khớp với tab bộ lọc không
 */
export function isPoemMatchingForm(
  poem: Poem,
  filterKey: PoemFormType | "all" | "tan_van"
): boolean {
  if (filterKey === "all") return true;
  const genre = getPoemGenreInfo(poem);

  if (filterKey === "tan_van") return genre.isProse;
  if (genre.isProse) return false;

  return genre.key === filterKey;
}
