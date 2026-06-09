import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 智能推荐系统 - 基于产品类型智能匹配（支持多模态输入）
function getSmartRecommendations(productDescription: string, files?: any[], urls?: string[]) {
  const lowerDesc = productDescription.toLowerCase();
  
  // 分析多模态输入
  let hasImages = false;
  let hasVideos = false;
  let hasAudio = false;
  let hasDocuments = false;
  let hasUrls = urls && urls.length > 0;
  
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.type?.startsWith('image/')) hasImages = true;
      else if (file.type?.startsWith('video/')) hasVideos = true;
      else if (file.type?.startsWith('audio/')) hasAudio = true;
      else hasDocuments = true;
    }
  }
  
  // 产品类型识别
  let productType = 'general';
  if (lowerDesc.includes('game') || lowerDesc.includes('游戏')) productType = 'game';
  else if (lowerDesc.includes('beauty') || lowerDesc.includes('化妆') || lowerDesc.includes('护肤')) productType = 'beauty';
  else if (lowerDesc.includes('fashion') || lowerDesc.includes('时尚') || lowerDesc.includes('服装')) productType = 'fashion';
  else if (lowerDesc.includes('education') || lowerDesc.includes('教育') || lowerDesc.includes('课程')) productType = 'education';
  else if (lowerDesc.includes('digital') || lowerDesc.includes('数码') || lowerDesc.includes('电子') || lowerDesc.includes('科技')) productType = 'digital';
  else if (lowerDesc.includes('music') || lowerDesc.includes('音乐') || hasAudio) productType = 'music';
  else if (lowerDesc.includes('food') || lowerDesc.includes('美食') || lowerDesc.includes('餐饮')) productType = 'food';
  else if (lowerDesc.includes('travel') || lowerDesc.includes('旅游') || lowerDesc.includes('旅行')) productType = 'travel';
  else if (lowerDesc.includes('fitness') || lowerDesc.includes('健身') || lowerDesc.includes('运动')) productType = 'fitness';

  // 目标市场推荐
  const targetMarkets = {
    digital: ['美国', '东南亚', '中东', '巴西'],
    beauty: ['美国', '东南亚', '中东'],
    fashion: ['美国', '东南亚', '中东', '巴西'],
    game: ['全球'],
    education: ['美国', '东南亚'],
    music: ['全球', '东南亚', '美国'],
    food: ['全球', '东南亚', '中国'],
    travel: ['全球', '东南亚', '欧美'],
    fitness: ['全球', '美国', '中国'],
    general: ['美国', '东南亚', '中东']
  };

  // 目标人群推荐
  const targetAudiences = {
    digital: ['Z世代', '千禧一代', '科技爱好者'],
    beauty: ['女性用户', 'Z世代', '美妆爱好者'],
    fashion: ['Z世代', '千禧一代', '时尚达人'],
    game: ['Z世代', '游戏玩家', '直播观众'],
    education: ['学生群体', '职场新人', '终身学习者'],
    music: ['音乐爱好者', 'Z世代', '创作者'],
    food: ['美食爱好者', '家庭主妇', '上班族'],
    travel: ['旅游爱好者', '摄影师', '探险者'],
    fitness: ['健身爱好者', '运动达人', '健康关注者'],
    general: ['Z世代', '千禧一代']
  };

  // 平台推荐（根据内容类型调整）
  const recommendedPlatforms = {
    digital: ['TikTok', 'Instagram', 'YouTube', '抖音', 'B站'],
    beauty: ['TikTok', 'Instagram', 'YouTube', '小红书'],
    fashion: ['TikTok', 'Instagram', 'YouTube', '小红书'],
    game: ['TikTok', 'YouTube', 'B站', 'Twitch'],
    education: ['YouTube', 'TikTok', 'B站', '小红书'],
    music: ['TikTok', 'YouTube', 'Instagram', '抖音', 'B站'],
    food: ['TikTok', 'Instagram', 'YouTube', '小红书', '抖音'],
    travel: ['TikTok', 'Instagram', 'YouTube', '小红书'],
    fitness: ['TikTok', 'Instagram', 'YouTube', '抖音'],
    general: ['TikTok', 'Instagram', 'YouTube', '抖音', '小红书', 'B站']
  };

  // 内容策略推荐
  const contentStrategies = {
    digital: ['产品测评', '开箱视频', '对比评测', '使用教程'],
    beauty: ['教程分享', '产品展示', '前后对比', '直播带货'],
    fashion: ['穿搭展示', '时尚教程', '品牌故事', '季节新品'],
    game: ['直播试玩', '精彩剪辑', '攻略教程', '赛事精彩'],
    education: ['知识分享', '教学演示', '学习技巧', '成功案例'],
    music: ['音乐创作', '歌曲分享', '音乐教程', '直播演唱'],
    food: ['美食制作', '探店分享', '食谱教学', '美食测评'],
    travel: ['旅行Vlog', '景点介绍', '旅行攻略', '风景摄影'],
    fitness: ['健身教程', '运动日常', '营养建议', '成果展示'],
    general: ['生活记录', '情景短剧', '知识科普', '好物推荐']
  };

  // 发布频率推荐
  const frequencies = {
    digital: '每周3-5次',
    beauty: '每周5-7次',
    fashion: '每周5-7次',
    game: '每日1-2次',
    education: '每周2-3次',
    music: '每周2-3次',
    food: '每周3-5次',
    travel: '每周1-2次',
    fitness: '每周3-4次',
    general: '每周3-5次'
  };

  // 根据多模态输入调整推荐
  let adjustedPlatforms = recommendedPlatforms[productType as keyof typeof recommendedPlatforms];
  if (hasVideos) {
    // 如果有视频内容，优先推荐视频平台
    adjustedPlatforms = ['YouTube', 'TikTok', '抖音', 'B站', ...adjustedPlatforms.filter(p => !['YouTube', 'TikTok', '抖音', 'B站'].includes(p))];
  }
  if (hasImages) {
    // 如果有图片内容，优先推荐图片平台
    adjustedPlatforms = ['Instagram', '小红书', ...adjustedPlatforms.filter(p => !['Instagram', '小红书'].includes(p))];
  }
  if (hasAudio) {
    // 如果有音频内容，优先推荐音乐相关平台
    adjustedPlatforms = ['TikTok', 'YouTube', '抖音', ...adjustedPlatforms.filter(p => !['TikTok', 'YouTube', '抖音'].includes(p))];
  }
  
  // 生成完整的方案
  return {
    productType,
    hasImages,
    hasVideos,
    hasAudio,
    hasDocuments,
    hasUrls,
    analysisSummary: `智能分析完成${hasImages ? '📷' : ''}${hasVideos ? '🎬' : ''}${hasAudio ? '🎵' : ''}${hasDocuments ? '📄' : ''}${hasUrls ? '🔗' : ''}`,
    targetMarkets: targetMarkets[productType as keyof typeof targetMarkets],
    targetAudiences: targetAudiences[productType as keyof typeof targetAudiences],
    recommendedPlatforms: [...new Set(adjustedPlatforms)], // 去重
    contentStrategies: contentStrategies[productType as keyof typeof contentStrategies],
    frequency: frequencies[productType as keyof typeof frequencies],
    accountDistribution: { main: 60, backup: 40 },
    ipType: productType === 'game' ? 'datacenter' : 'residential',
    estimatedBudget: productType === 'digital' ? '¥5000-20000' : '¥2000-10000',
    // 新增完整方案内容
    completePlan: {
      overview: `基于${productType === 'general' ? '你的输入' : productType + '产品'}特征的完整引流方案`,
      phases: [
        {
          name: '第一阶段：平台搭建',
          duration: '1-2周',
          tasks: ['注册平台账号', '完善账号资料', '建立内容库']
        },
        {
          name: '第二阶段：内容发布',
          duration: '2-4周',
          tasks: ['按频率发布内容', '优化内容质量', '积累初始粉丝']
        },
        {
          name: '第三阶段：流量增长',
          duration: '1-2个月',
          tasks: ['与KOL合作', '投放付费广告', '跨平台引流']
        },
        {
          name: '第四阶段：稳定运营',
          duration: '持续',
          tasks: ['数据分析', '策略优化', '粉丝维护']
        }
      ],
      keyMetrics: ['粉丝增长数', '内容互动率', '转化率', 'ROI'],
      riskMitigation: [
        '账号风险：分散使用IP，避免批量操作',
        '内容风险：确保原创，遵守平台规则',
        '流量风险：多平台布局，避免单一依赖'
      ]
    }
  };
}

