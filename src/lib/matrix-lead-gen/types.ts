// ========== 矩阵引流类型定义 ==========

// 平台类型
export type Platform = 
  | 'tiktok' 
  | 'instagram' 
  | 'facebook' 
  | 'linkedin' 
  | 'youtube' 
  | 'twitter' 
  | 'xiaohongshu' 
  | 'bilibili' 
  | 'douyin' 
  | 'kuaishou' 
  | 'wechat' 
  | 'whatsapp' 
  | 'other';

// 平台角色
export type PlatformRoleType = 'reach' | 'trust' | 'engagement' | 'conversion';

// 账号分组类型
export type AccountGroupType = 'market' | 'content' | 'product' | 'stage';

// 内容形式
export type ContentFormat = 'short_video' | 'image_text' | 'case' | 'qa' | 'tutorial' | 'live' | 'article';

// 互动任务类型
export type EngagementTaskType = 'comment' | 'direct_message' | 'like' | 'share' | 'collect' | 'follow';

// 线索承接类型
export type LeadCaptureType = 'form' | 'whatsapp' | 'private_domain' | 'crm' | 'consultation' | 'email';

// 线索阶段
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'closing' | 'won' | 'lost';

// 项目状态
export type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed' | 'reviewing';

// 平台角色配置
export interface PlatformRoleConfig {
  platform: Platform;
  role: PlatformRoleType;
  priority: 'primary' | 'secondary';
  accountConfig: {
    count: number;
    strategy: '60-40' | '50-50' | 'custom'; // 60%主力 + 40%备用
    tiers: {
      primary: number;
      secondary: number;
    };
  };
  contentStrategy: {
    formats: ContentFormat[];
    frequency: string; // 发布频率
    tone: string; // 内容调性
  };
  kpiTargets: {
    views?: number;
    engagements?: number;
    leads?: number;
    conversionRate?: number;
  };
}

// 内容排期配置
export interface ContentScheduleConfig {
  theme: string;
  formats: ContentFormat[];
  platformAllocation: Record<Platform, {
    formats: ContentFormat[];
    frequency: number; // 每周发布次数
  }>;
  publishSchedule: {
    date: string;
    time: string;
    platform: Platform;
    format: ContentFormat;
  }[];
  materials: {
    type: string;
    url?: string;
    description: string;
  }[];
}

// 互动任务配置
export interface EngagementTaskConfig {
  taskType: EngagementTaskType;
  platform: Platform;
  targetAccounts: string[];
  followUpRules: {
    responseTime: string; // 响应时间要求
    escalation: boolean; // 是否升级
    templates: string[];
  };
  priority: 'high' | 'medium' | 'low';
}

// 线索承接配置
export interface LeadCaptureConfig {
  captureType: LeadCaptureType;
  sourcePlatform: Platform;
  entryConfig: {
    url?: string;
    formFields?: string[];
    whatsappNumber?: string;
    privateDomainLink?: string;
  };
  guideText: string;
  trackingConfig: {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  };
}

// 项目配置
export interface MatrixLeadGenConfig {
  projectId: string;
  userId: string;
  name: string;
  description: string;
  isPilot: boolean;
  pilotPeriodDays: number;
  // 试点验证项
  pilotItems: {
    platformCombination: boolean;
    contentRhythm: boolean;
    engagementCapture: boolean;
    dataReview: boolean;
    scaleConditions: boolean;
  };
}

// 执行统计
export interface ExecutionStats {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  platformStats: Record<Platform, {
    views: number;
    engagements: number;
    leads: number;
  }>;
}

// AI推荐
export interface AIRecommendations {
  platformSelection: PlatformRoleConfig[];
  contentStrategy: {
    themes: string[];
    formats: ContentFormat[];
    schedule: string;
  };
  engagementStrategy: {
    tasks: EngagementTaskConfig[];
    automation: boolean;
  };
  leadCaptureStrategy: LeadCaptureConfig[];
  optimizationSuggestions: string[];
}

// 周复盘数据
export interface WeeklyReviewData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  platformPerformance: Record<Platform, {
    views: number;
    engagements: number;
    leads: number;
    conversionRate: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  accountPerformance: Record<string, {
    platform: Platform;
    views: number;
    engagements: number;
    leads: number;
  }>;
  contentPerformance: {
    topContent: Array<{
      id: string;
      platform: Platform;
      format: ContentFormat;
      views: number;
      engagements: number;
      leads: number;
    }>;
    formatBreakdown: Record<ContentFormat, {
      count: number;
      avgViews: number;
      avgEngagements: number;
    }>;
  };
  leadAnalysis: {
    totalLeads: number;
    qualifiedLeads: number;
    sourceBreakdown: Record<Platform, number>;
    stageBreakdown: Record<LeadStage, number>;
    qualityScoreDistribution: {
      low: number;
      medium: number;
      high: number;
    };
  };
  successes: Array<{
    type: string;
    description: string;
    impact: string;
  }>;
  issuesAndImprovements: Array<{
    issue: string;
    severity: 'high' | 'medium' | 'low';
    suggestedFix: string;
  }>;
  nextWeekPlan: {
    priorities: string[];
    platformAdjustments: Array<{
      platform: Platform;
      adjustment: string;
    }>;
    contentPlan: {
      themes: string[];
      adjustments: string;
    };
  };
}

// 试点验证项
export interface PilotValidationItem {
  item: string;
  goal: string;
  passed: boolean | null;
  results?: any;
  fixSuggestions?: string;
}

// 全球平台数据
export interface GlobalPlatformData {
  platform: Platform;
  name: string;
  regions: string[];
  primaryAudience: string[];
  contentTypes: ContentFormat[];
  strengths: string[];
  recommendedRole: PlatformRoleType;
}

// 目标客户群体
export interface TargetAudience {
  countries: string[];
  ageRanges: string[];
  personas: string[];
  languages: string[];
}

// 内容策略
export interface ContentStrategy {
  approach: 'kol' | 'brand_account' | 'small_account' | 'mixed';
  contentMix: {
    educational: number;
    promotional: number;
    engaging: number;
    userGenerated: number;
  };
  platformAdaptation: Record<Platform, {
    tone: string;
    format: ContentFormat;
    frequency: string;
  }>;
}
