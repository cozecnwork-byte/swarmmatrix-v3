/**
 * 智能体任务执行 API
 * POST /api/agent/execute - 执行智能体任务
 * GET /api/agent/tasks - 获取任务列表
 * GET /api/agent/tasks/[id] - 获取任务详情
 */

import { NextRequest, NextResponse } from "next/server";
import { createAgent } from "@/lib/agent";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// POST - 执行智能体任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, userId, sessionId } = body;

    if (!input) {
      return NextResponse.json(
        { success: false, error: "请输入任务指令" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "用户ID不能为空" },
        { status: 400 }
      );
    }

    const agent = createAgent({
      userId,
      sessionId,
      enableReflection: true,
    });

    const result = await agent.execute(input);

    return NextResponse.json({
      success: result.success,
      taskId: result.taskId,
      output: result.output,
      reflection: result.reflection,
      duration: result.duration,
      steps: result.steps,
    });
  } catch (error) {
    console.error("智能体执行失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "执行失败",
      },
      { status: 500 }
    );
  }
}

// GET - 获取任务列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "用户ID不能为空" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    let query = supabase
      .from("agent_tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      total: count,
    });
  } catch (error) {
    console.error("获取任务列表失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取失败",
      },
      { status: 500 }
    );
  }
}
