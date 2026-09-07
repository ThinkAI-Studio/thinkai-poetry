import { Author, Category, Collection, Poem } from "@/types/database";

export const mockAuthor: Author = {
  id: "a0000000-0000-0000-0000-000000000001",
  name: "Hữu Thịnh",
  pen_name: "Hữu Thịnh",
  slug: "huu-thinh",
  period: "Văn học đương đại",
  bio: "Nhà thơ Hữu Thịnh — Người gieo vần cho những miền ký ức và triết lý nhân sinh sâu lắng. Tác giả của nhiều thi phẩm trữ tình tiêu biểu gắn liền với vẻ đẹp tâm hồn Việt Nam.",
  avatar_url: "/floral/flower-pink.png",
  created_at: new Date().toISOString(),
};

export const mockAuthors: Author[] = [mockAuthor];

export const mockCategories: Category[] = [
  { id: "c0000000-0000-0000-0000-000000000001", name: "Thơ Lục Bát", slug: "tho-luc-bat", description: "Điệu hồn dân tộc, niêm luật 6-8 truyền thống", sort_order: 1, created_at: new Date().toISOString() },
  { id: "c0000000-0000-0000-0000-000000000002", name: "Thơ Tự Do", slug: "tho-tu-do", description: "Phóng khoáng, nhịp điệu nội tâm", sort_order: 2, created_at: new Date().toISOString() },
  { id: "c0000000-0000-0000-0000-000000000003", name: "Thơ Đường Luật", slug: "tho-duong-luat", description: "Thất ngôn trang trọng, niêm đối nghiêm cẩn", sort_order: 3, created_at: new Date().toISOString() },
  { id: "c0000000-0000-0000-0000-000000000004", name: "Thơ Thiền & Tĩnh Tâm", slug: "tho-thien", description: "Lắng đọng, an nhiên giữa dòng đời", sort_order: 4, created_at: new Date().toISOString() },
  { id: "c0000000-0000-0000-0000-000000000005", name: "Tản Văn", slug: "tan-van", description: "Tùy bút & cảm xúc văn xuôi", sort_order: 5, created_at: new Date().toISOString() },
];

// Xóa sạch toàn bộ dữ liệu mẫu theo yêu cầu người dùng
export const mockCollections: Collection[] = [];
export const mockPoems: Poem[] = [];
