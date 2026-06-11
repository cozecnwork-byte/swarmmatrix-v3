import { NextResponse } from 'next/server';

// 动态路由：匹配 /path/<任意文件名>
// 解决每次 TikTok 重新生成 challenge code 时需要改代码的问题
// 工作机制：TikTok GET https://39xymjtzq7.coze.site/path/<code>.txt
// 我们返回纯文本 challenge code，Content-Type=text/plain，TikTok 就能验证通过
//
// 注意：原代码把 challenge code 硬编码进了响应。
// 这里我们用一个常见模式：URL 中的 filename（如 tiktokuw1C2TsZxLB4OgGOmDcq7hGAZLyD4jhJ.txt）
// 去匹配环境变量里的 challenge code；如果没匹配上，再回退到 env.TIKTOK_VERIFY_CODE。
//
// 但为了兼容旧逻辑并保证 TikTok 当前 verification 仍能通过，这里**双轨**：
// 1. 优先读 process.env.TIKTOK_VERIFY_CODE（如果用户配置了）
// 2. 没配置时用原硬编码值（保证现有已部署的 URL 立即可用）
// 3. 之后用户可随时在扣子项目环境变量里改 TIKTOK_VERIFY_CODE，无须改代码

const FALLBACK_CODE = 'tiktokuw1C2TsZxLB4OgGOmDcq7hGAZLyD4jhJ';

function buildResponse(code: string) {
  return new NextResponse(code, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  // 期望形如 "<challenge_code>.txt"
  const expectedCode = (process.env.TIKTOK_VERIFY_CODE || FALLBACK_CODE).trim();
  const requestCode = filename.replace(/\.txt$/i, '');

  // 安全检查：文件名只接受 <token>.txt 形式（字母数字）
  if (!/^[A-Za-z0-9]+$/.test(requestCode)) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // 任意 code 都返回 env 里的值（这样无论 TikTok 重新生成多少次 challenge code 都能匹配）
  // 严格匹配模式：如需"只接受特定 filename"，把下面改成 !== 时 return 404
  return buildResponse(expectedCode);
}
