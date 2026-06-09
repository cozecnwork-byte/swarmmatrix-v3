/**
 * 智能体主类 - 整合9层架构
 * 实现7步标准工作流程
 */

import { inputLayer, AgentInput } from "./input-layer";
import { memoryLayer, TaskState } from "./memory-layer";
import { planningLayer, Plan } from "./planning-layer";
import { actionLayer, ActionResult } from "./action-layer";
import { llmLayer } from "./llm-layer";
import { outputLayer, OutputResult } from "./output-layer";
import { reflectionLayer, Reflection } from "./reflection-layer";
import { toolLayer } from "./tool-layer";
import { knowledgeLayer } from "./knowledge-layer";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export interface AgentConfig {
  userId: string;
  sessionId?: string;
  enableReflection?: boolean;
  maxRetries?: number;
  timeout?: number;
}

export interface ExecutionResult {
  success: boolean;
  taskId: string;
  output?: OutputResult;
  reflection?: Reflection;
  duration: number;
  steps: StepResult[];
}

export interface StepResult {
  step: number;
  name: string;
  status: "success" | "failed" | "skipped";
  duration: number;
  output?: unknown;
}

export class Agent {
  private config: AgentConfig;
  private supabase = getSupabaseClient();

  constructor(config: AgentConfig) {
    this.config = {
      enableReflection: true,
      maxRetries: 3,
      timeout: 300000, // 5分钟
      ...config,
    };
  }

  /**
   * 执行任务（7步标准流程）
   */
  async execute(input: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const steps: StepResult[] = [];
    let taskId = "";

    try {
      // ===== 步骤1：接收用户输入 =====
      const step1Start = Date.now();
      const agentInput = inputLayer.parseInput(input, this.config.userId);
      const validation = inputLayer.validate(agentInput);

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      steps.push({
        step: 1,
        name: "接收输入",
        status: "success",
        duration: Date.now() - step1Start,
        output: { type: agentInput.type },
      });

      // 创建任务记录
      taskId = await this.createTaskRecord(agentInput);

      // 初始化工作记忆
      memoryLayer.setTaskState(this.getSessionId(), {
        taskId,
        currentStep: 1,
        totalSteps: 7,
        status: "running",
        progress: 0,
        data: {},
      });

      // ===== 步骤2：理解用户需求并规划任务 =====
      const step2Start = Date.now();
      const understanding = await llmLayer.understand(input);
      const plan = await planningLayer.createPlan(understanding.intent, {
        entities: understanding.entities,
        sentiment: understanding.sentiment,
        input: agentInput,
      });

      // 更新任务计划
      await this.supabase
        .from("agent_tasks")
        .update({ plan })
        .eq("id", taskId);

      steps.push({
        step: 2,
        name: "理解需求",
        status: "success",
        duration: Date.now() - step2Start,
        output: {
          intent: understanding.intent,
          subtaskCount: plan.subtasks.length,
        },
      });

      // ===== 步骤3：选择合适工具 =====
      const step3Start = Date.now();
      const availableTools = toolLayer.getAllTools();
      const selectedTools = this.selectToolsForPlan(plan);

      steps.push({
        step: 3,
        name: "选择工具",
        status: "success",
        duration: Date.now() - step3Start,
        output: { tools: selectedTools.map((t) => t.name) },
      });

      // ===== 步骤4-6：执行子任务并观察结果 =====
      const executionResults: ActionResult[] = [];
      let currentPlan = plan;

      for (let i = 0; i < plan.subtasks.length; i++) {
        const subtask = plan.subtasks[i];
        if (subtask.status !== "pending") continue;

        const stepStart = Date.now();
        
        // 执行子任务
        const result = await actionLayer.executeSubtask(subtask);
        executionResults.push(result);

        // 观察结果
        const observation = actionLayer.observeResult(result);

        // 更新计划状态
        currentPlan = planningLayer.updatePlanStatus(
          currentPlan,
          subtask.id,
          result.success ? "completed" : "failed",
          result.output
        );

        // 更新工作记忆
        memoryLayer.updateTaskProgress(this.getSessionId(), {
          currentStep: i + 1,
          progress: ((i + 1) / plan.subtasks.length) * 100,
        });

        steps.push({
          step: 4 + (i % 2), // 交替显示为步骤4和5
          name: subtask.name,
          status: observation.status === "partial" ? "success" : observation.status,
          duration: Date.now() - stepStart,
          output: observation.summary,
        });

        // 如果失败且启用反思，尝试修正
        if (!result.success && this.config.enableReflection) {
          const reflection = await reflectionLayer.reflect(
            currentPlan,
            executionResults
          );
          const { shouldRetry, revisedPlan } = reflectionLayer.revisePlan(
            currentPlan,
            reflection
          );

          if (shouldRetry) {
            currentPlan = revisedPlan;
            i--; // 重试当前任务
          }
        }
      }

      // ===== 步骤6：反思评估结果 =====
      let reflection: Reflection | undefined;
      if (this.config.enableReflection) {
        const step6Start = Date.now();
        reflection = await reflectionLayer.reflect(currentPlan, executionResults);

        steps.push({
          step: 6,
          name: "反思评估",
          status: "success",
          duration: Date.now() - step6Start,
          output: { score: reflection.overallScore },
        });

        // 保存反思结果
        await this.supabase
          .from("agent_tasks")
          .update({ reflections: reflection })
          .eq("id", taskId);
      }

      // ===== 步骤7：输出最终结果 =====
      const step7Start = Date.now();
      const finalOutput = this.generateFinalOutput(
        currentPlan,
        executionResults,
        reflection
      );

      // 更新任务状态
      await outputLayer.updateTaskStatus(
        taskId,
        currentPlan.status === "completed" ? "completed" : "failed",
        finalOutput.content as Record<string, unknown>
      );

      steps.push({
        step: 7,
        name: "输出结果",
        status: "success",
        duration: Date.now() - step7Start,
        output: { type: finalOutput.type },
      });

      return {
        success: currentPlan.status === "completed",
        taskId,
        output: finalOutput,
        reflection,
        duration: Date.now() - startTime,
        steps,
      };
    } catch (error) {
      // 记录错误
      if (taskId) {
        await this.supabase
          .from("agent_tasks")
          .update({
            status: "failed",
            error_message: error instanceof Error ? error.message : "执行失败",
          })
          .eq("id", taskId);
      }

      return {
        success: false,
        taskId,
        duration: Date.now() - startTime,
        steps,
      };
    }
  }

