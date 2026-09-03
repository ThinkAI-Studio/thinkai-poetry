import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ánh Thịnh Thi Quán | Không Gian Thi Ca Đương Đại",
  description: "Tuyển tập những tác phẩm thi ca đương đại, lắng đọng từng thanh âm và nhịp điệu tâm hồn. Phát triển bởi ThinkAI Studio.",
  openGraph: {
    title: "Ánh Thịnh Thi Quán | Không Gian Thi Ca Đương Đại",
    description: "Tuyển tập những tác phẩm thi ca đương đại, lắng đọng từng thanh âm và nhịp điệu tâm hồn.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${playfair.variable} antialiased`}
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
