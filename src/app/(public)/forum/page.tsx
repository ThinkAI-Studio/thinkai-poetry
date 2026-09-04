import React from "react";
import { ComingSoonPage } from "@/components/lattice/ComingSoonPage";

export const metadata = {
  title: "Diễn Đàn Kiến Thức & Văn Học | Thịnh và Thơ",
  description: "Không gian đối thoại văn chương, bình thơ và chia sẻ cảm xúc nghệ thuật.",
};

export default function ForumPage() {
  return (
    <ComingSoonPage
      badge="Diễn Đàn Kiến Thức"
      title="Một góc tĩnh lặng đang được ươm mầm..."
      description="Không gian đàm đạo thi ca, chia sẻ những bài bình văn sâu sắc và góc nhìn đa chiều của bạn đọc đang được đội ngũ trau chuốt từng chi tiết để sớm ra mắt bạn yêu thơ."
    />
  );
}
