import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 系统提示词
const SYSTEM_PROMPT = `你是GlobalLeadGen矩阵引流平台的AI客服助手，专门帮助小白用户使用平台。

你的职责：
1. 解答用户关于平台使用的问题
2. 提供操作指导和教程
3. 自动排查和修复操作问题
4. 提供智能建议和优化方案
5. 识别用户的操作错误并给予纠正

你的特点：
- 友好耐心，用小白能理解的语言
- 专业准确，基于实际功能
- 主动提供帮助，预判用户需求
- 提供可执行的建议，而不是空泛的理论

请根据用户的问题提供针对性的帮助。`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, conversationId, message, contextType } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    switch (action) {
      case 'sendMessage':
        return await sendMessage(supabase, userId, conversationId, message, contextType);
      case 'createConversation':
        return await createConversation(supabase, userId, contextType);
      case 'getConversation':
        return await getConversation(supabase, userId, conversationId);
      case 'listConversations':
        return await listConversations(supabase, userId);
      case 'autoTroubleshoot':
        return await autoTroubleshoot(supabase, userId, message);
      default:
        return NextResponse.json(
          { success: false, error: '无效的操作' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI客服API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || '';
    const action = searchParams.get('action') || '';
    const conversationId = searchParams.get('conversationId') ?? undefined;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    switch (action) {
      case 'getConversation':
        return await getConversation(supabase, userId, conversationId);
      case 'listConversations':
        return await listConversations(supabase, userId);
      default:
        return NextResponse.json(
          { success: false, error: '无效的操作' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI客服API错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 创建对话
async function createConversation(supabase: any, userId: string, contextType?: string) {
  const { data: conversation, error } = await supabase
    .from('ai_assistant_conversations')
    .insert({
      user_id: userId,
      title: '新对话',
      context_type: contextType || 'general',
    })
    .select()
    .single();

  if (error) throw error;

  // 添加系统欢迎消息
  const welcomeMessage = {
    role: 'assistant',
    content: '你好！我是你的AI助手，很高兴为你服务！有什么我可以帮你的吗？',
    message_type: 'text',
  };

  const { data: messageData, error: messageError } = await supabase
    .from('ai_assistant_messages')
    .insert({
      conversation_id: conversation.id,
      ...welcomeMessage,
    })
    .select()
    .single();

  if (messageError) throw messageError;

  return NextResponse.json({ 
    success: true, 
    data: { 
      conversation, 
      messages: [messageData] 
    } 
  });
}

// 发送消息
async function sendMessage(
  supabase: any, 
  userId: string, 
  conversationId: string, 
  userMessage: string, 
  contextType?: string
) {
  // 获取对话历史
  const { data: messages, error: messagesError } = await supabase
    .from('ai_assistant_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (messagesError) throw messagesError;

  // 保存用户消息
  const { data: userMsgData, error: userMsgError } = await supabase
    .from('ai_assistant_messages')
    .insert({
      conversation_id: conversationId,
      role: 'user',
      content: userMessage,
      message_type: 'text',
    })
    .select()
    .single();

  if (userMsgError) throw userMsgError;

  // 生成AI回复（简化版本，实际项目中调用LLM）
  const aiResponse = await generateAIResponse(messages, userMessage, contextType);

  // 保存AI回复
  const { data: aiMsgData, error: aiMsgError } = await supabase
    .from('ai_assistant_messages')
    .insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse.content,
      message_type: aiResponse.type || 'text',
      actions: aiResponse.actions,
    })
    .select()
    .single();

  if (aiMsgError) throw aiMsgError;

  // 更新对话标题（根据第一条消息自动生成）
  const isFirstMessage = messages && messages.length === 0;
  if (isFirstMessage) {
    const title = userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '');
    await supabase
      .from('ai_assistant_conversations')
      .update({ 
        title,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversationId);
  } else {
    await supabase
      .from('ai_assistant_conversations')
      .update({ 
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversationId);
  }

  return NextResponse.json({ 
    success: true, 
    data: { 
      userMessage: userMsgData, 
      aiMessage: aiMsgData 
    } 
  });
}

// 获取对话
async function getConversation(supabase: any, userId: string, conversationId?: string) {
  if (!conversationId) {
    return NextResponse.json(
      { success: false, error: '对话ID不能为空' },
      { status: 400 }
    );
  }

  // 获取对话信息
  const { data: conversation, error: convError } = await supabase
    .from('ai_assistant_conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (convError) throw convError;

  // 获取消息
  const { data: messages, error: msgError } = await supabase
    .from('ai_assistant_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (msgError) throw msgError;

  return NextResponse.json({ 
    success: true, 
    data: { conversation, messages } 
  });
}

// 列出用户对话
async function listConversations(supabase: any, userId: string) {
  const { data: conversations, error } = await supabase
    .from('ai_assistant_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return NextResponse.json({ success: true, data: conversations });
}

// 自动排查
async function autoTroubleshoot(supabase: any, userId: string, description?: string) {
  // 简单的自动排查逻辑（可以后续扩展）
  const issues = [];
  
  // 检查是否有最近失败的任务
  const { data: recentTasks, error: tasksError } = await supabase
    .from('agent_tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'failed')
    .order('created_at', { ascending: false })
    .limit(10);

  if (!tasksError && recentTasks && recentTasks.length > 0) {
    issues.push({
      type: 'task_failure',
      description: `发现 ${recentTasks.length} 个最近失败的任务`,
      details: recentTasks.map((t: any) => ({
        id: t.id,
        name: t.name,
        error: t.error_message,
      })),
    });
  }

  // 检查平台账号配置
  const { data: accounts, error: accountsError } = await supabase
    .from('platform_accounts')
    .select('*')
    .eq('user_id', userId);

  if (!accountsError && (!accounts || accounts.length === 0)) {
    issues.push({
      type: 'no_accounts',
      description: '未配置任何平台账号',
      suggestion: '请先在系统设置中添加平台账号',
    });
  }

  // 生成AI排查报告
  const report = {
    timestamp: new Date().toISOString(),
    issues,
    suggestions: issues.length > 0 
      ? [
          '建议先处理失败的任务',
          '检查平台账号配置是否正确',
          '参考教程了解正确的操作流程',
        ]
      : ['系统状态良好，未发现明显问题'],
    quickFixes: [
      { action: 'check_guides', label: '查看使用教程' },
      { action: 'test_accounts', label: '测试账号连接' },
    ],
  };

  return NextResponse.json({ success: true, data: report });
}

// 生成AI回复（简化版本）
async function generateAIResponse(messages: any[], userMessage: string, contextType?: string) {
  // 这里简化处理，实际项目中应该调用LLM SDK
  // 根据用户消息返回简单回复
  const responses = {
    '怎么发布': '请点击侧边栏的"一键发布"按钮，然后按照向导操作即可。',
    '如何使用': '欢迎使用GlobalLeadGen！建议先查看侧边栏的"AI向导"，7步即可完成项目创建。',
    '帮助': '我可以帮你解答使用问题、提供操作指导、自动排查问题。请告诉我你的具体需求。',
    '涨粉': '涨粉建议：1) 选择合适的平台 2) 定期发布优质内容 3) 使用智能优化助手规划方案。',
    '模板': '请进入"模板市场"页面，那里有丰富的内容模板供你选择使用。',
  };

  // 简单的关键词匹配
  let content = '感谢你的提问！我正在学习中，后续会提供更智能的回复。你可以尝试：\n1. 使用AI向导创建项目\n2. 进入模板市场选择模板\n3. 使用一键发布功能';
  
  for (const [key, value] of Object.entries(responses)) {
    if (userMessage.includes(key)) {
      content = value;
      break;
    }
  }

  return {
    content,
    type: 'text',
    actions: null,
  };
}
