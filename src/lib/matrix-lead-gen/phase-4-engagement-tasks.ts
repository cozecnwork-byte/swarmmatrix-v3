// ========== 阶段4：安排互动任务 ==========
export function planEngagementTasks(platformRoles: any[]) {
  return platformRoles.flatMap(role => [
    {
      taskType: 'comment',
      platform: role.platform,
      priority: 'high',
      followUpRules: { responseTime: '24h' }
    },
    {
      taskType: 'direct_message',
      platform: role.platform,
      priority: 'high',
      followUpRules: { responseTime: '12h' }
    },
    {
      taskType: 'like',
      platform: role.platform,
      priority: 'medium',
      followUpRules: { responseTime: '48h' }
    }
  ]);
}