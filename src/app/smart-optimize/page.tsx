'use client';

import React, { useState } from 'react';
import { Sparkles, Target, TrendingUp, Calendar, Zap, CheckCircle2, PlayCircle, Clock, BarChart3, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const PRESET_SCENARIOS = [
  {
    id: 'douyin-growth',
    name: '抖音涨粉',
    icon: '🎵',
    description: '快速提升抖音粉丝量',
    goal: '我要涨粉1000+',
    color: 'from-blue-500 to-cyan-500',
    features: ['爆款选题', '黄金时段发布', '互动话题']
  },
  {
    id: 'xiaohongshu-seeding',
    name: '小红书种草',
    icon: '📖',
    description: '小红书好物分享',
    goal: '提升笔记曝光和转化',
    color: 'from-pink-500 to-rose-500',
    features: ['好物测评', '笔记矩阵', 'KOL合作']
  },
  {
    id: 'community-drainage',
    name: '社群引流',
    icon: '👥',
    description: '社群裂变增长',
    goal: '社群成员增长和活跃',
    color: 'from-green-500 to-emerald-500',
    features: ['福利活动', '内容裂变', '精准转化']
  },
  {
    id: 'brand-exposure',
    name: '品牌曝光',
    icon: '🌟',
    description: '提升品牌知名度',
    goal: '品牌声量和媒体报道',
    color: 'from-purple-500 to-violet-500',
    features: ['多平台联动', '话题营销', '事件传播']
  }
];

export default function SmartOptimizePage() {
  const [activeTab, setActiveTab] = useState('preset');
  const [userGoal, setUserGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const handlePreset = async (scenario: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/smart-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-001',
          action: 'createOptimization',
          userGoal: scenario.goal,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setOptimizationResult(result.data);
        setActiveTab('custom');
        setUserGoal(scenario.goal);
        toast.success('方案生成成功！');
      }
    } catch (error) {
      toast.error('生成方案失败');
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomOptimization = async () => {
    if (!userGoal.trim()) {
      toast.error('请输入你的目标');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/smart-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-001',
          action: 'createOptimization',
          userGoal,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setOptimizationResult(result.data);
        toast.success('AI优化方案已生成！');
      }
    } catch (error) {
      toast.error('生成方案失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-10 h-10 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">智能优化助手</h1>
            <p className="text-slate-500">AI为你规划最优引流方案</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preset">预设场景</TabsTrigger>
          <TabsTrigger value="custom">自定义目标</TabsTrigger>
        </TabsList>

        <TabsContent value="preset" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {PRESET_SCENARIOS.map((scenario) => (
              <Card 
                key={scenario.id} 
                className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => handlePreset(scenario)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{scenario.icon}</span>
                      <div>
                        <CardTitle>{scenario.name}</CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      推荐
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-3">
                      <Target className="w-4 h-4 inline mr-2" />
                      目标：{scenario.goal}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scenario.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    disabled={isLoading}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    一键启动
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {!optimizationResult ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  设置你的引流目标
                </CardTitle>
                <CardDescription>
                  输入你的目标，AI会自动生成完整的优化方案
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    我想要：
                  </label>
                  <Input
                    placeholder="例如：我要涨粉1000、我要提升转化率、我要增加曝光..."
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    className="text-base"
                  />
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    AI建议
                  </h4>
                  <div className="space-y-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-left justify-start h-auto py-2"
                      onClick={() => setUserGoal('我要涨粉1000+')}
                    >
                      🎯 我要涨粉1000+
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-left justify-start h-auto py-2"
                      onClick={() => setUserGoal('提升转化率30%')}
                    >
                      📈 提升转化率30%
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-left justify-start h-auto py-2"
                      onClick={() => setUserGoal('增加曝光100万+')}
                    >
                      🌟 增加曝光100万+
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={createCustomOptimization}
                  disabled={isLoading || !userGoal.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      AI正在生成方案...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      生成AI优化方案
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    AI优化方案已生成
                  </CardTitle>
                  <CardDescription>
                    基于目标：{optimizationResult.optimization?.goal || userGoal}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    优化计划
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizationResult.plan?.tasks?.map((task: any, index: number) => (
                      <Card key={index} className="bg-slate-50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{task.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  预计: {task.estimatedTime}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) || (
                      <p className="text-slate-500 text-center py-8">
                        暂无任务计划
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                    onClick={() => {
                      toast.success('开始执行优化方案！');
                    }}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    开始执行优化
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    预期效果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        +{optimizationResult.expectedResults?.views || '50k'}
                      </div>
                      <div className="text-sm text-blue-700">曝光增长</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        +{optimizationResult.expectedResults?.engagement || '30%'}
                      </div>
                      <div className="text-sm text-green-700">互动提升</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        +{optimizationResult.expectedResults?.followers || '1k'}
                      </div>
                      <div className="text-sm text-purple-700">粉丝增长</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
