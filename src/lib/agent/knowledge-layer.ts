/**
 * 9层智能体架构 - 第九层：数据源/知识库层
 * 包含向量数据库、文档知识库及结构化数据存储
 */

import { getSupabaseClient } from "@/storage/database/supabase-client";
import {
  KnowledgeClient,
  Config,
  DataSourceType,
  ChunkConfig,
} from "coze-coding-dev-sdk";

export interface DataSource {
  id: string;
  type: "database" | "knowledge" | "api" | "file";
  name: string;
  config: Record<string, unknown>;
  status: "active" | "inactive" | "error";
}

export interface KnowledgeEntry {
  id: string;
  content: string;
  source: string;
  metadata?: Record<string, unknown>;
  embedding?: number[];
  createdAt: Date;
}

export class KnowledgeLayer {
  private supabase: ReturnType<typeof getSupabaseClient>;
  private knowledgeClient: KnowledgeClient;
  private dataSources: Map<string, DataSource> = new Map();

  constructor() {
    // 延迟初始化supabase客户端
    this.supabase = getSupabaseClient();
    const config = new Config();
    this.knowledgeClient = new KnowledgeClient(config);
    this.initializeDataSources();
  }

  /**
   * 初始化数据源
   */
  private initializeDataSources(): void {
    // Supabase数据库
    this.dataSources.set("supabase", {
      id: "supabase",
      type: "database",
      name: "Supabase PostgreSQL",
      config: {},
      status: "active",
    });

    // 向量知识库
    this.dataSources.set("knowledge", {
      id: "knowledge",
      type: "knowledge",
      name: "向量知识库",
      config: {},
      status: "active",
    });
  }

  /**
   * 添加数据源
   */
  addDataSource(source: DataSource): void {
    this.dataSources.set(source.id, source);
  }

  /**
   * 获取所有数据源
   */
  getDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * 向知识库添加文档
   */
  async addDocument(
    content: string,
    options?: {
      tableName?: string;
      source?: string;
      chunkConfig?: ChunkConfig;
    }
  ): Promise<{ success: boolean; docId?: string; error?: string }> {
    try {
      const response = await this.knowledgeClient.addDocuments(
        [{ source: DataSourceType.TEXT, raw_data: content }],
        options?.tableName || "coze_doc_knowledge",
        options?.chunkConfig
      );

      if (response.code === 0 && response.doc_ids && response.doc_ids.length > 0) {
        return { success: true, docId: response.doc_ids[0] };
      }

      return { success: false, error: response.msg };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "添加失败",
      };
    }
  }

  /**
   * 从URL添加文档
   */
  async addDocumentFromUrl(
    url: string,
    options?: {
      tableName?: string;
      chunkConfig?: ChunkConfig;
    }
  ): Promise<{ success: boolean; docId?: string; error?: string }> {
    try {
      const response = await this.knowledgeClient.addDocuments(
        [{ source: DataSourceType.URL, url }],
        options?.tableName || "coze_doc_knowledge",
        options?.chunkConfig
      );

      if (response.code === 0 && response.doc_ids && response.doc_ids.length > 0) {
        return { success: true, docId: response.doc_ids[0] };
      }

      return { success: false, error: response.msg };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "添加失败",
      };
    }
  }

  /**
   * 语义搜索知识库
   */
  async search(
    query: string,
    options?: {
      tableNames?: string[];
      topK?: number;
      minScore?: number;
    }
  ): Promise<KnowledgeEntry[]> {
    try {
      const response = await this.knowledgeClient.search(
        query,
        options?.tableNames,
        options?.topK || 5,
        options?.minScore
      );

      if (response.code === 0 && response.chunks) {
        return response.chunks.map((chunk) => ({
          id: chunk.doc_id || "",
          content: chunk.content || "",
          source: "knowledge",
          metadata: { score: chunk.score || 0 },
          createdAt: new Date(),
        }));
      }

      return [];
    } catch (error) {
      console.error("知识库搜索失败:", error);
      return [];
    }
  }

  /**
   * 查询数据库
   */
  async queryDatabase<T>(
    table: string,
    options?: {
      select?: string;
      filter?: Record<string, unknown>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<{ success: boolean; data?: T[]; error?: string }> {
    try {
      let query = this.supabase.from(table).select(options?.select || "*");

      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (options?.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as T[] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "查询失败",
      };
    }
  }

  /**
   * 写入数据库
   */
  async writeToDatabase(
    table: string,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert(data)
        .select("id")
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, id: result.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "写入失败",
      };
    }
  }

  /**
   * 更新数据库记录
   */
  async updateDatabase(
    table: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from(table)
        .update(data)
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "更新失败",
      };
    }
  }

  /**
   * 删除数据库记录
   */
  async deleteFromDatabase(
    table: string,
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.from(table).delete().eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "删除失败",
      };
    }
  }

  /**
   * 批量插入
   */
  async batchInsert(
    table: string,
    data: Record<string, unknown>[]
  ): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const { error } = await this.supabase.from(table).insert(data);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, count: data.length };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "批量插入失败",
      };
    }
  }

  /**
   * 获取引流模板
   */
  async getLeadTemplates(
    category?: string
  ): Promise<{ success: boolean; data?: unknown[]; error?: string }> {
    const query = this.supabase
      .from("templates")
      .select("*")
      .eq("type", "content")
      .eq("is_public", true);

    if (category) {
      query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  /**
   * 获取工作流模板
   */
  async getWorkflowTemplates(): Promise<{
    success: boolean;
    data?: unknown[];
    error?: string;
  }> {
    const { data, error } = await this.supabase
      .from("templates")
      .select("*")
      .eq("type", "workflow")
      .eq("is_public", true);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }
}

export const knowledgeLayer = new KnowledgeLayer();
