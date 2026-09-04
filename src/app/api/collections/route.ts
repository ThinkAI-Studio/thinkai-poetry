import { NextResponse } from "next/server";
import { getCollections } from "@/lib/data-service";

export async function GET() {
  try {
    const collections = await getCollections();
    return NextResponse.json({ success: true, data: collections });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi lấy tuyển tập" },
      { status: 500 }
    );
  }
}
