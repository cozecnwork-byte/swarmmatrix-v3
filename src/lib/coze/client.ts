/**
 * Coze Bot 客户端
 * 用于调用Coze平台的3个智能体：
 * 1. 主引流智能体 - 内容生成、任务管理
 * 2. 销售智能体 - 线索转化、销售跟进
 * 3. 支持智能体 - 客户服务、问题解答
 */

// 智能体类型定义
export type BotType = "lead_gen" | "sales" | "support";

export interface BotConfig {
  id: string;
  name: string;
  description: string;
}

export interface BotMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface BotResponse {
  content: string;
  success: boolean;
  conversationId?: string;
  error?: string;
}

// 智能体配置
export const BOT_CONFIGS: Record<BotType, BotConfig> = {
  lead_gen: {
    id: process.env.COZE_BOT_ID_LEAD_GEN || "7647759953419042816",
    name: "主引流智能体",
    description: "负责内容生成、任务管理、引流策略制定"
  },
  sales: {
    id: process.env.COZE_BOT_ID_SALES || "7648163305961603072",
    name: "销售智能体",
    description: "负责线索转化、销售跟进、客户沟通"
  },
  support: {
    id: process.env.COZE_BOT_ID_SUPPORT || "7648168794057195560",
    name: "支持智能体",
    description: "负责客户服务、问题解答、技术支持"
  }
};

/**
 * Coze Bot 客户端类
 */
export class CozeBotClient {
  private apiKey: string | undefined;
  private baseUrl = "https://api.coze.cn";

  constructor() {
    this.apiKey = process.env.COZE_API_KEY;
  }

  /**
   * 获取智能体配置
   */
  getBotConfig(botType: BotType): BotConfig {
    return BOT_CONFIGS[botType];
  }

  /**
   * 检查是否配置了API密钥
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * 发送消息到智能体（非流式）
   */
  async sendMessage(
    botType: BotType,
    message: string,
    conversationHistory?: BotMessage[]
  ): Promise<BotResponse> {
    const botConfig = this.getBotConfig(botType);
    
    try {
      // 如果没有配置API密钥，返回模拟响应
      if (!this.apiKey) {
        console.warn(`Coze API Key未配置，返回模拟响应 (${botConfig.name})`);
        return this.getMockResponse(botType, message);
      }

      // 构建请求消息
      const messages = this.buildMessages(message, conversationHistory);

      // 调用Coze API
      const response = await fetch(`${this.baseUrl}/v3/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          bot_id: botConfig.id,
          user: "globalleadgen_user",
          stream: false,
          auto_save_history: true,
          additional_messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Coze API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.messages?.[0]?.content || "暂无响应",
        success: true,
        conversationId: data.conversation_id,
      };
    } catch (error) {
      console.error(`调用${botConfig.name}失败:`, error);
      return {
        content: "",
        success: false,
        error: error instanceof Error ? error.message : "未知错误"
      };
    }
  }

  /**
   * 发送消息到智能体（流式）
   */
  async *sendMessageStream(
    botType: BotType,
    message: string,
    conversationHistory?: BotMessage[]
  ): AsyncGenerator<string> {
    const botConfig = this.getBotConfig(botType);
    
    try {
      // 如果没有配置API密钥，返回模拟流式响应
      if (!this.apiKey) {
        console.warn(`Coze API Key未配置，返回模拟流式响应 (${botConfig.name})`);
        const mockResponse = this.getMockResponse(botType, message);
        for (const char of mockResponse.content) {
          yield char;
          await new Promise(resolve => setTimeout(resolve, 20));
        }
        return;
      }

      const messages = this.buildMessages(message, conversationHistory);

      const response = await fetch(`${this.baseUrl}/v3/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          bot_id: botConfig.id,
          user: "globalleadgen_user",
          stream: true,
          auto_save_history: true,
          additional_messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Coze API请求失败: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const data = JSON.parse(line.slice(5));
              if (data.event === "conversation.message.delta") {
                yield data.data?.content || "";
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      console.error(`流式调用${botConfig.name}失败:`, error);
      yield "抱歉，发生了错误，请稍后重试。";
    }
  }

  /**
   * 构建消息数组
   */
  private buildMessages(
    message: string,
    conversationHistory?: BotMessage[]
  ): Array<{ role: "user" | "assistant"; content: string; content_type: string }> {
    const messages: Array<{ role: "user" | "assistant"; content: string; content_type: string }> = [];

    if (conversationHistory) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
          content_type: "text"
        });
      }
    }

    messages.push({
      role: "user",
      content: message,
      content_type: "text"
    });

    return messages;
  }

  /**
   * 获取模拟响应（当API未配置时使用）
   */
  private getMockResponse(botType: BotType, message: string): BotResponse {
    const mockResponses: Record<BotType, string> = {
      lead_gen: `好的！我已经理解你的需求："${message}"

作为主引流智能体，我会为你制定完整的引流策略：

📊 **引流策略建议**
1. 目标平台：TikTok + 小红书 + B站
2. 内容类型：短视频 + 图文
3. 发布频率：每周3-5次

🎯 **下一步操作**
- 配置平台账号
- 准备内容素材
- 设置发布时间

（注意：这是模拟响应。请配置 Coze API Key 以启用真实的智能体功能。）`,
      
      sales: `收到！我来帮你处理销售转化：

关于"${message}"，我的建议是：

💼 **销售策略**
1. 快速响应客户咨询
2. 提供个性化方案
3. 建立长期信任关系

📝 **跟进计划**
- 24小时内首次跟进
- 3天后二次回访
- 持续保持联系

（注意：这是模拟响应。请配置 Coze API Key 以启用真实的智能体功能。）`,
      
      support: `你好！很高兴为你服务！

关于你的问题"${message}"，我来帮你解答：

🔧 **解决方案**
1. 首先检查基本设置
2. 按照步骤逐步操作
3. 如果还有问题随时联系我

📞 **支持渠道**
- 在线帮助文档
- 实时客服支持
- 社区论坛交流

（注意：这是模拟响应。请配置 Coze API Key 以启用真实的智能体功能。）`
    };

    return {
      content: mockResponses[botType],
      success: true
    };
  }
}

// 导出单例实例
export const cozeBotClient = new CozeBotClient();

// 导出便捷方法
export async function callLeadGenBot(message: string, history?: BotMessage[]): Promise<BotResponse> {
  return cozeBotClient.sendMessage("lead_gen", message, history);
}

export async function callSalesBot(message: string, history?: BotMessage[]): Promise<BotResponse> {
  return cozeBotClient.sendMessage("sales", message, history);
}

export async function callSupportBot(message: string, history?: BotMessage[]): Promise<BotResponse> {
  return cozeBotClient.sendMessage("support", message, history);
}

export async function* streamLeadGenBot(message: string, history?: BotMessage[]): AsyncGenerator<string> {
  yield* cozeBotClient.sendMessageStream("lead_gen", message, history);
}

export async function* streamSalesBot(message: string, history?: BotMessage[]): AsyncGenerator<string> {
  yield* cozeBotClient.sendMessageStream("sales", message, history);
}

export async function* streamSupportBot(message: string, history?: BotMessage[]): AsyncGenerator<string> {
  yield* cozeBotClient.sendMessageStream("support", message, history);
}
