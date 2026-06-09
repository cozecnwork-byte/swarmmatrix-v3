import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 平台数据
const PLATFORM_DATA = {
  platforms: [
    { id: 'douyin', name: '抖音', icon: '🎬', primaryRegions: ['CN'], recommended: true },
    { id: 'xiaohongshu', name: '小红书', icon: '📖', primaryRegions: ['CN'], recommended: true },
    { id: 'kuaishou', name: '快手', icon: '🎥', primaryRegions: ['CN'], recommended: false },
    { id: 'bilibili', name: 'B站', icon: '📺', primaryRegions: ['CN'], recommended: false },
    { id: 'weixin', name: '微信', icon: '💬', primaryRegions: ['CN'], recommended: true },
    { id: 'weibo', name: '微博', icon: '🌐', primaryRegions: ['CN'], recommended: false },
  ],
  countries: [
    { code: 'CN', name: '中国', flag: '🇨🇳', languages: ['zh-CN'], platforms: ['douyin', 'xiaohongshu', 'kuaishou', 'bilibili', 'weixin', 'weibo'] },
    { code: 'US', name: '美国', flag: '🇺🇸', languages: ['en-US'], platforms: ['youtube', 'instagram', 'twitter', 'tiktok'] },
    { code: 'UK', name: '英国', flag: '🇬🇧', languages: ['en-GB'], platforms: ['youtube', 'instagram', 'twitter', 'tiktok'] },
    { code: 'JP', name: '日本', flag: '🇯🇵', languages: ['ja-JP'], platforms: ['youtube', 'instagram', 'twitter', 'line'] },
    { code: 'KR', name: '韩国', flag: '🇰🇷', languages: ['ko-KR'], platforms: ['youtube', 'instagram', 'twitter', 'kakao'] },
  ],
};

