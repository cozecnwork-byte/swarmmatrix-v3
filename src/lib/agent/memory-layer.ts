/**
 * 9层智能体架构 - 第二层：记忆层
 * 包含对话历史短期记忆、知识库长期记忆及当前任务状态工作记忆
 */

import { getSupabaseClient } from "@/storage/database/supabase-client";

export type MemoryType = "short_term" | "long_term" | "working";

export interface MemoryItem {
  id: string;
  type: MemoryType;
  content: Record<string, unknown>;
  importance: number;
  tags: string[];
  createdAt: Date;
  accessedAt: Date;
  accessCount: number;
  expiresAt?: Date;
}

export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface TaskState {
  taskId: string;
  currentStep: number;
  totalSteps: number;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  data: Record<string, unknown>;
}

export class MemoryLayer {
  private supabase: ReturnType<typeof getSupabaseClient>;
  private shortTermCache: Map<string, ConversationMessage[]> = new Map();
  private workingMemory: Map<string, TaskState> = new Map();

  constructor() {
    // 延迟初始化supabase客户端
    this.supabase = getSupabaseClient();
  }

  /**
   * 添加对话消息（短期记忆）
   */
  async addConversationMessage(
    sessionId: string,
    message: ConversationMessage
  ): Promise<void> {
    if (!this.shortTermCache.has(sessionId)) {
      this.shortTermCache.set(sessionId, []);
    }
    this.shortTermCache.get(sessionId)!.push(message);

    // 保持短期记忆在合理大小
    const messages = this.shortTermCache.get(sessionId)!;
    if (messages.length > 50) {
      messages.shift();
    }
  }

  /**
   * 获取对话历史
   */
  getConversationHistory(sessionId: string): ConversationMessage[] {
    return this.shortTermCache.get(sessionId) || [];
  }

  /**
   * 清除对话历史
   */
  clearConversation(sessionId: string): void {
    this.shortTermCache.delete(sessionId);
  }

  /**
   * 设置工作记忆（当前任务状态）
   */
  setTaskState(sessionId: string, state: TaskState): void {
    this.workingMemory.set(sessionId, state);
  }

  /**
   * 获取工作记忆
   */
  getTaskState(sessionId: string): TaskState | undefined {
    return this.workingMemory.get(sessionId);
  }

  /**
   * 更新任务进度
   */
  updateTaskProgress(
    sessionId: string,
    progress: Partial<TaskState>
  ): TaskState | undefined {
    const current = this.workingMemory.get(sessionId);
    if (current) {
      const updated = { ...current, ...progress };
      this.workingMemory.set(sessionId, updated);
      return updated;
    }
    return undefined;
  }

  /**
   * 存储长期记忆到数据库
   */
  async storeLongTermMemory(
    userId: string,
    taskId: string,
    content: Record<string, unknown>,
    tags: string[] = [],
    importance: number = 0.5
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from("agent_memory")
      .insert({
        user_id: userId,
        task_id: taskId,
        memory_type: "long_term",
        content,
        tags,
        importance,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  }

  /**
   * 检索长期记忆
   */
  async retrieveLongTermMemory(
    userId: string,
    query: string,
    limit: number = 5
  ): Promise<MemoryItem[]> {
    // 基于标签或内容关键词检索
    const { data, error } = await this.supabase
      .from("agent_memory")
      .select("*")
      .eq("user_id", userId)
      .eq("memory_type", "long_term")
      .textSearch("content", query)
      .order("importance", { ascending: false })
      .order("access_count", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // 更新访问计数
    if (data && data.length > 0) {
      const ids = data.map((d) => d.id);
      await this.supabase
        .from("agent_memory")
        .update({
          access_count: this.supabase.rpc("increment"),
          last_accessed_at: new Date().toISOString(),
        })
        .in("id", ids);
    }

    return data.map(this.mapToMemoryItem);
  }

  /**
   * 获取最近的相关记忆
   */
  async getRecentMemories(
    userId: string,
    limit: number = 10
  ): Promise<MemoryItem[]> {
    const { data, error } = await this.supabase
      .from("agent_memory")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(this.mapToMemoryItem);
  }

  /**
   * 清理过期的短期记忆
   */
  async cleanupExpiredMemories(userId: string): Promise<number> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("agent_memory")
      .delete()
      .eq("user_id", userId)
      .eq("memory_type", "short_term")
      .lt("expires_at", now)
      .select("id");

    if (error) throw error;
    return data?.length || 0;
  }

  private mapToMemoryItem(data: Record<string, unknown>): MemoryItem {
    return {
      id: data.id as string,
      type: data.memory_type as MemoryType,
      content: data.content as Record<string, unknown>,
      importance: Number(data.importance) || 0.5,
      tags: (data.tags as string[]) || [],
      createdAt: new Date(data.created_at as string),
      accessedAt: new Date(
        ((data.last_accessed_at as string) || data.created_at) as string
      ),
      accessCount: (data.access_count as number) || 0,
      expiresAt: data.expires_at
        ? new Date(data.expires_at as string)
        : undefined,
    };
  }
}

export const memoryLayer = new MemoryLayer();
