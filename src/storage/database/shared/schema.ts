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

// ========== 质量保证表 ==========
export const qualityAssurance = pgTable(
  "quality_assurance",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 保证类型：quality（质量保证）、efficiency（效能提升）
    assurance_type: varchar("assurance_type", { length: 30 }).notNull(),
    // 检查项
    check_item: varchar("check_item", { length: 100 }).notNull(),
    // 检查标准
    check_standard: jsonb("check_standard"),
    // 检查结果
    check_result: jsonb("check_result"),
    // 状态：pending, passed, failed, needs_improvement
    status: varchar("status", { length: 30 }).default("pending"),
    // 问题描述
    issue_description: text("issue_description"),
    // 改进措施
    improvement_actions: jsonb("improvement_actions"),
    // 负责人
    assigned_to: varchar("assigned_to", { length: 36 }),
    // 检查时间
    checked_at: timestamp("checked_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("quality_assurance_project_id_idx").on(table.project_id),
    index("quality_assurance_assurance_type_idx").on(table.assurance_type),
    index("quality_assurance_status_idx").on(table.status),
  ]
);

// ========== 接口测试表 ==========
export const apiTests = pgTable(
  "api_tests",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 测试名称
    test_name: varchar("test_name", { length: 200 }).notNull(),
    // API端点
    endpoint: varchar("endpoint", { length: 500 }).notNull(),
    // HTTP方法
    method: varchar("method", { length: 10 }).notNull(),
    // 请求头
    headers: jsonb("headers"),
    // 请求体
    request_body: jsonb("request_body"),
    // 预期响应
    expected_response: jsonb("expected_response"),
    // 实际响应
    actual_response: jsonb("actual_response"),
    // 状态码
    status_code: integer("status_code"),
    // 响应时间（毫秒）
    response_time_ms: integer("response_time_ms"),
    // 测试状态：pending, passed, failed
    status: varchar("status", { length: 20 }).default("pending"),
    // 错误信息
    error_message: text("error_message"),
    // 执行时间
    executed_at: timestamp("executed_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("api_tests_project_id_idx").on(table.project_id),
    index("api_tests_status_idx").on(table.status),
    index("api_tests_endpoint_idx").on(table.endpoint),
  ]
);

// ========== 性能测试表 ==========
export const performanceTests = pgTable(
  "performance_tests",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 测试名称
    test_name: varchar("test_name", { length: 200 }).notNull(),
    // 测试类型：load（负载测试）、stress（压力测试）、soak（稳定性测试）
    test_type: varchar("test_type", { length: 30 }).notNull(),
    // 测试配置
    test_config: jsonb("test_config"),
    // 并发用户数
    concurrent_users: integer("concurrent_users"),
    // 测试时长（秒）
    duration_seconds: integer("duration_seconds"),
    // 结果指标
    results: jsonb("results"),
    // 平均响应时间（毫秒）
    avg_response_time_ms: integer("avg_response_time_ms"),
    // 最大响应时间（毫秒）
    max_response_time_ms: integer("max_response_time_ms"),
    // 吞吐量（请求/秒）
    throughput: numeric("throughput", { precision: 10, scale: 2 }),
    // 错误率
    error_rate: numeric("error_rate", { precision: 5, scale: 2 }),
    // 状态：pending, running, completed, failed
    status: varchar("status", { length: 20 }).default("pending"),
    // 执行时间
    executed_at: timestamp("executed_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("performance_tests_project_id_idx").on(table.project_id),
    index("performance_tests_test_type_idx").on(table.test_type),
    index("performance_tests_status_idx").on(table.status),
  ]
);

// ========== 安全测试表 ==========
export const securityTests = pgTable(
  "security_tests",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 测试名称
    test_name: varchar("test_name", { length: 200 }).notNull(),
    // 安全类型：authentication（认证）、authorization（授权）、injection（注入）、xss（跨站脚本）、csrf（跨站请求伪造）
    security_type: varchar("security_type", { length: 50 }).notNull(),
    // 目标
    target: varchar("target", { length: 500 }),
    // 测试payload
    payload: jsonb("payload"),
    // 发现的漏洞
    vulnerabilities: jsonb("vulnerabilities"),
    // 风险等级：low, medium, high, critical
    risk_level: varchar("risk_level", { length: 20 }),
    // 状态：pending, scanning, completed, failed
    status: varchar("status", { length: 20 }).default("pending"),
    // 修复建议
    remediation_suggestions: text("remediation_suggestions"),
    // 扫描时间
    scanned_at: timestamp("scanned_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("security_tests_project_id_idx").on(table.project_id),
    index("security_tests_security_type_idx").on(table.security_type),
    index("security_tests_risk_level_idx").on(table.risk_level),
    index("security_tests_status_idx").on(table.status),
  ]
);

