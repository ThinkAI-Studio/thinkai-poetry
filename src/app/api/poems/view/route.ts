import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { recordPoemView } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetId = body.id || body.slug;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID hoặc slug bài thơ" },
        { status: 400 }
      );
    }

    const result = await recordPoemView(targetId);

    try {
      revalidatePath("/admin", "layout");
      revalidatePath("/admin/poems", "page");
    } catch {}

    const response = NextResponse.json({
      success: true,
      view_count: result.view_count,
    });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi ghi nhận lượt đọc" },
      { status: 500 }
    );
  }
}
