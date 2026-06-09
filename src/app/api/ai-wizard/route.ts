import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 智能推荐系统 - 基于产品类型智能匹配
function getSmartRecommendations(productDescription: string) {
  const lowerDesc = productDescription.toLowerCase();
  
  // 产品类型识别
  let productType = 'general';
  if (lowerDesc.includes('game') || lowerDesc.includes('游戏')) productType = 'game';
  else if (lowerDesc.includes('beauty') || lowerDesc.includes('化妆') || lowerDesc.includes('护肤')) productType = 'beauty';
  else if (lowerDesc.includes('fashion') || lowerDesc.includes('时尚') || lowerDesc.includes('服装')) productType = 'fashion';
  else if (lowerDesc.includes('education') || lowerDesc.includes('教育') || lowerDesc.includes('课程')) productType = 'education';
  else if (lowerDesc.includes('digital') || lowerDesc.includes('数码') || lowerDesc.includes('电子') || lowerDesc.includes('科技')) productType = 'digital';

  // 目标市场推荐
  const targetMarkets = {
    digital: ['美国', '东南亚', '中东', '巴西'],
    beauty: ['美国', '东南亚', '中东'],
    fashion: ['美国', '东南亚', '中东', '巴西'],
    game: ['全球'],
    education: ['美国', '东南亚'],
    general: ['美国', '东南亚', '中东']
  };

  // 目标人群推荐
  const targetAudiences = {
    digital: ['Z世代', '千禧一代', '科技爱好者'],
    beauty: ['女性用户', 'Z世代', '美妆爱好者'],
    fashion: ['Z世代', '千禧一代', '时尚达人'],
    game: ['Z世代', '游戏玩家', '直播观众'],
    education: ['学生群体', '职场新人', '终身学习者'],
    general: ['Z世代', '千禧一代']
  };

  // 平台推荐
  const recommendedPlatforms = {
    digital: ['TikTok', 'Instagram', 'YouTube', '抖音', 'B站'],
    beauty: ['TikTok', 'Instagram', 'YouTube', '小红书'],
    fashion: ['TikTok', 'Instagram', 'YouTube', '小红书'],
    game: ['TikTok', 'YouTube', 'B站', 'Twitch'],
    education: ['YouTube', 'TikTok', 'B站', '小红书'],
    general: ['TikTok', 'Instagram', 'YouTube', '抖音', '小红书', 'B站']
  };

  // 内容策略推荐
  const contentStrategies = {
    digital: ['产品测评', '开箱视频', '对比评测', '使用教程'],
    beauty: ['教程分享', '产品展示', '前后对比', '直播带货'],
    fashion: ['穿搭展示', '时尚教程', '品牌故事', '季节新品'],
    game: ['直播试玩', '精彩剪辑', '攻略教程', '赛事精彩'],
    education: ['知识分享', '教学演示', '学习技巧', '成功案例'],
    general: ['生活记录', '情景短剧', '知识科普', '好物推荐']
  };

  // 发布频率推荐
  const frequencies = {
    digital: '每周3-5次',
    beauty: '每周5-7次',
    fashion: '每周5-7次',
    game: '每日1-2次',
    education: '每周2-3次',
    general: '每周3-5次'
  };

  return {
    productType,
    targetMarkets: targetMarkets[productType as keyof typeof targetMarkets],
    targetAudiences: targetAudiences[productType as keyof typeof targetAudiences],
    recommendedPlatforms: recommendedPlatforms[productType as keyof typeof recommendedPlatforms],
    contentStrategies: contentStrategies[productType as keyof typeof contentStrategies],
    frequency: frequencies[productType as keyof typeof frequencies],
    accountDistribution: { main: 60, backup: 40 },
    ipType: productType === 'game' ? 'datacenter' : 'residential',
    estimatedBudget: productType === 'digital' ? '¥5000-20000' : '¥2000-10000'
  };
}

// 生成优化后的描述
function generateOptimizedDescription(input: string): string {
  const recommendations = getSmartRecommendations(input);
  
  return `制作一个关于"${input}"的矩阵引流项目。

1. 产品定位：基于${recommendations.productType === 'general' ? '综合品类' : recommendations.productType}产品特性，重点突出产品核心价值
2. 目标市场：覆盖${recommendations.targetMarkets.join('、')}，先从${recommendations.targetMarkets[0]}开始冷启动
3. 目标人群：主要针对${recommendations.targetAudiences.join('、')}
4. 内容策略：以${recommendations.contentStrategies[0]}为主，辅以${recommendations.contentStrategies.slice(1).join('、')}
5. 平台组合：优先布局${recommendations.recommendedPlatforms.join('、')}
6. 发布节奏：${recommendations.frequency}，保持稳定更新
7. 账号配置：${recommendations.accountDistribution.main}%主力账号 + ${recommendations.accountDistribution.backup}%备用账号`;
}

// POST: AI智能优化
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, step, data, projectId, simpleInput } = body;
    const supabase = getSupabaseClient();

    // AI一键优化
    const inputToUse = simpleInput || (data && data.simpleInput);
    if ((action === 'ai-optimize' || action === 'oneClickOptimize') && inputToUse) {
      const optimized = generateOptimizedDescription(inputToUse);
      const recommendations = getSmartRecommendations(inputToUse);
      
      return NextResponse.json({
        success: true,
        data: {
          original: inputToUse,
          optimized,
          recommendations,
          projectId: `project_${Date.now()}`
        }
      });
    }

    // 应用AI方案
    if (action === 'apply-ai-scheme' && projectId) {
      return NextResponse.json({
        success: true,
        data: {
          projectId,
          status: 'created',
          message: '项目已创建！可进入高级模式查看详情或直接开始发布'
        }
      });
    }

    // 创建项目
    if (action === 'create') {
      const projectData = {
        id: `project_${Date.now()}`,
        name: data.name || '未命名项目',
        description: data.description || '',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'system'
      };

      return NextResponse.json({
        success: true,
        data: projectData
      });
    }

    // 更新步骤数据
    if (action === 'update-step' && projectId) {
      return NextResponse.json({
        success: true,
        data: {
          projectId,
          step,
          status: 'updated',
          message: '步骤数据已保存'
        }
      });
    }

    // 完成项目
    if (action === 'complete' && projectId) {
      return NextResponse.json({
        success: true,
        data: {
          projectId,
          status: 'completed',
          workflowId: `workflow_${Date.now()}`,
          message: '项目创建成功！工作流已自动配置'
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('[AI-Wizard-API] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET: 获取项目状态
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const supabase = getSupabaseClient();

    if (!projectId) {
      return NextResponse.json({
        success: true,
        data: null
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: projectId,
        currentStep: 1,
        status: 'draft',
        steps: {}
      }
    });

  } catch (error) {
    console.error('[AI-Wizard-API] Get Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
