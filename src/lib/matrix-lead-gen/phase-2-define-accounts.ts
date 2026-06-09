// ========== 阶段2：定账号角色 ==========
export function defineAccountRoles(platformRoles: any[]) {
  return {
    groups: platformRoles.flatMap(role => [
      {
        platform: role.platform,
        groupName: `${role.platform}-市场-主力`,
        groupType: 'market',
        accountCount: role.accountConfig?.tiers?.primary || 2
      },
      {
        platform: role.platform,
        groupName: `${role.platform}-市场-备用`,
        groupType: 'market',
        accountCount: role.accountConfig?.tiers?.secondary || 1
      }
    ])
  };
}