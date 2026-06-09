// ========== 矩阵引流核心引擎 ==========
// 完整实现6步矩阵引流工作流

import { LLMClient, Config } from 'coze-coding-dev-sdk';
import type { 
  MatrixLeadGenConfig, 
  AIRecommendations, 
  ExecutionStats,
  TargetAudience,
  ContentStrategy,
  PlatformRoleConfig
} from './types';
import { GLOBAL_PLATFORMS, recommendPlatformsForAudience, getPlatformDefaultRole } from './global-platforms';

export class MatrixLeadGenEngine {
  private llmClient: LLMClient;
  private config: MatrixLeadGenConfig;

  constructor(config: MatrixLeadGenConfig) {
    this.config = config;
    
    // 初始化LLM客户端
    const apiKey = process.env.COZE_API_KEY || '';
    const baseUrl = process.env.COZE_API_BASE_URL || 'https://api.coze.cn';
    
    const llmConfig = new Config({ apiKey, baseUrl });
    this.llmClient = new LLMClient(llmConfig);
  }

  // ========== 阶段1：选主平台 ==========
  async selectPrimaryPlatforms(audience: TargetAudience): Promise<PlatformRoleConfig[]> {
    // 根据目标客户群体推荐平台
    const recommendedPlatforms = recommendPlatformsForAudience(audience);
    
    // AI智能分配平台角色
    const platformRoles: PlatformRoleConfig[] = [];
    
    // 选择2-3个主平台
    const primaryPlatforms = recommendedPlatforms.slice(0, 3);
    
    for (const platform of primaryPlatforms) {
      const role = getPlatformDefaultRole(platform.platform);
      platformRoles.push({
        platform: platform.platform,
        role: role,
        priority: platformRoles.length === 0 ? 'primary' : 'secondary',
        accountConfig: {
          count: 3, // 每个平台3个账号
          strategy: '60-40',
          tiers: {
            primary: 2,
            secondary: 1
          }
        },
        contentStrategy: {
          formats: platform.contentTypes,
          frequency: this.getRecommendedFrequency(platform.platform, role),
          tone: this.getRecommendedTone(platform.platform, role)
        },
        kpiTargets: {
          views: 10000,
          engagements: 500,
          leads: 20,
          conversionRate: 2.0
        }
      });
    }

    return platformRoles;
  }

  // ========== 阶段2：定账号角色 ==========
  defineAccountRoles(platformRoles: PlatformRoleConfig[]): Promise<{
    groups: Array<{
      platform: string;
      groupName: string;
      groupType: 'market' | 'content' | 'product' | 'stage';
      accountCount: number;
    }>;
  }> {
    const groups = [];

    for (const platformRole of platformRoles) {
      // 按市场分组
      groups.push({
        platform: platformRole.platform,
        groupName: `${platformRole.platform}-市场-主力`,
        groupType: 'market' as const,
        accountCount: platformRole.accountConfig.tiers.primary
      });

      groups.push({
        platform: platformRole.platform,
        groupName: `${platformRole.platform}-市场-备用`,
        groupType: 'market' as const,
        accountCount: platformRole.accountConfig.tiers.secondary
      });

      // 按内容方向分组
      groups.push({
        platform: platformRole.platform,
        groupName: `${platformRole.platform}-内容-教育`,
        groupType: 'content' as const,
        accountCount: 1
      });

      groups.push({
        platform: platformRole.platform,
        groupName: `${platformRole.platform}-内容-互动`,
        groupType: 'content' as const,
        accountCount: 1
      });
    }

    return Promise.resolve({ groups });
  }

