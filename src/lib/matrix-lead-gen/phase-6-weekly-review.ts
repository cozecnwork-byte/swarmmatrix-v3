// ========== 阶段6：每周复盘 ==========
export function generateWeeklyReview(projectData: any) {
  return {
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
      qualityScoreDistribution: { low: 0, medium: 0, high: 0 }
    },
    successes: [],
    issuesAndImprovements: [],
    nextWeekPlan: {
      priorities: [],
      platformAdjustments: [],
      contentPlan: { themes: [], adjustments: '' }
    }
  };
}