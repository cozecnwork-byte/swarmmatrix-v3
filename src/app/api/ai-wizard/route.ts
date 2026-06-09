import { NextRequest, NextResponse } from 'next/server';

// 模拟项目存储（实际项目中应使用数据库）
let projects: Record<string, any> = {};
let projectIdCounter = 1;

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

    switch (action) {
      case 'initializeWizard':
        return await initializeWizard(userId, data);
      case 'updateStep':
        return await updateStep(userId, data);
      case 'startProject':
        return await startProject(userId, data);
      case 'oneClickOptimize':
        return await oneClickOptimize(userId, data);
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
async function initializeWizard(userId: string, data: any) {
  const { projectName, description } = data;

  if (!projectName) {
    return NextResponse.json({
      success: false,
      error: '项目名称不能为空'
    }, { status: 400 });
  }

  // 生成AI推荐
  const recommendations = await generateGlobalRecommendations(data, 1);

  // 创建项目（使用内存存储）
  const projectId = `proj_${projectIdCounter++}`;
  projects[projectId] = {
    id: projectId,
    user_id: userId,
    project_name: projectName,
    description: description,
    current_step: 1,
    step_data: { 1: data },
    status: 'in_progress',
    recommendations: recommendations,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: {
      id: projectId,
      recommendations,
    }
  });
}

// 更新步骤
async function updateStep(userId: string, data: any) {
  const { projectId, step, stepData } = data;

  // 获取项目
  const project = projects[projectId];
  if (!project) {
    return NextResponse.json({
      success: false,
      error: '项目不存在'
    }, { status: 404 });
  }

  // 生成该步骤的AI推荐
  const recommendations = await generateGlobalRecommendations(
    { ...project.step_data, [step]: stepData },
    step
  );

  // 更新项目
  project.step_data = { ...project.step_data, [step]: stepData };
  project.current_step = Math.min(step + 1, 7);
  project.recommendations = { ...project.recommendations, ...recommendations };
  project.updated_at = new Date().toISOString();

  return NextResponse.json({
    success: true,
    data: {
      recommendations,
    }
  });
}

// 启动项目
async function startProject(userId: string, data: any) {
  const { projectId } = data;

  // 获取项目
  const project = projects[projectId];
  if (!project) {
    return NextResponse.json({
      success: false,
      error: '项目不存在'
    }, { status: 404 });
  }

  // 更新项目状态
  project.status = 'completed';
  project.completed_at = new Date().toISOString();
  project.updated_at = new Date().toISOString();

  return NextResponse.json({
    success: true,
    data: {
      taskId: `task_${Date.now()}`,
      result: {
        message: '项目已成功启动！引流方案开始执行...',
        projectData: project.step_data,
      }
    }
  });
}

// 一键优化+智能匹配
async function oneClickOptimize(userId: string, data: any) {
  const { simpleInput } = data;

  if (!simpleInput) {
    return NextResponse.json({
      success: false,
      error: '请输入简单描述'
    }, { status: 400 });
  }

  // AI智能分析和优化
  const optimizedData = await analyzeAndOptimize(simpleInput);

  return NextResponse.json({
    success: true,
    data: optimizedData
  });
}

