import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 预设场景模板
const PRESET_SCENARIOS = [
  {
    id: 'douyin_growth',
    name: '抖音快速涨粉',
    description: '30天抖音涨粉1000+的完整方案',
    icon: '🎬',
    color: '#FE2C55',
    difficulty: 'beginner',
    estimatedTime: '30天',
    platforms: ['douyin'],
    goals: {
      views: '10万+',
      engagement: '5%+',
      followers: '1000+',
    },
  },
  {
    id: 'xiaohongshu_planting',
    name: '小红书种草',
    description: '小红书产品种草转化方案',
    icon: '📖',
    color: '#FE2C55',
    difficulty: 'beginner',
    estimatedTime: '14天',
    platforms: ['xiaohongshu'],
    goals: {
      views: '5万+',
      engagement: '8%+',
      followers: '500+',
    },
  },
  {
    id: 'community_drain',
    name: '社群引流',
    description: '微信群等社群渠道引流方案',
    icon: '👥',
    color: '#07C160',
    difficulty: 'intermediate',
    estimatedTime: '21天',
    platforms: ['weixin'],
    goals: {
      views: '2万+',
      engagement: '10%+',
      followers: '300+',
    },
  },
  {
    id: 'multi_platform',
    name: '多平台矩阵',
    description: '多平台同步引流矩阵方案',
    icon: '🌐',
    color: '#3B82F6',
    difficulty: 'advanced',
    estimatedTime: '45天',
    platforms: ['douyin', 'xiaohongshu', 'kuaishou', 'weixin'],
    goals: {
      views: '50万+',
      engagement: '6%+',
      followers: '3000+',
    },
  },
];