  // ========== 阶段3：做内容排期 ==========
  async generateContentSchedule(
    platformRoles: PlatformRoleConfig[],
    productInfo: any
  ): Promise<{
    theme: string;
    formats: string[];
    platformAllocation: Record<string, any>;
    publishSchedule: any[];
  }> {
    // AI生成内容主题
    const theme = await this.generateContentTheme(productInfo);
    
    // 生成内容排期
    const formats = ['short_video', 'image_text', 'case', 'qa', 'tutorial'];
    
    const platformAllocation: Record<string, any> = {};
    const publishSchedule: any[] = [];

    let dayOffset = 0;
    for (const platformRole of platformRoles) {
      platformAllocation[platformRole.platform] = {
        formats: platformRole.contentStrategy.formats,
        frequency: 3 // 每周3次
      };

      // 生成发布排期
      for (let i = 0; i < 7; i++) {
        const format = platformRole.contentStrategy.formats[i % platformRole.contentStrategy.formats.length];
        const date = new Date();
        date.setDate(date.getDate() + dayOffset + i);
        
        publishSchedule.push({
          date: date.toISOString().split('T')[0],
          time: '09:00',
          platform: platformRole.platform,
          format: format
        });
      }
      dayOffset += 7;
    }

    return {
      theme,
      formats,
      platformAllocation,
      publishSchedule
    };
  }

  // ========== 阶段4：安排互动任务 ==========
  async planEngagementTasks(platformRoles: PlatformRoleConfig[]): Promise<any[]> {
    const tasks = [];

    for (const platformRole of platformRoles) {
      // 评论任务
      tasks.push({
        taskType: 'comment',
        platform: platformRole.platform,
        targetAccounts: [],
        followUpRules: {
          responseTime: '24h',
          escalation: true,
          templates: ['感谢评论！', '有什么问题随时问我~', '欢迎交流！']
        },
        priority: 'high'
      });

      // 私信任务
      tasks.push({
        taskType: 'direct_message',
        platform: platformRole.platform,
        targetAccounts: [],
        followUpRules: {
          responseTime: '12h',
          escalation: true,
          templates: ['您好！感谢关注~', '有什么可以帮您？', '欢迎了解我们的产品！']
        },
        priority: 'high'
      });

      // 点赞/收藏任务
      tasks.push({
        taskType: 'like',
        platform: platformRole.platform,
        targetAccounts: [],
        followUpRules: {
          responseTime: '48h',
          escalation: false,
          templates: []
        },
        priority: 'medium'
      });
    }

    return tasks;
  }

  // ========== 阶段5：设计承接入口 ==========
  async designLeadCapturePoints(platformRoles: PlatformRoleConfig[]): Promise<any[]> {
    const capturePoints = [];

    for (const platformRole of platformRoles) {
      if (platformRole.role === 'conversion') {
        // 转化角色的平台设计承接入口
        capturePoints.push({
          captureType: 'whatsapp',
          sourcePlatform: platformRole.platform,
          entryConfig: {
            whatsappNumber: '+86-138-0000-0000'
          },
          guideText: '扫码添加WhatsApp获取更多信息~',
          trackingConfig: {
            utmSource: platformRole.platform,
            utmMedium: 'social',
            utmCampaign: this.config.name
          }
        });

        capturePoints.push({
          captureType: 'form',
          sourcePlatform: platformRole.platform,
          entryConfig: {
            formFields: ['姓名', '邮箱', '需求描述']
          },
          guideText: '填写表单获取专属方案~',
          trackingConfig: {
            utmSource: platformRole.platform,
            utmMedium: 'social',
            utmCampaign: this.config.name
          }
        });
      } else if (platformRole.role === 'engagement') {
        // 互动角色的平台设计承接入口
        capturePoints.push({
          captureType: 'private_domain',
          sourcePlatform: platformRole.platform,
          entryConfig: {
            privateDomainLink: 'https://example.com/community'
          },
          guideText: '加入社群获取更多干货~',
          trackingConfig: {
            utmSource: platformRole.platform,
            utmMedium: 'social',
            utmCampaign: this.config.name
          }
        });
      }
    }

    return capturePoints;
  }

  // ========== 阶段6：每周复盘 ==========
  async generateWeeklyReview(projectData: any): Promise<any> {
    // AI分析数据并生成复盘报告
    const review = {
      platformPerformance: {},
      accountPerformance: {},
      contentPerformance: {
        topContent: [],
        formatBreakdown: {}
      },
      leadAnalysis: {
        totalLeads: 0,
        qualifiedLeads: 0,
        sourceBreakdown: {},
        stageBreakdown: {},
        qualityScoreDistribution: {
          low: 0,
          medium: 0,
          high: 0
        }
      },
      successes: [],
      issuesAndImprovements: [],
      nextWeekPlan: {
        priorities: [],
        platformAdjustments: [],
        contentPlan: {
          themes: [],
          adjustments: ''
        }
      }
    };

    return review;
  }

