# Thi Ca Anh Thịnh (Wind Poetic Platform)

Một không gian thi ca đương đại kết hợp mỹ cảm Á Đông truyền thống và công nghệ web hiện đại. Nền tảng mang đến trải nghiệm đọc thơ tương tác cao cấp với cuốn sách 3D lật trang vật lý, hệ sinh thái khí quyển bốn mùa thời gian thực, giá sách thi ca đa tầng và bộ tổng hợp âm thanh thiên nhiên qua Web Audio API.

---

## Trải Nghiệm & Tính Năng Sản Phẩm

### 1. Cuốn Sách Thơ 3D Tương Tác Vật Lý
- **Lật trang 3D đa góc nhìn**: Mô phỏng cảm giác lật giở từng trang sách giấy mỹ thuật, hỗ trợ kéo thả chuột, phím mũi tên và cử chỉ vuốt chạm trên thiết bị di động.
- **Tứ quý tương tác theo mùa**:
  - *Mùa Xuân*: Cánh hoa đào phai hồng phấn vương nhẹ gáy sách, chao cánh bay khi lật trang.
  - *Mùa Hạ*: Vệt nắng vàng mật ong ấm áp xiên qua mặt giấy cùng hạt bụi phấn nắng bay lơ lửng.
  - *Mùa Thu*: Chiếc lá phong đỏ hoặc đóa cúc vàng mắc vào mép sách, lật trang thổi bay vút lên cao.
  - *Mùa Đông*: Hơi thở sương mai ngưng tụ viền bìa sách, tan dần khi chạm tay hoặc lật sách với âm thanh tinh thể rạn giòn.
- **Điều hướng thi ca**: Chuyển bài đọc theo danh mục, tra cứu mục lục trực quan, tùy biến cỡ chữ và lưu bài thơ yêu thích.

### 2. Khí Quyển 4 Mùa & Động Lực Học Thiên Nhiên
- **Cành hoa góc màn hình phong cách Sora Lattice**:
  - Tái hiện quy luật giải phẫu thực vật học với cành thuôn tự nhiên theo luật phân nhánh Leonardo da Vinci.
  - Chi tiết vỏ cành sần sùi, mấu gỗ mun phong sương, đài hoa và nụ hoa điểm xuyết.
  - Thích ứng động theo 4 mùa: Hoa đào phai & lộc non (Xuân), hoa sen & tán lá sum suê (Hạ), lá phong Momiji & ngân hạnh (Thu), cành khẳng khiu trút lá đọng sương muối (Đông).
- **Thảm cỏ thực vật & Động lực học lá rụng**:
  - Thảm cỏ thi ca thường trực viền chân màn hình tạo cảm giác tiếp đất tự nhiên.
  - Đống lá mùa thu tích tụ trực tiếp trong lòng cỏ, kích hoạt chu kỳ gió lốc cuốn tung lá bay theo nhiều quỹ đạo rồi từ từ đáp xuống.
  - Mùa đông với lá đọng băng giá viền sương tuyết, tương tác phát tiếng sương gãy vụn lách tách.
- **Lớp phủ khí quyển thích ứng**: Sắc thái ánh sáng và viền mờ tương thích hài hòa cả Light Mode và Dark Mode, đảm bảo chuẩn tương phản đọc chữ WCAG AAA.

### 3. Giá Sách Thi Ca Đa Tầng (Multi-tier Bookshelf)
- Bố cục giá sách gỗ mộc nhiều tầng, phân loại theo tuyển tập và chủ đề sáng tác.
- Tương tác xem gáy sách 3D, hiệu ứng rút sách mượt mà và chuyển đổi linh hoạt sang chế độ đọc toàn màn hình.

### 4. Bộ Tổng Hợp Âm Thanh Tự Nhiên (Zero-Asset Web Audio)
- Không sử dụng file âm thanh ngoại vi (mp3/wav), loại bỏ hoàn toàn tải trọng mạng và độ trễ tải file.
- Sử dụng Web Audio API (Oscillators, Bandpass Filters, Exponential Gain Curves, Pink/White Noise Buffers) để tái tạo chân thực:
  - Tiếng gió lốc cuốn lá khô xào xạc.
  - Tiếng tinh thể băng sương rạn vỡ giòn tan.
  - Tiếng lật trang sách giấy thủ công.

### 5. Quản Trị & Biên Tập Nội Dung (Admin Workspace)
- Quản lý toàn diện bài thơ, tản văn, danh mục và tác giả.
- Cơ chế bật/tắt hiển thị tác phẩm (Publish / Draft) cập nhật tức thì.
- Kiến trúc lưu trữ kép (Dual-layer persistence): Đồng bộ trực tiếp với cơ sở dữ liệu Supabase, tự động chuyển đổi sang Local JSON Store khi chạy môi trường độc lập.

---