// ========== 测试开发表 ==========
export const testDevelopment = pgTable(
  "test_development",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 开发类型：automation（自动化测试）、unit（单元测试）、integration（集成测试）、e2e（端到端测试）
    dev_type: varchar("dev_type", { length: 30 }).notNull(),
    // 测试脚本
    test_scripts: jsonb("test_scripts"),
    // 测试框架
    test_framework: varchar("test_framework", { length: 100 }),
    // 覆盖率目标
    coverage_target: numeric("coverage_target", { precision: 5, scale: 2 }),
    // 实际覆盖率
    actual_coverage: numeric("actual_coverage", { precision: 5, scale: 2 }),
    // CI/CD配置
    ci_cd_config: jsonb("ci_cd_config"),
    // 状态：draft, active, deprecated
    status: varchar("status", { length: 20 }).default("draft"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("test_development_project_id_idx").on(table.project_id),
    index("test_development_dev_type_idx").on(table.dev_type),
    index("test_development_status_idx").on(table.status),
  ]
);

// ========== 测试运维表 ==========
export const testOperations = pgTable(
  "test_operations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 环境类型：dev（开发环境）、test（测试环境）、uat（UAT环境）、prod（生产环境）
    env_type: varchar("env_type", { length: 20 }).notNull(),
    // 环境配置
    env_config: jsonb("env_config"),
    // 服务器信息
    server_info: jsonb("server_info"),
    // 数据库配置
    database_config: jsonb("database_config"),
    // 监控配置
    monitoring_config: jsonb("monitoring_config"),
    // 环境状态
    env_status: varchar("env_status", { length: 30 }),
    // 最后检查时间
    last_check_at: timestamp("last_check_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("test_operations_project_id_idx").on(table.project_id),
    index("test_operations_env_type_idx").on(table.env_type),
    index("test_operations_env_status_idx").on(table.env_status),
  ]
);

// ========== 测试管理表 ==========
export const testManagement = pgTable(
  "test_management",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 管理类型：planning（测试计划）、execution（测试执行）、reporting（测试报告）、review（测试评审）
    management_type: varchar("management_type", { length: 30 }).notNull(),
    // 测试计划
    test_plan: jsonb("test_plan"),
    // 测试用例
    test_cases: jsonb("test_cases"),
    // 测试报告
    test_report: jsonb("test_report"),
    // 测试总结
    test_summary: text("test_summary"),
    // 负责人
    owner_id: varchar("owner_id", { length: 36 }),
    // 状态：draft, in_progress, completed, cancelled
    status: varchar("status", { length: 20 }).default("draft"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("test_management_project_id_idx").on(table.project_id),
    index("test_management_management_type_idx").on(table.management_type),
    index("test_management_status_idx").on(table.status),
  ]
);

// ========== 文档管理表 ==========
export const documentManagement = pgTable(
  "document_management",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 文档类型：test_plan（测试计划）、test_case（测试用例）、test_report（测试报告）、user_manual（用户手册）、api_doc（API文档）
    doc_type: varchar("doc_type", { length: 30 }).notNull(),
    // 文档标题
    title: varchar("title", { length: 200 }).notNull(),
    // 文档内容
    content: text("content"),
    // 文档版本
    version: varchar("version", { length: 20 }).default("1.0"),
    // 文档状态：draft, review, published, archived
    status: varchar("status", { length: 20 }).default("draft"),
    // 作者
    author_id: varchar("author_id", { length: 36 }),
    // 标签
    tags: jsonb("tags"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("document_management_project_id_idx").on(table.project_id),
    index("document_management_doc_type_idx").on(table.doc_type),
    index("document_management_status_idx").on(table.status),
  ]
);

