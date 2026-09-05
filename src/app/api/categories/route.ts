import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCategories, createCategory } from "@/lib/data-service";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi lấy danh sách thể loại" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    if (session?.value !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "Yêu cầu quyền đăng nhập Admin" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Tên thể loại không được để trống" },
        { status: 400 }
      );
    }

    const { data, error } = await createCategory({
      name: body.name.trim(),
      description: body.description?.trim() || null,
    });

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi tạo thể loại mới" },
      { status: 500 }
    );
  }
}
