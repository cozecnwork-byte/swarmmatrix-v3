'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, User, Package, Users, FileText, Share2, Server, Globe, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// 步骤配置
const STEPS = [
  { id: 1, name: '基础信息', icon: User, description: '项目名称和描述' },
  { id: 2, name: '产品信息', icon: Package, description: '产品详情和卖点' },
  { id: 3, name: '目标客户', icon: Users, description: '国家和人群标签' },
  { id: 4, name: '内容策略', icon: FileText, description: '内容类型和主题' },
  { id: 5, name: '平台选择', icon: Share2, description: '平台组合推荐' },
  { id: 6, name: '账号配置', icon: Server, description: '账号数量和分层' },
  { id: 7, name: '启动确认', icon: Globe, description: 'IP检查与启动' },
];

export default function AIWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [stepData, setStepData] = useState<any>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(((currentStep - 1) / (STEPS.length - 1)) * 100);
  }, [currentStep]);

  // 创建项目
  const createProject = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user',
          action: 'createProject',
          data,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setProjectId(result.data.id);
        setStepData({ ...stepData, 1: data });
        setCurrentStep(2);
        toast.success('项目创建成功！');
      }
    } catch (error) {
      toast.error('创建项目失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 更新步骤
  const updateStep = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user',
          action: 'updateStep',
          step: currentStep,
          data: {
            projectId,
            stepData: data,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAiRecommendations(result.data.recommendations);
        setStepData({ ...stepData, [currentStep]: data });
        
        if (currentStep < STEPS.length) {
          setCurrentStep(currentStep + 1);
        }
        toast.success('保存成功！');
      }
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 上一步
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 启动项目
  const startProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user',
          action: 'startProject',
          data: { projectId },
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('项目启动成功！正在执行引流方案...');
      }
    } catch (error) {
      toast.error('启动失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 顶部进度条 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI创建向导</h1>
                <p className="text-sm text-slate-500">7步创建你的专属引流方案</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              步骤 {currentStep} / {STEPS.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* 步骤导航 */}
          <div className="flex justify-between mt-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center gap-2 ${isActive ? 'scale-105' : ''} transition-transform`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {React.createElement(STEPS[currentStep - 1].icon, { className: 'w-5 h-5 text-blue-500' })}
                  {STEPS[currentStep - 1].name}
                </CardTitle>
                <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
              </div>
              {aiRecommendations && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700">
                  <Sparkles className="w-3 h-3" />
                  AI已推荐
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <StepContent 
              step={currentStep}
              data={stepData[currentStep]}
              onSubmit={currentStep === 1 ? createProject : updateStep}
              onPrev={prevStep}
              isLoading={isLoading}
              hasPrev={currentStep > 1}
              isLastStep={currentStep === STEPS.length}
              onStart={startProject}
              recommendations={aiRecommendations}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 步骤内容组件
function StepContent({ 
  step, 
  data, 
  onSubmit, 
  onPrev, 
  isLoading, 
  hasPrev, 
  isLastStep,
  onStart,
  recommendations 
}: any) {
  const [formData, setFormData] = useState(data || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleUseRecommendation = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
    toast.success('已使用AI推荐！');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>项目名称</Label>
            <Input 
              placeholder="例如：2024科技数码涨粉计划"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {recommendations?.projectNameSuggestions && (
              <div className="flex flex-wrap gap-2">
                {recommendations.projectNameSuggestions.map((name: string, idx: number) => (
                  <Button 
                    key={idx}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUseRecommendation('name', name)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>项目描述</Label>
            <Textarea 
              placeholder="描述你的引流目标和预期效果..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>产品名称</Label>
            <Input 
              placeholder="你的产品名称"
              value={formData.productName || ''}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>产品链接</Label>
            <Input 
              placeholder="https://..."
              value={formData.productUrl || ''}
              onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>产品描述</Label>
            <Textarea 
              placeholder="详细描述你的产品特点和优势..."
              value={formData.productDescription || ''}
              onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>目标国家/地区</Label>
            <div className="grid grid-cols-3 gap-3">
              {['中国', '美国', '日本', '韩国', '英国', '德国'].map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox 
                    id={country}
                    checked={formData.countries?.includes(country)}
                    onCheckedChange={(checked) => {
                      const countries = formData.countries || [];
                      if (checked) {
                        setFormData({ ...formData, countries: [...countries, country] });
                      } else {
                        setFormData({ ...formData, countries: countries.filter((c: string) => c !== country) });
                      }
                    }}
                  />
                  <Label htmlFor={country} className="cursor-pointer">{country}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>目标年龄段</Label>
            <Select 
              value={formData.ageGroup}
              onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择年龄段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-24">18-24岁</SelectItem>
                <SelectItem value="25-34">25-34岁</SelectItem>
                <SelectItem value="35-44">35-44岁</SelectItem>
                <SelectItem value="45+">45岁以上</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>兴趣标签</Label>
            <div className="flex flex-wrap gap-2">
              {['科技', '美妆', '游戏', '旅行', '美食', '健身', '教育', '财经'].map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={formData.tags?.includes(tag) ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => {
                    const tags = formData.tags || [];
                    if (tags.includes(tag)) {
                      setFormData({ ...formData, tags: tags.filter((t: string) => t !== tag) });
                    } else {
                      setFormData({ ...formData, tags: [...tags, tag] });
                    }
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>内容类型</Label>
            <Select 
              value={formData.contentType}
              onValueChange={(value) => setFormData({ ...formData, contentType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择内容类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">短视频</SelectItem>
                <SelectItem value="image">图文笔记</SelectItem>
                <SelectItem value="live">直播</SelectItem>
                <SelectItem value="mixed">混合类型</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>内容主题</Label>
            <div className="grid grid-cols-2 gap-3">
              {['产品评测', '使用教程', '好物分享', '干货知识', '生活记录', '互动话题'].map((topic) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox 
                    id={topic}
                    checked={formData.topics?.includes(topic)}
                    onCheckedChange={(checked) => {
                      const topics = formData.topics || [];
                      if (checked) {
                        setFormData({ ...formData, topics: [...topics, topic] });
                      } else {
                        setFormData({ ...formData, topics: topics.filter((t: string) => t !== topic) });
                      }
                    }}
                  />
                  <Label htmlFor={topic} className="cursor-pointer">{topic}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>平台选择</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: '抖音', icon: '🎵' },
                { name: '小红书', icon: '📖' },
                { name: 'B站', icon: '📺' },
                { name: '微博', icon: '🌐' },
                { name: '快手', icon: '🎬' },
                { name: '视频号', icon: '💬' },
              ].map((platform) => (
                <div key={platform.name} className="flex items-center space-x-2">
                  <Checkbox 
                    id={platform.name}
                    checked={formData.platforms?.includes(platform.name)}
                    onCheckedChange={(checked) => {
                      const platforms = formData.platforms || [];
                      if (checked) {
                        setFormData({ ...formData, platforms: [...platforms, platform.name] });
                      } else {
                        setFormData({ ...formData, platforms: platforms.filter((p: string) => p !== platform.name) });
                      }
                    }}
                  />
                  <Label htmlFor={platform.name} className="cursor-pointer">
                    {platform.icon} {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          {recommendations?.platformCombinations && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <Label className="text-blue-700 mb-2 block">AI推荐组合</Label>
              <div className="space-y-2">
                {recommendations.platformCombinations.map((combo: string[], idx: number) => (
                  <Button 
                    key={idx}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUseRecommendation('platforms', combo)}
                    className="w-full justify-start"
                  >
                    {combo.join(' + ')}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>账号数量</Label>
            <Select 
              value={formData.accountCount}
              onValueChange={(value) => setFormData({ ...formData, accountCount: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择账号数量" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1个账号（起步）</SelectItem>
                <SelectItem value="3">3个账号（推荐）</SelectItem>
                <SelectItem value="5">5个账号（矩阵）</SelectItem>
                <SelectItem value="10">10个账号（大规模）</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>账号分层策略</Label>
            <Select 
              value={formData.accountStrategy}
              onValueChange={(value) => setFormData({ ...formData, accountStrategy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择策略" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">主打账号（1个主账号+其他辅助）</SelectItem>
                <SelectItem value="equal">均衡发展（所有账号同等重要）</SelectItem>
                <SelectItem value="niche">垂直细分（每个账号专注不同细分领域）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-6">
          <div className="p-6 bg-green-50 rounded-lg text-center">
            <Globe className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">配置完成！</h3>
            <p className="text-green-600">检查通过，可以开始你的引流之旅了</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">IP检查</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['中国', '美国', '日本'].map((country) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-sm">{country}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">正常</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">风险评估</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">发布频率</span>
                    <Badge variant="secondary">适中</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">内容策略</span>
                    <Badge variant="secondary">安全</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">账号配置</span>
                    <Badge variant="secondary">合理</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">AI建议</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 建议前3天每天发布1-2篇，观察效果后再增加频率</li>
              <li>• 注意各平台内容差异化，避免完全重复</li>
              <li>• 关注数据反馈，及时调整内容策略</li>
            </ul>
          </div>
        </div>
      )}

      <CardFooter className="flex justify-between pt-6">
        {hasPrev && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onPrev}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
        )}
        {!hasPrev && <div />}
        
        {!isLastStep ? (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '保存中...' : '下一步'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        ) : (
          <Button type="button" onClick={onStart} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? '启动中...' : '一键启动'}
            {!isLoading && <PlayCircle className="w-4 h-4 ml-2" />}
          </Button>
        )}
      </CardFooter>
    </form>
  );
}
