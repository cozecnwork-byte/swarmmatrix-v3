/**
 * 9层智能体架构 - 第一层：输入层
 * 支持自然语言指令、外部事件触发、环境状态查看及定时任务设置
 */

export type InputType = "natural_language" | "event_trigger" | "state_check" | "scheduled";

export interface AgentInput {
  type: InputType;
  content: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  userId: string;
  sessionId?: string;
}

export interface InputLayerConfig {
  enableEventTrigger: boolean;
  enableStateCheck: boolean;
  enableScheduledTask: boolean;
  maxInputLength: number;
}

export class InputLayer {
  private config: InputLayerConfig;

  constructor(config?: Partial<InputLayerConfig>) {
    this.config = {
      enableEventTrigger: true,
      enableStateCheck: true,
      enableScheduledTask: true,
      maxInputLength: 10000,
      ...config,
    };
  }

  /**
   * 解析用户输入
   */
  parseInput(rawInput: string, userId: string): AgentInput {
    const trimmedInput = rawInput.trim();

    if (trimmedInput.length > this.config.maxInputLength) {
      throw new Error(`输入长度超过限制：${this.config.maxInputLength}字符`);
    }

    const type = this.detectInputType(trimmedInput);

    return {
      type,
      content: trimmedInput,
      timestamp: new Date(),
      userId,
    };
  }

  /**
   * 检测输入类型
   */
  private detectInputType(input: string): InputType {
    // 定时任务触发
    if (input.startsWith("[SCHEDULED]") || input.includes("定时任务")) {
      return "scheduled";
    }

    // 事件触发
    if (input.startsWith("[EVENT]") || input.includes("触发事件")) {
      return "event_trigger";
    }

    // 状态查看
    if (
      input.startsWith("[STATE]") ||
      input.includes("查看状态") ||
      input.includes("当前状态")
    ) {
      return "state_check";
    }

    // 默认为自然语言
    return "natural_language";
  }

  /**
   * 处理外部事件
   */
  processEvent(event: {
    type: string;
    payload: Record<string, unknown>;
    userId: string;
  }): AgentInput {
    return {
      type: "event_trigger",
      content: JSON.stringify({
        eventType: event.type,
        payload: event.payload,
      }),
      metadata: {
        eventType: event.type,
        source: "external",
      },
      timestamp: new Date(),
      userId: event.userId,
    };
  }

  /**
   * 创建定时任务输入
   */
  createScheduledInput(
    command: string,
    userId: string,
    schedule: string
  ): AgentInput {
    return {
      type: "scheduled",
      content: command,
      metadata: {
        schedule,
        triggered: false,
      },
      timestamp: new Date(),
      userId,
    };
  }

  /**
   * 验证输入有效性
   */
  validate(input: AgentInput): { valid: boolean; error?: string } {
    if (!input.content || input.content.trim().length === 0) {
      return { valid: false, error: "输入内容不能为空" };
    }

    if (!input.userId) {
      return { valid: false, error: "用户ID不能为空" };
    }

    if (input.content.length > this.config.maxInputLength) {
      return { valid: false, error: "输入内容超过最大长度限制" };
    }

    return { valid: true };
  }
}

export const inputLayer = new InputLayer();
