import { NextRequest, NextResponse } from "next/server";
import { cozeBotClient, BotType } from "@/lib/coze";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { botType, message, conversationHistory, stream = false } = body;

    if (!botType || !message) {
      return NextResponse.json(
        { success: false, error: "缺少必要参数: botType 和 message" },
        { status: 400 }
      );
    }

    const validBotTypes: BotType[] = ["lead_gen", "sales", "support"];
    if (!validBotTypes.includes(botType as BotType)) {
      return NextResponse.json(
        { success: false, error: "无效的botType，可选值: lead_gen, sales, support" },
        { status: 400 }
      );
    }

    if (stream) {
      // 流式响应
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of cozeBotClient.sendMessageStream(
              botType as BotType,
              message,
              conversationHistory
            )) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          } catch (error) {
            console.error("流式响应错误:", error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "处理失败" })}\n\n`));
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      // 非流式响应
      const response = await cozeBotClient.sendMessage(
        botType as BotType,
        message,
        conversationHistory
      );

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error("Coze API错误:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "服务器内部错误" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Coze智能体API",
    bots: cozeBotClient.isConfigured() 
      ? {
          lead_gen: cozeBotClient.getBotConfig("lead_gen"),
          sales: cozeBotClient.getBotConfig("sales"),
          support: cozeBotClient.getBotConfig("support"),
        }
      : { message: "Coze API Key未配置" }
  });
}
