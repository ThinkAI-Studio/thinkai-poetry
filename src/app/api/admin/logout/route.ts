import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete({ name: "admin_session", path: "/" });
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true, message: "Đã đăng xuất thành công" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
