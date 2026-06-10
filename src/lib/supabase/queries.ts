import { supabase, createServiceClient } from './client';
import type { 
  User, 
  Project, 
  PlatformAccount, 
  ContentTemplate, 
  PublishTask, 
  Lead, 
  ScheduledTask, 
  AgentTask, 
  Workflow, 
  AnalyticsData 
} from './types';

// ============================================
// 项目相关查询
// ============================================

// 获取用户的所有项目
export async function getUserProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 创建新项目
export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 更新项目
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// 平台账号相关查询
// ============================================

// 获取用户的所有平台账号
export async function getUserPlatformAccounts(userId: string): Promise<PlatformAccount[]> {
  const { data, error } = await supabase
    .from('platform_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 创建平台账号
export async function createPlatformAccount(account: Omit<PlatformAccount, 'id' | 'created_at' | 'updated_at'>): Promise<PlatformAccount> {
  const { data, error } = await supabase
    .from('platform_accounts')
    .insert([account])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// 发布任务相关查询
// ============================================

// 获取用户的发布任务
export async function getUserPublishTasks(userId: string, limit = 50): Promise<PublishTask[]> {
  const { data, error } = await supabase
    .from('publish_tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 创建发布任务
export async function createPublishTask(task: Omit<PublishTask, 'id' | 'created_at' | 'updated_at'>): Promise<PublishTask> {
  const { data, error } = await supabase
    .from('publish_tasks')
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 更新发布任务状态
export async function updatePublishTaskStatus(id: string, status: PublishTask['status'], errorMessage?: string): Promise<PublishTask> {
  const updates: Partial<PublishTask> = { status };
  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  }
  if (errorMessage) {
    updates.error_message = errorMessage;
  }

  const { data, error } = await supabase
    .from('publish_tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// 线索相关查询
// ============================================

// 获取用户的线索
export async function getUserLeads(userId: string, limit = 100): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// 创建线索
export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 更新线索状态
export async function updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// 内容模板相关查询
// ============================================

// 获取用户的内容模板
export async function getUserContentTemplates(userId: string): Promise<ContentTemplate[]> {
  const { data, error } = await supabase
    .from('content_templates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 获取公开模板
export async function getPublicContentTemplates(): Promise<ContentTemplate[]> {
  const { data, error } = await supabase
    .from('content_templates')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================
// 智能体任务相关查询
// ============================================

// 创建智能体任务
export async function createAgentTask(task: Omit<AgentTask, 'id' | 'created_at' | 'updated_at'>): Promise<AgentTask> {
  const { data, error } = await supabase
    .from('agent_tasks')
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 更新智能体任务
export async function updateAgentTask(id: string, updates: Partial<AgentTask>): Promise<AgentTask> {
  const { data, error } = await supabase
    .from('agent_tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 获取用户的智能体任务
export async function getUserAgentTasks(userId: string, limit = 20): Promise<AgentTask[]> {
  const { data, error } = await supabase
    .from('agent_tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ============================================
// 数据分析相关查询
// ============================================

// 添加分析数据
export async function addAnalyticsData(data: Omit<AnalyticsData, 'id' | 'created_at'>): Promise<AnalyticsData> {
  const { data: result, error } = await supabase
    .from('analytics_data')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

// 获取项目分析数据
export async function getProjectAnalytics(projectId: string, days = 30): Promise<AnalyticsData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('analytics_data')
    .select('*')
    .eq('project_id', projectId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export default {
  getUserProjects,
  createProject,
  updateProject,
  getUserPlatformAccounts,
  createPlatformAccount,
  getUserPublishTasks,
  createPublishTask,
  updatePublishTaskStatus,
  getUserLeads,
  createLead,
  updateLeadStatus,
  getUserContentTemplates,
  getPublicContentTemplates,
  createAgentTask,
  updateAgentTask,
  getUserAgentTasks,
  addAnalyticsData,
  getProjectAnalytics,
};
