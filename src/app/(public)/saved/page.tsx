import React from "react";
import { ComingSoonPage } from "@/components/lattice/ComingSoonPage";

export const metadata = {
  title: "Tủ Thơ Yêu Thích | Thịnh và Thơ",
  description: "Bộ sưu tập những vần thơ tâm đắc của riêng bạn.",
};

export default function FavoritesPage() {
  return (
    <ComingSoonPage
      badge="Tủ Thơ Yêu Thích"
      title="Một góc tĩnh lặng đang được ươm mầm..."
      description="Tính năng đánh dấu những vần thơ chạm đến trái tim và tạo bộ sưu tập thi ca cá nhân của bạn đang được hoàn thiện để mang đến trải nghiệm lưu trữ tao nhã nhất."
    />
  );
}
