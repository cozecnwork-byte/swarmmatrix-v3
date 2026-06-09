// ========== 矩阵引流API路由 ==========
import { NextRequest, NextResponse } from 'next/server';
import { MatrixLeadGenEngine } from '@/lib/matrix-lead-gen';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, projectConfig, data } = body;

    // 初始化引擎
    const engine = new MatrixLeadGenEngine(projectConfig);

    let result;

    switch (action) {
      // 阶段1：选主平台
      case 'select-platforms':
        result = await engine.selectPrimaryPlatforms(data.audience);
        break;

      // 阶段2：定账号角色
      case 'define-accounts':
        result = await engine.defineAccountRoles(data.platformRoles);
        break;

      // 阶段3：做内容排期
      case 'generate-schedule':
        result = await engine.generateContentSchedule(
          data.platformRoles,
          data.productInfo
        );
        break;

      // 阶段4：安排互动任务
      case 'plan-engagement':
        result = await engine.planEngagementTasks(data.platformRoles);
        break;

      // 阶段5：设计承接入口
      case 'design-capture':
        result = await engine.designLeadCapturePoints(data.platformRoles);
        break;

      // 阶段6：每周复盘
      case 'weekly-review':
        result = await engine.generateWeeklyReview(data.projectData);
        break;

      // 生成AI推荐
      case 'ai-recommendations':
        result = await engine.generateAIRecommendations(
          data.audience,
          data.productInfo
        );
        break;

      // 完整执行所有步骤
      case 'execute-full':
        // 1. 选平台
        const platformRoles = await engine.selectPrimaryPlatforms(data.audience);
        // 2. 定账号
        const accountRoles = await engine.defineAccountRoles(platformRoles);
        // 3. 内容排期
        const contentSchedule = await engine.generateContentSchedule(
          platformRoles,
          data.productInfo
        );
        // 4. 互动任务
        const engagementTasks = await engine.planEngagementTasks(platformRoles);
        // 5. 承接入口
        const capturePoints = await engine.designLeadCapturePoints(platformRoles);
        // 6. AI推荐
        const aiRecommendations = await engine.generateAIRecommendations(
          data.audience,
          data.productInfo
        );

        result = {
          platformRoles,
          accountRoles,
          contentSchedule,
          engagementTasks,
          capturePoints,
          aiRecommendations
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Matrix Lead Gen API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'global-platforms') {
      // 返回全球平台数据
      const { GLOBAL_PLATFORMS } = await import('@/lib/matrix-lead-gen/global-platforms');
      return NextResponse.json({ success: true, data: GLOBAL_PLATFORMS });
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Matrix Lead Gen API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
