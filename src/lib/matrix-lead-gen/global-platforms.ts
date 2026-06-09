// ========== 全球平台数据 ==========
// 基于文章中的平台角色分工

import type { GlobalPlatformData, PlatformRoleType } from './types';

// 全球主要社交平台数据
export const GLOBAL_PLATFORMS: GlobalPlatformData[] = [
  // TikTok - 短视频触达
  {
    platform: 'tiktok',
    name: 'TikTok',
    regions: ['global', 'us', 'eu', 'asia', 'latam'],
    primaryAudience: ['16-24', '25-34', 'creators', 'consumers'],
    contentTypes: ['short_video', 'live'],
    strengths: ['快速触达', '算法推荐', '年轻受众', '全球覆盖'],
    recommendedRole: 'reach'
  },
  // Instagram - 视觉信任建设
  {
    platform: 'instagram',
    name: 'Instagram',
    regions: ['global', 'us', 'eu', 'latam'],
    primaryAudience: ['18-34', 'fashion', 'lifestyle', 'brands'],
    contentTypes: ['image_text', 'short_video', 'case', 'tutorial'],
    strengths: ['视觉品牌', 'KOL合作', '社群互动', '高参与度'],
    recommendedRole: 'trust'
  },
  // Facebook - 社群互动沉淀
  {
    platform: 'facebook',
    name: 'Facebook',
    regions: ['global', 'us', 'eu', 'latam', 'asia'],
    primaryAudience: ['25-54', 'families', 'professionals', 'communities'],
    contentTypes: ['image_text', 'article', 'qa', 'case'],
    strengths: ['社群运营', '页面管理', '广告配合', '成熟用户'],
    recommendedRole: 'engagement'
  },
  // LinkedIn - B2B信任建设
  {
    platform: 'linkedin',
    name: 'LinkedIn',
    regions: ['global', 'us', 'eu', 'asia'],
    primaryAudience: ['25-54', 'professionals', 'b2b', 'decision_makers'],
    contentTypes: ['article', 'case', 'tutorial', 'qa'],
    strengths: ['B2B关系', '专业形象', '决策人触达', '信任背书'],
    recommendedRole: 'trust'
  },
  // YouTube - 长视频内容
  {
    platform: 'youtube',
    name: 'YouTube',
    regions: ['global'],
    primaryAudience: ['all_ages', 'learners', 'entertainment', 'creators'],
    contentTypes: ['short_video', 'tutorial', 'case', 'live'],
    strengths: ['搜索流量', '长视频', '教程内容', '广告收入'],
    recommendedRole: 'trust'
  },
  // Twitter/X - 实时互动
  {
    platform: 'twitter',
    name: 'X (Twitter)',
    regions: ['global', 'us', 'eu', 'asia'],
    primaryAudience: ['18-49', 'tech', 'news', 'professionals'],
    contentTypes: ['image_text', 'qa', 'short_video'],
    strengths: ['实时对话', 'KOL互动', '话题趋势', '快速传播'],
    recommendedRole: 'engagement'
  },
  // 小红书 - 中文种草
  {
    platform: 'xiaohongshu',
    name: '小红书',
    regions: ['cn', 'overseas_chinese'],
    primaryAudience: ['18-35', 'female', 'fashion', 'lifestyle'],
    contentTypes: ['image_text', 'short_video', 'case', 'tutorial'],
    strengths: ['种草能力', '女性用户', '真实评价', '购买决策'],
    recommendedRole: 'trust'
  },
  // B站 - 二次元/年轻用户
  {
    platform: 'bilibili',
    name: 'B站',
    regions: ['cn', 'overseas_chinese'],
    primaryAudience: ['16-30', 'acg', 'gamers', 'learners'],
    contentTypes: ['short_video', 'tutorial', 'live', 'case'],
    strengths: ['年轻用户', '高粘性', '二次元', '学习社区'],
    recommendedRole: 'reach'
  },
  // 抖音 - 中文短视频
  {
    platform: 'douyin',
    name: '抖音',
    regions: ['cn', 'overseas_chinese'],
    primaryAudience: ['all_ages', 'creators', 'consumers', 'local_business'],
    contentTypes: ['short_video', 'live', 'image_text'],
    strengths: ['算法推荐', '本地生活', '直播带货', '全民参与'],
    recommendedRole: 'reach'
  },
  // 快手 - 下沉市场
  {
    platform: 'kuaishou',
    name: '快手',
    regions: ['cn'],
    primaryAudience: ['18-45', 'rural', 'blue_collar', 'small_town'],
    contentTypes: ['short_video', 'live', 'image_text'],
    strengths: ['下沉市场', '真实社区', '老铁经济', '直播电商'],
    recommendedRole: 'reach'
  },
  // 微信 - 私域承接
  {
    platform: 'wechat',
    name: '微信',
    regions: ['cn', 'overseas_chinese'],
    primaryAudience: ['all_ages', 'private_domain', 'crm', 'community'],
    contentTypes: ['image_text', 'article', 'qa', 'tutorial'],
    strengths: ['私域运营', '社群管理', 'CRM', '支付闭环'],
    recommendedRole: 'conversion'
  },
  // WhatsApp - 全球私域承接
  {
    platform: 'whatsapp',
    name: 'WhatsApp',
    regions: ['global', 'latam', 'eu', 'asia', 'africa'],
    primaryAudience: ['all_ages', 'private_domain', 'crm', 'international'],
    contentTypes: ['image_text', 'qa', 'short_video'],
    strengths: ['全球覆盖', '高开放率', '直接沟通', '国际商务'],
    recommendedRole: 'conversion'
  }
];

