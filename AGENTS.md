# GlobalLeadGen v3 矩阵引流平台

## 项目概览

GlobalLeadGen v3 是一款专为新手小白设计的简化版矩阵引流平台，基于 **9层智能体架构** 与 **5层企业级平台架构**，提供直观易用的操作界面和一键式功能。

### 核心特性

- **9层智能体架构**：完整的AI智能体系统，从输入到输出的全流程自动化
- **5层企业级平台架构**：从基础设施到应用层的分层设计
- **小白专属功能**：一键发布、定时任务、模板市场、数据看板等
- **7步标准工作流程**：接收→理解→选择→执行→观察→反思→输出
- **零代码配置**：通过.env文件配置，无需编写复杂代码

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **AI**: coze-coding-dev-sdk (LLM集成)
- **Storage**: S3 兼容对象存储

## 目录结构

```
├── public/                     # 静态资源
├── src/
│   ├── app/                    # 页面路由
│   │   ├── api/               # API路由
│   │   │   ├── agent/         # 智能体API
│   │   │   ├── workflow/      # 工作流API
│   │   │   ├── template/      # 模板API
│   │   │   ├── analytics/     # 数据分析API
│   │   │   ├── schedule/      # 定时任务API
│   │   │   └── publish/       # 一键发布API
│   │   ├── dashboard/         # 仪表盘页面
│   │   ├── agent/             # 智能体页面
│   │   ├── workflow/          # 工作流页面
│   │   ├── publish/           # 一键发布页面
│   │   ├── templates/         # 模板市场页面
│   │   ├── schedule/          # 定时任务页面
│   │   ├── analytics/         # 数据看板页面
│   │   └── settings/          # 系统设置页面
│   ├── components/            # UI组件
│   │   ├── layout/           # 布局组件
│   │   └── ui/               # shadcn/ui组件
│   ├── lib/                   # 核心库
│   │   ├── agent/            # 9层智能体架构
│   │   │   ├── input-layer.ts        # 第一层：输入层
│   │   │   ├── memory-layer.ts       # 第二层：记忆层
│   │   │   ├── planning-layer.ts     # 第三层：规划层
│   │   │   ├── action-layer.ts       # 第四层：行动层
│   │   │   ├── llm-layer.ts          # 第五层：大模型层
│   │   │   ├── output-layer.ts       # 第六层：输出层
│   │   │   ├── reflection-layer.ts   # 第七层：反思层
│   │   │   ├── tool-layer.ts         # 第八层：工具层
│   │   │   ├── knowledge-layer.ts    # 第九层：知识库层
│   │   │   └── index.ts              # 智能体主类
│   │   └── utils.ts          # 工具函数
│   └── storage/              # 数据存储
│       └── database/         # 数据库配置
├── DESIGN.md                  # 设计规范
├── package.json              # 依赖管理
└── tsconfig.json             # TypeScript配置
```

## 9层智能体架构

| 层级 | 名称 | 职责 |
|-----|------|------|
| 第一层 | 输入层 | 自然语言指令、外部事件触发、环境状态查看、定时任务设置 |
| 第二层 | 记忆层 | 对话历史短期记忆、知识库长期记忆、工作记忆 |
| 第三层 | 规划层 | 目标理解、任务分解、子任务计划生成 |
| 第四层 | 行动层 | 工具选择、执行操作、成果观察 |
| 第五层 | 大模型层 | 理解、推理、决策、内容生成 |
| 第六层 | 输出层 | 自然语言回复、报告生成、API调用、状态更新 |
| 第七层 | 反思层 | 自动评估结果、总结经验、优化计划 |
| 第八层 | 工具层 | 搜索引擎、计算器、API调用等 |
| 第九层 | 知识库层 | 向量数据库、文档知识库、结构化数据 |

## 5层企业级平台架构

| 层级 | 名称 | 组件 |
|-----|------|------|
| 第一层 | 基础设施层 | 云服务器、数据库、对象存储 |
| 第二层 | 模型与算法层 | 大模型优化、RAG增强 |
| 第三层 | 核心引擎层 | lead_gen、video_publish等10大引流引擎 |
| 第四层 | 能力扩展层 | 每日引流、视频发布工作流 |
| 第五层 | 应用层 | 用户界面、小白功能 |

## 数据库表结构

- `agent_tasks` - 智能体任务记录
- `workflows` - 工作流定义
- `templates` - 模板市场
- `lead_data` - 引流数据
- `scheduled_tasks` - 定时任务
- `platform_accounts` - 平台账号
- `agent_memory` - 智能体记忆
- `agent_reflections` - 反思记录
- `analytics_data` - 数据分析

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务
pnpm start

# 类型检查
pnpm ts-check

# 代码检查
pnpm lint
```

## API接口

| 接口 | 方法 | 功能 |
|-----|------|------|
| `/api/agent` | POST | 执行智能体任务 |
| `/api/agent` | GET | 获取任务列表 |
| `/api/agent/tasks/[id]` | GET | 获取任务详情 |
| `/api/workflow` | GET/POST | 工作流管理 |
| `/api/template` | GET/POST | 模板管理 |
| `/api/analytics` | GET | 数据分析 |
| `/api/schedule` | GET/POST | 定时任务管理 |
| `/api/publish` | POST | 一键发布 |

## 小白功能指南

### 一键发布
1. 进入"一键发布"页面
2. 编写或选择内容模板
3. 选择目标平台
4. 点击发布按钮

### 定时任务
1. 进入"定时任务"页面
2. 创建新任务
3. 设置执行时间和频率
4. 关联工作流

### 模板使用
1. 进入"模板市场"
2. 浏览或搜索模板
3. 点击"使用"按钮
4. 根据引导完成操作

### 智能体对话
1. 进入"智能体"页面
2. 输入自然语言指令
3. AI自动理解并执行
4. 查看执行结果

## 注意事项

- 所有平台账号需要先在"系统设置"中连接
- 定时任务依赖系统调度，请确保服务稳定运行
- 数据分析展示最近30天的数据
- 智能体支持自然语言指令，无需学习命令语法
