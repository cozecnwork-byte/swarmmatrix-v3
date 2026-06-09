/**
 * 9层智能体架构 - 第八层：工具层
 * 集成搜索引擎、计算器、API调用等实用工具
 */

import { KnowledgeClient, Config, DataSourceType } from "coze-coding-dev-sdk";

// 简化的web搜索函数
async function webSearch(query: string): Promise<{ success: boolean; results?: Array<{ title: string; url: string; snippet: string }>; error?: string }> {
  // 这里是简化实现，实际应调用搜索API
  return { success: true, results: [{ title: query, url: `https://example.com/search?q=${encodeURIComponent(query)}`, snippet: `搜索结果: ${query}` }] };
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: ToolParameter[];
  execute: (params: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  description: string;
  default?: unknown;
}

export class ToolLayer {
  private tools: Map<string, ToolDefinition> = new Map();
  private knowledgeClient: KnowledgeClient;

  constructor() {
    const config = new Config();
    this.knowledgeClient = new KnowledgeClient(config);
    this.registerDefaultTools();
  }

  /**
   * 注册默认工具
   */
  private registerDefaultTools(): void {
    // 网络搜索工具
    this.registerTool({
      id: "web_search",
      name: "网络搜索",
      description: "搜索互联网信息",
      category: "search",
      parameters: [
        {
          name: "query",
          type: "string",
          required: true,
          description: "搜索关键词",
        },
      ],
      execute: async (params) => {
        try {
          const results = await webSearch(params.query as string);
          return { success: true, data: results };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "搜索失败",
          };
        }
      },
    });

    // 知识库搜索工具
    this.registerTool({
      id: "knowledge_search",
      name: "知识库搜索",
      description: "在知识库中搜索相关信息",
      category: "knowledge",
      parameters: [
        {
          name: "query",
          type: "string",
          required: true,
          description: "搜索内容",
        },
        {
          name: "topK",
          type: "number",
          required: false,
          description: "返回结果数量",
          default: 5,
        },
      ],
      execute: async (params) => {
        try {
          const response = await this.knowledgeClient.search(
            params.query as string,
            undefined,
            (params.topK as number) || 5
          );
          return {
            success: response.code === 0,
            data: response.chunks,
            error: response.msg,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "搜索失败",
          };
        }
      },
    });

    // 知识库添加工具
    this.registerTool({
      id: "knowledge_add",
      name: "知识库添加",
      description: "将内容添加到知识库",
      category: "knowledge",
      parameters: [
        {
          name: "content",
          type: "string",
          required: true,
          description: "要添加的内容",
        },
        {
          name: "tableName",
          type: "string",
          required: false,
          description: "数据集名称",
          default: "coze_doc_knowledge",
        },
      ],
      execute: async (params) => {
        try {
          const response = await this.knowledgeClient.addDocuments(
            [
              {
                source: DataSourceType.TEXT,
                raw_data: params.content as string,
              },
            ],
            (params.tableName as string) || "coze_doc_knowledge"
          );
          return {
            success: response.code === 0,
            data: response.doc_ids,
            error: response.msg,
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "添加失败",
          };
        }
      },
    });

    // 计算器工具
    this.registerTool({
      id: "calculator",
      name: "计算器",
      description: "执行数学计算",
      category: "utility",
      parameters: [
        {
          name: "expression",
          type: "string",
          required: true,
          description: "数学表达式",
        },
      ],
      execute: async (params) => {
        try {
          const expression = params.expression as string;
          const result = Function(
            `"use strict"; return (${expression.replace(/[^0-9+\-*/().%\s]/g, "")})`
          )();
          return { success: true, data: result };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "计算失败",
          };
        }
      },
    });

    // 日期工具
    this.registerTool({
      id: "datetime",
      name: "日期时间",
      description: "获取或处理日期时间",
      category: "utility",
      parameters: [
        {
          name: "action",
          type: "string",
          required: true,
          description: "操作：now, format, add, diff",
        },
        {
          name: "value",
          type: "string",
          required: false,
          description: "日期值或格式",
        },
      ],
      execute: async (params) => {
        const action = params.action as string;
        const now = new Date();

        switch (action) {
          case "now":
            return { success: true, data: now.toISOString() };
          case "format":
            return {
              success: true,
              data: now.toLocaleString("zh-CN", {
                timeZone: "Asia/Shanghai",
              }),
            };
          default:
            return { success: true, data: now.toISOString() };
        }
      },
    });

    // JSON处理工具
    this.registerTool({
      id: "json_processor",
      name: "JSON处理",
      description: "解析或生成JSON",
      category: "utility",
      parameters: [
        {
          name: "action",
          type: "string",
          required: true,
          description: "操作：parse, stringify",
        },
        {
          name: "data",
          type: "string",
          required: true,
          description: "JSON字符串或对象",
        },
      ],
      execute: async (params) => {
        try {
          const action = params.action as string;
          const data = params.data;

          if (action === "parse") {
            return { success: true, data: JSON.parse(data as string) };
          } else {
            return { success: true, data: JSON.stringify(data) };
          }
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "处理失败",
          };
        }
      },
    });

    // 平台账号工具
    this.registerTool({
      id: "platform_list",
      name: "获取平台列表",
      description: "获取已连接的平台账号",
      category: "platform",
      parameters: [],
      execute: async () => {
        return {
          success: true,
          data: [
            { id: "douyin", name: "抖音", status: "connected" },
            { id: "xiaohongshu", name: "小红书", status: "connected" },
            { id: "bilibili", name: "B站", status: "pending" },
            { id: "kuaishou", name: "快手", status: "pending" },
          ],
        };
      },
    });
  }

  /**
   * 注册自定义工具
   */
  registerTool(tool: ToolDefinition): void {
    this.tools.set(tool.id, tool);
  }

  /**
   * 获取所有工具
   */
  getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * 按类别获取工具
   */
  getToolsByCategory(category: string): ToolDefinition[] {
    return this.getAllTools().filter((t) => t.category === category);
  }

  /**
   * 获取工具定义
   */
  getTool(toolId: string): ToolDefinition | undefined {
    return this.tools.get(toolId);
  }

  /**
   * 执行工具
   */
  async executeTool(
    toolId: string,
    params: Record<string, unknown>
  ): Promise<ToolResult> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      return { success: false, error: `工具 ${toolId} 不存在` };
    }

    // 验证必需参数
    for (const param of tool.parameters) {
      if (param.required && params[param.name] === undefined) {
        if (param.default !== undefined) {
          params[param.name] = param.default;
        } else {
          return {
            success: false,
            error: `缺少必需参数: ${param.name}`,
          };
        }
      }
    }

    try {
      return await tool.execute(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "执行失败",
      };
    }
  }

  /**
   * 批量执行工具
   */
  async executeBatch(
    executions: Array<{ toolId: string; params: Record<string, unknown> }>
  ): Promise<ToolResult[]> {
    return Promise.all(
      executions.map((e) => this.executeTool(e.toolId, e.params))
    );
  }

  /**
   * 获取工具描述（用于LLM）
   */
  getToolsDescription(): string {
    const tools = this.getAllTools();
    return tools
      .map(
        (t) =>
          `${t.id}: ${t.description}\n参数: ${t.parameters
            .map((p) => `${p.name}(${p.type})${p.required ? "[必需]" : ""}`)
            .join(", ")}`
      )
      .join("\n\n");
  }
}

export const toolLayer = new ToolLayer();
