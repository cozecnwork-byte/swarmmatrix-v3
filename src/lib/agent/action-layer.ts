/**
 * 9层智能体架构 - 第四层：行动层
 * 支持工具选择、执行操作及成果观察
 */

import { SubTask } from "./planning-layer";

export interface ActionResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  duration: number;
  retryCount: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<ActionResult>;
}

export class ActionLayer {
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.registerDefaultTools();
  }

  /**
   * 注册默认工具
   */
  private registerDefaultTools(): void {
    // 搜索工具
    this.registerTool({
      id: "search",
      name: "搜索引擎",
      description: "搜索互联网信息",
      category: "search",
      parameters: { query: "string" },
      execute: async (params) => {
        // 实际实现在Tool Layer
        return {
          success: true,
          output: { action: "search", params },
          duration: 0,
          retryCount: 0,
        };
      },
    });

    // 发布工具
    this.registerTool({
      id: "publish",
      name: "内容发布",
      description: "发布内容到各平台",
      category: "publish",
      parameters: { platform: "string", content: "object" },
      execute: async (params) => {
        return {
          success: true,
          output: { action: "publish", params },
          duration: 0,
          retryCount: 0,
        };
      },
    });

    // 分析工具
    this.registerTool({
      id: "analyze",
      name: "数据分析",
      description: "分析引流数据",
      category: "analytics",
      parameters: { data: "object", metrics: "array" },
      execute: async (params) => {
        return {
          success: true,
          output: { action: "analyze", params },
          duration: 0,
          retryCount: 0,
        };
      },
    });

    // 生成工具
    this.registerTool({
      id: "generate",
      name: "内容生成",
      description: "使用AI生成内容",
      category: "generation",
      parameters: { type: "string", prompt: "string" },
      execute: async (params) => {
        return {
          success: true,
          output: { action: "generate", params },
          duration: 0,
          retryCount: 0,
        };
      },
    });

    // 翻译工具
    this.registerTool({
      id: "translate",
      name: "实时翻译",
      description: "翻译内容到目标语言",
      category: "translation",
      parameters: { text: "string", targetLang: "string" },
      execute: async (params) => {
        return {
          success: true,
          output: { action: "translate", params },
          duration: 0,
          retryCount: 0,
        };
      },
    });
  }

  /**
   * 注册工具
   */
  registerTool(tool: Tool): void {
    this.tools.set(tool.id, tool);
  }

  /**
   * 获取所有工具
   */
  getAvailableTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * 根据任务类型选择合适的工具
   */
  selectTools(subtask: SubTask): Tool[] {
    const selectedTools: Tool[] = [];
    const taskType = subtask.type;

    // 根据任务类型匹配工具
    for (const tool of this.tools.values()) {
      if (this.isToolApplicable(tool, taskType)) {
        selectedTools.push(tool);
      }
    }

    return selectedTools;
  }

  /**
   * 判断工具是否适用于任务类型
   */
  private isToolApplicable(tool: Tool, taskType: string): boolean {
    const mapping: Record<string, string[]> = {
      search: ["search", "understand"],
      publish: ["publish", "execute", "lead_gen"],
      analyze: ["analyze", "observe", "reflect"],
      generate: ["generate", "content_generation"],
      translate: ["translate", "output"],
    };

    return mapping[tool.id]?.includes(taskType) || false;
  }

  /**
   * 执行子任务
   */
  async executeSubtask(subtask: SubTask): Promise<ActionResult> {
    const startTime = Date.now();
    const tools = this.selectTools(subtask);

    if (tools.length === 0) {
      return {
        success: false,
        error: `没有找到适用于任务类型 "${subtask.type}" 的工具`,
        duration: Date.now() - startTime,
        retryCount: subtask.retryCount,
      };
    }

    // 使用第一个匹配的工具执行
    const tool = tools[0];
    try {
      const result = await tool.execute(subtask.input || {});
      return {
        ...result,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "执行失败",
        duration: Date.now() - startTime,
        retryCount: subtask.retryCount,
      };
    }
  }

  /**
   * 批量执行（并行）
   */
  async executeBatch(
    subtasks: SubTask[],
    parallel: boolean = true
  ): Promise<ActionResult[]> {
    if (parallel) {
      return Promise.all(subtasks.map((st) => this.executeSubtask(st)));
    }

    const results: ActionResult[] = [];
    for (const subtask of subtasks) {
      results.push(await this.executeSubtask(subtask));
    }
    return results;
  }

  /**
   * 观察执行结果
   */
  observeResult(result: ActionResult): {
    status: "success" | "partial" | "failed";
    summary: string;
    metrics: Record<string, number>;
  } {
    if (result.success) {
      return {
        status: "success",
        summary: "执行成功",
        metrics: {
          duration: result.duration,
          retryCount: result.retryCount,
        },
      };
    }

    return {
      status: "failed",
      summary: result.error || "执行失败",
      metrics: {
        duration: result.duration,
        retryCount: result.retryCount,
      },
    };
  }
}

export const actionLayer = new ActionLayer();
