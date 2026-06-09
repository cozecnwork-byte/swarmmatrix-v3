import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TikTok验证文件内容
const TIKTOK_VERIFICATION_FILE = 'tiktokjYnY11EEplJ2Vvi5v1MEecqVK6L76kCv.txt';
const TIKTOK_VERIFICATION_CONTENT = 'tiktokjYnY11EEplJ2Vvi5v1MEecqVK6L76kCv';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 处理TikTok验证文件请求
  if (pathname === `/${TIKTOK_VERIFICATION_FILE}`) {
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
    '/tiktokjYnY11EEplJ2Vvi5v1MEecqVK6L76kCv.txt',
  ],
};
