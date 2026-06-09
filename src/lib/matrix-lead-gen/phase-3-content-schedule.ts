// ========== 阶段3：做内容排期 ==========
export function generateContentSchedule(platformRoles: any[], productInfo: any) {
  return {
    theme: `${productInfo.name}矩阵引流内容`,
    formats: ['short_video', 'image_text', 'case', 'qa', 'tutorial'],
    platformAllocation: Object.fromEntries(
      platformRoles.map(role => [
        role.platform,
        {
          formats: role.contentStrategy?.formats || ['short_video', 'image_text'],
          frequency: 3
        }
      ])
    ),
    publishSchedule: []
  };
}