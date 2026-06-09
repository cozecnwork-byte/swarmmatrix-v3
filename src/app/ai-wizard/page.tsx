'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  PlayCircle,
  Globe,
  Target,
  Users,
  TrendingUp,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// 全球国家列表
const GLOBAL_COUNTRIES = [
  { name: '中国', code: 'CN', flag: '🇨🇳', continent: '亚洲' },
  { name: '美国', code: 'US', flag: '🇺🇸', continent: '北美' },
  { name: '日本', code: 'JP', flag: '🇯🇵', continent: '亚洲' },
  { name: '韩国', code: 'KR', flag: '🇰🇷', continent: '亚洲' },
  { name: '英国', code: 'GB', flag: '🇬🇧', continent: '欧洲' },
  { name: '德国', code: 'DE', flag: '🇩🇪', continent: '欧洲' },
  { name: '法国', code: 'FR', flag: '🇫🇷', continent: '欧洲' },
  { name: '意大利', code: 'IT', flag: '🇮🇹', continent: '欧洲' },
  { name: '西班牙', code: 'ES', flag: '🇪🇸', continent: '欧洲' },
  { name: '加拿大', code: 'CA', flag: '🇨🇦', continent: '北美' },
  { name: '澳大利亚', code: 'AU', flag: '🇦🇺', continent: '大洋洲' },
  { name: '印度', code: 'IN', flag: '🇮🇳', continent: '亚洲' },
  { name: '巴西', code: 'BR', flag: '🇧🇷', continent: '南美' },
  { name: '墨西哥', code: 'MX', flag: '🇲🇽', continent: '北美' },
  { name: '印度尼西亚', code: 'ID', flag: '🇮🇩', continent: '亚洲' },
  { name: '土耳其', code: 'TR', flag: '🇹🇷', continent: '欧亚' },
  { name: '俄罗斯', code: 'RU', flag: '🇷🇺', continent: '欧亚' },
  { name: '沙特', code: 'SA', flag: '🇸🇦', continent: '中东' },
  { name: '阿联酋', code: 'AE', flag: '🇦🇪', continent: '中东' },
  { name: '尼日利亚', code: 'NG', flag: '🇳🇬', continent: '非洲' },
];

// 目标人群标签
const AUDIENCE_GROUPS = [
  { value: 'creator', label: '创作者', icon: '🎨' },
  { value: 'business', label: '企业主', icon: '🏢' },
  { value: 'developer', label: '开发者', icon: '💻' },
  { value: 'marketing', label: '营销人员', icon: '📢' },
  { value: 'student', label: '学生', icon: '🎓' },
  { value: 'general', label: '大众消费者', icon: '👥' },
];

// 内容策略类型
const CONTENT_STRATEGIES = [
  { value: 'kol', label: 'KOL合作', description: '与当地有影响力的KOL合作推广' },
  { value: 'brand', label: '品牌账号', description: '建立官方品牌账号，发布官方内容' },
  { value: 'micro', label: '小号矩阵', description: '创建多个小号，批量发布内容' },
  { value: 'mixed', label: '混合策略', description: 'KOL + 品牌账号 + 小号 综合使用' },
];

// 全球平台列表
const GLOBAL_PLATFORMS = [
  { name: 'TikTok', icon: '🎵', region: '全球', category: '短视频' },
  { name: 'Instagram', icon: '📸', region: '全球', category: '图片社交' },
  { name: 'YouTube', icon: '📺', region: '全球', category: '长视频' },
  { name: 'Facebook', icon: '📘', region: '全球', category: '社交网络' },
  { name: 'Twitter/X', icon: '🐦', region: '全球', category: '短内容' },
  { name: 'LinkedIn', icon: '💼', region: '全球', category: '职场社交' },
  { name: 'Pinterest', icon: '📌', region: '全球', category: '图片发现' },
  { name: 'Snapchat', icon: '👻', region: '欧美', category: '即时社交' },
  { name: 'WhatsApp', icon: '💬', region: '全球', category: '即时通讯' },
  { name: 'Telegram', icon: '✈️', region: '全球', category: '即时通讯' },
  { name: 'Reddit', icon: '🔴', region: '全球', category: '社区论坛' },
  { name: 'Discord', icon: '💜', region: '全球', category: '社群互动' },
  { name: '抖音', icon: '🎵', region: '中国', category: '短视频' },
  { name: '小红书', icon: '📖', region: '中国', category: '内容社区' },
  { name: 'B站', icon: '📺', region: '中国', category: '长视频' },
  { name: '微博', icon: '🌐', region: '中国', category: '社交网络' },
  { name: 'Line', icon: '💚', region: '日本/台湾', category: '即时通讯' },
  { name: 'KakaoTalk', icon: '💛', region: '韩国', category: '即时通讯' },
];

