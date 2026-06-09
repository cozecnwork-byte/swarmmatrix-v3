/**
 * 社交平台 API 对接 - 统一导出
 */

// 导出类型
export * from './types';

// 导出管理器
export * from './manager';
export { default as PlatformManager } from './manager';

// 导出各平台客户端
export { TikTokClient, tiktokClient } from './tiktok';
export { XiaohongshuClient, xiaohongshuClient } from './xiaohongshu';

// 可扩展：添加更多平台
// export { BilibiliClient, bilibiliClient } from './bilibili';
// export { InstagramClient, instagramClient } from './instagram';
// export { YoutubeClient, youtubeClient } from './youtube';
// export { TwitterClient, twitterClient } from './twitter';
// export { LinkedinClient, linkedinClient } from './linkedin';

/**
 * 初始化所有平台
 * 调用此函数来注册所有支持的平台
 */
export function initializePlatforms() {
  const { registerPlatform } = require('./manager');
  const { tiktokClient } = require('./tiktok');
  const { xiaohongshuClient } = require('./xiaohongshu');

  // 注册已实现的平台
  registerPlatform('tiktok', tiktokClient);
  registerPlatform('xiaohongshu', xiaohongshuClient);

  // TODO: 注册更多平台
  // registerPlatform('bilibili', bilibiliClient);
  // registerPlatform('instagram', instagramClient);
  // registerPlatform('youtube', youtubeClient);
  // registerPlatform('twitter', twitterClient);
  // registerPlatform('linkedin', linkedinClient);

  console.log('[Platforms] 所有平台初始化完成');
}

// 自动初始化（可选）
// initializePlatforms();
