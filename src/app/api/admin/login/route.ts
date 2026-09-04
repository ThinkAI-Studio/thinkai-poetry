import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

// Bộ nhớ đệm giới hạn tần suất đăng nhập (In-memory Rate Limiting)
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  return ip;
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Tránh timing attack bằng cách vẫn thực hiện so sánh giả
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIdentifier(request);
    const now = Date.now();

    // 1. Kiểm tra trạng thái khóa do nhập sai nhiều lần
    const attemptRecord = loginAttempts.get(clientIp);
    if (attemptRecord && attemptRecord.lockedUntil > now) {
      const remainingSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Tài khoản tạm khóa do nhập sai nhiều lần. Vui lòng đợi ${remainingSeconds} giây.`,
          locked: true,
          remainingSeconds,
        },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || "anhthinh";

    if (password && safeCompare(password, expectedPassword)) {
      // Đăng nhập thành công -> Reset bộ đếm số lần sai
      loginAttempts.delete(clientIp);

      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
      });

      return NextResponse.json({ success: true, message: "Xác thực quản trị thành công" });
    }

    // Đăng nhập thất bại -> Tăng số lần thử
    const currentCount = (attemptRecord ? attemptRecord.count : 0) + 1;
    const maxAttempts = 5;

    if (currentCount >= maxAttempts) {
      const lockoutMs = 60 * 1000; // Khóa 60 giây
      loginAttempts.set(clientIp, { count: currentCount, lockedUntil: now + lockoutMs });
      return NextResponse.json(
        {
          success: false,
          error: `Bạn đã nhập sai ${maxAttempts} lần. Cổng quản trị bị tạm khóa trong 60 giây.`,
          locked: true,
          remainingSeconds: 60,
        },
        { status: 429 }
      );
    }

    loginAttempts.set(clientIp, { count: currentCount, lockedUntil: 0 });
    return NextResponse.json(
      {
        success: false,
        error: `Mật khẩu không chính xác. Bạn còn ${maxAttempts - currentCount} lần thử.`,
        remainingAttempts: maxAttempts - currentCount,
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