// ========== AI智能体应用管理平台架构表 ==========
export const aiAgentPlatform = pgTable(
  "ai_agent_platform",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 平台名称
    platform_name: varchar("platform_name", { length: 200 }).notNull(),
    // 架构层级：application（应用层）、model（模型层）、infrastructure（基础设施层）
    architecture_layer: varchar("architecture_layer", { length: 30 }).notNull(),
    // 应用层：generative_ai（生成式AI）、expert_knowledge（专家知识库）、ai_customer_service（AI客服）、digital_human（数字人）、ocr（OCR识别）、smart_monitoring（智慧监控）、coding_assistant（编程助手）、multilingual_translation（多语言翻译）
    application_type: varchar("application_type", { length: 50 }),
    // 模型层：model_management（AI模型管理）、model_tuning（AI模型调优）、model_inference（AI模型推理服务）
    model_type: varchar("model_type", { length: 50 }),
    // 基础设施层：virtualization（虚拟化）、ops_management（运维管理）、disaster_recovery（容灾服务）、security_service（安全服务）
    infrastructure_type: varchar("infrastructure_type", { length: 50 }),
    // 配置
    config: jsonb("config"),
    // 状态
    status: varchar("status", { length: 20 }).default("active"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("ai_agent_platform_project_id_idx").on(table.project_id),
    index("ai_agent_platform_architecture_layer_idx").on(table.architecture_layer),
    index("ai_agent_platform_status_idx").on(table.status),
  ]
);

// ========== AI应用开发表 ==========
export const aiApplicationDevelopment = pgTable(
  "ai_application_development",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 开发类型：llm_ops（多种LLMOps服务）、rag_knowledge（RAG知识库）、version_management（版本管理）、agent（Agent）、workflow（Workflow）、plugin_management（插件管理）、data_isolation（数据隔离）
    dev_type: varchar("dev_type", { length: 50 }).notNull(),
    // 配置
    config: jsonb("config"),
    // 状态
    status: varchar("status", { length: 20 }).default("active"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("ai_application_development_project_id_idx").on(table.project_id),
    index("ai_application_development_dev_type_idx").on(table.dev_type),
  ]
);

// ========== 服务评测表 ==========
export const serviceEvaluation = pgTable(
  "service_evaluation",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 评测类型：hardware_compatibility（硬件适配性）、model_performance（模型计算效能）、high_load_stability（高负载稳定性）、elastic_scalability（弹性扩展能力）
    eval_type: varchar("eval_type", { length: 50 }).notNull(),
    // 评测结果
    eval_results: jsonb("eval_results"),
    // 评分
    score: numeric("score", { precision: 5, scale: 2 }),
    // 状态
    status: varchar("status", { length: 20 }).default("pending"),
    evaluated_at: timestamp("evaluated_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("service_evaluation_project_id_idx").on(table.project_id),
    index("service_evaluation_eval_type_idx").on(table.eval_type),
  ]
);

// ========== 门户运营表 ==========
export const portalOperations = pgTable(
  "portal_operations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }),
    // 运营类型：multi_tenant_management（多租户管理）、compute_quota（算力配额）、service_permissions（服务权限）、work_order_approval（工单审批）、billing_and_accounting（计费和账单）、multi_region_statistics（多域服务统计）、visualized_dashboard（可视化智慧大屏）
    ops_type: varchar("ops_type", { length: 50 }).notNull(),
    // 配置
    config: jsonb("config"),
    // 状态
    status: varchar("status", { length: 20 }).default("active"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("portal_operations_project_id_idx").on(table.project_id),
    index("portal_operations_ops_type_idx").on(table.ops_type),
  ]
);

// ========== 矩阵账号类型表 ==========
export const matrixAccountTypes = pgTable(
  "matrix_account_types",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    platform: varchar("platform", { length: 50 }).notNull(),
    // 账号类型：brand（品牌号）、persona（人设号）、influencer（达人号）、lead_gen（引流号）
    account_type: varchar("account_type", { length: 30 }).notNull(),
    account_name: varchar("account_name", { length: 100 }).notNull(),
    // 账号定位描述
    positioning: text("positioning"),
    // 内容策略
    content_strategy: jsonb("content_strategy"),
    // 增长目标
    growth_targets: jsonb("growth_targets"),
    // 层级：primary（主力60%）、secondary（备用40%）
    tier: varchar("tier", { length: 20 }).default("secondary"),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("matrix_account_types_project_id_idx").on(table.project_id),
    index("matrix_account_types_platform_idx").on(table.platform),
    index("matrix_account_types_account_type_idx").on(table.account_type),
  ]
);

