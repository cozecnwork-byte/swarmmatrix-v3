/**
 * 数据分析 API
 * GET /api/analytics - 获取分析数据
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const dimension = searchParams.get("dimension") || "daily";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "用户ID不能为空" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // 获取引流数据
    const now = new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(now.setDate(now.getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();

    const { data: leadData, error: leadError } = await supabase
      .from("lead_data")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: false });

    if (leadError) {
      return NextResponse.json(
        { success: false, error: leadError.message },
        { status: 500 }
      );
    }

    // 计算统计数据
    const stats = calculateStats(leadData || []);

    // 获取趋势数据
    const trends = calculateTrends(leadData || [], dimension);

    // 平台分布
    const platformDistribution = calculatePlatformDistribution(leadData || []);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        trends,
        platformDistribution,
        period: {
          start: start.toISOString(),
          end: end.toISOString(),
          dimension,
        },
      },
    });
  } catch (error) {
    console.error("获取分析数据失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取失败",
      },
      { status: 500 }
    );
  }
}

function calculateStats(data: Record<string, unknown>[]) {
  const totalViews = data.reduce(
    (sum, d) => sum + ((d.view_count as number) || 0),
    0
  );
  const totalClicks = data.reduce(
    (sum, d) => sum + ((d.click_count as number) || 0),
    0
  );
  const totalLikes = data.reduce(
    (sum, d) => sum + ((d.like_count as number) || 0),
    0
  );
  const totalComments = data.reduce(
    (sum, d) => sum + ((d.comment_count as number) || 0),
    0
  );
  const totalShares = data.reduce(
    (sum, d) => sum + ((d.share_count as number) || 0),
    0
  );
  const totalConversions = data.reduce(
    (sum, d) => sum + ((d.convert_count as number) || 0),
    0
  );

  return {
    totalItems: data.length,
    totalViews,
    totalClicks,
    totalLikes,
    totalComments,
    totalShares,
    totalConversions,
    clickRate: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0,
    conversionRate:
      totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0,
  };
}

function calculateTrends(
  data: Record<string, unknown>[],
  dimension: string
): Array<{ date: string; value: number }> {
  const grouped: Record<string, number> = {};

  data.forEach((d) => {
    const date = new Date(d.created_at as string);
    let key: string;

    if (dimension === "daily") {
      key = date.toISOString().split("T")[0];
    } else if (dimension === "weekly") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    grouped[key] = (grouped[key] || 0) + ((d.view_count as number) || 0);
  });

  return Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function calculatePlatformDistribution(
  data: Record<string, unknown>[]
): Array<{ platform: string; count: number; percentage: number }> {
  const platformCounts: Record<string, number> = {};

  data.forEach((d) => {
    const platform = (d.source_platform as string) || "unknown";
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
  });

  const total = data.length || 1;

  return Object.entries(platformCounts)
    .map(([platform, count]) => ({
      platform,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}
