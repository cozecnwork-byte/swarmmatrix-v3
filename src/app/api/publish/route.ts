import { NextRequest, NextResponse } from 'next/server';

// 平台配置
const PLATFORM_CONFIGS = {
  douyin: { name: '抖音', color: '#000000' },
  xiaohongshu: { name: '小红书', color: '#FF2442' },
  bilibili: { name: 'B站', color: '#00A1D6' },
  weixin: { name: '微信公众号', color: '#07C160' },
  weibo: { name: '微博', color: '#E6162D' },
  instagram: { name: 'Instagram', color: '#E4405F' }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      content, 
      platforms, 
      scheduledTime,
      translate,
      userId = 'demo-user'
    } = body;

    // 验证必填字段
    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: '请输入发布内容' },
        { status: 400 }
      );
    }

    if (!platforms?.length) {
      return NextResponse.json(
        { success: false, error: '请选择至少一个发布平台' },
        { status: 400 }
      );
    }

    console.log(`[Publish] 开始发布流程:`, { title, platforms, scheduledTime: !!scheduledTime });

    // 模拟发布流程 - 逐个平台发布
    const results: Array<{
      platform: string;
      success: boolean;
      message: string;
      publishedUrl?: string;
    }> = [];

    for (const platformId of platforms) {
      const platformConfig = PLATFORM_CONFIGS[platformId as keyof typeof PLATFORM_CONFIGS];
      
      try {
        // 模拟平台发布API调用
        console.log(`[Publish] 正在发布到 ${platformConfig?.name || platformId}...`);
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

        // 模拟成功率 90%
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          results.push({
            platform: platformId,
            success: true,
            message: `成功发布到${platformConfig?.name || platformId}`,
            publishedUrl: `https://${platformId}.com/post/demo-${Date.now()}`
          });
          console.log(`[Publish] ✅ ${platformConfig?.name || platformId} 发布成功`);
        } else {
          results.push({
            platform: platformId,
            success: false,
            message: `${platformConfig?.name || platformId}发布失败，请稍后重试`
          });
          console.log(`[Publish] ❌ ${platformConfig?.name || platformId} 发布失败`);
        }
      } catch (error) {
        results.push({
          platform: platformId,
          success: false,
          message: `${platformConfig?.name || platformId}发布异常: ${(error as Error)?.message}`
        });
      }
    }

    // 计算统计
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    // 数据库保存是可选的，暂时跳过避免构建问题
    console.log(`[Publish] 发布完成，跳过数据库保存以避免构建问题`);

    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: platforms.length,
          success: successCount,
          failed: failedCount
        }
      }
    });

  } catch (error) {
    console.error('[Publish] 发布异常:', error);
    return NextResponse.json(
      { success: false, error: '发布服务异常，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: '一键发布API',
    platforms: Object.entries(PLATFORM_CONFIGS).map(([id, config]) => ({
      id,
      name: config.name,
      color: config.color
    }))
  });
}
