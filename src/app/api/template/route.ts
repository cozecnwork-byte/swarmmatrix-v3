/**
 * 模板 API
 * GET /api/template - 获取模板列表
 * POST /api/template - 创建模板
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// GET - 获取模板列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const isPublic = searchParams.get("isPublic");
    const creatorId = searchParams.get("creatorId");

    const supabase = getSupabaseClient();
    let query = supabase
      .from("templates")
      .select("*")
      .order("use_count", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (isPublic === "true") {
      query = query.eq("is_public", true);
    }
    if (creatorId) {
      query = query.eq("creator_id", creatorId);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("获取模板列表失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "获取失败",
      },
      { status: 500 }
    );
  }
}

// POST - 创建模板
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creatorId, name, description, type, category, content, variables, isPublic, tags } = body;

    if (!name || !type || !content) {
      return NextResponse.json(
        { success: false, error: "缺少必需参数" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("templates")
      .insert({
        creator_id: creatorId,
        name,
        description,
        type,
        category,
        content,
        variables,
        is_public: isPublic || false,
        tags,
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
    console.error("创建模板失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "创建失败",
      },
      { status: 500 }
    );
  }
}