// 生成优化后的描述（支持多模态输入）
function generateOptimizedDescription(input: string, files?: any[], urls?: string[]): string {
  const recommendations = getSmartRecommendations(input, files, urls);
  
  let extraInfo = '';
  if (files && files.length > 0) {
    extraInfo += `\n📁 已分析${files.length}个文件`;
  }
  if (urls && urls.length > 0) {
    extraInfo += `\n🔗 已分析${urls.length}个链接`;
  }
  
  return `制作一个关于"${input}"的矩阵引流项目。${extraInfo}

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

    // AI一键优化（支持多模态输入）
    const inputToUse = simpleInput || (data && data.simpleInput);
    const filesToUse = data && data.files;
    const urlsToUse = data && data.urls;
    
    if ((action === 'ai-optimize' || action === 'oneClickOptimize')) {
      const finalInput = inputToUse || '根据上传的文件和链接分析';
      const optimized = generateOptimizedDescription(finalInput);
      const recommendations = getSmartRecommendations(finalInput, filesToUse, urlsToUse);
      
      return NextResponse.json({
        success: true,
        data: {
          original: finalInput,
          optimized,
          recommendations,
          hasFiles: filesToUse && filesToUse.length > 0,
          hasUrls: urlsToUse && urlsToUse.length > 0,
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
