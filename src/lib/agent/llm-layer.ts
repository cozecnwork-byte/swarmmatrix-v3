/**
 * 9层智能体架构 - 第五层：大模型层
 * 具备理解、推理、决策与内容生成能力
 */

import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";
import { ConversationMessage } from "./memory-layer";

export interface LLMConfig {
  model?: string;
  temperature?: number;
  thinking?: "enabled" | "disabled";
  maxTokens?: number;
}

export interface ReasoningResult {
  conclusion: string;
  steps: string[];
  confidence: number;
  metadata?: Record<string, unknown>;
}

export class LLMLayer {
  private client: LLMClient;
  private defaultConfig: LLMConfig;

  constructor(config?: LLMConfig) {
    const llmConfig = new Config();
    this.client = new LLMClient(llmConfig);
    this.defaultConfig = {
      model: "doubao-seed-2-0-lite-260215",
      temperature: 0.7,
      thinking: "disabled",
      maxTokens: 4096,
      ...config,
    };
  }

  /**
   * 理解用户意图
   */
  async understand(
    input: string,
    context?: ConversationMessage[]
  ): Promise<{
    intent: string;
    entities: Record<string, unknown>;
    sentiment: string;
  }> {
    const messages = this.buildMessages(
      `请分析以下用户输入，提取意图、实体和情感倾向。
返回JSON格式：
{
  "intent": "用户意图描述",
  "entities": { "提取的关键实体": "值" },
  "sentiment": "positive/neutral/negative"
}

用户输入：${input}`,
      context
    );

    const response = await this.client.invoke(messages, {
      model: this.defaultConfig.model,
      temperature: 0.3,
    });

    try {
      return JSON.parse(response.content);
    } catch {
      return {
        intent: input,
        entities: {},
        sentiment: "neutral",
      };
    }
  }

  /**
   * 推理分析
   */
  async reason(
    problem: string,
    context?: Record<string, unknown>
  ): Promise<ReasoningResult> {
    const messages = [
      {
        role: "system" as const,
        content: `你是一个专业的推理助手。请按照以下步骤进行推理：
1. 分析问题
2. 列出关键信息
3. 进行逻辑推导
4. 得出结论

请以JSON格式返回：
{
  "conclusion": "最终结论",
  "steps": ["推理步骤1", "推理步骤2", ...],
  "confidence": 0.0-1.0的置信度
}`,
      },
      {
        role: "user" as const,
        content: `问题：${problem}
${context ? `上下文：${JSON.stringify(context)}` : ""}`,
      },
    ];

    const response = await this.client.invoke(messages, {
      model: this.defaultConfig.model,
      temperature: 0.5,
      thinking: "enabled",
    });

    try {
      return JSON.parse(response.content);
    } catch {
      return {
        conclusion: response.content,
        steps: [],
        confidence: 0.5,
      };
    }
  }

  /**
   * 决策选择
   */
  async decide(
    options: string[],
    criteria: string,
    context?: Record<string, unknown>
  ): Promise<{
    selected: string;
    reason: string;
    scores: Record<string, number>;
  }> {
    const messages = [
      {
        role: "system" as const,
        content: `你是一个决策助手。请根据给定的标准和上下文，从选项中选择最佳方案。

返回JSON格式：
{
  "selected": "选中的选项",
  "reason": "选择理由",
  "scores": { "选项": 分数 }
}`,
      },
      {
        role: "user" as const,
        content: `选项：${options.join(", ")}
标准：${criteria}
${context ? `上下文：${JSON.stringify(context)}` : ""}`,
      },
    ];

    const response = await this.client.invoke(messages, {
      model: this.defaultConfig.model,
      temperature: 0.3,
    });

    try {
      return JSON.parse(response.content);
    } catch {
      return {
        selected: options[0],
        reason: response.content,
        scores: {},
      };
    }
  }

  /**
   * 内容生成
   */
  async generate(
    prompt: string,
    type: string,
    options?: {
      style?: string;
      length?: "short" | "medium" | "long";
      language?: string;
    }
  ): Promise<string> {
    const systemPrompt = this.getGenerationSystemPrompt(type, options);

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: prompt },
    ];

    const response = await this.client.invoke(messages, {
      model: this.defaultConfig.model,
      temperature: options?.style === "creative" ? 0.9 : 0.7,
    });

    return response.content;
  }

  /**
   * 流式生成（用于实时响应）
   */
  async *generateStream(
    prompt: string,
    type: string,
    context?: ConversationMessage[]
  ): AsyncGenerator<string> {
    const systemPrompt = this.getGenerationSystemPrompt(type);
    const messages = this.buildMessages(prompt, context, systemPrompt);

    const stream = this.client.stream(messages, {
      model: this.defaultConfig.model,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      if (chunk.content) {
        yield chunk.content.toString();
      }
    }
  }

  /**
   * 翻译
   */
  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    const messages = [
      {
        role: "system" as const,
        content: `你是一个专业的翻译助手。请将以下内容翻译成${targetLanguage}。保持原文的语气和格式。${
          sourceLanguage ? `原文语言：${sourceLanguage}` : ""
        }`,
      },
      { role: "user" as const, content: text },
    ];

    const response = await this.client.invoke(messages, {
      model: this.defaultConfig.model,
      temperature: 0.3,
    });

    return response.content;
  }

  /**
   * 总结
   */
  async summarize(
    content: string,
    length: "short" | "medium" | "long" = "medium"
  ): Promise<string> {
    const lengthGuide = {
      short: "用1-2句话总结",
      medium: "用3-5句话总结",
      long: "用详细段落总结",
    };

    const messages = [
      {
        role: "system" as const,
        content: `你是一个总结助手。请${lengthGuide[length]}以下内容的要点。`,
      },
      { role: "user" as const, content },
    ];

    const response = await this.client.invoke(messages, {
      model: this.defaultConfig.model,
      temperature: 0.5,
    });

    return response.content;
  }

  /**
   * 构建消息数组
   */
  private buildMessages(
    prompt: string,
    context?: ConversationMessage[],
    systemPrompt?: string
  ): Array<{ role: "system" | "user" | "assistant"; content: string }> {
    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [];

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }

    if (context && context.length > 0) {
      for (const msg of context) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: prompt });

    return messages;
  }

  /**
   * 获取生成类型的系统提示
   */
  private getGenerationSystemPrompt(
    type: string,
    options?: {
      style?: string;
      length?: "short" | "medium" | "long";
      language?: string;
    }
  ): string {
    const prompts: Record<string, string> = {
      article: "你是一个专业的内容创作者，擅长撰写高质量的文章。",
      post: "你是一个社交媒体运营专家，擅长创作吸引人的帖子内容。",
      video_script: "你是一个视频脚本创作者，擅长撰写引人入胜的脚本。",
      ad_copy: "你是一个广告文案专家，擅长撰写有转化力的广告文案。",
      email: "你是一个邮件营销专家，擅长撰写有效的邮件内容。",
      report: "你是一个数据分析专家，擅长撰写清晰的分析报告。",
    };

    let prompt = prompts[type] || "你是一个专业的内容生成助手。";

    if (options?.style) {
      prompt += ` 风格：${options.style}`;
    }
    if (options?.length) {
      const lengthMap = {
        short: "简短",
        medium: "适中",
        long: "详细",
      };
      prompt += ` 篇幅：${lengthMap[options.length]}`;
    }
    if (options?.language) {
      prompt += ` 语言：${options.language}`;
    }

    return prompt;
  }
}

export const llmLayer = new LLMLayer();
