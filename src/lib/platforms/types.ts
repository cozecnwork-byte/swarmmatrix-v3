/**
 * 社交平台 API 对接 - 类型定义
 */

// 平台类型
export type PlatformType = 
  | 'tiktok' 
  | 'douyin' 
  | 'xiaohongshu' 
  | 'bilibili' 
  | 'instagram' 
  | 'youtube' 
  | 'twitter' 
  | 'linkedin';

// 内容类型
export type ContentType = 'video' | 'image' | 'text' | 'mixed';

// 发布状态
export type PublishStatus = 'pending' | 'publishing' | 'success' | 'failed';

// 账号状态
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'needs_reauth';

// 基础账号配置
export interface PlatformAccount {
  id: string;
  userId: string;
  platform: PlatformType;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

// 发布请求
export interface PublishRequest {
  accountId: string;
  platform: PlatformType;
  contentType: ContentType;
  title?: string;
  content: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

// 发布结果
export interface PublishResult {
  success: boolean;
  platform: PlatformType;
  postId?: string;
  postUrl?: string;
  status: PublishStatus;
  error?: string;
  publishedAt?: Date;
  metadata?: Record<string, any>;
}

// 数据采集结果
export interface AnalyticsData {
  platform: PlatformType;
  accountId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    impressions?: number;      // 曝光量
    views?: number;            // 观看量
    likes?: number;            // 点赞数
    comments?: number;         // 评论数
    shares?: number;           // 分享数
    saves?: number;            // 收藏数
    clicks?: number;           // 点击数
    followers?: number;        // 粉丝数
    newFollowers?: number;     // 新增粉丝
    engagementRate?: number;   // 互动率
    conversionRate?: number;   // 转化率
  };
  posts?: PostAnalytics[];
  collectedAt: Date;
}

// 单条帖子数据
export interface PostAnalytics {
  postId: string;
  postUrl?: string;
  publishedAt: Date;
  title?: string;
  contentType: ContentType;
  metrics: {
    impressions?: number;
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    clicks?: number;
  };
}

// 平台接口
export interface PlatformClient {
  // 平台类型
  readonly platform: PlatformType;
  readonly platformName: string;

  // 认证相关
  refreshToken?(account: PlatformAccount): Promise<PlatformAccount>;
  revokeAccess?(account: PlatformAccount): Promise<void>;

  // 内容发布
  publish(request: PublishRequest): Promise<PublishResult>;
  publishBatch?(requests: PublishRequest[]): Promise<PublishResult[]>;

  // 内容管理
  deletePost?(account: PlatformAccount, postId: string): Promise<boolean>;
  getPost?(account: PlatformAccount, postId: string): Promise<any>;

  // 数据采集
  getAnalytics?(
    account: PlatformAccount, 
    startDate: Date, 
    endDate: Date
  ): Promise<AnalyticsData>;
  
  getPostAnalytics?(
    account: PlatformAccount,
    postId: string
  ): Promise<PostAnalytics>;

  // 账号信息
  getAccountInfo?(account: PlatformAccount): Promise<{
    username: string;
    displayName?: string;
    avatarUrl?: string;
    followers?: number;
    following?: number;
    posts?: number;
  }>;

  // 代理支持
  setProxy?(proxyUrl: string): void;
}
