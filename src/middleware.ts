import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TikTok验证文件配置 - 支持多个文件名和路径前缀
const TIKTOK_VERIFICATION_FILES = [
  'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ.txt',
  'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ_20260609182904798.txt',
  'tiktokuw1C2TsZxLB4OgGOmDcq7hGAZLyD4jhJ.txt',
  'tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH.txt',
];
const TIKTOK_VERIFICATION_CONTENTS: Record<string, string> = {
  'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ.txt': 'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ',
  'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ_20260609182904798.txt': 'tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ',
  'tiktokuw1C2TsZxLB4OgGOmDcq7hGAZLyD4jhJ.txt': 'tiktokuw1C2TsZxLB4OgGOmDcq7hGAZLyD4jhJ',
  'tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH.txt': 'tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 处理TikTok验证文件请求 - 支持根路径和/path/路径
  for (const file of TIKTOK_VERIFICATION_FILES) {
    if (pathname === `/${file}` || pathname === `/path/${file}`) {
      const content = TIKTOK_VERIFICATION_CONTENTS[file] || file.replace('.txt', '');
      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
  }

  // 处理.well-known路径的TikTok验证
  if (pathname === '/.well-known/tiktok-site-verification' || 
      pathname === '/path/.well-known/tiktok-site-verification') {
    return new NextResponse('tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH', {
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

// 配置中间件匹配路径 - 支持根路径和/path/路径
export const config = {
  matcher: [
    '/tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ.txt',
    '/tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ_20260609182904798.txt',
    '/tiktokuw1C2TsZxLB4OgGOmDcq7hGAZLyD4jhJ.txt',
    '/tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH.txt',
    '/path/tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ.txt',
    '/path/tiktokCejA5PqaRJCGQJdkFqROybjEHYj6arZQ_20260609182904798.txt',
    '/path/tiktokuw1C2TsZxLB4OgGOmDcq7hGAZLyD4jhJ.txt',
    '/path/tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH.txt',
    '/.well-known/tiktok-site-verification',
    '/path/.well-known/tiktok-site-verification',
  ],
};