// ========== 内容策略表（首图设计、标题撰写、内容优化） ==========
export const contentStrategies = pgTable(
  "content_strategies",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    content_id: varchar("content_id", { length: 36 }),
    // 首图设计
    cover_image_strategy: jsonb("cover_image_strategy"),
    // 标题撰写策略
    title_strategy: jsonb("title_strategy"),
    // 内容选择策略
    content_selection: jsonb("content_selection"),
    // 内容优化策略
    content_optimization: jsonb("content_optimization"),
    // A/B测试配置
    ab_test_config: jsonb("ab_test_config"),
    // 效果评估
    performance_metrics: jsonb("performance_metrics"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("content_strategies_project_id_idx").on(table.project_id),
  ]
);

// ========== 矩阵账号布局表（品牌专业号、KOL/KOC达人号、店员小号） ==========
export const matrixAccountLayouts = pgTable(
  "matrix_account_layouts",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 布局类型：brand_professional（品牌专业号）、kol_koc（KOL/KOC达人号）、store_clerk（店员小号）
    layout_type: varchar("layout_type", { length: 30 }).notNull(),
    // 账号分组
    account_groups: jsonb("account_groups"),
    // 定位策略
    positioning_strategy: jsonb("positioning_strategy"),
    // 影响力策略
    influence_strategy: jsonb("influence_strategy"),
    // 互动策略
    engagement_strategy: jsonb("engagement_strategy"),
    // 客户服务策略
    customer_service_strategy: jsonb("customer_service_strategy"),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("matrix_account_layouts_project_id_idx").on(table.project_id),
    index("matrix_account_layouts_layout_type_idx").on(table.layout_type),
  ]
);

// ========== 品牌形象保护表 ==========
export const brandProtections = pgTable(
  "brand_protections",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 保护类型：image（形象保护）、reputation（声誉保护）、copyright（版权保护）
    protection_type: varchar("protection_type", { length: 30 }).notNull(),
    // 保护规则
    protection_rules: jsonb("protection_rules"),
    // 监控关键词
    monitoring_keywords: jsonb("monitoring_keywords"),
    // 告警配置
    alert_config: jsonb("alert_config"),
    // 违规记录
    violation_records: jsonb("violation_records"),
    // 一致性检查
    consistency_checks: jsonb("consistency_checks"),
    is_active: boolean("is_active").default(true),
    last_check_at: timestamp("last_check_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("brand_protections_project_id_idx").on(table.project_id),
    index("brand_protections_protection_type_idx").on(table.protection_type),
  ]
);

// ========== 矩阵运营4个注意点表（定位清晰、内容质量、数据分析、品牌保护） ==========
export const matrixOperationChecklists = pgTable(
  "matrix_operation_checklists",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 检查项：positioning（定位清晰）、content_quality（内容质量）、data_analysis（数据分析）、brand_protection（品牌保护）
    checklist_item: varchar("checklist_item", { length: 50 }).notNull(),
    // 检查状态：pending, passed, failed, needs_improvement
    status: varchar("status", { length: 30 }).default("pending"),
    // 检查结果
    check_results: jsonb("check_results"),
    // 改进建议
    improvement_suggestions: text("improvement_suggestions"),
    // 上次检查时间
    last_checked_at: timestamp("last_checked_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("matrix_operation_checklists_project_id_idx").on(table.project_id),
    index("matrix_operation_checklists_checklist_item_idx").on(table.checklist_item),
  ]
);

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

// ========== AI向导项目表 ==========
export const aiWizardProjects = pgTable(
  "ai_wizard_projects",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    // 当前步骤
    current_step: integer("current_step").default(1),
    // 状态
    status: varchar("status", { length: 20 }).default("draft"), // draft, active, paused, completed
    // 步骤数据
    step1_data: jsonb("step1_data"), // 基础信息
    step2_data: jsonb("step2_data"), // 产品信息
    step3_data: jsonb("step3_data"), // 目标客户
    step4_data: jsonb("step4_data"), // 内容策略
    step5_data: jsonb("step5_data"), // 平台选择
    step6_data: jsonb("step6_data"), // 账号配置
    step7_data: jsonb("step7_data"), // IP检查
    // AI生成的推荐
    ai_recommendations: jsonb("ai_recommendations"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("ai_wizard_projects_user_id_idx").on(table.user_id),
    index("ai_wizard_projects_status_idx").on(table.status),
  ]
);

