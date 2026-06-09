/**
 * 一键发布 API
 * POST /api/publish - 一键发布内容到所有平台
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { llmLayer } from "@/lib/agent/llm-layer";

interface PublishRequest {
  userId: string;
  content: string;
  platforms?: string[];
  title?: string;
  scheduledAt?: string;
  translate?: boolean;
  targetLanguages?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: PublishRequest = await request.json();
    const { userId, content, platforms, title, scheduledAt, translate, targetLanguages } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { success: false, error: "缺少必需参数" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // 获取用户已连接的平台账号
    const { data: accounts, error: accountsError } = await supabase
      .from("platform_accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (accountsError) {
      return NextResponse.json(
        { success: false, error: accountsError.message },
        { status: 500 }
      );
    }

    // 确定发布平台
    const targetPlatforms = platforms?.length
      ? platforms
      : accounts?.map((a) => a.platform) || ["douyin", "xiaohongshu", "bilibili"];

    // 翻译处理
    let processedContent = content;
    const translations: Record<string, string> = {};

    if (translate && targetLanguages?.length) {
      for (const lang of targetLanguages) {
        translations[lang] = await llmLayer.translate(content, lang);
      }
    }

    // 创建引流数据记录
    const publishResults: Array<{
      platform: string;
      status: string;
      data?: Record<string, unknown>;
      error?: string;
    }> = [];

    for (const platform of targetPlatforms) {
      // 这里模拟发布逻辑，实际需要对接各平台API
      const publishData = {
        user_id: userId,
        source_platform: "internal",
        target_platform: platform,
        content_type: "post",
        raw_content: { title, content: processedContent },
        processed_content: { title, content: processedContent },
        status: scheduledAt ? "scheduled" : "active",
        published_at: scheduledAt ? null : new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("lead_data")
        .insert(publishData)
        .select()
        .single();

      if (error) {
        publishResults.push({
          platform,
          status: "failed",
          error: error.message,
        });
      } else {
        publishResults.push({
          platform,
          status: "success",
          data,
        });
      }
    }

    const successCount = publishResults.filter((r) => r.status === "success").length;

    return NextResponse.json({
      success: successCount > 0,
      data: {
        totalPlatforms: targetPlatforms.length,
        successCount,
        failedCount: targetPlatforms.length - successCount,
        results: publishResults,
        translations,
        scheduledAt,
      },
    });
  } catch (error) {
    console.error("一键发布失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "发布失败",
      },
      { status: 500 }
    );
  }
}