// AI智能分析和优化
async function analyzeAndOptimize(simpleInput: string) {
  // 这里模拟AI分析，实际项目中应调用真实的LLM API
  // 基于用户的简单输入，智能生成完整的项目配置

  const inputLower = simpleInput.toLowerCase();
  
  // 智能识别产品类型
  let productType = 'general';
  if (inputLower.includes('数码') || inputLower.includes('电子') || inputLower.includes('手机') || inputLower.includes('电脑')) {
    productType = 'digital';
  } else if (inputLower.includes('美妆') || inputLower.includes('护肤') || inputLower.includes('化妆品')) {
    productType = 'beauty';
  } else if (inputLower.includes('服装') || inputLower.includes('时尚') || inputLower.includes('衣服')) {
    productType = 'fashion';
  } else if (inputLower.includes('游戏') || inputLower.includes('手游') || inputLower.includes('app')) {
    productType = 'game';
  } else if (inputLower.includes('教育') || inputLower.includes('课程') || inputLower.includes('培训')) {
    productType = 'education';
  }

  // 智能推荐目标国家
  let countries = ['US', 'GB', 'CA', 'AU']; // 英语国家
  if (inputLower.includes('中国') || inputLower.includes('中文') || inputLower.includes('国内')) {
    countries = ['CN'];
  } else if (inputLower.includes('东南亚') || inputLower.includes('新加坡') || inputLower.includes('马来')) {
    countries = ['SG', 'MY', 'ID', 'TH', 'PH'];
  } else if (inputLower.includes('欧洲') || inputLower.includes('欧盟')) {
    countries = ['DE', 'FR', 'ES', 'IT', 'NL'];
  }

  // 智能推荐目标人群
  let audienceGroups = ['young_adults'];
  if (productType === 'beauty' || productType === 'fashion') {
    audienceGroups = ['young_adults', 'women'];
  } else if (productType === 'game') {
    audienceGroups = ['young_adults', 'men', 'teens'];
  } else if (productType === 'education') {
    audienceGroups = ['parents', 'professionals', 'students'];
  }

  // 智能推荐平台
  let platforms = ['TikTok', 'Instagram', 'YouTube'];
  if (countries.includes('CN')) {
    platforms = ['抖音', '小红书', 'B站'];
  } else if (productType === 'education' || productType === 'digital') {
    platforms = ['YouTube', 'TikTok', 'LinkedIn', 'Twitter/X'];
  }

  // 智能生成项目名称
  const projectName = simpleInput.length > 20 
    ? simpleInput.substring(0, 20) + '...推广计划' 
    : simpleInput + '全球推广计划';

  // 智能生成内容策略
  let contentStrategy = 'micro';
  if (productType === 'digital' || productType === 'education') {
    contentStrategy = 'brand';
  } else if (productType === 'beauty' || productType === 'fashion') {
    contentStrategy = 'kol';
  } else if (countries.length > 3) {
    contentStrategy = 'mixed';
  }

  return {
    // 步骤1: 项目信息
    projectName: projectName,
    description: simpleInput,
    
    // 步骤2: 产品信息
    productName: simpleInput,
    productSellingPoints: generateSellingPoints(productType, simpleInput),
    
    // 步骤3: 目标客户
    countries: countries,
    audienceGroups: audienceGroups,
    languages: countries.includes('CN') ? ['zh-CN'] : ['en-US'],
    
    // 步骤4: 内容策略
    contentStrategy: contentStrategy,
    contentTypes: ['short_video', 'carousel', 'live'],
    postingFrequency: 'daily',
    
    // 步骤5: 平台选择
    platforms: platforms,
    platformCombinations: [platforms],
    
    // 步骤6: 账号配置
    mainAccounts: Math.min(30, Math.max(10, platforms.length * 6)),
    backupAccounts: Math.min(20, Math.max(5, platforms.length * 4)),
    
    // 智能分析说明
    analysis: {
      productType: productType,
      confidence: 'high',
      reasoning: `基于您的输入"${simpleInput}"，AI智能识别为${getProductTypeName(productType)}产品，推荐了最合适的目标市场、平台和内容策略。`,
    }
  };
}

function getProductTypeName(type: string) {
  const names: Record<string, string> = {
    digital: '数码电子',
    beauty: '美妆护肤',
    fashion: '时尚服装',
    game: '游戏应用',
    education: '教育培训',
    general: '通用',
  };
  return names[type] || '通用';
}

function generateSellingPoints(productType: string, input: string) {
  const points = {
    digital: [
      '品质卓越，性能强劲',
      '设计时尚，携带便捷',
      '价格合理，性价比高',
      '售后服务完善',
      '用户口碑极佳'
    ],
    beauty: [
      '天然成分，温和不刺激',
      '效果显著，看得见的改变',
      '适合各种肤质',
      '专业品牌，值得信赖',
      '用户好评如潮'
    ],
    fashion: [
      '潮流设计，时尚前沿',
      '舒适面料，穿着自在',
      '尺码齐全，适合各种身形',
      '做工精细，品质保证',
      '性价比超高'
    ],
    game: [
      '玩法创新，趣味十足',
      '画面精美，视觉震撼',
      '操作简单，容易上手',
      '社交互动，乐趣倍增',
      '持续更新，内容丰富'
    ],
    education: [
      '内容专业，知识系统',
      '名师讲解，通俗易懂',
      '学习灵活，随时随地',
      '效果显著，快速提升',
      '价格实惠，物超所值'
    ],
    general: [
      '产品品质优异',
      '价格竞争力强',
      '用户体验优秀',
      '售后服务完善',
      '市场口碑良好'
    ]
  };
  return points[productType as keyof typeof points] || points.general;
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
  const baseName = data.projectName || '项目';
  return [
    `${baseName}全球推广计划`,
    `${baseName}国际市场拓展`,
    `${baseName}多渠道引流矩阵`,
    `${baseName}环球市场渗透方案`,
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