// ========== AI客服对话表 ==========
export const aiAssistantConversations = pgTable(
  "ai_assistant_conversations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    title: varchar("title", { length: 200 }),
    context_type: varchar("context_type", { length: 50 }), // general, troubleshooting, tutorial, optimization
    is_active: boolean("is_active").default(true),
    last_message_at: timestamp("last_message_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("ai_assistant_conversations_user_id_idx").on(table.user_id),
    index("ai_assistant_conversations_is_active_idx").on(table.is_active),
    index("ai_assistant_conversations_context_type_idx").on(table.context_type),
  ]
);

// ========== AI客服消息表 ==========
export const aiAssistantMessages = pgTable(
  "ai_assistant_messages",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    conversation_id: varchar("conversation_id", { length: 36 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(), // user, assistant, system
    content: text("content").notNull(),
    // 消息类型
    message_type: varchar("message_type", { length: 50 }).default("text"), // text, suggestion, error, confirmation
    // 相关操作
    actions: jsonb("actions"), // 快捷操作按钮
    // 解决的问题
    resolved_issue: jsonb("resolved_issue"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("ai_assistant_messages_conversation_id_idx").on(table.conversation_id),
    index("ai_assistant_messages_created_at_idx").on(table.created_at),
  ]
);

// ========== 预设场景模板表 ==========
export const presetScenarios = pgTable(
  "preset_scenarios",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 50 }).notNull(), // growth, sales, brand, community
    // 场景配置
    config: jsonb("config").notNull(),
    // AI生成的说明
    ai_guide: text("ai_guide"),
    // 是否启用
    is_active: boolean("is_active").default(true),
    // 使用统计
    use_count: integer("use_count").default(0),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("preset_scenarios_category_idx").on(table.category),
    index("preset_scenarios_is_active_idx").on(table.is_active),
  ]
);

// ========== 智能优化任务表 ==========
export const smartOptimizationTasks = pgTable(
  "smart_optimization_tasks",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    project_id: varchar("project_id", { length: 36 }),
    // 用户目标
    user_goal: text("user_goal").notNull(),
    // AI生成的方案
    optimization_plan: jsonb("optimization_plan"),
    // 执行状态
    status: varchar("status", { length: 20 }).default("pending"), // pending, planning, executing, completed, failed
    // 执行结果
    results: jsonb("results"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("smart_optimization_tasks_user_id_idx").on(table.user_id),
    index("smart_optimization_tasks_project_id_idx").on(table.project_id),
    index("smart_optimization_tasks_status_idx").on(table.status),
  ]
);

// ========== 矩阵引流项目表 ==========
export const matrixLeadGenProjects = pgTable(
  "matrix_lead_gen_projects",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    // 当前执行阶段（1-6步矩阵引流流程）
    current_phase: integer("current_phase").default(1),
    // 项目状态：draft, active, paused, completed, reviewing
    status: varchar("status", { length: 20 }).default("draft"),
    // 阶段1：选主平台
    phase1_data: jsonb("phase1_data"),
    // 阶段2：定账号角色
    phase2_data: jsonb("phase2_data"),
    // 阶段3：做内容排期
    phase3_data: jsonb("phase3_data"),
    // 阶段4：安排互动任务
    phase4_data: jsonb("phase4_data"),
    // 阶段5：设计承接入口
    phase5_data: jsonb("phase5_data"),
    // 阶段6：每周复盘
    phase6_data: jsonb("phase6_data"),
    // AI生成的推荐方案
    ai_recommendations: jsonb("ai_recommendations"),
    // 执行统计
    execution_stats: jsonb("execution_stats"),
    // 试点验证
    is_pilot: boolean("is_pilot").default(false),
    pilot_period_days: integer("pilot_period_days").default(28),
    started_at: timestamp("started_at", { withTimezone: true }),
    completed_at: timestamp("completed_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("matrix_lead_gen_projects_user_id_idx").on(table.user_id),
    index("matrix_lead_gen_projects_status_idx").on(table.status),
    index("matrix_lead_gen_projects_current_phase_idx").on(table.current_phase),
    index("matrix_lead_gen_projects_created_at_idx").on(table.created_at),
  ]
);

