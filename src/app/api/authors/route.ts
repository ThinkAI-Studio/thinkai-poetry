import { NextResponse } from "next/server";
import { getAuthors } from "@/lib/data-service";

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
