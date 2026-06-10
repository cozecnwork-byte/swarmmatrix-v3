// ============================================
// 数据库类型定义
// ============================================

// 用户表
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// 项目表
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  platforms: string[];
  countries: string[];
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

// 平台账号表
export interface PlatformAccount {
  id: string;
  user_id: string;
  project_id?: string;
  platform: string;
  username: string;
  access_token?: string;
  refresh_token?: string;
  status: 'active' | 'inactive' | 'error';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 内容模板表
export interface ContentTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  content_type: 'video' | 'image' | 'text' | 'live';
  platforms: string[];
  template_data: Record<string, any>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// 发布任务表
export interface PublishTask {
  id: string;
  user_id: string;
  project_id?: string;
  platform_account_id?: string;
  template_id?: string;
  platform: string;
  content: string;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  scheduled_at?: string;
  published_at?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 线索表
export interface Lead {
  id: string;
  user_id: string;
  project_id?: string;
  source_platform: string;
  source_content_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 定时任务表
export interface ScheduledTask {
  id: string;
  user_id: string;
  project_id?: string;
  name: string;
  task_type: 'publish' | 'engagement' | 'analytics' | 'custom';
  schedule: string; // cron表达式
  config: Record<string, any>;
  status: 'active' | 'paused' | 'error';
  last_run_at?: string;
  next_run_at?: string;
  created_at: string;
  updated_at: string;
}

// 智能体任务表
export interface AgentTask {
  id: string;
  user_id: string;
  project_id?: string;
  agent_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, any>;
  output?: Record<string, any>;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// 工作流表
export interface Workflow {
  id: string;
  user_id: string;
  project_id?: string;
  name: string;
  description?: string;
  steps: Record<string, any>[];
  status: 'draft' | 'active' | 'paused';
  created_at: string;
  updated_at: string;
}

// 数据分析表
export interface AnalyticsData {
  id: string;
  user_id: string;
  project_id?: string;
  platform?: string;
  data_type: 'impressions' | 'clicks' | 'leads' | 'engagement' | 'conversions';
  value: number;
  date: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// 数据库表名
export type DatabaseTables = {
  users: User;
  projects: Project;
  platform_accounts: PlatformAccount;
  content_templates: ContentTemplate;
  publish_tasks: PublishTask;
  leads: Lead;
  scheduled_tasks: ScheduledTask;
  agent_tasks: AgentTask;
  workflows: Workflow;
  analytics_data: AnalyticsData;
};
