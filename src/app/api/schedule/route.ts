/**
 * 定时任务 API
 * POST /api/schedule - 创建定时任务
 * GET /api/schedule - 获取定时任务列表
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// POST - 创建定时任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, workflowId, taskName, scheduleType, scheduleConfig, params } = body;

    if (!userId || !taskName || !scheduleConfig) {
      return NextResponse.json(
        { success: false, error: "缺少必需参数" },
        { status: 400 }
      );
    }

    // 计算下次执行时间
    const nextRunAt = calculateNextRun(scheduleType, scheduleConfig);

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("scheduled_tasks")
      .insert({
        user_id: userId,
        workflow_id: workflowId,
        task_name: taskName,
        schedule_type: scheduleType || "cron",
        schedule_config: scheduleConfig,
        params,
        next_run_at: nextRunAt?.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("创建定时任务失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "创建失败",
      },
      { status: 500 }
    );
  }
}

// GET - 获取定时任务列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const isActive = searchParams.get("isActive");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "用户ID不能为空" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    let query = supabase
      .from("scheduled_tasks")
      .select("*")
      .eq("user_id", userId)
      .order("next_run_at", { ascending: true });

    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true");
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("获取定时任务列表失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取失败",
      },
      { status: 500 }
    );
  }
}

// 计算下次执行时间
function calculateNextRun(
  scheduleType: string,
  scheduleConfig: Record<string, unknown>
): Date | null {
  const now = new Date();

  switch (scheduleType) {
    case "once": {
      // 单次执行
      const runAt = scheduleConfig.runAt as string;
      return runAt ? new Date(runAt) : null;
    }
    case "interval": {
      // 间隔执行（分钟）
      const interval = (scheduleConfig.interval as number) || 60;
      return new Date(now.getTime() + interval * 60 * 1000);
    }
    case "cron": {
      // Cron表达式（简化处理：每天固定时间）
      const hour = (scheduleConfig.hour as number) || 9;
      const minute = (scheduleConfig.minute as number) || 0;
      const next = new Date(now);
      next.setHours(hour, minute, 0, 0);
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      return next;
    }
    default:
      return null;
  }
}
