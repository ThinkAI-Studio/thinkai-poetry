import type { Metadata } from "next";
import { EB_Garamond, Lora, Be_Vietnam_Pro } from "next/font/google";
import { PoeticPaperTexture } from "@/components/effects/PoeticPaperTexture";
import "./globals.css";

// 1. Phông Tiêu Đề & Thi Phẩm: EB Garamond (Kinh điển thời Thơ Mới, tao nhã, chuẩn mực)
const ebGaramond = EB_Garamond({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

// 2. Phông Thân Thơ & Khổ Thơ: Lora (Nét bút lông trữ tình, dấu thanh tiếng Việt uốn mềm tuyệt mỹ)
const lora = Lora({
  variable: "--font-verse",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// 3. Phông Giao Diện & Metadata: Be Vietnam Pro (Chuẩn mực Quốc ngữ hiện đại thiết kế bởi người Việt)
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thịnh và Thơ | Không Gian Thi Ca Đương Đại",
  description: "Tuyển tập những tác phẩm thi ca đương đại, lắng đọng từng thanh âm và nhịp điệu tâm hồn. Thịnh và Thơ.",
  icons: {
    icon: "/thinh-va-tho-symbol.png",
    shortcut: "/thinh-va-tho-symbol.png",
    apple: "/thinh-va-tho-symbol.png",
  },
  openGraph: {
    title: "Thịnh và Thơ | Không Gian Thi Ca Đương Đại",
    description: "Tuyển tập những tác phẩm thi ca đương đại, lắng đọng từng thanh âm và nhịp điệu tâm hồn.",
    type: "website",
    locale: "vi_VN",
    images: [{ url: "/thinh-va-tho-symbol.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Zero-FOUC instant theme script (Sora Labs / Lattice pattern) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('site-theme') || localStorage.getItem('reader-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var params = new URLSearchParams(window.location.search);
                  var urlTheme = params.get('theme');
                  if (urlTheme === 'dark' || (!urlTheme && saved === 'dark')) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-reader-theme', 'dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else if (saved === 'sepia') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-reader-theme', 'sepia');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-reader-theme', 'ivory');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${beVietnamPro.variable} ${ebGaramond.variable} ${lora.variable} antialiased`}
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        {/* Lớp vân thớ giấy Dó hữu cơ & Bộ lọc SVG Loang Mực */}
        <PoeticPaperTexture />
        {children}
      </body>
    </html>
  );
}
