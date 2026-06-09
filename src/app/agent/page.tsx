"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  History,
  FileText,
  Zap,
  Copy,
  RotateCcw,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  steps?: StepInfo[];
}

interface StepInfo {
  step: number;
  name: string;
  status: "running" | "completed" | "failed";
  output?: string;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<StepInfo[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentSteps]);

  const quickCommands = [
    { label: "发布抖音视频", command: "帮我创建一个抖音引流视频，主题是人工智能教程" },
    { label: "生成小红书文案", command: "生成一篇小红书种草文案，产品是智能手表" },
    { label: "分析数据", command: "分析过去一周的引流效果数据" },
    { label: "批量发布", command: "将准备好的内容发布到所有已连接平台" },
  ];

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const timestamp = new Date();
    const userMessage: Message = {
      id: `${timestamp.getTime()}`,
      role: "user",
      content: input,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setCurrentSteps([]);

    // 模拟执行步骤
    const steps: StepInfo[] = [
      { step: 1, name: "接收输入", status: "running" },
      { step: 2, name: "理解需求", status: "running" },
      { step: 3, name: "选择工具", status: "running" },
      { step: 4, name: "执行任务", status: "running" },
      { step: 5, name: "观察结果", status: "running" },
      { step: 6, name: "反思评估", status: "running" },
      { step: 7, name: "输出结果", status: "running" },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      steps[i].status = "completed";
      setCurrentSteps([...steps]);
    }

    // 添加AI响应
    const aiTimestamp = new Date();
    const aiMessage: Message = {
      id: `${aiTimestamp.getTime() + 1}`,
      role: "assistant",
      content: generateAIResponse(input),
      timestamp: aiTimestamp,
      steps: steps,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
    setCurrentSteps([]);
  };

  const generateAIResponse = (userInput: string): string => {
    if (userInput.includes("抖音") || userInput.includes("视频")) {
      return `✅ 任务执行完成！

**任务**: 创建抖音引流视频

**执行步骤**:
1. 分析用户需求 → 识别主题：人工智能教程
2. 生成视频脚本 → 已生成3个版本供选择
3. 优化标题和标签 → 推荐热门标签5个
4. 设置发布时间 → 建议：晚上8点发布

**生成结果**:
- 📹 视频脚本已生成（可下载）
- 📝 推荐标题：3个备选
- 🏷️ 推荐标签：#AI教程 #人工智能 #科技 #学习 #干货
- ⏰ 最佳发布时间：20:00

是否需要我自动发布到抖音平台？`;
    }
    if (userInput.includes("小红书") || userInput.includes("文案")) {
      return `✅ 任务执行完成！

**任务**: 生成小红书种草文案

**执行结果**:
━━━━━━━━━━━━━━━━━━━━
📱 **智能手表种草日记**

姐妹们！这个智能手表真的绝了！✨

1️⃣ 续航超长，一周一充不是梦
2️⃣ 运动记录超准，每天10000步轻松达成
3️⃣ 睡眠监测很详细，终于知道自己为什么这么困了
4️⃣ 颜值超高，配什么衣服都好看

已经用了两个月，真的离不开它了！
推荐指数：⭐⭐⭐⭐⭐

#智能手表 #种草分享 #好物推荐
━━━━━━━━━━━━━━━━━━━━

📊 **优化建议**:
- 添加3-5张产品实拍图效果更佳
- 建议在晚上9-11点发布
- 可搭配限时优惠信息提升转化`;
    }
    return `✅ 任务已接收并处理！

**智能体执行报告**:
- 📥 输入解析：成功
- 🧠 需求理解：完成
- 🔧 工具选择：已选择最佳工具
- ⚡ 任务执行：完成
- 👁️ 结果观察：成功
- 🔄 反思优化：已优化
- 📤 结果输出：完成

请问还有其他需要帮助的吗？`;
  };

  return (
    <AppLayout title="智能体任务">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
        {/* 左侧：任务历史 */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4" />
                任务历史
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100%-80px)] px-4 pb-4">
                <div className="space-y-2">
                  {[
                    { name: "抖音视频引流", time: "2分钟前", status: "completed" },
                    { name: "小红书文案生成", time: "15分钟前", status: "completed" },
                    { name: "批量内容发布", time: "1小时前", status: "completed" },
                    { name: "数据分析报告", time: "3小时前", status: "completed" },
                    { name: "B站专栏推广", time: "昨天", status: "failed" },
                    { name: "微信引流设置", time: "昨天", status: "completed" },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{task.name}</span>
                        {task.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{task.time}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：对话区域 */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                AI智能体对话
                <Badge variant="secondary" className="ml-2">
                  9层架构
                </Badge>
              </CardTitle>
              <CardDescription>
                自然语言指令，智能理解执行，自动反思优化
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* 消息区域 */}
              <ScrollArea className="flex-1 px-6" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      开始与智能体对话
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-md">
                      输入自然语言指令，AI将自动理解、规划、执行并优化您的引流任务
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-2">
                      {quickCommands.map((cmd) => (
                        <Button
                          key={cmd.label}
                          variant="outline"
                          size="sm"
                          className="justify-start"
                          onClick={() => setInput(cmd.command)}
                        >
                          <Zap className="h-4 w-4 mr-2 text-blue-500" />
                          {cmd.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-4 ${
                            msg.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                          <div
                            className={`text-xs mt-2 ${
                              msg.role === "user" ? "text-blue-100" : "text-slate-500"
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && currentSteps.length > 0 && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 rounded-lg p-4 max-w-[85%]">
                          <div className="text-sm font-medium text-slate-700 mb-3">
                            智能体执行中...
                          </div>
                          <div className="space-y-2">
                            {currentSteps.map((step) => (
                              <div key={step.step} className="flex items-center gap-2">
                                {step.status === "running" ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                <span
                                  className={`text-sm ${
                                    step.status === "running"
                                      ? "text-slate-600"
                                      : "text-slate-400"
                                  }`}
                                >
                                  步骤{step.step}: {step.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* 输入区域 */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入任务指令，例如：帮我创建一个抖音引流视频..."
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    className="h-auto px-4"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>按 Enter 发送，Shift+Enter 换行</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7">
                      <FileText className="h-3 w-3 mr-1" />
                      模板
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7">
                      <Copy className="h-3 w-3 mr-1" />
                      历史
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