// ========== 平台角色表 ==========
export const platformRoles = pgTable(
  "platform_roles",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    platform: varchar("platform", { length: 50 }).notNull(),
    // 平台角色：reach（触达入口）、trust（信任建设）、engagement（互动沉淀）、conversion（线索承接）
    role: varchar("role", { length: 30 }).notNull(),
    // 优先级：primary（主平台）、secondary（辅助平台）
    priority: varchar("priority", { length: 20 }).default("secondary"),
    // 账号配置
    account_config: jsonb("account_config"),
    // 内容策略
    content_strategy: jsonb("content_strategy"),
    // KPI目标
    kpi_targets: jsonb("kpi_targets"),
    // 状态
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("platform_roles_project_id_idx").on(table.project_id),
    index("platform_roles_platform_idx").on(table.platform),
    index("platform_roles_role_idx").on(table.role),
  ]
);

// ========== 账号角色分组表 ==========
export const accountGroups = pgTable(
  "account_groups",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    platform: varchar("platform", { length: 50 }).notNull(),
    group_name: varchar("group_name", { length: 100 }).notNull(),
    // 分组类型：market（市场）、content（内容方向）、product（产品线）、stage（客户阶段）
    group_type: varchar("group_type", { length: 30 }).notNull(),
    // 账号列表
    account_ids: jsonb("account_ids"),
    // 策略配置
    strategy_config: jsonb("strategy_config"),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("account_groups_project_id_idx").on(table.project_id),
    index("account_groups_platform_idx").on(table.platform),
    index("account_groups_group_type_idx").on(table.group_type),
  ]
);

// ========== 内容排期表 ==========
export const contentSchedules = pgTable(
  "content_schedules",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 主题
    theme: varchar("theme", { length: 200 }).notNull(),
    // 内容形式：short_video（短视频）、image_text（图文）、case（案例）、qa（问答）、tutorial（教程）
    content_formats: jsonb("content_formats").notNull(),
    // 平台分配
    platform_allocation: jsonb("platform_allocation"),
    // 发布排期
    publish_schedule: jsonb("publish_schedule"),
    // 素材准备
    materials: jsonb("materials"),
    // AI生成的内容建议
    ai_content_suggestions: jsonb("ai_content_suggestions"),
    // 状态：draft, scheduled, publishing, completed
    status: varchar("status", { length: 20 }).default("draft"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("content_schedules_project_id_idx").on(table.project_id),
    index("content_schedules_status_idx").on(table.status),
    index("content_schedules_created_at_idx").on(table.created_at),
  ]
);

// ========== 互动任务表 ==========
export const engagementTasks = pgTable(
  "engagement_tasks",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 任务类型：comment（评论）、direct_message（私信）、like（点赞）、share（转发）、collect（收藏）
    task_type: varchar("task_type", { length: 30 }).notNull(),
    // 目标平台
    platform: varchar("platform", { length: 50 }).notNull(),
    // 目标账号
    target_accounts: jsonb("target_accounts"),
    // 跟进规则
    follow_up_rules: jsonb("follow_up_rules"),
    // 优先级
    priority: varchar("priority", { length: 20 }).default("medium"),
    // 分配给
    assigned_to: varchar("assigned_to", { length: 36 }),
    // 状态：pending, in_progress, completed, failed
    status: varchar("status", { length: 20 }).default("pending"),
    // 执行结果
    results: jsonb("results"),
    scheduled_at: timestamp("scheduled_at", { withTimezone: true }),
    started_at: timestamp("started_at", { withTimezone: true }),
    completed_at: timestamp("completed_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("engagement_tasks_project_id_idx").on(table.project_id),
    index("engagement_tasks_task_type_idx").on(table.task_type),
    index("engagement_tasks_platform_idx").on(table.platform),
    index("engagement_tasks_status_idx").on(table.status),
    index("engagement_tasks_scheduled_at_idx").on(table.scheduled_at),
  ]
);

