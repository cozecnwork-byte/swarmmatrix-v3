'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Bot, User, HelpCircle, AlertCircle, CheckCircle2, XCircle, Lightbulb, BookOpen, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// 常见问题
const FAQ_QUESTIONS = [
  {
    id: 'faq-1',
    question: '如何开始使用AI向导创建项目？',
    answer: '点击左侧导航"AI向导"，按照7步流程逐步填写即可。每一步都有AI实时建议，非常简单！'
  },
  {
    id: 'faq-2',
    question: '我的数据安全吗？',
    answer: '您的数据存储在加密的数据库中，只有您可以访问。我们严格保护用户隐私。'
  },
  {
    id: 'faq-3',
    question: '如何添加多个平台账号？',
    answer: '进入"系统设置"→"平台账号"，点击"添加账号"按钮，按照提示填写即可。'
  },
  {
    id: 'faq-4',
    question: '发布失败了怎么办？',
    answer: '请检查：1.账号是否有效 2.内容是否合规 3.网络连接是否正常。也可以点击下方"自助排查"获取帮助。'
  },
  {
    id: 'faq-5',
    question: '如何查看引流效果数据？',
    answer: '进入"数据看板"页面，您可以查看各平台的实时数据、趋势图表和转化分析。'
  }
];

// 快速问题
const QUICK_QUESTIONS = [
  '如何优化我的引流内容？',
  '今天发布什么内容好？',
  '我的引流效果不好怎么办？',
  '如何设置定时任务？',
  '推荐几个热门话题'
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化对话
  useEffect(() => {
    initializeConversation();
  }, []);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = async () => {
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-001',
          action: 'createConversation'
        })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setConversationId(data.data.id);
        // 添加欢迎消息
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: '👋 你好！我是GlobalLeadGen的AI助手，很高兴为你服务！\n\n我可以帮你：\n• 解答平台使用问题\n• 排查操作问题\n• 提供引流建议\n• 优化你的引流策略\n\n有什么我可以帮你的吗？',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('初始化失败:', error);
    }
  };

  const sendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-001',
          conversationId,
          action: 'sendMessage',
          message: content
        })
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.success && data.data ? data.data.content : '抱歉，我暂时无法处理你的请求，请稍后再试。',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，出现了一些问题，请稍后再试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const runTroubleshooting = async (type: string) => {
    setIsTyping(true);
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-001',
          conversationId,
          action: 'troubleshoot',
          troubleshootingType: type
        })
      });
      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.success && data.data ? data.data.content : '正在进行排查...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bot className="h-8 w-8 text-blue-500" />
            AI客服助手
          </h1>
          <p className="text-slate-500 mt-1">24小时在线，随时解答你的问题</p>
        </div>
      </div>

      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">实时对话</TabsTrigger>
          <TabsTrigger value="faq">常见问题</TabsTrigger>
          <TabsTrigger value="troubleshoot">自助排查</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">AI助手</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    在线
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-900'}`}>
                          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-slate-400 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-100 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 p-4">
              <div className="flex gap-2 w-full">
                <Input
                  placeholder="输入你的问题..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={() => sendMessage()} disabled={isTyping || !inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {QUICK_QUESTIONS.map((question, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                className="text-xs h-auto py-2 px-3 flex-wrap justify-start text-left"
                onClick={() => sendMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="grid gap-4">
            {FAQ_QUESTIONS.map((faq) => (
              <Card key={faq.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="troubleshoot" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => runTroubleshooting('publish')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  发布问题排查
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">检查账号状态、内容合规性、网络连接</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => runTroubleshooting('account')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  账号问题排查
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">验证账号连接、权限配置、IP状态</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => runTroubleshooting('data')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  数据问题排查
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">检查数据同步、统计准确性、API连接</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => runTroubleshooting('system')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-slate-500" />
                  系统问题排查
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">系统健康检查、配置验证、性能检测</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => runTroubleshooting('performance')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  效果优化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">AI分析当前数据，提供优化建议</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => {
              toast.success('已联系人工客服，请等待回复！');
            }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-purple-500" />
                  联系人工客服
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">工作日9:00-18:00，专人在线服务</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
