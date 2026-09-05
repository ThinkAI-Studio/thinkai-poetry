import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPoem, getPoems } from "@/lib/data-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formType = searchParams.get("form_type") as any;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const poems = await getPoems({ formType, limit });
    return NextResponse.json({ success: true, data: poems });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi lấy danh sách thi phẩm" },
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

    if (!body.title || !body.raw_text) {
      return NextResponse.json(
        { success: false, error: "Tiêu đề và nội dung bài thơ không được để trống" },
        { status: 400 }
      );
    }

    const { data, error } = await createPoem(body);

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi tạo thi phẩm mới" },
      { status: 500 }
    );
  }
}
