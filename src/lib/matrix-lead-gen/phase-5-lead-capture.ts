// ========== 阶段5：设计承接入口 ==========
export function designLeadCapturePoints(platformRoles: any[]) {
  return platformRoles
    .filter(role => role.role === 'conversion' || role.role === 'engagement')
    .map(role => ({
      captureType: role.role === 'conversion' ? 'whatsapp' : 'private_domain',
      sourcePlatform: role.platform,
      guideText: role.role === 'conversion' ? '获取更多信息' : '加入社群',
      trackingConfig: {
        utmSource: role.platform,
        utmMedium: 'social',
        utmCampaign: 'matrix_lead_gen'
      }
    }));
}