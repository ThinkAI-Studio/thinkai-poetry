import { Author, Category, Collection, Poem } from "@/types/database";

export const mockAuthor: Author = {
  id: "author-1",
  name: "Ánh Thịnh",
  pen_name: "Ánh Thịnh",
  slug: "anh-thinh",
  period: "Văn học đương đại",
  bio: "Người gieo vần cho những miền ký ức. Tác giả của nhiều thi phẩm trữ tình đương đại, gắn liền với tình yêu thiên nhiên, triết lý nhân sinh và vẻ đẹp sâu lắng của tâm hồn người Việt.",
  avatar_url: "/floral/flower-pink.png",
  created_at: new Date().toISOString(),
};

export const mockAuthors: Author[] = [mockAuthor];

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Thơ Lục Bát", slug: "tho-luc-bat", description: "Điệu hồn dân tộc, niêm luật 6-8 truyền thống", sort_order: 1, created_at: new Date().toISOString() },
  { id: "cat-2", name: "Thơ Tự Do", slug: "tho-tu-do", description: "Phóng khoáng, nhịp điệu nội tâm", sort_order: 2, created_at: new Date().toISOString() },
  { id: "cat-3", name: "Thơ Đường Luật", slug: "tho-duong-luat", description: "Thất ngôn trang trọng, niêm đối nghiêm cẩn", sort_order: 3, created_at: new Date().toISOString() },
  { id: "cat-4", name: "Thơ Thiền & Tĩnh Tâm", slug: "tho-thien", description: "Lắng đọng, an nhiên giữa dòng đời", sort_order: 4, created_at: new Date().toISOString() },
];

// Xóa sạch toàn bộ dữ liệu mẫu theo yêu cầu người dùng
export const mockCollections: Collection[] = [];
export const mockPoems: Poem[] = [];
