/**
 * Coze 智能体集成模块
 * 
 * 提供3个智能体的调用能力：
 * 1. 主引流智能体 - 内容生成、任务管理
 * 2. 销售智能体 - 线索转化、销售跟进
 * 3. 支持智能体 - 客户服务、问题解答
 */

export {
  CozeBotClient,
  cozeBotClient,
  BOT_CONFIGS,
  callLeadGenBot,
  callSalesBot,
  callSupportBot,
  streamLeadGenBot,
  streamSalesBot,
  streamSupportBot
} from "./client";

export type {
  BotType,
  BotConfig,
  BotMessage,
  BotResponse
} from "./client";
