/**
 * 数据采集器 - 从各平台采集实时数据
 */

import { getSupabaseClient } from '@/storage/database/supabase-client';
import { PlatformManager, getRegisteredPlatforms, AnalyticsData, PlatformAccount } from '@/lib/platforms';

/**
 * 数据采集器
 */
export class DataCollector {
  private supabase: any;

  constructor() {
    this.supabase = getSupabaseClient();
  }

  /**
   * 采集单个账号的数据
   */
  async collectAccountData(
    account: PlatformAccount,
    startDate?: Date,
    endDate?: Date
  ): Promise<AnalyticsData | null> {
    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000); // 默认7天

    console.log(`[DataCollector] 开始采集账号数据:`, account.accountName, account.platform);

    try {
      // 获取平台客户端
      const analyticsData = await PlatformManager.getPlatformAnalytics(
        account.platform as any,
        account,
        start,
        end
      );

      if (analyticsData) {
        // 保存到数据库
        await this.saveAnalyticsData(analyticsData);
        console.log(`[DataCollector] 账号数据采集完成:`, account.accountName);
      }

      return analyticsData;
    } catch (error) {
      console.error(`[DataCollector] 账号数据采集失败:`, account.accountName, error);
      return null;
    }
  }

  /**
   * 采集所有账号的数据
   */
  async collectAllAccountsData(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<AnalyticsData[]> {
    console.log(`[DataCollector] 开始采集所有账号数据, 用户:`, userId);

    try {
      // 获取用户的所有活跃账号
      const { data: accounts, error } = await this.supabase
        .from('platform_accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error(`[DataCollector] 获取账号列表失败:`, error);
        throw error;
      }

      if (!accounts || accounts.length === 0) {
        console.log(`[DataCollector] 没有找到活跃账号`);
        return [];
      }

      // 并发采集所有账号数据
      const results: AnalyticsData[] = [];
      const promises = accounts.map(async (account: any) => {
        const data = await this.collectAccountData(
          account as PlatformAccount,
          startDate,
          endDate
        );
        if (data) {
          results.push(data);
        }
      });

      await Promise.allSettled(promises);

      console.log(`[DataCollector] 所有账号数据采集完成, 共 ${results.length} 个`);
      return results;
    } catch (error) {
      console.error(`[DataCollector] 采集所有账号数据失败:`, error);
      throw error;
    }
  }

  /**
   * 保存分析数据到数据库
   */
  private async saveAnalyticsData(data: AnalyticsData): Promise<void> {
    try {
      // 保存到 analytics_data 表
      const { error } = await this.supabase
        .from('analytics_data')
        .insert({
          platform: data.platform,
          account_id: data.accountId,
          period_start: data.period.start,
          period_end: data.period.end,
          metrics: data.metrics,
          posts: data.posts,
          collected_at: data.collectedAt
        });

      if (error) {
        console.error(`[DataCollector] 保存分析数据失败:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`[DataCollector] 保存分析数据异常:`, error);
      // 不抛出错误，避免影响数据采集流程
    }
  }

  /**
   * 获取历史分析数据
   */
  async getHistoricalData(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsData[]> {
    try {
      const { data, error } = await this.supabase
        .from('analytics_data')
        .select('*')
        .eq('account_id', accountId)
        .gte('collected_at', startDate.toISOString())
        .lte('collected_at', endDate.toISOString())
        .order('collected_at', { ascending: false });

      if (error) {
        console.error(`[DataCollector] 获取历史数据失败:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(`[DataCollector] 获取历史数据异常:`, error);
      return [];
    }
  }
}

// 导出单例
export const dataCollector = new DataCollector();
export default dataCollector;
