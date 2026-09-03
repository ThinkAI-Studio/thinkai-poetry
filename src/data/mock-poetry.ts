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

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Thơ Lục Bát", slug: "tho-luc-bat", description: "Điệu hồn dân tộc, niêm luật 6-8 truyền thống", sort_order: 1, created_at: new Date().toISOString() },
  { id: "cat-2", name: "Thơ Tự Do", slug: "tho-tu-do", description: "Phóng khoáng, nhịp điệu nội tâm", sort_order: 2, created_at: new Date().toISOString() },
  { id: "cat-3", name: "Thơ Đường Luật", slug: "tho-duong-luat", description: "Thất ngôn trang trọng, niêm đối nghiêm cẩn", sort_order: 3, created_at: new Date().toISOString() },
  { id: "cat-4", name: "Thơ Thiền & Tĩnh Tâm", slug: "tho-thien", description: "Lắng đọng, an nhiên giữa dòng đời", sort_order: 4, created_at: new Date().toISOString() },
];

export const mockCollections: Collection[] = [
  {
    id: "col-1",
    title: "Tuyển Tập Ánh Thịnh — Gió Đầu Mùa",
    slug: "tuyen-tap-anh-thinh-gio-dau-mua",
    description: "Tập thơ tập hợp những sáng tác tiêu biểu về tình người, nỗi nhớ và những giao cảm tinh tế với đất trời lúc giao mùa.",
    cover_image_url: "/floral/flower-pink.png",
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    poems_count: 8,
  },
  {
    id: "col-2",
    title: "Hương Sắc Mùa Thu",
    slug: "huong-sac-mua-thu",
    description: "Những câu thơ dệt nên từ heo may, hoa cúc vàng và những chiều sương bảng lảng bên hồ nước phẳng lặng.",
    cover_image_url: "/floral/flower-yellow.png",
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    poems_count: 6,
  },
  {
    id: "col-3",
    title: "Thiền Trà & Chiêm Nghiệm",
    slug: "thien-tra-va-chiem-nghiem",
    description: "Nhấp ngụm trà sớm, lắng nghe tiếng chuông chiều buông nhẹ bên hiên vắng.",
    cover_image_url: "/floral/leaf-1.png",
    is_featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    poems_count: 5,
  },
];

export const mockPoems: Poem[] = [
  {
    id: "poem-1",
    title: "Vườn Xưa Hoa Nở",
    slug: "vuon-xua-hoa-no",
    form_type: "luc_bat",
    excerpt: "Gió xuân thổi nhẹ qua rèm / Nhành hoa hé nụ dịu êm đón ngày...",
    content_json: {},
    content_html: `
      <div class="stanza">
        <p class="verse verse-6">Gió xuân thổi nhẹ qua rèm</p>
        <p class="verse verse-8">Nhành hoa hé nụ dịu êm đón ngày</p>
        <p class="verse verse-6">Sương giăng mờ ảo hàng cây</p>
        <p class="verse verse-8">Hương xưa còn đọng tháng ngày phôi pha.</p>
      </div>
      <div class="stanza">
        <p class="verse verse-6">Thềm rêu vương vấn bước qua</p>
        <p class="verse verse-8">Nghe trong tĩnh lặng bài ca thuở nào</p>
        <p class="verse verse-6">Vườn xưa ngọn cỏ lao xao</p>
        <p class="verse verse-8">Thương người tri kỷ gửi vào ngàn mây.</p>
      </div>
      <div class="stanza">
        <p class="verse verse-6">Mai về dẫu dặm đường dài</p>
        <p class="verse verse-8">Vẫn mang theo một đóa nhài thanh tao</p>
        <p class="verse verse-6">Chữ tình thắm đượm ngạt ngào</p>
        <p class="verse verse-8">Nghìn năm thơ vẫn dạt dào hồn xưa.</p>
      </div>
    `,
    raw_text: "Gió xuân thổi nhẹ qua rèm Nhành hoa hé nụ dịu êm đón ngày Sương giăng mờ ảo hàng cây Hương xưa còn đọng tháng ngày phôi pha...",
    author_id: "author-1",
    show_author_info: true,
    category_id: "cat-1",
    cover_image_url: "/floral/flower-pink.png",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Audio demo
    status: "published",
    is_featured: true,
    view_count: 1248,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockAuthor,
    category: mockCategories[0],
    annotations: [
      { id: "ann-1", poem_id: "poem-1", term: "Tri kỷ", explanation: "Người thấu hiểu tâm can, đồng điệu về chí hướng và cảm xúc.", order_index: 1 },
      { id: "ann-2", poem_id: "poem-1", term: "Hồn xưa", explanation: "Khí chất thanh cao và phong vị tao nhã của tiền nhân.", order_index: 2 },
    ],
  },
  {
    id: "poem-2",
    title: "Tiếng Thu Rơi Nghiêng",
    slug: "tieng-thu-roi-nghieng",
    form_type: "tu_do",
    excerpt: "Có chiếc lá chạm vào hoàng hôn / Nghe mùa trở mình rất khẽ...",
    content_json: {},
    content_html: `
      <div class="stanza">
        <p class="verse">Có chiếc lá chạm vào hoàng hôn</p>
        <p class="verse">Nghe mùa trở mình rất khẽ</p>
        <p class="verse">Mặt hồ soi bóng mây bay</p>
        <p class="verse">Thời gian tan vào sương khói.</p>
      </div>
      <div class="stanza">
        <p class="verse">Góc phố nhỏ chiều nay vắng người</p>
        <p class="verse">Chỉ có tiếng đàn trầm mặc</p>
        <p class="verse">Ngân dài qua từng ô cửa</p>
        <p class="verse">Đánh thức những điều tưởng đã lãng quên.</p>
      </div>
    `,
    raw_text: "Có chiếc lá chạm vào hoàng hôn Nghe mùa trở mình rất khẽ Mặt hồ soi bóng mây bay Thời gian tan vào sương khói...",
    author_id: "author-1",
    show_author_info: false, // Ẩn thông tin tác giả mẫu để kiểm thử toggle
    category_id: "cat-2",
    cover_image_url: "/floral/flower-yellow.png",
    audio_url: null,
    status: "published",
    is_featured: true,
    view_count: 852,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockAuthor,
    category: mockCategories[1],
  },
  {
    id: "poem-3",
    title: "Vấn Trăng",
    slug: "van-trang",
    form_type: "that_ngon",
    excerpt: "Đêm vắng ngẩng đầu hỏi ánh trăng / Mấy độ thăng trầm thế sự nhăng...",
    content_json: {},
    content_html: `
      <div class="stanza">
        <p class="verse">Đêm vắng ngẩng đầu hỏi ánh trăng</p>
        <p class="verse">Mấy độ thăng trầm thế sự nhăng</p>
        <p class="verse">Trần ai gió thoảng miền hư ảo</p>
        <p class="verse">Thi tứ mênh mang bến nước bằng.</p>
      </div>
    `,
    raw_text: "Đêm vắng ngẩng đầu hỏi ánh trăng Mấy độ thăng trầm thế sự nhăng...",
    author_id: "author-1",
    show_author_info: true,
    category_id: "cat-3",
    cover_image_url: "/floral/leaf-1.png",
    audio_url: null,
    status: "published",
    is_featured: false,
    view_count: 430,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: mockAuthor,
    category: mockCategories[2],
  },
];
