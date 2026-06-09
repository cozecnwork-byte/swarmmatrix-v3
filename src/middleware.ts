import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TikTok验证文件配置 - 支持多个文件名
const TIKTOK_VERIFICATION_FILES = [
  'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ.txt',
  'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ_20260609182904798.txt',
];
const TIKTOK_VERIFICATION_CONTENT = 'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 处理TikTok验证文件请求
  if (TIKTOK_VERIFICATION_FILES.some(file => pathname === `/${file}`)) {
    return new NextResponse(TIKTOK_VERIFICATION_CONTENT, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }

  // 其他请求继续正常处理
  return NextResponse.next();
}

// 配置中间件匹配路径
export const config = {
  matcher: [
    '/tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ.txt',
    '/tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ_20260609182904798.txt',
  ],
};