## Kiến Trúc Công Nghệ

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 15 (App Router)                   │
│         React 19 Server Components & Turbopack Engine        │
├──────────────────────────────┬──────────────────────────────┤
│ Giao Diện & Trải Nghiệm      │ Động Lực Học & Đồ Họa        │
│ • Tailwind CSS v4            │ • Lenis Inertial Scroll      │
│ • Typography: EB Garamond,   │ • Motion (Framer Motion v12) │
│   Be Vietnam Pro, Lora       │ • SVG Vector Mathematics     │
│ • Radix UI Primitives        │ • Hardware-accelerated CSS   │
├──────────────────────────────┼──────────────────────────────┤
│ Dữ Liệu & Hậu Tầng           │ Âm Thanh & Tương Tác         │
│ • Supabase SSR & Database    │ • Web Audio API Synthesis    │
│ • Local JSON Fallback Store  │ • Reading Zone Hysteresis    │
│ • Next.js Route Handlers     │ • Reduced Motion Safe Mode   │
└──────────────────────────────┴──────────────────────────────┘
```

---

## Cấu Trúc Thư Mục

```
.
├── public/
│   ├── floral/               # Tài nguyên hoa, lá và tinh thể 4 mùa
│   └── fonts/                # Phông chữ thi ca tối ưu cho web
├── scripts/
│   ├── generate_seasonal_floral.py  # Script toán học sinh hoa lá 4 mùa
│   └── seed.mjs              # Script khởi tạo dữ liệu mẫu Supabase
├── src/
│   ├── app/
│   │   ├── (admin)/          # Không gian quản trị biên tập
│   │   ├── (public)/         # Giao diện thi quán công khai
│   │   │   ├── collections/  # Trang danh mục & tuyển tập thơ
│   │   │   ├── poems/        # Trang chi tiết bài thơ & giao diện đọc
│   │   │   └── page.tsx      # Trang chủ thi quán
│   │   ├── api/              # Route handlers (CRUD thơ, tuyển tập, auth)
│   │   ├── globals.css       # Design tokens, keyframes & animations
│   │   └── layout.tsx        # Root layout, providers & font configuration
│   ├── components/
│   │   ├── book/             # Cuốn sách 3D, lật trang & tương tác mùa
│   │   ├── bookshelf/        # Giá sách thi ca đa tầng
│   │   ├── effects/          # Khí quyển 4 mùa, cành hoa, thảm cỏ, gió tuyết
│   │   ├── layout/           # SiteHeader, SiteFooter, Theme/Season switch
│   │   └── reader/           # Thanh công cụ đọc thơ, ghi chú, chia sẻ
│   ├── context/
│   │   └── SeasonContext.tsx # Trạng thái mùa và điều phối khí quyển toàn app
│   ├── data/
│   │   ├── local-collections.json  # Dữ liệu tuyển tập dự phòng cục bộ
│   │   └── local-poems.json        # Dữ liệu bài thơ dự phòng cục bộ
│   ├── hooks/
│   │   └── useReadingZone.ts # Kiểm soát ngưỡng cuộn đồng bộ Header & Cành hoa
│   ├── lib/
│   │   ├── data-service.ts   # Tầng truy xuất dữ liệu trừu tượng (DB + Local)
│   │   ├── nature-audio.ts   # Bộ tổng hợp âm thanh Web Audio API
│   │   └── poem-genre.ts     # Phân loại thể loại thi ca & trắc nghiệm điệu
│   └── types/
│       └── database.ts       # Định nghĩa kiểu dữ liệu TypeScript
└── package.json
```

---

## Khởi Chạy Dự Án

### Yêu Cầu Môi Trường
- Node.js 20.x trở lên
- Trình quản lý gói: `npm`, `pnpm`, hoặc `yarn`

### Cài Đặt

1. Sao chép mã nguồn:
   ```bash
   git clone <repository-url>
   cd anhthinh
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```

3. Cấu hình biến môi trường (tùy chọn nếu kết nối Supabase):
   Tạo tệp `.env.local` ở thư mục gốc:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_PASSWORD=your_secure_admin_password
   ```
   *Lưu ý: Nếu không cấu hình Supabase, hệ thống tự động sử dụng kho dữ liệu cục bộ trong `src/data/`.*

4. Chạy môi trường phát triển:
   ```bash
   npm run dev
   ```
   Truy cập giao diện tại `http://localhost:3000`.

5. Kiểm tra mã nguồn và biên dịch sản phẩm:
   ```bash
   # Kiểm tra kiểu TypeScript
   npx tsc --noEmit

   # Biên dịch bản phát hành
   npm run build

   # Chạy thử bản phát hành
   npm run start
   ```

---

## Nguyên Tắc Thiết Kế & Thẩm Mỹ

1. **Thẩm mỹ Sora Lattice & Á Đông đương đại**: Mọi chi tiết hoa lá, nét cành và hoa văn đều lấy cảm hứng từ tranh thủy mặc và nghệ thuật hoa ép tự nhiên, giữ nét thanh nhã, không rườm rà.
2. **Ưu tiên chất thơ và trải nghiệm đọc**:
   - Vùng đọc trung tâm luôn được bảo vệ độ trong trẻo và tương phản cao nhất.
   - Hiệu ứng khí quyển phân bố ở các rìa và góc màn hình, tạo không khí bảng lảng mà không gây xao nhãng con chữ.
3. **Tiết chế & Tự nhiên**:
   - Chuyển động sử dụng hàm gia tốc mượt mà (`cubic-bezier`), biên độ dịch chuyển vi mô.
   - Hỗ trợ đầy đủ `prefers-reduced-motion` cho người dùng nhạy cảm với chuyển động.
4. **Không phụ thuộc tài nguyên nặng**: Tối ưu hóa hiệu năng 60fps qua GPU transforms, CSS vectorization và tổng hợp âm thanh tại chỗ.

---

## Bản Quyền & Giấy Phép

Nội dung thi ca và hình ảnh nghệ thuật thuộc quyền sở hữu của **Thi Ca Anh Thịnh**.  
Mã nguồn phát triển dưới giấy phép nội bộ của **ThinkAI Studio**.
