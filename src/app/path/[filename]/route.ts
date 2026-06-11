import { NextResponse } from 'next/server';

// 动态路由：/path/[filename]
// TikTok prefix 验证模式：TikTok GET https://<prefix>/path/<challenge_code>.txt
// 服务器必须返回 challenge_code 字符串（与 URL filename 去 .txt 后一致）
// TikTok 比对返回内容 == 自己的 challenge code，一致则验证通过
//
// 设计要点：
// 1. 任意 filename 都能命中路由（避免 TikTok 每次重新生成 challenge code 都要改代码）
// 2. 返回内容 = filename 去 .txt（与 TikTok 期望完全一致）
// 3. Content-Type 必须是 text/plain
// 4. 强 no-cache 头（防 CDN/中间层缓存导致返回陈旧 challenge code）
// 5. 文件名格式校验：只接受 <token>.txt，token 限定 [A-Za-z0-9]+

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // 期望形如 "<challenge_code>.txt"，长度通常 20-60
  if (!/^[A-Za-z0-9]+\.txt$/i.test(filename)) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // 返回 filename 去 .txt 后缀，作为 challenge code 文本
  const challengeCode = filename.replace(/\.txt$/i, '');

  return new NextResponse(challengeCode, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