// 优化策略库
const OPTIMIZATION_STRATEGIES = {
  content: [
    { id: 'short_video', name: '短视频优化', description: '提升短视频完播率和互动率', tips: ['前3秒抓住注意力', '使用热门BGM', '结尾引导互动'] },
    { id: 'image_note', name: '图文优化', description: '优化小红书等图文平台内容', tips: ['首图要有吸引力', '使用热门话题', '排版简洁美观'] },
    { id: 'live_stream', name: '直播优化', description: '提升直播观看和转化', tips: ['固定直播时间', '准备话题大纲', '多与观众互动'] },
  ],
  timing: [
    { id: 'morning', name: '早高峰', description: '7:00-9:00 通勤时间', bestFor: ['知识类', '新闻类'] },
    { id: 'lunch', name: '午高峰', description: '12:00-14:00 午休时间', bestFor: ['娱乐类', '美食类'] },
    { id: 'evening', name: '晚高峰', description: '19:00-23:00 休闲时间', bestFor: ['全品类'] },
  ],
  platform: [
    { id: 'douyin', name: '抖音策略', description: '抖音平台专属优化', tips: ['使用热门话题', '参与挑战赛', '合拍热门视频'] },
    { id: 'xiaohongshu', name: '小红书策略', description: '小红书平台专属优化', tips: ['封面要有吸引力', '使用emoji表情', '话题标签精准'] },
    { id: 'kuaishou', name: '快手策略', description: '快手平台专属优化', tips: ['真实接地气', '互动性要强', '持续稳定更新'] },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, goal, currentData, planId, scenarioId, content, platforms } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    switch (action) {
      case 'generatePlan':
        return await generatePlan(supabase, userId, goal, currentData);
      case 'getPlan':
        return await getPlan(supabase, userId, planId);
      case 'listPlans':
        return await listPlans(supabase, userId);
      case 'optimizeContent':
        return await optimizeContent(content, platforms);
      case 'usePreset':
        return await applyPreset(supabase, userId, scenarioId);
      case 'listPresets':
        return NextResponse.json({ success: true, data: PRESET_SCENARIOS });
      case 'getStrategies':
        return NextResponse.json({ success: true, data: OPTIMIZATION_STRATEGIES });
      default:
        return NextResponse.json(
          { success: false, error: '无效的操作' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('智能优化API错误:', error);
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
    const action = searchParams.get('action') || '';
    const planId = searchParams.get('planId') ?? undefined;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    switch (action) {
      case 'getPlan':
        return await getPlan(supabase, userId, planId);
      case 'listPlans':
        return await listPlans(supabase, userId);
      case 'listPresets':
        return NextResponse.json({ success: true, data: PRESET_SCENARIOS });
      case 'getStrategies':
        return NextResponse.json({ success: true, data: OPTIMIZATION_STRATEGIES });
      default:
        return NextResponse.json(
          { success: false, error: '无效的操作' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('智能优化API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 生成优化方案
async function generatePlan(supabase: any, userId: string, goal: string, currentData: any) {
  // 分析目标
  const goalAnalysis = analyzeGoal(goal);

  // 推荐内容类型
  const contentTypes = recommendContentTypes(goalAnalysis);

  // 推荐平台组合
  const platformCombo = recommendPlatforms(goalAnalysis, currentData);

  // 推荐发布时间
  const timingPlan = recommendTiming(platformCombo);

  // 生成完整方案
  const plan = {
    goal,
    goalAnalysis,
    contentStrategy: {
      types: contentTypes,
      themes: recommendThemes(contentTypes),
      frequency: { perDay: 2, perWeek: 14 },
      templateSuggestions: [
        '使用模板市场的热门模板',
        '根据产品特点定制内容',
      ],
    },
    platformStrategy: platformCombo,
    timingStrategy: timingPlan,
    riskMitigation: {
      frequencyControl: '遵守平台发布频率限制',
      contentCheck: '发布前进行内容合规检查',
      accountSafety: '保持账号安全距离',
    },
    milestones: generateMilestones(goalAnalysis),
    estimatedResults: {
      timeline: '30天',
      expectedReach: goalAnalysis.expected.views,
      expectedEngagement: goalAnalysis.expected.engagement,
      expectedFollowers: goalAnalysis.expected.followers,
    },
  };

  // 保存方案到数据库
  const { data: savedPlan, error } = await supabase
    .from('optimization_plans')
    .insert({
      user_id: userId,
      goal,
      goal_analysis: goalAnalysis,
      plan_data: plan,
      status: 'draft',
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ 
    success: true, 
    data: { 
      plan: savedPlan,
      nextSteps: [
        '查看并确认优化方案',
        '选择内容模板',
        '配置发布时间',
        '一键启动方案',
      ],
    } 
  });
}

// 获取方案
async function getPlan(supabase: any, userId: string, planId?: string) {
  if (!planId) {
    // 获取最新方案
    const { data: plans, error } = await supabase
      .from('optimization_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      data: plans && plans.length > 0 ? plans[0] : null,
      presets: PRESET_SCENARIOS,
      strategies: OPTIMIZATION_STRATEGIES,
    });
  }

  const { data: plan, error } = await supabase
    .from('optimization_plans')
    .select('*')
    .eq('id', planId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  return NextResponse.json({ 
    success: true, 
    data: plan,
    presets: PRESET_SCENARIOS,
    strategies: OPTIMIZATION_STRATEGIES,
  });
}

// 列出用户方案
async function listPlans(supabase: any, userId: string) {
  const { data: plans, error } = await supabase
    .from('optimization_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  return NextResponse.json({ success: true, data: plans });
}

// 内容优化
async function optimizeContent(content: string, platforms: string[]) {
  // 简单的内容优化建议（后续可以接入LLM）
  const suggestions = [];

  if (content.length < 50) {
    suggestions.push({
      type: 'length',
      severity: 'warning',
      message: '内容偏短，建议增加更多细节',
      suggestion: '可以添加更多描述、使用场景或个人感受',
    });
  }

  if (!content.includes('！') && !content.includes('?')) {
    suggestions.push({
      type: 'engagement',
      severity: 'info',
      message: '建议增加互动性',
      suggestion: '可以使用感叹号或问句增加互动感',
    });
  }

  // 平台特定建议
  const platformSuggestions = platforms.map((platform: string) => {
    switch (platform) {
      case 'douyin':
        return { platform, tips: ['建议3秒内抓住重点', '使用热门BGM', '添加热门话题标签'] };
      case 'xiaohongshu':
        return { platform, tips: ['首图要有吸引力', '使用emoji', '话题标签精准'] };
      default:
        return { platform, tips: ['保持内容真实', '持续稳定更新'] };
    }
  });

  return NextResponse.json({ 
    success: true, 
    data: {
      optimized: content,
      suggestions,
      platformSuggestions,
      score: Math.min(100, 50 + content.length / 2),
    } 
  });
}

// 使用预设方案
async function applyPreset(supabase: any, userId: string, scenarioId: string) {
  const scenario = PRESET_SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) {
    return NextResponse.json(
      { success: false, error: '预设方案不存在' },
      { status: 404 }
    );
  }

  // 创建方案
  const { data: plan, error } = await supabase
    .from('optimization_plans')
    .insert({
      user_id: userId,
      goal: scenario.name,
      preset_used: scenarioId,
      goal_analysis: {
        type: 'preset',
        scenario: scenarioId,
        platforms: scenario.platforms,
        expected: scenario.goals,
      },
      plan_data: {
        preset: scenario,
        readyToUse: true,
      },
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ 
    success: true, 
    data: { 
      plan, 
      scenario,
      nextSteps: [
        '确认预设方案',
        '配置平台账号',
        '一键启动执行',
      ],
    } 
  });
}

// 分析目标
function analyzeGoal(goal: string) {
  // 简单的关键词分析
  const lowerGoal = goal.toLowerCase();
  
  let type = 'growth';
  let timeframe = '30天';
  let targetFollowers = 1000;

  if (lowerGoal.includes('涨粉') || lowerGoal.includes('粉丝')) {
    type = 'growth';
  } else if (lowerGoal.includes('转化') || lowerGoal.includes('销售')) {
    type = 'conversion';
  } else if (lowerGoal.includes('品牌') || lowerGoal.includes('曝光')) {
    type = 'branding';
  }

  // 提取数字
  const numberMatch = goal.match(/(\d+)/);
  if (numberMatch) {
    targetFollowers = parseInt(numberMatch[1]);
  }

  return {
    type,
    timeframe,
    target: {
      followers: targetFollowers,
    },
    expected: {
      views: `${targetFollowers * 100}+`,
      engagement: '5%+',
      followers: `${targetFollowers}+`,
    },
  };
}

// 推荐内容类型
function recommendContentTypes(goalAnalysis: any) {
  const baseTypes = ['short_video', 'image'];
  
  switch (goalAnalysis.type) {
    case 'growth':
      return [...baseTypes, 'trending'];
    case 'conversion':
      return [...baseTypes, 'review', 'tutorial'];
    default:
      return baseTypes;
  }
}

// 推荐主题
function recommendThemes(contentTypes: string[]) {
  const themeMap: Record<string, string[]> = {
    'short_video': ['生活分享', '知识科普', '娱乐搞笑'],
    'image': ['好物分享', '使用教程', '避坑指南'],
    'trending': ['热门话题', '挑战赛', '合拍'],
    'review': ['产品测评', '使用体验', '对比分析'],
    'tutorial': ['操作教程', '技巧分享', '入门指南'],
  };

  const themes = new Set<string>();
  contentTypes.forEach(type => {
    (themeMap[type] || []).forEach(theme => themes.add(theme));
  });

  return Array.from(themes);
}

// 推荐平台
function recommendPlatforms(goalAnalysis: any, currentData: any) {
  const platforms = [
    { id: 'douyin', name: '抖音', icon: '🎬', priority: 1 },
    { id: 'xiaohongshu', name: '小红书', icon: '📖', priority: 2 },
    { id: 'kuaishou', name: '快手', icon: '🎥', priority: 3 },
  ];

  return {
    primary: platforms.slice(0, 2),
    secondary: platforms.slice(2),
    accountStrategy: {
      perPlatform: 2,
      total: 4,
    },
  };
}

// 推荐发布时间
function recommendTiming(platformCombo: any) {
  return {
    bestTimes: [
      { time: '07:00-09:00', reason: '通勤时间' },
      { time: '12:00-14:00', reason: '午休时间' },
      { time: '19:00-23:00', reason: '休闲时间' },
    ],
    frequency: {
      daily: 2,
      weekly: 14,
    },
    platformSpecific: platformCombo.primary.map((p: any) => ({
      platform: p.id,
      times: ['19:00-21:00'],
    })),
  };
}

// 生成里程碑
function generateMilestones(goalAnalysis: any) {
  return [
    { week: 1, goal: '基础建设', tasks: ['账号配置', '内容测试', '数据收集'] },
    { week: 2, goal: '快速增长', tasks: ['优化内容', '增加发布', '互动运营'] },
    { week: 3, goal: '稳定提升', tasks: ['数据分析', '策略调整', '放大效果'] },
    { week: 4, goal: '目标达成', tasks: ['总结复盘', '成果巩固', '后续规划'] },
  ];
}
