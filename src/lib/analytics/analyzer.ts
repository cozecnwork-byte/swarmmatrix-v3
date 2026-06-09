/**
 * 数据分析器 - 分析采集到的数据
 */

import { AnalyticsData } from '@/lib/platforms';

/**
 * 趋势分析结果
 */
export interface TrendAnalysis {
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    impressions?: {
      value: number;
      change: number; // 变化百分比
      trend: 'up' | 'down' | 'stable';
    };
    views?: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
    likes?: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
    engagementRate?: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
    followers?: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  insights: string[];
  recommendations: string[];
}

/**
 * 平台对比分析
 */
export interface PlatformComparison {
  platforms: {
    [platform: string]: {
      impressions: number;
      views: number;
      likes: number;
      engagementRate: number;
      roi?: number; // 投资回报率
    };
  };
  bestPerformer: string;
  worstPerformer: string;
  insights: string[];
}

/**
 * 内容性能分析
 */
export interface ContentPerformance {
  topPosts: {
    postId: string;
    platform: string;
    views: number;
    likes: number;
    engagementRate: number;
    publishedAt: Date;
  }[];
  worstPosts: {
    postId: string;
    platform: string;
    views: number;
    likes: number;
    engagementRate: number;
    publishedAt: Date;
  }[];
  bestTimeToPost?: {
    hour: number;
    day: number;
  };
  contentTypes: {
    [type: string]: {
      count: number;
      avgViews: number;
      avgLikes: number;
      avgEngagement: number;
    };
  };
}

/**
 * 数据分析器
 */
export class DataAnalyzer {
  constructor() {}

  /**
   * 分析趋势变化
   */
  analyzeTrend(
    currentData: AnalyticsData,
    previousData?: AnalyticsData
  ): TrendAnalysis {
    const insights: string[] = [];
    const recommendations: string[] = [];

    const metrics: TrendAnalysis['metrics'] = {};

    // 分析曝光量
    if (currentData.metrics.impressions !== undefined) {
      const prevImpressions = previousData?.metrics.impressions;
      const change = prevImpressions 
        ? ((currentData.metrics.impressions - prevImpressions) / prevImpressions) * 100 
        : 0;
      
      metrics.impressions = {
        value: currentData.metrics.impressions,
        change,
        trend: this.getTrend(change)
      };

      if (change > 20) {
        insights.push('曝光量显著上升，内容触达效果良好');
      } else if (change < -20) {
        insights.push('曝光量明显下降，建议优化内容关键词');
        recommendations.push('增加发布频率，优化话题标签');
      }
    }

    // 分析互动率
    if (currentData.metrics.engagementRate !== undefined) {
      const prevEngagement = previousData?.metrics.engagementRate;
      const change = prevEngagement 
        ? currentData.metrics.engagementRate - prevEngagement 
        : 0;
      
      metrics.engagementRate = {
        value: currentData.metrics.engagementRate,
        change,
        trend: this.getTrend(change)
      };

      if (currentData.metrics.engagementRate > 5) {
        insights.push('互动率优秀，用户参与度高');
      } else if (currentData.metrics.engagementRate < 2) {
        insights.push('互动率偏低，建议增加互动引导');
        recommendations.push('在内容中增加问题、投票等互动元素');
      }
    }

    // 分析粉丝增长
    if (currentData.metrics.newFollowers !== undefined) {
      const prevNewFollowers = previousData?.metrics.newFollowers;
      const change = prevNewFollowers 
        ? ((currentData.metrics.newFollowers - prevNewFollowers) / prevNewFollowers) * 100 
        : 0;
      
      metrics.followers = {
        value: currentData.metrics.followers || 0,
        change,
        trend: this.getTrend(change)
      };

      if (currentData.metrics.newFollowers > 100) {
        insights.push('粉丝增长强劲，账号吸引力强');
      }
    }

    return {
      period: currentData.period,
      metrics,
      insights: insights.length > 0 ? insights : ['数据表现平稳'],
      recommendations: recommendations.length > 0 ? recommendations : ['继续保持当前策略']
    };
  }

  /**
   * 对比多个平台数据
   */
  comparePlatforms(analyticsDataList: AnalyticsData[]): PlatformComparison {
    const platforms: PlatformComparison['platforms'] = {};
    
    analyticsDataList.forEach(data => {
      platforms[data.platform] = {
        impressions: data.metrics.impressions || 0,
        views: data.metrics.views || 0,
        likes: data.metrics.likes || 0,
        engagementRate: data.metrics.engagementRate || 0
      };
    });

    // 找出表现最好和最差的平台
    let bestPerformer = '';
    let worstPerformer = '';
    let maxEngagement = -1;
    let minEngagement = Infinity;

    Object.entries(platforms).forEach(([platform, data]) => {
      if (data.engagementRate > maxEngagement) {
        maxEngagement = data.engagementRate;
        bestPerformer = platform;
      }
      if (data.engagementRate < minEngagement) {
        minEngagement = data.engagementRate;
        worstPerformer = platform;
      }
    });

    const insights: string[] = [];
    if (bestPerformer) {
      insights.push(`${bestPerformer} 平台互动率最高，建议加大投入`);
    }
    if (worstPerformer && worstPerformer !== bestPerformer) {
      insights.push(`${worstPerformer} 平台需要优化内容策略`);
    }

    return {
      platforms,
      bestPerformer,
      worstPerformer,
      insights
    };
  }

  /**
   * 综合分析所有数据
   */
  analyzeComprehensive(
    analyticsDataList: AnalyticsData[],
    historicalData?: AnalyticsData[]
  ): {
    trendAnalysis: TrendAnalysis;
    platformComparison: PlatformComparison;
    summary: string;
    actionItems: string[];
  } {
    // 取最新的数据做趋势分析
    const latestData = analyticsDataList[0];
    const previousData = historicalData?.[0];
    
    const trendAnalysis = latestData 
      ? this.analyzeTrend(latestData, previousData)
      : {
          period: { start: new Date(), end: new Date() },
          metrics: {},
          insights: ['暂无数据'],
          recommendations: ['请先采集数据']
        };

    const platformComparison = this.comparePlatforms(analyticsDataList);

    // 生成总结
    const summary = this.generateSummary(trendAnalysis, platformComparison);
    
    // 生成行动项
    const actionItems = [
      ...trendAnalysis.recommendations,
      ...platformComparison.insights
    ].filter((item, index, self) => self.indexOf(item) === index);

    return {
      trendAnalysis,
      platformComparison,
      summary,
      actionItems
    };
  }

  /**
   * 生成总结
   */
  private generateSummary(
    trendAnalysis: TrendAnalysis,
    platformComparison: PlatformComparison
  ): string {
    const parts: string[] = [];

    if (trendAnalysis.insights.length > 0) {
      parts.push(trendAnalysis.insights.join('；'));
    }

    if (platformComparison.bestPerformer) {
      parts.push(`${platformComparison.bestPerformer} 平台表现最佳`);
    }

    if (parts.length === 0) {
      return '数据表现平稳，继续保持当前策略';
    }

    return parts.join('。');
  }

  /**
   * 获取趋势方向
   */
  private getTrend(change: number): 'up' | 'down' | 'stable' {
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  }
}

// 导出单例
export const dataAnalyzer = new DataAnalyzer();
export default dataAnalyzer;
