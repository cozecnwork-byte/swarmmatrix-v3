/**
 * 9层智能体架构 - 第三层：规划层
 * 实现目标理解、任务分解及子任务计划生成
 */

export interface SubTask {
  id: string;
  name: string;
  description: string;
  type: string;
  priority: number;
  dependencies: string[];
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  retryCount: number;
  maxRetries: number;
}

export interface Plan {
  id: string;
  goal: string;
  subtasks: SubTask[];
  currentTaskIndex: number;
  status: "draft" | "executing" | "completed" | "failed" | "paused";
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface PlanningConfig {
  maxSubtasks: number;
  maxDepth: number;
  enableParallelExecution: boolean;
  defaultMaxRetries: number;
}

export class PlanningLayer {
  private config: PlanningConfig;

  constructor(config?: Partial<PlanningConfig>) {
    this.config = {
      maxSubtasks: 20,
      maxDepth: 5,
      enableParallelExecution: true,
      defaultMaxRetries: 3,
      ...config,
    };
  }

  /**
   * 理解目标并生成计划
   */
  async createPlan(goal: string, context?: Record<string, unknown>): Promise<Plan> {
    const subtasks = await this.decomposeGoal(goal, context);
    
    return {
      id: this.generateId(),
      goal,
      subtasks,
      currentTaskIndex: 0,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: context,
    };
  }

  /**
   * 分解目标为子任务
   */
  private async decomposeGoal(
    goal: string,
    context?: Record<string, unknown>
  ): Promise<SubTask[]> {
    // 基于目标关键词识别任务类型
    const taskType = this.detectTaskType(goal);
    
    // 根据任务类型生成标准化工作流（7步）
    const subtasks = this.generateStandardWorkflow(taskType, goal, context);
    
    return subtasks;
  }

  /**
   * 检测任务类型
   */
  private detectTaskType(goal: string): string {
    const goalLower = goal.toLowerCase();
    
    if (goalLower.includes("引流") || goalLower.includes("lead")) {
      return "lead_generation";
    }
    if (goalLower.includes("发布") || goalLower.includes("publish")) {
      return "content_publish";
    }
    if (goalLower.includes("分析") || goalLower.includes("analyze")) {
      return "data_analysis";
    }
    if (goalLower.includes("搜索") || goalLower.includes("search")) {
      return "search";
    }
    if (goalLower.includes("生成") || goalLower.includes("generate")) {
      return "content_generation";
    }
    
    return "general";
  }

  /**
   * 生成7步标准工作流
   */
  private generateStandardWorkflow(
    taskType: string,
    goal: string,
    context?: Record<string, unknown>
  ): SubTask[] {
    const baseSubtasks: SubTask[] = [
      {
        id: this.generateId(),
        name: "步骤1：接收输入",
        description: "接收用户输入或定时触发事件",
        type: "input",
        priority: 1,
        dependencies: [],
        status: "pending",
        input: { goal, context },
        retryCount: 0,
        maxRetries: this.config.defaultMaxRetries,
      },
      {
        id: this.generateId(),
        name: "步骤2：理解需求",
        description: "理解用户需求并规划任务",
        type: "understand",
        priority: 2,
        dependencies: [],
        status: "pending",
        retryCount: 0,
        maxRetries: this.config.defaultMaxRetries,
      },
      {
        id: this.generateId(),
        name: "步骤3：选择工具",
        description: "选择合适工具并准备执行",
        type: "tool_selection",
        priority: 3,
        dependencies: [],
        status: "pending",
        retryCount: 0,
        maxRetries: this.config.defaultMaxRetries,
      },
      {
        id: this.generateId(),
        name: "步骤4：执行行动",
        description: "执行具体操作",
        type: "execute",
        priority: 4,
        dependencies: [],
        status: "pending",
        retryCount: 0,
        maxRetries: this.config.defaultMaxRetries,
      },
      {
        id: this.generateId(),
        name: "步骤5：观察结果",
        description: "观察并收集执行结果",
        type: "observe",
        priority: 5,
        dependencies: [],
        status: "pending",
        retryCount: 0,
        maxRetries: this.config.defaultMaxRetries,
      },
      {
        id: this.generateId(),
        name: "步骤6：反思评估",
        description: "反思评估结果并修正计划",
        type: "reflect",
        priority: 6,
        dependencies: [],
        status: "pending",
        retryCount: 0,
        maxRetries: this.config.defaultMaxRetries,
      },
      {
        id: this.generateId(),
        name: "步骤7：输出结果",
        description: "完成任务并输出最终结果",
        type: "output",
        priority: 7,
        dependencies: [],
        status: "pending",
        retryCount: 0,
        maxRetries: this.config.defaultMaxRetries,
      },
    ];

    // 根据任务类型添加特定子任务
    const additionalSubtasks = this.getTaskSpecificSubtasks(taskType, goal);
    
    return [...baseSubtasks, ...additionalSubtasks].slice(0, this.config.maxSubtasks);
  }