// ========== 线索承接入口表 ==========
export const leadCapturePoints = pgTable(
  "lead_capture_points",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 承接入口类型：form（表单）、whatsapp（WhatsApp）、private_domain（私域）、crm（CRM）、consultation（咨询页）
    capture_type: varchar("capture_type", { length: 30 }).notNull(),
    // 来源平台
    source_platform: varchar("source_platform", { length: 50 }).notNull(),
    // 入口配置
    entry_config: jsonb("entry_config"),
    // 引导文案
    guide_text: text("guide_text"),
    // 转化跟踪
    tracking_config: jsonb("tracking_config"),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("lead_capture_points_project_id_idx").on(table.project_id),
    index("lead_capture_points_capture_type_idx").on(table.capture_type),
    index("lead_capture_points_source_platform_idx").on(table.source_platform),
  ]
);

// ========== 线索表 ==========
export const leads = pgTable(
  "leads",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 来源信息
    source_platform: varchar("source_platform", { length: 50 }).notNull(),
    source_content: varchar("source_content", { length: 500 }),
    source_engagement: varchar("source_engagement", { length: 50 }), // comment, dm, etc.
    // 客户信息
    customer_info: jsonb("customer_info"),
    // 联系方式
    contact_info: jsonb("contact_info"),
    // 需求描述
    requirements: text("requirements"),
    // 线索质量评分（0-100）
    quality_score: integer("quality_score"),
    // 线索阶段：new, contacted, qualified, proposal, closing, won, lost
    stage: varchar("stage", { length: 20 }).default("new"),
    // 分配给
    assigned_to: varchar("assigned_to", { length: 36 }),
    // 标签
    tags: jsonb("tags"),
    // 跟进记录
    follow_ups: jsonb("follow_ups"),
    // 承接入口
    capture_point_id: varchar("capture_point_id", { length: 36 }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("leads_project_id_idx").on(table.project_id),
    index("leads_source_platform_idx").on(table.source_platform),
    index("leads_stage_idx").on(table.stage),
    index("leads_quality_score_idx").on(table.quality_score),
    index("leads_created_at_idx").on(table.created_at),
  ]
);

// ========== 周复盘表 ==========
export const weeklyReviews = pgTable(
  "weekly_reviews",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 周次
    week_number: integer("week_number").notNull(),
    // 日期范围
    start_date: timestamp("start_date", { withTimezone: true }).notNull(),
    end_date: timestamp("end_date", { withTimezone: true }).notNull(),
    // 平台表现
    platform_performance: jsonb("platform_performance"),
    // 账号表现
    account_performance: jsonb("account_performance"),
    // 内容表现
    content_performance: jsonb("content_performance"),
    // 有效线索分析
    lead_analysis: jsonb("lead_analysis"),
    // 成功经验
    successes: jsonb("successes"),
    // 问题与改进
    issues_and_improvements: jsonb("issues_and_improvements"),
    // 下周计划
    next_week_plan: jsonb("next_week_plan"),
    // AI分析建议
    ai_analysis: jsonb("ai_analysis"),
    // 是否完成复盘
    is_completed: boolean("is_completed").default(false),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("weekly_reviews_project_id_idx").on(table.project_id),
    index("weekly_reviews_week_number_idx").on(table.week_number),
    index("weekly_reviews_is_completed_idx").on(table.is_completed),
  ]
);

// ========== 试点验证表 ==========
export const pilotValidations = pgTable(
  "pilot_validations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: varchar("project_id", { length: 36 }).notNull(),
    // 试点项
    pilot_item: varchar("pilot_item", { length: 100 }).notNull(),
    // 验证目标
    validation_goal: text("validation_goal").notNull(),
    // 当前状态
    current_status: varchar("current_status", { length: 20 }).default("pending"),
    // 是否通过
    is_passed: boolean("is_passed"),
    // 验证结果
    results: jsonb("results"),
    // 失败时的修复建议
    fix_suggestions: text("fix_suggestions"),
    validated_at: timestamp("validated_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("pilot_validations_project_id_idx").on(table.project_id),
    index("pilot_validations_pilot_item_idx").on(table.pilot_item),
    index("pilot_validations_is_passed_idx").on(table.is_passed),
  ]
);