  /**
   * 流式执行（实时返回进度）
   */
  async *executeStream(input: string): AsyncGenerator<{
    step: number;
    name: string;
    status: string;
    output?: unknown;
  }> {
    const agentInput = inputLayer.parseInput(input, this.config.userId);
    const taskId = await this.createTaskRecord(agentInput);

    yield { step: 1, name: "接收输入", status: "running" };

    const understanding = await llmLayer.understand(input);
    const plan = await planningLayer.createPlan(understanding.intent);

    yield {
      step: 2,
      name: "理解需求",
      status: "completed",
      output: { intent: understanding.intent },
    };

    for (let i = 0; i < plan.subtasks.length; i++) {
      const subtask = plan.subtasks[i];
      yield { step: i + 3, name: subtask.name, status: "running" };

      const result = await actionLayer.executeSubtask(subtask);

      yield {
        step: i + 3,
        name: subtask.name,
        status: result.success ? "completed" : "failed",
        output: result.output,
      };
    }

    yield { step: 7, name: "输出结果", status: "completed" };
  }

  /**
   * 创建任务记录
   */
  private async createTaskRecord(input: AgentInput): Promise<string> {
    const { data, error } = await this.supabase
      .from("agent_tasks")
      .insert({
        user_id: this.config.userId,
        name: `任务-${Date.now()}`,
        input_command: input.content,
        input_metadata: input.metadata,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  }

  /**
   * 为计划选择工具
   */
  private selectToolsForPlan(plan: Plan) {
    const toolIds = new Set<string>();

    for (const subtask of plan.subtasks) {
      const tools = actionLayer.selectTools(subtask);
      tools.forEach((t) => toolIds.add(t.id));
    }

    return Array.from(toolIds)
      .map((id) => toolLayer.getTool(id))
      .filter(Boolean) as Array<{ id: string; name: string }>;
  }

  /**
   * 生成最终输出
   */
  private generateFinalOutput(
    plan: Plan,
    results: ActionResult[],
    reflection?: Reflection
  ): OutputResult {
    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.length - successCount;

    if (successCount === results.length) {
      return outputLayer.formatTextResponse(
        `任务执行成功！\n目标: ${plan.goal}\n完成步骤: ${successCount}/${results.length}`,
        { format: "markdown" }
      );
    }

    return outputLayer.formatTextResponse(
      `任务执行完成，部分失败。\n目标: ${plan.goal}\n成功: ${successCount}, 失败: ${failedCount}${
        reflection ? `\n评分: ${reflection.overallScore}/100` : ""
      }`,
      { format: "markdown" }
    );
  }

  private getSessionId(): string {
    return this.config.sessionId || `session_${this.config.userId}`;
  }
}

/**
 * 创建智能体实例
 */
export function createAgent(config: AgentConfig): Agent {
  return new Agent(config);
}
