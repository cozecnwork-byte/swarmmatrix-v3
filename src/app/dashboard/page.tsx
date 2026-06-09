'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Globe, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  PlayCircle,
  Zap,
  Activity,
  Shield,
  Cog,
  FileText,
  Bot,
  Rocket,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 模拟数据
const MOCK_DATA = {
  stats: {
    activeProjects: 3,
    totalLeads: 156,
    platforms: 12,
    countries: 8
  },
  recentProjects: [
    {
      id: '1',
      name: '2024全球数码产品推广',
      status: 'running',
      progress: 65,
      startDate: '2024-01-15',
      platforms: ['TikTok', 'Instagram', 'Facebook'],
      countries: ['US', 'JP', 'GB']
    },
    {
      id: '2',
      name: '亚洲地区品牌建设',
      status: 'pending',
      progress: 0,
      startDate: '2024-02-01',
      platforms: ['抖音', '小红书', 'B站'],
      countries: ['CN', 'KR', 'JP']
    },
    {
      id: '3',
      name: '欧洲市场测试',
      status: 'completed',
      progress: 100,
      startDate: '2023-12-01',
      platforms: ['YouTube', 'LinkedIn', 'Twitter'],
      countries: ['DE', 'FR', 'ES']
    }
  ],
  platformPerformance: [
    { name: 'TikTok', leads: 89, engagement: 4520, conversion: 3.2 },
    { name: 'Instagram', leads: 67, engagement: 3890, conversion: 2.8 },
    { name: 'YouTube', leads: 45, engagement: 2100, conversion: 2.1 },
    { name: 'Facebook', leads: 34, engagement: 1890, conversion: 1.8 },
    { name: 'LinkedIn', leads: 23, engagement: 890, conversion: 2.6 },
    { name: 'Twitter', leads: 18, engagement: 560, conversion: 3.2 }
  ],
  contentTypes: [
    { type: '短视频', count: 89, performance: 'best' },
    { type: '图文', count: 67, performance: 'good' },
    { type: '长视频', count: 34, performance: 'average' },
    { type: '直播', count: 12, performance: 'good' }
  ],
  leadCapture: {
    total: 156,
    bySource: {
      'TikTok': 89,
      'Instagram': 67,
      'YouTube': 45,
      'Facebook': 34,
      '其他': 23
    },
    conversionRate: 2.8
  },
  qualityAssurance: {
    testCases: 156,
    passed: 148,
    failed: 8,
    coverage: 92
  },
  aiAgentPlatform: {
    activeAgents: 12,
    workflows: 8,
    plugins: 24,
    modelCalls: 1234
  }
};

