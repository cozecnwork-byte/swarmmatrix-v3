/**
 * 9层智能体架构 - 第七层：反思与自我修正层
 * 自动评估结果、总结经验并优化计划
 */

import { Plan } from "./planning-layer";
import { ActionResult } from "./action-layer";
import { llmLayer } from "./llm-layer";

export interface Reflection {
  id: string;
  taskId: string;
  overallScore: number;
  issues: Issue[];
  lessons: string[];
  suggestions: string[];
  improvements: Improvement[];
  createdAt: Date;
}

export interface Issue {
  type: "critical" | "warning" | "info";
  description: string;
  location: string;
  suggestedFix?: string;
}

export interface Improvement {
  area: string;
  currentValue: string;
  suggestedValue: string;
  impact: "high" | "medium" | "low";
}

export class ReflectionLayer {
  /**
   * 反思评估结果
   */
  async reflect(
    plan: Plan,
    results: ActionResult[]
  ): Promise<Reflection> {
    const id = this.generateId();

    // 计算整体评分
    const overallScore = this.calculateOverallScore(results);

    // 识别问题
    const issues = this.identifyIssues(results);

    // 使用LLM进行深度反思
    const deepReflection = await this.deepReflect(plan, results, issues);

    // 提取经验教训
    const lessons = await this.extractLessons(results, issues);

    // 生成改进建议
    const improvements = this.generateImprovements(issues, results);

    return {
      id,
      taskId: plan.id,
      overallScore,
      issues,
      lessons: deepReflection.lessons || lessons,
      suggestions: deepReflection.suggestions || [],
      improvements,
      createdAt: new Date(),
    };
  }

  /**
   * 计算整体评分（0-100）
   */
  private calculateOverallScore(results: ActionResult[]): number {
    if (results.length === 0) return 0;

    const successRate =
      results.filter((r) => r.success).length / results.length;

    const avgDuration =
      results.reduce((sum, r) => sum + r.duration, 0) / results.length;

    const efficiencyScore = Math.max(0, 100 - avgDuration / 100);

    return Math.round(successRate * 70 + efficiencyScore * 0.3);
  }

  /**
   * 识别问题
   */
  private identifyIssues(results: ActionResult[]): Issue[] {
    const issues: Issue[] = [];

    results.forEach((result, index) => {
      if (!result.success) {
        issues.push({
          type: "critical",
          description: result.error || "执行失败",
          location: `步骤 ${index + 1}`,
          suggestedFix: "检查参数配置或重试",
        });
      }

      if (result.retryCount > 0) {
        issues.push({
          type: "warning",
          description: `重试了 ${result.retryCount} 次`,
          location: `步骤 ${index + 1}`,
          suggestedFix: "优化执行逻辑减少重试",
        });
      }

      if (result.duration > 30000) {
        issues.push({
          type: "warning",
          description: `执行耗时过长 (${Math.round(result.duration / 1000)}秒)`,
          location: `步骤 ${index + 1}`,
          suggestedFix: "考虑优化或异步执行",
        });
      }
    });

    return issues;
  }

  /**
   * 深度反思（使用LLM）
   */
  private async deepReflect(
    plan: Plan,
    results: ActionResult[],
    issues: Issue[]
  ): Promise<{ lessons?: string[]; suggestions?: string[] }> {
    const reflectionPrompt = `
请分析以下任务执行情况，总结经验教训并提出改进建议：

目标：${plan.goal}
执行步骤数：${plan.subtasks.length}
成功步骤数：${results.filter((r) => r.success).length}
失败步骤数：${results.filter((r) => !r.success).length}
问题列表：${issues.map((i) => i.description).join(", ")}

请返回JSON格式：
{
  "lessons": ["经验1", "经验2"],
  "suggestions": ["建议1", "建议2"]
}
`;

    try {
      const response = await llmLayer.generate(reflectionPrompt, "report");
      return JSON.parse(response);
    } catch {
      return {};
    }
  }

  /**
   * 提取经验教训
   */
  private async extractLessons(
    results: ActionResult[],
    issues: Issue[]
  ): Promise<string[]> {
    const lessons: string[] = [];

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    if (successCount === totalCount) {
      lessons.push("所有步骤执行成功，流程稳定可靠");
    }

    const criticalIssues = issues.filter((i) => i.type === "critical");
    if (criticalIssues.length > 0) {
      lessons.push(`发现 ${criticalIssues.length} 个关键问题需要关注`);
    }

    const retryCount = results.reduce((sum, r) => sum + r.retryCount, 0);
    if (retryCount > results.length) {
      lessons.push("执行稳定性有待提高，建议增加前置检查");
    }

    return lessons;
  }

  /**
   * 生成改进建议
   */
  private generateImprovements(
    issues: Issue[],
    results: ActionResult[]
  ): Improvement[] {
    const improvements: Improvement[] = [];

    // 性能改进
    const avgDuration =
      results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    if (avgDuration > 5000) {
      improvements.push({
        area: "性能",
        currentValue: `平均耗时 ${Math.round(avgDuration / 1000)}秒`,
        suggestedValue: "优化至3秒以内",
        impact: "medium",
      });
    }

    // 稳定性改进
    const failureRate =
      results.filter((r) => !r.success).length / results.length;
    if (failureRate > 0.1) {
      improvements.push({
        area: "稳定性",
        currentValue: `失败率 ${(failureRate * 100).toFixed(1)}%`,
        suggestedValue: "失败率低于5%",
        impact: "high",
      });
    }

    // 错误处理改进
    const criticalIssues = issues.filter((i) => i.type === "critical");
    if (criticalIssues.length > 0) {
      improvements.push({
        area: "错误处理",
        currentValue: "缺少详细错误处理",
        suggestedValue: "增加异常捕获和重试机制",
        impact: "high",
      });
    }

    return improvements;
  }

  /**
   * 修正计划
   */
  revisePlan(
    plan: Plan,
    reflection: Reflection
  ): {
    shouldRetry: boolean;
    revisedPlan: Plan;
    changes: string[];
  } {
    const changes: string[] = [];
    let shouldRetry = false;

    // 复制计划
    const revisedPlan = { ...plan, subtasks: [...plan.subtasks] };

    // 对失败的步骤重试
    reflection.issues.forEach((issue) => {
      if (issue.type === "critical") {
        const stepIndex = parseInt(issue.location.replace("步骤 ", "")) - 1;
        if (stepIndex >= 0 && stepIndex < revisedPlan.subtasks.length) {
          const subtask = revisedPlan.subtasks[stepIndex];
          if (subtask.retryCount < subtask.maxRetries) {
            revisedPlan.subtasks[stepIndex] = {
              ...subtask,
              status: "pending",
              retryCount: subtask.retryCount + 1,
            };
            changes.push(`重试步骤 ${stepIndex + 1}`);
            shouldRetry = true;
          }
        }
      }
    });

    return { shouldRetry, revisedPlan, changes };
  }

  /**
   * 生成反思报告
   */
  generateReflectionReport(reflection: Reflection): string {
    const lines: string[] = [
      `# 反思报告`,
      ``,
      `## 整体评分: ${reflection.overallScore}/100`,
      ``,
      `## 问题列表`,
      ...reflection.issues.map(
        (i) => `- [${i.type}] ${i.description} (${i.location})`
      ),
      ``,
      `## 经验教训`,
      ...reflection.lessons.map((l) => `- ${l}`),
      ``,
      `## 改进建议`,
      ...reflection.suggestions.map((s) => `- ${s}`),
    ];

    return lines.join("\n");
  }

  private generateId(): string {
    return `reflect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const reflectionLayer = new ReflectionLayer();