// 场景模板
const PRESET_SCENARIOS = [
  {
    id: 'douyin_growth',
    name: '抖音快速涨粉',
    description: '通过抖音平台快速获取粉丝增长',
    icon: '🎬',
    steps: {
      basic: { name: '抖音涨粉项目', description: '在抖音平台快速涨粉' },
      product: { name: '你的产品', link: '', image: '', sellingPoints: '有趣、有用、有共鸣' },
      target: { countries: ['CN'], language: 'zh-CN', tags: ['年轻人', '时尚', '娱乐'] },
      content: { types: ['short_video', 'trending'], themes: ['生活分享', '知识科普', '娱乐搞笑'] },
      platforms: { selection: ['douyin'], accountCount: 3 },
    },
  },
  {
    id: 'xiaohongshu_planting',
    name: '小红书种草',
    description: '在小红书进行产品种草推广',
    icon: '📖',
    steps: {
      basic: { name: '小红书种草项目', description: '在小红书种草推广产品' },
      product: { name: '好物推荐', link: '', image: '', sellingPoints: '真实体验、详细测评' },
      target: { countries: ['CN'], language: 'zh-CN', tags: ['女性', '时尚', '美妆', '生活'] },
      content: { types: ['note', 'image'], themes: ['好物分享', '使用教程', '避坑指南'] },
      platforms: { selection: ['xiaohongshu'], accountCount: 2 },
    },
  },
  {
    id: 'community_drain',
    name: '社群引流',
    description: '通过微信群等社群渠道引流',
    icon: '👥',
    steps: {
      basic: { name: '社群引流项目', description: '通过社群进行引流' },
      product: { name: '社群服务', link: '', image: '', sellingPoints: '有价值、能互动' },
      target: { countries: ['CN'], language: 'zh-CN', tags: ['精准人群', '兴趣社群'] },
      content: { types: ['text', 'image'], themes: ['干货分享', '问题解答', '活动通知'] },
      platforms: { selection: ['weixin'], accountCount: 5 },
    },
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, step, data, wizardId, scenarioId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    switch (action) {
      case 'initializeWizard':
        return await initializeWizard(supabase, userId);
      case 'saveStep':
        return await saveStep(supabase, userId, wizardId, step, data);
      case 'getWizard':
        return await getWizard(supabase, userId, wizardId);
      case 'getAIAdvice':
        return await getAIAdvice(step, data);
      case 'getPlatformRecommendations':
        return await getPlatformRecommendations(data);
      case 'checkIP':
        return await checkIP(supabase, userId, data);
      case 'startProject':
        return await startProject(supabase, userId, wizardId);
      case 'applyPreset':
        return await applyPreset(supabase, userId, scenarioId);
      case 'listPresets':
        return NextResponse.json({ success: true, data: PRESET_SCENARIOS });
      default:
        return NextResponse.json(
          { success: false, error: '无效的操作' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI向导API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || '';
    const wizardId = searchParams.get('wizardId') ?? undefined;
    const action = searchParams.get('action') || '';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    switch (action) {
      case 'getWizard':
        return await getWizard(supabase, userId, wizardId);
      case 'listWizards':
        return await listWizards(supabase, userId);
      case 'listPresets':
        return NextResponse.json({ success: true, data: PRESET_SCENARIOS });
      case 'getPlatformData':
        return NextResponse.json({ success: true, data: PLATFORM_DATA });
      default:
        return NextResponse.json(
          { success: false, error: '无效的操作' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI向导API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 初始化向导
async function initializeWizard(supabase: any, userId: string) {
  const { data: wizard, error } = await supabase
    .from('ai_wizard_sessions')
    .insert({
      user_id: userId,
      current_step: 1,
      step_data: {},
      status: 'in_progress',
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ 
    success: true, 
    data: { 
      wizard, 
      platformData: PLATFORM_DATA,
      presets: PRESET_SCENARIOS,
    } 
  });
}

// 保存步骤
async function saveStep(supabase: any, userId: string, wizardId: string, step: number, data: any) {
  // 获取当前会话
  const { data: currentWizard, error: fetchError } = await supabase
    .from('ai_wizard_sessions')
    .select('*')
    .eq('id', wizardId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;

  // 更新步骤数据
  const newStepData = { 
    ...currentWizard.step_data, 
    [step]: data 
  };

  // 如果是最后一步，自动验证
  let validation = null;
  if (step === 7) {
    validation = await validateAllSteps(newStepData);
  }

  const { data: updatedWizard, error: updateError } = await supabase
    .from('ai_wizard_sessions')
    .update({
      step_data: newStepData,
      current_step: step,
      status: step === 7 ? 'completed' : 'in_progress',
      validation_result: validation,
    })
    .eq('id', wizardId)
    .select()
    .single();

  if (updateError) throw updateError;

  return NextResponse.json({ 
    success: true, 
    data: { 
      wizard: updatedWizard, 
      validation,
      nextAdvice: step < 7 ? await getStepAdvice(step + 1, newStepData) : null,
    } 
  });
}

// 获取向导
async function getWizard(supabase: any, userId: string, wizardId?: string) {
  if (!wizardId) {
    // 获取最新的进行中向导
    const { data: wizards, error } = await supabase
      .from('ai_wizard_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      data: wizards && wizards.length > 0 ? wizards[0] : null,
      platformData: PLATFORM_DATA,
      presets: PRESET_SCENARIOS,
    });
  }

  const { data: wizard, error } = await supabase
    .from('ai_wizard_sessions')
    .select('*')
    .eq('id', wizardId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  return NextResponse.json({ 
    success: true, 
    data: wizard,
    platformData: PLATFORM_DATA,
    presets: PRESET_SCENARIOS,
  });
}

// 列出用户向导
async function listWizards(supabase: any, userId: string) {
  const { data: wizards, error } = await supabase
    .from('ai_wizard_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  return NextResponse.json({ success: true, data: wizards });
}

// 获取AI建议
async function getAIAdvice(step: number, data: any) {
  const advice = await getStepAdvice(step, data);
  return NextResponse.json({ success: true, data: advice });
}

// 获取平台推荐
async function getPlatformRecommendations(data: any) {
  const { countries, tags, contentTypes } = data;
  
  // 简单的推荐逻辑
  const recommendations = PLATFORM_DATA.platforms.filter(platform => {
    const matchesCountry = countries && countries.some((c: string) => 
      platform.primaryRegions.includes(c)
    );
    return matchesCountry || platform.recommended;
  });

  return NextResponse.json({ 
    success: true, 
    data: {
      recommended: recommendations,
      accountStrategy: {
        total: Math.min(recommendations.length * 2, 10),
        perPlatform: 2,
        tiers: ['主账号', '辅助账号'],
      },
    } 
  });
}

// IP检查
async function checkIP(supabase: any, userId: string, data: any) {
  const { countries } = data;
  
  // 模拟IP检查
  const results = countries.map((country: string) => ({
    country,
    status: 'ready', // ready | warning | error
    message: '环境就绪，可以启动',
    lastCheck: new Date().toISOString(),
  }));

  return NextResponse.json({ 
    success: true, 
    data: {
      results,
      summary: {
        total: countries.length,
        ready: countries.length,
        warning: 0,
        error: 0,
      },
      recommendations: [
        '建议使用独立IP环境',
        '确保账号安全距离',
        '遵守各平台规则',
      ],
    } 
  });
}

// 启动项目
async function startProject(supabase: any, userId: string, wizardId: string) {
  const { data: wizard, error: fetchError } = await supabase
    .from('ai_wizard_sessions')
    .select('*')
    .eq('id', wizardId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;

  // 创建智能体任务
  const { data: task, error: taskError } = await supabase
    .from('agent_tasks')
    .insert({
      user_id: userId,
      name: wizard.step_data[1]?.name || '引流项目',
      description: wizard.step_data[1]?.description,
      input_command: '执行引流方案',
      status: 'pending',
    })
    .select()
    .single();

  if (taskError) throw taskError;

  // 更新向导状态
  await supabase
    .from('ai_wizard_sessions')
    .update({
      status: 'launched',
      project_id: task.id,
    })
    .eq('id', wizardId);

  return NextResponse.json({ 
    success: true, 
    data: {
      task,
      nextSteps: [
        '查看智能体执行进度',
        '配置平台账号',
        '选择内容模板',
      ],
    } 
  });
}

// 使用预设场景
async function applyPreset(supabase: any, userId: string, scenarioId: string) {
  const scenario = PRESET_SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) {
    return NextResponse.json(
      { success: false, error: '预设场景不存在' },
      { status: 404 }
    );
  }

  // 创建向导并填充预设数据
  const { data: wizard, error } = await supabase
    .from('ai_wizard_sessions')
    .insert({
      user_id: userId,
      current_step: 7,
      step_data: scenario.steps,
      status: 'completed',
      preset_used: scenarioId,
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ 
    success: true, 
    data: { 
      wizard, 
      scenario,
      platformData: PLATFORM_DATA,
    } 
  });
}

// 验证所有步骤
async function validateAllSteps(stepData: any) {
  const issues = [];
  const warnings = [];

  // 步骤1: 基础信息
  if (!stepData[1]?.name) {
    issues.push({ step: 1, field: 'name', message: '项目名称不能为空' });
  }

  // 步骤2: 产品信息
  if (!stepData[2]?.name) {
    issues.push({ step: 2, field: 'name', message: '产品名称不能为空' });
  }

  // 步骤3: 目标客户
  if (!stepData[3]?.countries || stepData[3].countries.length === 0) {
    issues.push({ step: 3, field: 'countries', message: '请至少选择一个目标国家' });
  }

  // 步骤4: 内容策略
  if (!stepData[4]?.types || stepData[4].types.length === 0) {
    warnings.push({ step: 4, field: 'types', message: '建议选择内容类型' });
  }

  // 步骤5: 平台选择
  if (!stepData[5]?.selection || stepData[5].selection.length === 0) {
    issues.push({ step: 5, field: 'selection', message: '请至少选择一个平台' });
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    readyToLaunch: issues.length === 0,
  };
}

// 获取步骤建议
async function getStepAdvice(step: number, stepData: any) {
  const adviceMap: Record<number, any> = {
    1: {
      suggestions: [
        '项目名称要简洁明了，让人一眼就能知道是做什么的',
        '描述可以包含目标、方式和预期成果',
      ],
      examples: [
        '抖音美妆产品快速涨粉',
        '小红书好物分享引流',
      ],
    },
    2: {
      suggestions: [
        '产品图片要清晰、有吸引力',
        '卖点要具体，最好有数据支撑',
        'AI会根据产品信息自动提取卖点',
      ],
      aiPrompt: '帮我分析这个产品的核心卖点，要求：3-5个关键点，每个点不超过20字',
    },
    3: {
      suggestions: [
        '选择与产品匹配的目标市场',
        '人群标签越精准，引流效果越好',
        '可以同时选择多个国家进行多地区引流',
      ],
      recommendations: stepData[2]?.sellingPoints ? [
        '根据产品卖点推荐目标人群',
        '建议添加更多人群标签',
      ] : [],
    },
    4: {
      suggestions: [
        '不同平台适合不同的内容类型',
        '短视频适合抖音、快手，图文适合小红书',
        '建议准备2-3种内容类型进行测试',
      ],
      themeRecommendations: [
        { theme: '教程类', platforms: ['douyin', 'xiaohongshu', 'bilibili'] },
        { theme: '测评类', platforms: ['xiaohongshu', 'bilibili'] },
        { theme: '剧情类', platforms: ['douyin', 'kuaishou'] },
      ],
    },
    5: {
      suggestions: [
        'AI会根据目标国家和人群推荐最合适的平台组合',
        '建议选择2-3个核心平台深耕',
        '注意各平台的规则和特点',
      ],
    },
    6: {
      suggestions: [
        '账号数量要量力而行，建议先从少到多',
        '不同层级的账号有不同的定位和分工',
        '注意账号之间的安全距离',
      ],
      strategies: [
        { name: '精品策略', accounts: 2, description: '深耕2个核心账号' },
        { name: '矩阵策略', accounts: 5, description: '主账号+辅助账号组合' },
        { name: '规模化策略', accounts: 10, description: '多平台多账号布局' },
      ],
    },
    7: {
      suggestions: [
        '仔细检查所有配置是否正确',
        '确认IP环境安全后再启动',
        '启动后可以在智能体页面查看执行进度',
      ],
      checklist: [
        '产品信息完整',
        '目标客户明确',
        '平台选择合理',
        '账号配置就绪',
        'IP环境安全',
      ],
    },
  };

  return adviceMap[step] || { suggestions: [] };
}
