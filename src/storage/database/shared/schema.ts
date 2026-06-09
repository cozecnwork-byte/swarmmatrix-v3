import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  text,
  numeric,
} from "drizzle-orm/pg-core";

// ========== 系统健康检查表（必须保留） ==========
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

// ========== 用户配置表 ==========
export const userConfigs = pgTable(
  "user_configs",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    display_name: varchar("display_name", { length: 100 }),
    avatar_url: varchar("avatar_url", { length: 500 }),
    language: varchar("language", { length: 10 }).default("zh-CN"),
    timezone: varchar("timezone", { length: 50 }).default("Asia/Shanghai"),
    notification_enabled: boolean("notification_enabled").default(true),
    theme: varchar("theme", { length: 20 }).default("light"),
    settings: jsonb("settings"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [index("user_configs_user_id_idx").on(table.user_id)]
);

// ========== 平台账号表 ==========
export const platformAccounts = pgTable(
  "platform_accounts",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    platform: varchar("platform", { length: 50 }).notNull(), // 抖音、快手、小红书、B站等
    account_name: varchar("account_name", { length: 100 }).notNull(),
    account_id: varchar("account_id", { length: 100 }),
    credentials: jsonb("credentials"), // 加密的认证信息
    status: varchar("status", { length: 20 }).default("active"),
    last_sync_at: timestamp("last_sync_at", { withTimezone: true }),
    metadata: jsonb("metadata"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("platform_accounts_user_id_idx").on(table.user_id),
    index("platform_accounts_platform_idx").on(table.platform),
  ]
);

// ========== 智能体任务表（核心） ==========
export const agentTasks = pgTable(
  "agent_tasks",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    workflow_id: varchar("workflow_id", { length: 36 }),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    // 当前执行步骤（1-7步标准流程）
    current_step: integer("current_step").default(1),
    // 任务状态：pending, running, completed, failed, paused
    status: varchar("status", { length: 20 }).default("pending"),
    // 输入层：自然语言指令
    input_command: text("input_command"),
    input_metadata: jsonb("input_metadata"),
    // 规划层：分解的子任务
    plan: jsonb("plan"),
    // 行动层：执行结果
    actions: jsonb("actions"),
    // 输出层：最终结果
    output: jsonb("output"),
    // 反思层：评估和修正记录
    reflections: jsonb("reflections"),
    // 大模型配置
    llm_config: jsonb("llm_config"),
    // 工具选择
    tools_used: jsonb("tools_used"),
    // 执行日志
    execution_log: jsonb("execution_log"),
    // 错误信息
    error_message: text("error_message"),
    // 执行时间统计
    started_at: timestamp("started_at", { withTimezone: true }),
    completed_at: timestamp("completed_at", { withTimezone: true }),
    duration_ms: integer("duration_ms"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("agent_tasks_user_id_idx").on(table.user_id),
    index("agent_tasks_status_idx").on(table.status),
    index("agent_tasks_workflow_id_idx").on(table.workflow_id),
    index("agent_tasks_created_at_idx").on(table.created_at),
  ]
);

// ========== 智能体记忆层 ==========
export const agentMemory = pgTable(
  "agent_memory",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    task_id: varchar("task_id", { length: 36 }).notNull(),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    // 记忆类型：short_term（对话历史）、long_term（知识库）、working（当前任务）
    memory_type: varchar("memory_type", { length: 20 }).notNull(),
    // 记忆内容
    content: jsonb("content").notNull(),
    // 关键词标签（用于检索）
    tags: jsonb("tags"),
    // 重要性评分（0-1）
    importance: numeric("importance", { precision: 3, scale: 2 }).default("0.5"),
    // 访问次数
    access_count: integer("access_count").default(0),
    // 最后访问时间
    last_accessed_at: timestamp("last_accessed_at", { withTimezone: true }),
    // 过期时间（短期记忆）
    expires_at: timestamp("expires_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("agent_memory_task_id_idx").on(table.task_id),
    index("agent_memory_user_id_idx").on(table.user_id),
    index("agent_memory_type_idx").on(table.memory_type),
  ]
);

// ========== 工作流表 ==========
export const workflows = pgTable(
  "workflows",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    // 工作流类型：lead_gen（引流）、video_publish（视频发布）、daily_task（每日任务）
    type: varchar("type", { length: 50 }).notNull(),
    // 工作流定义（节点、边、配置）
    definition: jsonb("definition").notNull(),
    // 是否启用
    is_active: boolean("is_active").default(true),
    // 执行统计
    execution_count: integer("execution_count").default(0),
    success_count: integer("success_count").default(0),
    failure_count: integer("failure_count").default(0),
    // 最后执行时间
    last_executed_at: timestamp("last_executed_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("workflows_user_id_idx").on(table.user_id),
    index("workflows_type_idx").on(table.type),
    index("workflows_is_active_idx").on(table.is_active),
  ]
);

// ========== 定时任务表 ==========
export const scheduledTasks = pgTable(
  "scheduled_tasks",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    workflow_id: varchar("workflow_id", { length: 36 }),
    task_name: varchar("task_name", { length: 200 }).notNull(),
    // cron表达式或简单时间
    schedule_type: varchar("schedule_type", { length: 20 }).default("cron"), // cron, interval, once
    schedule_config: jsonb("schedule_config").notNull(), // { cron: "0 9 * * *", timezone: "Asia/Shanghai" }
    // 执行参数
    params: jsonb("params"),
    // 状态
    is_active: boolean("is_active").default(true),
    status: varchar("status", { length: 20 }).default("active"), // active, paused, completed
    // 下次执行时间
    next_run_at: timestamp("next_run_at", { withTimezone: true }),
    // 最后执行时间
    last_run_at: timestamp("last_run_at", { withTimezone: true }),
    // 执行统计
    run_count: integer("run_count").default(0),
    last_run_status: varchar("last_run_status", { length: 20 }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("scheduled_tasks_user_id_idx").on(table.user_id),
    index("scheduled_tasks_next_run_idx").on(table.next_run_at),
    index("scheduled_tasks_is_active_idx").on(table.is_active),
  ]
);

// ========== 模板表 ==========
export const templates = pgTable(
  "templates",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    creator_id: varchar("creator_id", { length: 36 }),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    // 模板类型：content（内容）、workflow（工作流）、campaign（营销活动）
    type: varchar("type", { length: 50 }).notNull(),
    category: varchar("category", { length: 50 }), // 分类标签
    // 模板内容
    content: jsonb("content").notNull(),
    // 变量定义
    variables: jsonb("variables"),
    // 是否公开（模板市场）
    is_public: boolean("is_public").default(false),
    // 使用统计
    use_count: integer("use_count").default(0),
    // 评分
    rating: numeric("rating", { precision: 2, scale: 1 }).default("0"),
    rating_count: integer("rating_count").default(0),
    // 标签
    tags: jsonb("tags"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("templates_type_idx").on(table.type),
    index("templates_category_idx").on(table.category),
    index("templates_is_public_idx").on(table.is_public),
    index("templates_creator_id_idx").on(table.creator_id),
  ]
);

// ========== 引流数据表 ==========
export const leadData = pgTable(
  "lead_data",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    task_id: varchar("task_id", { length: 36 }),
    // 数据来源平台
    source_platform: varchar("source_platform", { length: 50 }).notNull(),
    // 目标平台
    target_platform: varchar("target_platform", { length: 50 }),
    // 内容类型：video, article, comment, profile
    content_type: varchar("content_type", { length: 50 }).notNull(),
    // 原始内容
    raw_content: jsonb("raw_content"),
    // 处理后内容
    processed_content: jsonb("processed_content"),
    // 引流链接
    lead_url: varchar("lead_url", { length: 500 }),
    // 统计数据
    view_count: integer("view_count").default(0),
    click_count: integer("click_count").default(0),
    like_count: integer("like_count").default(0),
    comment_count: integer("comment_count").default(0),
    share_count: integer("share_count").default(0),
    convert_count: integer("convert_count").default(0),
    // 状态
    status: varchar("status", { length: 20 }).default("active"),
    // 发布时间
    published_at: timestamp("published_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("lead_data_user_id_idx").on(table.user_id),
    index("lead_data_task_id_idx").on(table.task_id),
    index("lead_data_source_platform_idx").on(table.source_platform),
    index("lead_data_created_at_idx").on(table.created_at),
  ]
);

// ========== 数据分析表 ==========
export const analyticsData = pgTable(
  "analytics_data",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    // 分析维度：daily, weekly, monthly
    dimension: varchar("dimension", { length: 20 }).notNull(),
    // 日期
    date: timestamp("date", { withTimezone: true }).notNull(),
    // 指标数据
    metrics: jsonb("metrics").notNull(), // { views: 1000, clicks: 100, conversions: 10, ... }
    // 平台分布
    platform_breakdown: jsonb("platform_breakdown"),
    // 内容类型分布
    content_type_breakdown: jsonb("content_type_breakdown"),
    // 同比/环比
    comparison: jsonb("comparison"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("analytics_data_user_id_idx").on(table.user_id),
    index("analytics_data_dimension_idx").on(table.dimension),
    index("analytics_data_date_idx").on(table.date),
  ]
);

// ========== 预警记录表 ==========
export const alerts = pgTable(
  "alerts",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    // 预警类型：account（账号）、ip（IP）、performance（效果）、system（系统）
    type: varchar("type", { length: 50 }).notNull(),
    // 严重程度：info, warning, error, critical
    severity: varchar("severity", { length: 20 }).notNull(),
    // 标题
    title: varchar("title", { length: 200 }).notNull(),
    // 详细信息
    message: text("message").notNull(),
    // 相关数据
    data: jsonb("data"),
    // 是否已读
    is_read: boolean("is_read").default(false),
    // 是否已处理
    is_resolved: boolean("is_resolved").default(false),
    resolved_at: timestamp("resolved_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("alerts_user_id_idx").on(table.user_id),
    index("alerts_type_idx").on(table.type),
    index("alerts_is_read_idx").on(table.is_read),
    index("alerts_created_at_idx").on(table.created_at),
  ]
);

// ========== 系统日志表 ==========
export const systemLogs = pgTable(
  "system_logs",
  {
    id: serial().primaryKey(),
    user_id: varchar("user_id", { length: 36 }),
    // 日志级别：debug, info, warn, error
    level: varchar("level", { length: 20 }).notNull(),
    // 模块
    module: varchar("module", { length: 100 }).notNull(),
    // 操作
    action: varchar("action", { length: 100 }).notNull(),
    // 详细信息
    message: text("message"),
    // 相关数据
    data: jsonb("data"),
    // 请求ID（用于追踪）
    request_id: varchar("request_id", { length: 36 }),
    // 执行时长（毫秒）
    duration_ms: integer("duration_ms"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("system_logs_user_id_idx").on(table.user_id),
    index("system_logs_level_idx").on(table.level),
    index("system_logs_module_idx").on(table.module),
    index("system_logs_created_at_idx").on(table.created_at),
  ]
);