  /**
   * 获取任务特定的子任务
   */
  private getTaskSpecificSubtasks(taskType: string, goal: string): SubTask[] {
    switch (taskType) {
      case "lead_generation":
        return [
          {
            id: this.generateId(),
            name: "执行引流",
            description: "执行多平台引流操作",
            type: "lead_gen",
            priority: 4,
            dependencies: [],
            status: "pending",
            retryCount: 0,
            maxRetries: this.config.defaultMaxRetries,
          },
        ];
      case "content_publish":
        return [
          {
            id: this.generateId(),
            name: "内容发布",
            description: "发布内容到目标平台",
            type: "publish",
            priority: 4,
            dependencies: [],
            status: "pending",
            retryCount: 0,
            maxRetries: this.config.defaultMaxRetries,
          },
        ];
      default:
        return [];
    }
  }

  /**
   * 更新计划状态
   */
  updatePlanStatus(
    plan: Plan,
    taskId: string,
    status: SubTask["status"],
    output?: Record<string, unknown>
  ): Plan {
    const subtaskIndex = plan.subtasks.findIndex((st) => st.id === taskId);
    if (subtaskIndex === -1) return plan;

    const updatedSubtasks = [...plan.subtasks];
    updatedSubtasks[subtaskIndex] = {
      ...updatedSubtasks[subtaskIndex],
      status,
      output,
    };

    // 更新当前任务索引
    let newIndex = plan.currentTaskIndex;
    if (status === "completed") {
      newIndex = Math.min(plan.currentTaskIndex + 1, plan.subtasks.length - 1);
    }

    // 确定整体状态
    let newStatus = plan.status;
    if (updatedSubtasks.every((st) => st.status === "completed")) {
      newStatus = "completed";
    } else if (updatedSubtasks.some((st) => st.status === "failed")) {
      newStatus = "failed";
    } else if (updatedSubtasks.some((st) => st.status === "running")) {
      newStatus = "executing";
    }

    return {
      ...plan,
      subtasks: updatedSubtasks,
      currentTaskIndex: newIndex,
      status: newStatus,
      updatedAt: new Date(),
    };
  }

  /**
   * 获取下一个可执行的子任务
   */
  getNextExecutableSubtask(plan: Plan): SubTask | null {
    for (const subtask of plan.subtasks) {
      if (subtask.status !== "pending") continue;

      // 检查依赖是否满足
      const dependenciesMet = subtask.dependencies.every((depId) => {
        const dep = plan.subtasks.find((st) => st.id === depId);
        return dep && dep.status === "completed";
      });

      if (dependenciesMet) {
        return subtask;
      }
    }

    return null;
  }

  /**
   * 修正计划（反思后）
   */
  revisePlan(
    plan: Plan,
    reflection: { issues: string[]; suggestions: string[] }
  ): Plan {
    // 基于反思结果调整计划
    const revisedSubtasks = plan.subtasks.map((subtask, index) => {
      if (subtask.status === "failed" && subtask.retryCount < subtask.maxRetries) {
        return {
          ...subtask,
          status: "pending" as const,
          retryCount: subtask.retryCount + 1,
        };
      }
      return subtask;
    });

    return {
      ...plan,
      subtasks: revisedSubtasks,
      status: "executing",
      updatedAt: new Date(),
      metadata: {
        ...plan.metadata,
        reflection,
        revisedAt: new Date().toISOString(),
      },
    };
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const planningLayer = new PlanningLayer();