function DashboardPageContent() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-3">
                欢迎使用 GlobalLeadGen v3
              </h1>
              <p className="text-blue-100 text-lg mb-6">
                专为新手小白设计的矩阵引流平台，零代码操作，智能引导
              </p>
              <div className="flex gap-3">
                <Button 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => window.location.href = '/ai-wizard'}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  快速开始
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-400"
                  onClick={() => window.location.href = '/tasks'}
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  查看任务
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 统计卡片 - 第一行 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-slate-600 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                智能体任务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {MOCK_DATA.stats.activeProjects}
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {MOCK_DATA.recentProjects.filter(p => p.status === 'running').length} 运行中
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {MOCK_DATA.recentProjects.filter(p => p.status === 'completed').length} 已完成
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                引流内容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {MOCK_DATA.stats.totalLeads}
              </div>
              <p className="text-slate-500">总曝光 {MOCK_DATA.stats.totalLeads * 150}K · 点击 {MOCK_DATA.stats.totalLeads * 12}K</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-slate-600 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                可用模板
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                45
              </div>
              <p className="text-slate-500">包含文案、视频、图文模板</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-slate-600 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                定时任务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                12
              </div>
              <p className="text-slate-500">自动化引流计划</p>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/ai-wizard'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">创建智能体任务</CardTitle>
                  <p className="text-slate-500 mt-1">让AI帮你完成引流任务</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="default" className="text-blue-600 bg-transparent hover:bg-blue-50">
                  开始使用
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/publish'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">一键发布内容</CardTitle>
                  <p className="text-slate-500 mt-1">快速发布到多个平台</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="default" className="text-green-600 bg-transparent hover:bg-green-50">
                  开始使用
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/templates'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">选择模板</CardTitle>
                  <p className="text-slate-500 mt-1">使用现成的引流模板</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="default" className="text-purple-600 bg-transparent hover:bg-purple-50">
                  开始使用
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/schedule'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">设置定时任务</CardTitle>
                  <p className="text-slate-500 mt-1">自动化执行计划</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="default" className="text-orange-600 bg-transparent hover:bg-orange-50">
                  开始使用
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：最近项目和平台性能 */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="projects">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="projects">最近项目</TabsTrigger>
                <TabsTrigger value="platforms">平台性能</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-4">
                {MOCK_DATA.recentProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <Badge 
                              className={
                                project.status === 'running' ? 'bg-blue-100 text-blue-700' :
                                project.status === 'completed' ? 'bg-green-100 text-green-700' :
                                'bg-slate-100 text-slate-700'
                              }
                            >
                              {project.status === 'running' ? '运行中' : 
                               project.status === 'completed' ? '已完成' : '待开始'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {project.startDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {project.countries.length} 个国家
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {project.platforms.length} 个平台
                            </span>
                          </div>
                          {project.status !== 'pending' && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">进度</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {project.platforms.map(platform => (
                              <Badge key={platform} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                            {project.countries.map(country => (
                              <Badge key={country} variant="outline" className="text-xs">
                                {country}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => window.location.href = `/tasks?project=${project.id}`}
                        >
                          查看详情
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="platforms" className="space-y-4">
                {MOCK_DATA.platformPerformance.map((platform) => (
                  <Card key={platform.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{platform.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span>线索: <span className="font-medium text-slate-900">{platform.leads}</span></span>
                            <span>互动: <span className="font-medium text-slate-900">{platform.engagement}</span></span>
                            <span>转化: <span className="font-medium text-green-600">{platform.conversion}%</span></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              platform.conversion >= 3 ? 'bg-green-100 text-green-700' :
                              platform.conversion >= 2 ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }
                          >
                            {platform.conversion >= 3 ? '优秀' : 
                             platform.conversion >= 2 ? '良好' : '一般'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧：质量保证和AI智能体平台 */}
          <div className="space-y-8">
            {/* 质量保证 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  质量保证
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">测试用例</span>
                    <span className="font-medium">{MOCK_DATA.qualityAssurance.testCases}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">通过</span>
                    <span className="font-medium text-green-600">{MOCK_DATA.qualityAssurance.passed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">失败</span>
                    <span className="font-medium text-red-600">{MOCK_DATA.qualityAssurance.failed}</span>
                  </div>
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">测试覆盖率</span>
                      <span className="font-medium">{MOCK_DATA.qualityAssurance.coverage}%</span>
                    </div>
                    <Progress value={MOCK_DATA.qualityAssurance.coverage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI智能体应用管理平台 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cog className="w-5 h-5" />
                  AI智能体平台
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">活跃智能体</span>
                    <span className="font-medium">{MOCK_DATA.aiAgentPlatform.activeAgents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">工作流</span>
                    <span className="font-medium">{MOCK_DATA.aiAgentPlatform.workflows}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">插件</span>
                    <span className="font-medium">{MOCK_DATA.aiAgentPlatform.plugins}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">模型调用</span>
                    <span className="font-medium">{MOCK_DATA.aiAgentPlatform.modelCalls.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 内容类型统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  内容类型
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_DATA.contentTypes.map((content) => (
                    <div key={content.type} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{content.type}</span>
                        <span className="text-sm text-slate-500 ml-2">({content.count})</span>
                      </div>
                      <Badge 
                        className={
                          content.performance === 'best' ? 'bg-green-100 text-green-700' :
                          content.performance === 'good' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }
                      >
                        {content.performance === 'best' ? '最佳' : 
                         content.performance === 'good' ? '良好' : '一般'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppLayout>
      <DashboardPageContent />
    </AppLayout>
  );
}
