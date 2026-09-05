import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get("admin_session")?.value;
  const isAuthenticated = adminSession === "authenticated";

  // 1. Bảo vệ các tuyến đường Admin (/admin & /admin/*)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/authors", request.url);
      loginUrl.searchParams.set("login", "admin");
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Bảo vệ các thao tác ghi dữ liệu qua API (POST, PUT, PATCH, DELETE)
  const isWriteMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method);
  const isProtectedApiRoute =
    pathname.startsWith("/api/poems") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/collections") ||
    pathname.startsWith("/api/authors");

  if (isProtectedApiRoute && isWriteMethod && !isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Xác thực không hợp lệ. Vui lòng đăng nhập với quyền Admin." },
      { status: 401 }
    );
  }

  // 3. Thêm Security Headers tiêu chuẩn cho mọi Response
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/poems/:path*",
    "/api/categories/:path*",
    "/api/collections/:path*",
    "/api/authors/:path*",
  ],
};
