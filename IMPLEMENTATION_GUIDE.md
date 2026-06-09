# GlobalLeadGen v3 正式上线实施指南

## 📋 概述

当前项目已经完成了基础架构搭建和前端界面开发。本指南将帮助你完成从"开发环境"到"正式可用"的最后一公里。

---

## 🚀 实施路线图（按优先级排序）

### 第一阶段：基础设施配置（1-2天）

#### 1.1 配置 Supabase 数据库
**优先级：🔴 最高**

**步骤：**
1. 注册/登录 Supabase 账号：https://supabase.com
2. 创建新项目（或使用现有项目）
3. 获取数据库连接信息：
   - 进入 Project Settings → API
   - 复制 `Project URL` 和 `anon/public` key
   - 复制 `service_role` key（用于服务端操作）
4. 在项目根目录创建 `.env.local` 文件：
   ```bash
   cp .env.example .env.local
   ```
5. 填入 Supabase 配置值

**验证：**
```bash
# 运行开发服务器测试连接
pnpm dev
# 访问 http://localhost:5000 查看是否正常
```

---

#### 1.2 初始化数据库表结构
**优先级：🔴 最高**

**步骤：**
1. 查看 `src/storage/database/shared/schema.ts` 了解所有表结构
2. 在 Supabase SQL Editor 中执行建表语句
3. 或者使用 Drizzle ORM 迁移工具

**关键表：**
- `ai_wizard_projects` - AI向导项目
- `agent_tasks` - 智能体任务
- `platform_accounts` - 平台账号
- `lead_data` - 引流数据
- `workflows` - 工作流
- `scheduled_tasks` - 定时任务
- 以及新增的12个测试和质量保证表

---

### 第二阶段：AI 大模型配置（1天）

#### 2.1 配置 coze-coding-dev-sdk
**优先级：🔴 最高**

**当前状态：**
- SDK 已安装：`coze-coding-dev-sdk@^0.7.24`
- 基础集成已完成

**配置步骤：**
1. 获取 Coze API Key：
   - 访问 https://www.coze.cn
   - 进入个人中心 → API 管理
   - 创建新的 API Key
2. 创建 Bot（智能体）：
   - 在 Coze 平台创建你的引流智能体
   - 获取 Bot ID
3. 在 `.env.local` 中配置：
   ```env
   COZE_API_KEY=your-coze-api-key
   COZE_BOT_ID=your-bot-id
   ```

**可选配置（其他 LLM）：**
- DeepSeek
- Kimi
- OpenAI
- Anthropic

---

### 第三阶段：社交平台 API 对接（3-5天）

#### 3.1 平台 API 对接清单

| 平台 | 优先级 | 难度 | 用途 |
|------|--------|------|------|
| 抖音 / TikTok | 🔴 高 | 中等 | 短视频发布、数据采集 |
| 小红书 | 🔴 高 | 中等 | 图文内容发布 |
| B站 | 🟡 中 | 较高 | 长视频发布 |
| Instagram | 🟡 中 | 中等 | 国际市场 |
| YouTube | 🟡 中 | 较高 | 国际视频市场 |
| Twitter/X | 🟢 低 | 低 | 短内容发布 |
| LinkedIn | 🟢 低 | 中等 | B2B市场 |

#### 3.2 开发平台对接模块

**文件位置建议：**
```
src/lib/platforms/
├── tiktok.ts          # 抖音/TikTok
├── xiaohongshu.ts     # 小红书
├── bilibili.ts        # B站
├── instagram.ts       # Instagram
├── youtube.ts         # YouTube
├── twitter.ts         # Twitter/X
├── linkedin.ts        # LinkedIn
└── index.ts           # 统一导出
```

**每个平台模块应包含：**
- 认证（OAuth）
- 内容发布
- 数据采集
- 账号管理

**示例：TikTok 发布函数**
```typescript
// src/lib/platforms/tiktok.ts
export async function publishToTikTok(
  accessToken: string,
  videoPath: string,
  title: string,
  description: string
) {
  // 实现TikTok视频发布逻辑
}
```

---

### 第四阶段：真实数据采集与分析（2-3天）

#### 4.1 数据采集模块

**需要采集的数据：**
- 各平台曝光量
- 点击量
- 互动量（点赞、评论、分享）
- 转化率
- 粉丝增长

**实现位置：**
```
src/lib/analytics/
├── collector.ts       # 数据采集器
├── analyzer.ts        # 数据分析器
└── reporter.ts        # 报告生成器
```

#### 4.2 实时数据更新

**方案：**
1. 使用 WebSocket 实时推送数据更新
2. 或使用定时任务定期拉取数据
3. 在前端展示实时仪表盘

