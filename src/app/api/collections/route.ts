import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/lib/data-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const collections = await getCollections();
    const response = NextResponse.json({ success: true, data: collections });
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi lấy danh sách tuyển tập" },
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

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Tên tuyển tập không được để trống" },
        { status: 400 }
      );
    }

    const { data, error } = await createCollection({
      title: body.title.trim(),
      description: body.description?.trim() || null,
      cover_image_url: body.cover_image_url || "/floral/flower-pink.png",
      is_featured: body.is_featured ?? true,
      sort_order: body.sort_order ?? 0,
    });

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/collections", "layout");
      revalidatePath("/admin/collections", "page");
      revalidatePath("/admin/poems/new", "page");
    } catch {}

    const response = NextResponse.json({ success: true, data }, { status: 201 });
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi tạo tuyển tập mới" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID tuyển tập cần cập nhật" },
        { status: 400 }
      );
    }

    const { data, error } = await updateCollection(id, updates);

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/collections", "layout");
      revalidatePath("/admin/collections", "page");
    } catch {}

    const response = NextResponse.json({ success: true, data });
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi cập nhật tuyển tập" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID tuyển tập cần xóa" },
        { status: 400 }
      );
    }

    const { success, error } = await deleteCollection(id);

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/collections", "layout");
      revalidatePath("/admin/collections", "page");
    } catch {}

    const response = NextResponse.json({ success: true });
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi xóa tuyển tập" },
      { status: 500 }
    );
  }
}
