/**
 * 9层智能体架构 - 第六层：输出层
 * 支持自然语言回复、报告生成、API调用及状态更新
 */

import { getSupabaseClient } from "@/storage/database/supabase-client";

export interface OutputResult {
  type: "text" | "report" | "api_response" | "action" | "error";
  content: string | Record<string, unknown>;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface Report {
  title: string;
  summary: string;
  sections: ReportSection[];
  metrics?: Record<string, number>;
  generatedAt: Date;
}

export interface ReportSection {
  title: string;
  content: string;
  charts?: ChartData[];
}

export interface ChartData {
  type: "line" | "bar" | "pie";
  title: string;
  data: Record<string, unknown>[];
}

export class OutputLayer {
  private supabase: ReturnType<typeof getSupabaseClient>;

  constructor() {
    // 延迟初始化supabase客户端
    this.supabase = getSupabaseClient();
  }

  /**
   * 生成自然语言回复
   */
  formatTextResponse(
    content: string,
    options?: {
      format?: "plain" | "markdown" | "html";
      language?: string;
    }
  ): OutputResult {
    return {
      type: "text",
      content: this.formatContent(content, options?.format || "plain"),
      timestamp: new Date(),
      metadata: options,
    };
  }

  /**
   * 生成报告
   */
  generateReport(
    title: string,
    summary: string,
    sections: ReportSection[],
    metrics?: Record<string, number>
  ): OutputResult {
    const report: Report = {
      title,
      summary,
      sections,
      metrics,
      generatedAt: new Date(),
    };

    return {
      type: "report",
      content: report as unknown as Record<string, unknown>,
      timestamp: new Date(),
    };
  }

  /**
   * 生成API响应
   */
  formatApiResponse(
    success: boolean,
    data?: Record<string, unknown>,
    error?: string
  ): OutputResult {
    return {
      type: "api_response",
      content: {
        success,
        data,
        error,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
    };
  }

  /**
   * 生成操作结果
   */
  formatActionResult(
    action: string,
    result: Record<string, unknown>
  ): OutputResult {
    return {
      type: "action",
      content: {
        action,
        result,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
    };
  }

  /**
   * 生成错误响应
   */
  formatError(error: string, details?: Record<string, unknown>): OutputResult {
    return {
      type: "error",
      content: {
        error,
        details,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
    };
  }

  /**
   * 生成引流效果报告
   */
  async generateLeadGenReport(
    userId: string,
    period: "day" | "week" | "month"
  ): Promise<OutputResult> {
    // 计算时间范围
    const now = new Date();
    const startDate = new Date(now);
    switch (period) {
      case "day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    // 查询引流数据
    const { data: leadData, error } = await this.supabase
      .from("lead_data")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      return this.formatError("获取引流数据失败", { error: error.message });
    }

    // 计算统计指标
    const totalViews = leadData?.reduce((sum, d) => sum + (d.view_count || 0), 0) || 0;
    const totalClicks = leadData?.reduce((sum, d) => sum + (d.click_count || 0), 0) || 0;
    const totalLikes = leadData?.reduce((sum, d) => sum + (d.like_count || 0), 0) || 0;
    const totalComments = leadData?.reduce((sum, d) => sum + (d.comment_count || 0), 0) || 0;
    const totalShares = leadData?.reduce((sum, d) => sum + (d.share_count || 0), 0) || 0;
    const totalConversions = leadData?.reduce((sum, d) => sum + (d.convert_count || 0), 0) || 0;

    // 按平台分组
    const platformBreakdown: Record<string, number> = {};
    leadData?.forEach((d) => {
      const platform = d.source_platform || "unknown";
      platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
    });

    return this.generateReport(
      `引流效果报告（${period === "day" ? "今日" : period === "week" ? "本周" : "本月"}）`,
      `共发布 ${leadData?.length || 0} 条内容，获得 ${totalViews} 次浏览，${totalClicks} 次点击，${totalConversions} 次转化`,
      [
        {
          title: "整体数据",
          content: `浏览量: ${totalViews}\n点击量: ${totalClicks}\n点赞: ${totalLikes}\n评论: ${totalComments}\n分享: ${totalShares}\n转化: ${totalConversions}`,
        },
        {
          title: "平台分布",
          content: Object.entries(platformBreakdown)
            .map(([platform, count]) => `${platform}: ${count}`)
            .join("\n"),
        },
        {
          title: "转化率",
          content: `点击率: ${totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0}%\n转化率: ${totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0}%`,
        },
      ],
      {
        views: totalViews,
        clicks: totalClicks,
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
        conversions: totalConversions,
      }
    );
  }

  /**
   * 更新任务状态
   */
  async updateTaskStatus(
    taskId: string,
    status: string,
    output?: Record<string, unknown>
  ): Promise<void> {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
    }

    if (output) {
      updateData.output = output;
    }

    await this.supabase.from("agent_tasks").update(updateData).eq("id", taskId);
  }

  /**
   * 发送通知
   */
  async sendNotification(
    userId: string,
    type: string,
    title: string,
    message: string
  ): Promise<void> {
    await this.supabase.from("alerts").insert({
      user_id: userId,
      type,
      severity: "info",
      title,
      message,
    });
  }

  /**
   * 格式化内容
   */
  private formatContent(
    content: string,
    format: "plain" | "markdown" | "html"
  ): string {
    switch (format) {
      case "markdown":
        return content;
      case "html":
        return content.replace(/\n/g, "<br>");
      default:
        return content;
    }
  }
}

export const outputLayer = new OutputLayer();