---

### 第五阶段：对象存储配置（1天）

#### 5.1 配置 S3 兼容存储

**选项：**
1. **AWS S3**（推荐国际版）
2. **阿里云 OSS**（推荐国内版）
3. **腾讯云 COS**
4. **MinIO**（自建）

**配置步骤：**
1. 创建存储桶（Bucket）
2. 获取 Access Key 和 Secret Key
3. 配置 CORS 允许前端上传
4. 在 `.env.local` 中填入配置

**用途：**
- 存储用户上传的图片、视频
- 存储生成的内容素材
- 存储报告和导出文件

---

### 第六阶段：定时任务系统（2天）

#### 6.1 实现定时任务调度

**选项：**
1. **Vercel Cron Jobs**（如果部署在 Vercel）
2. **Supabase Edge Functions + pg_cron**
3. **自建调度服务**
4. **使用第三方服务（如 Cronitor）**

**需要定时执行的任务：**
- 定时发布内容
- 定时采集数据
- 定时生成报告
- 定时检查账号状态
- 定时执行智能体任务

---

### 第七阶段：IP 代理配置（1-2天）

#### 7.1 代理服务选择

**推荐服务商：**
- **BrightData**（原 Luminati）- 全球住宅IP
- **Oxylabs** - 数据中心和住宅IP
- **Smartproxy** - 性价比高
- **Soax** - 精准定位

**配置步骤：**
1. 注册代理服务
2. 获取代理凭证
3. 按国家/地区配置代理池
4. 在代码中实现代理切换逻辑

---

### 第八阶段：测试与验证（2-3天）

#### 8.1 功能测试清单

- [ ] Supabase 数据库连接正常
- [ ] LLM API 调用正常
- [ ] 各平台内容发布测试
- [ ] 数据采集功能测试
- [ ] 定时任务执行测试
- [ ] 对象存储上传/下载测试
- [ ] IP 代理切换测试
- [ ] 前端界面完整测试
- [ ] 移动端响应式测试

#### 8.2 性能测试

- [ ] API 响应时间 < 2s
- [ ] 数据库查询优化
- [ ] 前端加载速度 < 3s
- [ ] 并发用户测试

---

### 第九阶段：部署上线（1天）

#### 9.1 部署选项

**推荐：**
1. **Vercel** - Next.js 官方推荐
2. **Netlify** - 简单易用
3. **AWS Amplify** - 全栈 AWS
4. **自建服务器** - 完全控制

**部署步骤（以 Vercel 为例）：**
1. 推送代码到 GitHub
2. 导入项目到 Vercel
3. 在 Vercel 项目设置中配置环境变量
4. 部署！

---

## 📝 关键配置检查清单

### 部署前必须确认：

- [ ] `.env.local` 文件已创建并填入所有必要配置
- [ ] Supabase 数据库表已创建
- [ ] 各平台 API Key 已获取并测试
- [ ] 对象存储已配置并测试上传
- [ ] 代理服务已配置（如需要）
- [ ] 所有 API 端点已测试通过
- [ ] 前端界面无控制台错误
- [ ] 移动端适配已测试
- [ ] 安全配置已检查（API Key 不暴露在前端）

---

## 🔧 常见问题解决

### 问题1：Supabase 连接失败
**解决方案：**
- 检查 `.env.local` 中的 URL 和 Key 是否正确
- 确认 Supabase 项目没有被暂停
- 检查网络连接

### 问题2：平台 API 认证失败
**解决方案：**
- 确认 Access Token 未过期
- 检查 OAuth 权限范围是否正确
- 查看平台 API 文档确认调用方式

### 问题3：定时任务不执行
**解决方案：**
- 确认 Cron 表达式正确
- 检查服务是否在运行
- 查看日志确认错误原因

---

## 🎯 最小可用版本（MVP）建议

如果想快速上线，可以先实现以下核心功能：

1. ✅ Supabase 数据库配置
2. ✅ LLM API 配置
3. ✅ 1-2个主要平台（如抖音+小红书）
4. ✅ 基础数据采集
5. ✅ 简单的定时任务
6. ✅ 对象存储

然后再逐步添加其他功能。

---

## 📚 参考资源

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)

### 平台 API 文档
- [TikTok for Developers](https://developers.tiktok.com/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Twitter API](https://developer.twitter.com/en/docs/twitter-api)
- [LinkedIn API](https://learn.microsoft.com/en-us/linkedin/)

---

## 💡 需要帮助？

如果在实施过程中遇到问题：
1. 查看各平台官方文档
2. 检查项目日志文件
3. 在 GitHub Issues 中提问
4. 联系技术支持

---

**祝上线顺利！🚀**