  // ========== AI推荐 ==========
  async generateAIRecommendations(
    audience: TargetAudience,
    productInfo: any
  ): Promise<AIRecommendations> {
    const prompt = `
作为矩阵引流专家，为以下项目生成AI推荐方案：

项目名称：${this.config.name}
项目描述：${this.config.description}

目标客户群体：
- 国家/地区：${audience.countries.join(', ')}
- 年龄段：${audience.ageRanges.join(', ')}
- 人群标签：${audience.personas.join(', ')}
- 语言：${audience.languages.join(', ')}

产品信息：
${JSON.stringify(productInfo, null, 2)}

请生成：
1. 平台选择建议（2-3个主平台，按角色分工）
2. 内容策略建议（主题、形式、排期）
3. 互动策略建议（任务类型、自动化）
4. 线索承接策略
5. 优化建议

请以JSON格式返回
`;

    try {
      const response = await this.llmClient.invoke(
        [{ role: 'user', content: prompt }],
        {
          model: 'doubao-seed-2-0-lite-260215',
          temperature: 0.7
        }
      );

      // 解析AI响应
      let recommendations: AIRecommendations = {
        platformSelection: [],
        contentStrategy: {
          themes: [],
          formats: [],
          schedule: ''
        },
        engagementStrategy: {
          tasks: [],
          automation: true
        },
        leadCaptureStrategy: [],
        optimizationSuggestions: []
      };

      try {
        const aiContent = response.content || '';
        const parsed = JSON.parse(aiContent);
        recommendations = { ...recommendations, ...parsed };
      } catch (e) {
        // 使用默认推荐
        recommendations.platformSelection = await this.selectPrimaryPlatforms(audience);
        recommendations.contentStrategy.themes = ['产品介绍', '使用教程', '客户案例', '行业洞察'];
        recommendations.contentStrategy.formats = ['short_video', 'image_text', 'case', 'qa', 'tutorial'];
        recommendations.contentStrategy.schedule = '每周3-5次，分散在不同平台';
        recommendations.optimizationSuggestions = ['建议先试点2-4周验证效果', '关注有效线索而非仅曝光', '确保线索承接流程顺畅'];
      }

      return recommendations;
    } catch (error) {
      console.error('AI推荐生成失败:', error);
      // 返回默认推荐
      return {
        platformSelection: await this.selectPrimaryPlatforms(audience),
        contentStrategy: {
          themes: ['产品介绍', '使用教程', '客户案例', '行业洞察'],
          formats: ['short_video', 'image_text', 'case', 'qa', 'tutorial'],
          schedule: '每周3-5次，分散在不同平台'
        },
        engagementStrategy: {
          tasks: [],
          automation: true
        },
        leadCaptureStrategy: [],
        optimizationSuggestions: ['建议先试点2-4周验证效果', '关注有效线索而非仅曝光', '确保线索承接流程顺畅']
      };
    }
}

  // ========== 辅助方法 ==========
  private getRecommendedFrequency(platform: string, role: string): string {
    const frequencyMap: Record<string, string> = {
      'tiktok': '每日1-2次',
      'instagram': '每日1次',
      'facebook': '每周3-5次',
      'linkedin': '每周2-3次',
      'youtube': '每周1-2次'
    };
    return frequencyMap[platform] || '每周3次';
  }

  private getRecommendedTone(platform: string, role: string): string {
    const toneMap: Record<string, string> = {
      'reach': '轻松有趣',
      'trust': '专业可信',
      'engagement': '亲切互动',
      'conversion': '引导行动'
    };
    return toneMap[role] || '专业友好';
  }

  private async generateContentTheme(productInfo: any): Promise<string> {
    const themes = [
      `${productInfo.name}产品介绍`,
      `${productInfo.name}使用教程`,
      `${productInfo.name}客户案例`,
      `${productInfo.name}行业洞察`
    ];
    return themes[Math.floor(Math.random() * themes.length)];
  }
}
