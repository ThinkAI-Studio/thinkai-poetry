import { NextResponse } from "next/server";
import { getAuthors, updateAuthor } from "@/lib/data-service";

export async function GET() {
  try {
    const authors = await getAuthors();
    return NextResponse.json({ success: true, data: authors });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi lấy tác giả" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, pen_name, slug, period, bio, avatar_url } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID tác giả cần cập nhật" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Họ và tên tác giả không được để trống" },
        { status: 400 }
      );
    }

    const updated = await updateAuthor(id, {
      name: name.trim(),
      pen_name: pen_name !== undefined ? (pen_name ? String(pen_name).trim() : null) : null,
      slug: slug ? String(slug).trim() : undefined,
      period: period !== undefined ? (period ? String(period).trim() : null) : null,
      bio: bio !== undefined ? (bio ? String(bio).trim() : null) : null,
      avatar_url: avatar_url !== undefined ? (avatar_url ? String(avatar_url).trim() : null) : null,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật tác giả:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ khi cập nhật tác giả" },
      { status: 500 }
    );
  }
}
