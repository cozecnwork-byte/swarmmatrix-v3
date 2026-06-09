import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { LLMClient, Config } from 'coze-coding-dev-sdk';
import { Agent } from '@/lib/agent';

// 初始化LLM客户端
let llmClient: LLMClient | null = null;
const getLLMClient = () => {
  if (!llmClient) {
    const config = new Config();
    llmClient = new LLMClient(config);
  }
  return llmClient;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, data } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: '用户ID不能为空'
      }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    switch (action) {
      case 'initializeWizard':
        return await initializeWizard(supabase, userId, data);
      case 'updateStep':
        return await updateStep(supabase, userId, data);
      case 'startProject':
        return await startProject(supabase, userId, data);
      default:
        return NextResponse.json({
          success: false,
          error: '未知操作'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('AI向导API错误:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}

// 初始化向导
async function initializeWizard(supabase: any, userId: string, data: any) {
  const { projectName, description } = data;

  if (!projectName) {
    return NextResponse.json({
      success: false,
      error: '项目名称不能为空'
    }, { status: 400 });
  }

  // 生成AI推荐
  const recommendations = await generateGlobalRecommendations(data, 1);

  // 创建项目
  const { data: project, error } = await supabase
    .from('ai_wizard_projects')
    .insert({
      user_id: userId,
      project_name: projectName,
      description: description,
      current_step: 1,
      step_data: { 1: data },
      status: 'in_progress',
      recommendations: recommendations,
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    data: {
      id: project.id,
      recommendations,
    }
  });
}

// 更新步骤
async function updateStep(supabase: any, userId: string, data: any) {
  const { projectId, step, stepData } = data;

  // 获取项目
  const { data: project, error: fetchError } = await supabase
    .from('ai_wizard_projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;

  // 生成该步骤的AI推荐
  const recommendations = await generateGlobalRecommendations(
    { ...project.step_data, [step]: stepData },
    step
  );

  // 更新项目
  const { data: updatedProject, error: updateError } = await supabase
    .from('ai_wizard_projects')
    .update({
      current_step: Math.min(step + 1, 7),
      step_data: { ...project.step_data, [step]: stepData },
      recommendations: { ...project.recommendations, ...recommendations },
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .select()
    .single();

  if (updateError) throw updateError;

  return NextResponse.json({
    success: true,
    data: {
      recommendations,
    }
  });
}

// 启动项目
async function startProject(supabase: any, userId: string, data: any) {
  const { projectId } = data;

  // 获取项目
  const { data: project, error: fetchError } = await supabase
    .from('ai_wizard_projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;

  // 创建智能体任务
  const agent = new Agent({
    userId: userId,
  });

  const taskData = {
    type: 'global_lead_gen',
    project: project.step_data,
    goal: '执行全球矩阵引流方案',
  };

  const result = await agent.execute(JSON.stringify(taskData));

  // 更新项目状态
  const { error: updateError } = await supabase
    .from('ai_wizard_projects')
    .update({
      status: 'completed',
      agent_task_id: result.taskId,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId);

  if (updateError) throw updateError;

  return NextResponse.json({
    success: true,
    data: {
      taskId: result.taskId,
      result,
    }
  });
}

// 生成全球版AI推荐
async function generateGlobalRecommendations(currentData: any, step: number) {
  switch (step) {
    case 1:
      return {
        projectNameSuggestions: await generateProjectNameSuggestions(currentData),
      };
    case 2:
      return {
        sellingPoints: await extractSellingPoints(currentData),
      };
    case 4:
      return {
        contentStrategy: await recommendContentStrategy(currentData),
      };
    case 5:
      return {
        platformCombinations: await recommendGlobalPlatforms(currentData),
      };
    default:
      return {};
  }
}

// 生成项目名称建议
async function generateProjectNameSuggestions(data: any) {
  return [
    '2024全球数码产品推广计划',
    'International Brand Expansion',
    '全球多渠道引流矩阵',
    '环球市场渗透方案',
  ];
}

// 提取产品卖点
async function extractSellingPoints(data: any) {
  const productInfo = data[2] || data;
  if (productInfo.productSellingPoints) {
    return productInfo.productSellingPoints.split('\n').filter(Boolean).slice(0, 5);
  }
  return [
    '产品品质优异',
    '价格竞争力强',
    '用户体验优秀',
    '售后服务完善',
  ];
}

// 推荐内容策略
async function recommendContentStrategy(data: any) {
  const audienceGroups = data[3]?.audienceGroups || [];
  const countries = data[3]?.countries || [];

  if (audienceGroups.includes('business')) {
    return 'brand';
  } else if (audienceGroups.includes('creator')) {
    return 'kol';
  } else if (countries.length > 5) {
    return 'mixed';
  }
  return 'micro';
}

// 推荐全球平台组合
async function recommendGlobalPlatforms(data: any) {
  const countries = data[3]?.countries || [];
  const audienceGroups = data[3]?.audienceGroups || [];

  const combinations: string[][] = [];

  // 基础全球组合
  combinations.push(['TikTok', 'Instagram', 'YouTube']);

  // 根据地区添加
  if (countries.includes('CN')) {
    combinations.push(['抖音', '小红书', 'B站']);
  }
  if (countries.includes('JP') || countries.includes('KR')) {
    combinations.push(['TikTok', 'Instagram', 'Line']);
  }
  if (countries.includes('US') || countries.includes('GB')) {
    combinations.push(['TikTok', 'Instagram', 'YouTube', 'Twitter/X']);
  }

  // 根据人群添加
  if (audienceGroups.includes('business')) {
    combinations.push(['LinkedIn', 'Twitter/X', 'YouTube']);
  }

  return combinations.slice(0, 3);
}