// 平台角色推荐映射
export const PLATFORM_ROLE_RECOMMENDATIONS: Record<PlatformRoleType, string[]> = {
  reach: ['tiktok', 'bilibili', 'douyin', 'kuaishou', 'youtube'],
  trust: ['instagram', 'linkedin', 'youtube', 'xiaohongshu'],
  engagement: ['facebook', 'twitter', 'instagram', 'wechat'],
  conversion: ['whatsapp', 'wechat', 'form', 'crm']
};

// 根据目标客户群体推荐平台
export function recommendPlatformsForAudience(audience: {
  countries: string[];
  ageRanges: string[];
  personas: string[];
  languages: string[];
}): GlobalPlatformData[] {
  let recommendedPlatforms = [...GLOBAL_PLATFORMS];

  // 根据国家/地区过滤
  if (audience.countries.length > 0) {
    recommendedPlatforms = recommendedPlatforms.filter(platform => {
      return audience.countries.some(country => {
        // 简化匹配逻辑
        const lowerCountry = country.toLowerCase();
        return platform.regions.some(region => 
          region.includes(lowerCountry) || 
          region === 'global' ||
          (lowerCountry.includes('china') && platform.regions.includes('cn')) ||
          (lowerCountry.includes('us') && platform.regions.includes('us')) ||
          (lowerCountry.includes('uk') && platform.regions.includes('eu')) ||
          (lowerCountry.includes('germany') && platform.regions.includes('eu')) ||
          (lowerCountry.includes('france') && platform.regions.includes('eu')) ||
          (lowerCountry.includes('japan') && platform.regions.includes('asia')) ||
          (lowerCountry.includes('korea') && platform.regions.includes('asia')) ||
          (lowerCountry.includes('brazil') && platform.regions.includes('latam')) ||
          (lowerCountry.includes('mexico') && platform.regions.includes('latam'))
        );
      });
    });
  }

  // 根据语言过滤
  if (audience.languages.includes('zh') || audience.languages.includes('中文')) {
    // 中文用户推荐中文平台
    const chinesePlatforms = recommendedPlatforms.filter(p => 
      ['xiaohongshu', 'bilibili', 'douyin', 'kuaishou', 'wechat'].includes(p.platform)
    );
    if (chinesePlatforms.length > 0) {
      recommendedPlatforms = [...chinesePlatforms, ...recommendedPlatforms.filter(p => 
        !['xiaohongshu', 'bilibili', 'douyin', 'kuaishou', 'wechat'].includes(p.platform)
      )];
    }
  }

  return recommendedPlatforms;
}

// 获取平台默认角色
export function getPlatformDefaultRole(platform: string): PlatformRoleType {
  const platformData = GLOBAL_PLATFORMS.find(p => p.platform === platform);
  return platformData?.recommendedRole || 'reach';
}
