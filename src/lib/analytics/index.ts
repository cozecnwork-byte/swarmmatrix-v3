/**
 * 数据分析模块 - 统一导出
 */

export * from './collector';
export { default as DataCollector, dataCollector } from './collector';

export * from './analyzer';
export { default as DataAnalyzer, dataAnalyzer } from './analyzer';

// 导出类型
export type { TrendAnalysis, PlatformComparison, ContentPerformance } from './analyzer';
