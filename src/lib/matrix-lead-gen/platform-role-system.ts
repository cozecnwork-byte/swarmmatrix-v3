// ========== 平台角色分工系统 ==========
export class PlatformRoleSystem {
  async assignRoles(platforms: string[], audience: any) {
    return platforms.map(platform => ({
      platform,
      role: this.getDefaultRole(platform),
      priority: 'secondary'
    }));
  }

  private getDefaultRole(platform: string): string {
    const roleMap: Record<string, string> = {
      tiktok: 'reach',
      instagram: 'trust',
      facebook: 'engagement',
      linkedin: 'trust',
      youtube: 'trust',
      twitter: 'engagement',
      xiaohongshu: 'trust',
      bilibili: 'reach',
      douyin: 'reach',
      kuaishou: 'reach',
      wechat: 'conversion',
      whatsapp: 'conversion'
    };
    return roleMap[platform] || 'reach';
  }
}