/**
 * 平台管理器 - 统一管理所有社交平台
 */

import { PlatformClient, PlatformType, PublishRequest, PublishResult, AnalyticsData, PlatformAccount } from './types';

// 平台客户端映射
const platformClients: Map<PlatformType, PlatformClient> = new Map();

// 注册平台客户端
export function registerPlatform(platform: PlatformType, client: PlatformClient) {
  platformClients.set(platform, client);
  console.log(`[PlatformManager] 已注册平台: ${platform}`);
}

// 获取平台客户端
export function getPlatformClient(platform: PlatformType): PlatformClient | undefined {
  return platformClients.get(platform);
}

// 获取所有已注册的平台
export function getRegisteredPlatforms(): PlatformType[] {
  return Array.from(platformClients.keys());
}

// 发布内容到单个平台
export async function publishToPlatform(
  platform: PlatformType,
  request: PublishRequest
): Promise<PublishResult> {
  const client = getPlatformClient(platform);
  
  if (!client) {
    return {
      success: false,
      platform,
      status: 'failed',
      error: `平台 ${platform} 未注册或不支持`
    };
  }

  try {
    return await client.publish(request);
  } catch (error) {
    console.error(`[PlatformManager] 发布到 ${platform} 失败:`, error);
    return {
      success: false,
      platform,
      status: 'failed',
      error: error instanceof Error ? error.message : '发布失败'
    };
  }
}

// 发布内容到多个平台
export async function publishToMultiplePlatforms(
  platforms: PlatformType[],
  request: PublishRequest
): Promise<Map<PlatformType, PublishResult>> {
  const results = new Map<PlatformType, PublishResult>();
  
  const promises = platforms.map(async (platform) => {
    const result = await publishToPlatform(platform, {
      ...request,
      platform
    });
    results.set(platform, result);
  });

  await Promise.allSettled(promises);
  return results;
}

// 获取单个平台数据
export async function getPlatformAnalytics(
  platform: PlatformType,
  account: PlatformAccount,
  startDate: Date,
  endDate: Date
): Promise<AnalyticsData | null> {
  const client = getPlatformClient(platform);
  
  if (!client || !client.getAnalytics) {
    console.warn(`[PlatformManager] 平台 ${platform} 不支持数据分析`);
    return null;
  }

  try {
    return await client.getAnalytics(account, startDate, endDate);
  } catch (error) {
    console.error(`[PlatformManager] 获取 ${platform} 数据失败:`, error);
    return null;
  }
}

// 获取所有平台数据
export async function getAllPlatformsAnalytics(
  accounts: PlatformAccount[],
  startDate: Date,
  endDate: Date
): Promise<AnalyticsData[]> {
  const results: AnalyticsData[] = [];
  
  const promises = accounts.map(async (account) => {
    const data = await getPlatformAnalytics(
      account.platform as PlatformType,
      account,
      startDate,
      endDate
    );
    if (data) {
      results.push(data);
    }
  });

  await Promise.allSettled(promises);
  return results;
}

// 设置平台代理
export function setPlatformProxy(platform: PlatformType, proxyUrl: string): void {
  const client = getPlatformClient(platform);
  if (client?.setProxy) {
    client.setProxy(proxyUrl);
    console.log(`[PlatformManager] 已为 ${platform} 设置代理: ${proxyUrl}`);
  }
}

// 刷新账号 Token
export async function refreshAccountToken(account: PlatformAccount): Promise<PlatformAccount> {
  const client = getPlatformClient(account.platform as PlatformType);
  
  if (client?.refreshToken) {
    return await client.refreshToken(account);
  }
  
  return account;
}

export default {
  registerPlatform,
  getPlatformClient,
  getRegisteredPlatforms,
  publishToPlatform,
  publishToMultiplePlatforms,
  getPlatformAnalytics,
  getAllPlatformsAnalytics,
  setPlatformProxy,
  refreshAccountToken
};