// 步骤定义
const STEPS = [
  { id: 1, name: '项目信息', icon: Globe, description: '设置基础项目信息' },
  { id: 2, name: '产品信息', icon: Target, description: '介绍你的产品和卖点' },
  { id: 3, name: '目标客户', icon: Users, description: '选择目标国家、人群和语言' },
  { id: 4, name: '内容策略', icon: TrendingUp, description: 'AI推荐最佳内容策略' },
  { id: 5, name: '平台选择', icon: Globe, description: 'AI智能匹配全球平台' },
  { id: 6, name: '账号配置', icon: Settings, description: '60%主力 + 40%备用，上限50' },
  { id: 7, name: 'IP检查', icon: AlertCircle, description: '逐国IP检查，9行配置总览' },
];

export default function GlobalAIWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState<string>('');
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);

  const progress = (currentStep / STEPS.length) * 100;

  // 创建项目
  const createProject = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user',
          action: 'initializeWizard',
          data,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setProjectId(result.data.id);
        setStepData({ 1: data });
        setAiRecommendations(result.data.recommendations);
        setCurrentStep(2);
        toast.success('项目创建成功！');
      }
    } catch (error) {
      toast.error('创建失败');
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
          data: { 
            projectId, 
            step: currentStep, 
            stepData: data 
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStepData({ ...stepData, [currentStep]: data });
        if (result.data.recommendations) {
          setAiRecommendations({ ...aiRecommendations, ...result.data.recommendations });
        }
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
        toast.success('🚀 项目启动成功！全球引流方案开始执行...');
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
                <h1 className="text-2xl font-bold text-slate-900">全球矩阵引流向导</h1>
                <p className="text-sm text-slate-500">7步创建你的专属全球引流方案</p>
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
              allStepData={stepData}
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
  recommendations,
  allStepData
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
      {/* 步骤1: 项目信息 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>项目名称</Label>
            <Input 
              placeholder="例如：2024全球数码产品推广计划"
              value={formData.projectName || ''}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            />
            {recommendations?.projectNameSuggestions && (
              <div className="flex flex-wrap gap-2">
                {recommendations.projectNameSuggestions.map((name: string, idx: number) => (
                  <Button 
                    key={idx}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUseRecommendation('projectName', name)}
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
              placeholder="描述你的全球引流目标和预期效果..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      )}

      {/* 步骤2: 产品信息 */}
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
            <Label>产品链接（可选）</Label>
            <Input 
              placeholder="https://..."
              value={formData.productUrl || ''}
              onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>产品卖点</Label>
            <Textarea 
              placeholder="详细描述你的产品特点、优势和核心卖点..."
              value={formData.productSellingPoints || ''}
              onChange={(e) => setFormData({ ...formData, productSellingPoints: e.target.value })}
              rows={4}
            />
            {recommendations?.sellingPoints && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <Label className="text-purple-700 mb-2 block">AI提取的卖点</Label>
                <div className="space-y-2">
                  {recommendations.sellingPoints.map((point: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5" />
                      <span className="text-sm text-purple-800">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 步骤3: 目标客户群体 */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>目标国家/地区（可多选）</Label>
            <Tabs defaultValue="亚洲">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="亚洲">亚洲</TabsTrigger>
                <TabsTrigger value="欧洲">欧洲</TabsTrigger>
                <TabsTrigger value="北美">北美</TabsTrigger>
                <TabsTrigger value="南美">南美</TabsTrigger>
                <TabsTrigger value="其他">其他</TabsTrigger>
              </TabsList>
              {['亚洲', '欧洲', '北美', '南美', '其他'].map((continent) => (
                <TabsContent key={continent} value={continent}>
                  <div className="grid grid-cols-3 gap-2">
                    {GLOBAL_COUNTRIES.filter(c => c.continent === continent).map((country) => (
                      <div key={country.code} className="flex items-center space-x-2">
                        <Checkbox 
                          id={country.code}
                          checked={formData.countries?.includes(country.code)}
                          onCheckedChange={(checked) => {
                            const countries = formData.countries || [];
                            if (checked) {
                              setFormData({ ...formData, countries: [...countries, country.code] });
                            } else {
                              setFormData({ ...formData, countries: countries.filter((c: string) => c !== country.code) });
                            }
                          }}
                        />
                        <Label htmlFor={country.code} className="cursor-pointer flex items-center gap-1">
                          <span>{country.flag}</span>
                          <span className="text-sm">{country.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="13-17">13-17岁（青少年）</SelectItem>
                  <SelectItem value="18-24">18-24岁（青年）</SelectItem>
                  <SelectItem value="25-34">25-34岁（青年）</SelectItem>
                  <SelectItem value="35-44">35-44岁（中年）</SelectItem>
                  <SelectItem value="45+">45岁以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>当地语言</Label>
              <Select 
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择主要语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">英文</SelectItem>
                  <SelectItem value="ja">日文</SelectItem>
                  <SelectItem value="ko">韩文</SelectItem>
                  <SelectItem value="es">西班牙文</SelectItem>
                  <SelectItem value="fr">法文</SelectItem>
                  <SelectItem value="de">德文</SelectItem>
                  <SelectItem value="pt">葡萄牙文</SelectItem>
                  <SelectItem value="ar">阿拉伯文</SelectItem>
                  <SelectItem value="ru">俄文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>目标人群</Label>
            <div className="grid grid-cols-3 gap-3">
              {AUDIENCE_GROUPS.map((group) => (
                <div key={group.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={group.value}
                    checked={formData.audienceGroups?.includes(group.value)}
                    onCheckedChange={(checked) => {
                      const groups = formData.audienceGroups || [];
                      if (checked) {
                        setFormData({ ...formData, audienceGroups: [...groups, group.value] });
                      } else {
                        setFormData({ ...formData, audienceGroups: groups.filter((g: string) => g !== group.value) });
                      }
                    }}
                  />
                  <Label htmlFor={group.value} className="cursor-pointer flex items-center gap-1">
                    <span>{group.icon}</span>
                    <span className="text-sm">{group.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 步骤4: 内容策略 */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>内容策略类型</Label>
            <div className="grid grid-cols-1 gap-3">
              {CONTENT_STRATEGIES.map((strategy) => (
                <div 
                  key={strategy.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.contentStrategy === strategy.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setFormData({ ...formData, contentStrategy: strategy.value })}
                >
                  <div className="font-medium">{strategy.label}</div>
                  <div className="text-sm text-slate-500 mt-1">{strategy.description}</div>
                </div>
              ))}
            </div>
            {recommendations?.contentStrategy && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <Label className="text-purple-700 mb-2 block">AI推荐策略</Label>
                <div className="text-purple-800">
                  根据您的产品特点，AI推荐使用：
                  <strong>{recommendations.contentStrategy}</strong>
                </div>
                <Button 
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleUseRecommendation('contentStrategy', recommendations.contentStrategy)}
                >
                  使用AI推荐
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 步骤5: 平台选择 */}
      {step === 5 && (
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>选择目标平台（AI已根据国家/人群智能匹配）</Label>
            <Tabs defaultValue="短视频">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="短视频">短视频</TabsTrigger>
                <TabsTrigger value="社交">社交网络</TabsTrigger>
                <TabsTrigger value="即时通讯">即时通讯</TabsTrigger>
                <TabsTrigger value="社区">社区</TabsTrigger>
              </TabsList>
              {['短视频', '社交', '即时通讯', '社区'].map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-2 gap-3">
                    {GLOBAL_PLATFORMS.filter(p => p.category.includes(category)).map((platform) => (
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
                        <Label htmlFor={platform.name} className="cursor-pointer flex items-center gap-2">
                          <span className="text-xl">{platform.icon}</span>
                          <div>
                            <div className="text-sm font-medium">{platform.name}</div>
                            <div className="text-xs text-slate-400">{platform.region}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
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

      {/* 步骤6: 账号配置 */}
      {step === 6 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>账号配置总览</Label>
              <Badge variant="secondary">
                平台数 × 国家数 = {formData.platforms?.length || 0} × {formData.countries?.length || 0} = {
                  Math.min((formData.platforms?.length || 0) * (formData.countries?.length || 0), 50)
                }个账号（上限50）
              </Badge>
            </div>

            {/* 账号分层可视化 */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <div className="flex items-center justify-between text-white mb-2">
                  <span className="font-medium">主力账号（60%）</span>
                  <span className="font-bold text-lg">
                    {Math.ceil(Math.min((formData.platforms?.length || 0) * (formData.countries?.length || 0), 50) * 0.6)}个
                  </span>
                </div>
                <Progress value={60} className="h-2 bg-blue-300" />
                <p className="text-blue-100 text-sm mt-2">
                  核心平台 + 核心国家，高频率发布
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg">
                <div className="flex items-center justify-between text-white mb-2">
                  <span className="font-medium">备用账号（40%）</span>
                  <span className="font-bold text-lg">
                    {Math.floor(Math.min((formData.platforms?.length || 0) * (formData.countries?.length || 0), 50) * 0.4)}个
                  </span>
                </div>
                <Progress value={40} className="h-2 bg-slate-300" />
                <p className="text-slate-100 text-sm mt-2">
                  辅助平台 + 长尾国家，低频率补充
                </p>
              </div>
            </div>

            {/* 按平台展示 */}
            <div className="space-y-3">
              <Label>按平台账号分配</Label>
              <div className="grid grid-cols-2 gap-3">
                {(formData.platforms || []).map((platform: string) => (
                  <Card key={platform}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <span className="text-lg">
                          {GLOBAL_PLATFORMS.find(p => p.name === platform)?.icon || '📱'}
                        </span>
                        {platform}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(formData.countries || []).length}个国家
                      </div>
                      <div className="text-sm text-slate-500">
                        主力：{Math.ceil((formData.countries || []).length * 0.6)}个
                      </div>
                      <div className="text-sm text-slate-500">
                        备用：{Math.floor((formData.countries || []).length * 0.4)}个
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 步骤7: IP检查与启动 */}
      {step === 7 && (
        <div className="space-y-6">
          {/* 9行配置总览表 */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-800 mb-4">📊 9行配置总览表</h3>
            <div className="space-y-2">
              {[
                { label: '项目名称', value: allStepData[1]?.projectName || '-' },
                { label: '产品名称', value: allStepData[2]?.productName || '-' },
                { label: '目标国家', value: `${(allStepData[3]?.countries || []).length}个国家` },
                { label: '目标人群', value: `${(allStepData[3]?.audienceGroups || []).length}类人群` },
                { label: '内容策略', value: CONTENT_STRATEGIES.find(s => s.value === allStepData[4]?.contentStrategy)?.label || '-' },
                { label: '目标平台', value: `${(allStepData[5]?.platforms || []).length}个平台` },
                { label: '总账号数', value: Math.min((allStepData[5]?.platforms || []).length * (allStepData[3]?.countries || []).length, 50) + '个账号' },
                { label: '分层策略', value: '60%主力 + 40%备用' },
                { label: '状态', value: '准备就绪', status: 'ready' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                  <span className="text-slate-600">{item.label}</span>
                  <span className={`font-medium ${item.status === 'ready' ? 'text-green-600' : 'text-slate-800'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 逐国IP检查 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">🌍 逐国IP状态检查</h3>
            <div className="grid grid-cols-3 gap-3">
              {(allStepData[3]?.countries || []).map((countryCode: string) => {
                const country = GLOBAL_COUNTRIES.find(c => c.code === countryCode);
                // 模拟IP状态
                const hasIp = Math.random() > 0.3;
                return (
                  <Card key={countryCode} className={hasIp ? 'border-green-200' : 'border-red-200'}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{country?.flag}</span>
                          <span className="text-sm font-medium">{country?.name}</span>
                        </div>
                        {hasIp ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      {!hasIp && (
                        <Button 
                          variant="secondary"
                          size="sm"
                          className="w-full mt-2 bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          前往设置
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 检查通过状态 */}
          <div className={`p-6 rounded-lg text-center ${
            (allStepData[3]?.countries || []).every((c: string) => Math.random() > 0.3)
              ? 'bg-green-50'
              : 'bg-yellow-50'
          }`}>
            {(allStepData[3]?.countries || []).every((c: string) => Math.random() > 0.3) ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">全部就绪！</h3>
                <p className="text-green-600">所有国家IP检查通过，可以启动</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-yellow-800 mb-2">部分IP缺失</h3>
                <p className="text-yellow-600 mb-4">请先完成IP配置，或选择跳过直接启动</p>
                <Button variant="secondary" className="mr-2">
                  跳过IP检查
                </Button>
              </>
            )}
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
          <Button 
            type="button" 
            onClick={onStart} 
            disabled={isLoading} 
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? '启动中...' : '一键启动全球引流'}
            {!isLoading && <PlayCircle className="w-4 h-4 ml-2" />}
          </Button>
        )}
      </CardFooter>
    </form>
  );
}
