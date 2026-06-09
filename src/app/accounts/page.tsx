"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Plus, 
  Search, 
  Settings,
  Globe,
  Users,
  Shield,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layout/app-layout';

// 模拟账号数据
const mockAccounts = [
  {
    id: 'acc-001',
    platform: 'TikTok',
    username: '@beauty_master',
    country: '美国',
    status: 'healthy',
    ipStatus: 'valid',
    riskLevel: 'low',
    taskCount: 2,
    lastActive: '2026-06-09 14:30:00',
    followers: 125000,
    engagement: 8.5
  },
  {
    id: 'acc-002',
    username: '@fashion_queen',
    platform: 'Instagram',
    country: '美国',
    status: 'healthy',
    ipStatus: 'valid',
    riskLevel: 'low',
    taskCount: 1,
    lastActive: '2026-06-09 13:15:00',
    followers: 89000,
    engagement: 6.2
  },
  {
    id: 'acc-003',
    username: '@tech_reviewer',
    platform: 'YouTube',
    country: '英国',
    status: 'warning',
    ipStatus: 'warning',
    riskLevel: 'medium',
    taskCount: 1,
    lastActive: '2026-06-08 20:45:00',
    followers: 234000,
    engagement: 12.1
  },
  {
    id: 'acc-004',
    username: '@health_tips',
    platform: 'Facebook',
    country: '德国',
    status: 'error',
    ipStatus: 'invalid',
    riskLevel: 'high',
    taskCount: 0,
    lastActive: '2026-06-05 10:20:00',
    followers: 45000,
    engagement: 3.8
  },
  {
    id: 'acc-005',
    username: '@travel_lover',
    platform: 'TikTok',
    country: '法国',
    status: 'healthy',
    ipStatus: 'valid',
    riskLevel: 'low',
    taskCount: 2,
    lastActive: '2026-06-09 12:00:00',
    followers: 67000,
    engagement: 7.3
  },
  {
    id: 'acc-006',
    username: '@food_explorer',
    platform: 'Instagram',
    country: '日本',
    status: 'healthy',
    ipStatus: 'valid',
    riskLevel: 'low',
    taskCount: 1,
    lastActive: '2026-06-09 11:30:00',
    followers: 156000,
    engagement: 9.7
  }
];

const platforms = ['全部', 'TikTok', 'Instagram', 'YouTube', 'Facebook', 'Twitter'];
const countries = ['全部', '美国', '英国', '法国', '德国', '日本', '韩国', '印度尼西亚'];
const statuses = ['全部', '健康', '警告', '异常', '待检查'];

const statusConfig = {
  healthy: { label: '健康', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
  warning: { label: '警告', variant: 'secondary' as const, icon: AlertCircle, color: 'text-orange-600' },
  error: { label: '异常', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
  pending: { label: '待检查', variant: 'outline' as const, icon: Activity, color: 'text-slate-500' }
};

const ipStatusConfig = {
  valid: { label: 'IP正常', variant: 'default' as const, icon: CheckCircle2 },
  warning: { label: 'IP异常', variant: 'secondary' as const, icon: AlertCircle },
  invalid: { label: 'IP失效', variant: 'destructive' as const, icon: XCircle }
};

const riskLevelConfig = {
  low: { label: '低风险', color: 'text-green-600', bg: 'bg-green-50' },
  medium: { label: '中风险', color: 'text-orange-600', bg: 'bg-orange-50' },
  high: { label: '高风险', color: 'text-red-600', bg: 'bg-red-50' }
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('全部');
  const [countryFilter, setCountryFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === '全部' || account.platform === platformFilter;
    const matchesCountry = countryFilter === '全部' || account.country === countryFilter;
    
    let matchesStatus = true;
    if (statusFilter !== '全部') {
      const statusMap: Record<string, string> = {
        '健康': 'healthy',
        '警告': 'warning', 
        '异常': 'error',
        '待检查': 'pending'
      };
      matchesStatus = account.status === statusMap[statusFilter];
    }
    
    return matchesSearch && matchesPlatform && matchesCountry && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getIPStatusBadge = (ipStatus: string) => {
    const config = ipStatusConfig[ipStatus as keyof typeof ipStatusConfig];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRiskLevelBadge = (riskLevel: string) => {
    const config = riskLevelConfig[riskLevel as keyof typeof riskLevelConfig];
    if (!config) return null;
    return (
      <Badge className={`${config.bg} ${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const stats = {
    total: accounts.length,
    healthy: accounts.filter(a => a.status === 'healthy').length,
    warning: accounts.filter(a => a.status === 'warning').length,
    error: accounts.filter(a => a.status === 'error').length,
    activeTasks: accounts.reduce((sum, a) => sum + a.taskCount, 0)
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">账号矩阵</h1>
          <p className="text-slate-500 mt-1">管理所有平台账号和IP状态</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            检查所有IP
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            添加账号
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">总账号</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-slate-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">健康</p>
                <p className="text-2xl font-bold text-green-600">{stats.healthy}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">警告</p>
                <p className="text-2xl font-bold text-orange-600">{stats.warning}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">异常</p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">活跃任务</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeTasks}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="搜索账号用户名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择平台" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择国家" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 账号列表 */}
      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">卡片视图</TabsTrigger>
            <TabsTrigger value="list">列表视图</TabsTrigger>
          </TabsList>
          <p className="text-sm text-slate-500">共 {filteredAccounts.length} 个账号</p>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccounts.map((account) => {
              const riskConfig = riskLevelConfig[account.riskLevel as keyof typeof riskLevelConfig];
              return (
                <Card key={account.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {account.username.charAt(1).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-base">{account.username}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {account.platform} · {account.country}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(account.status)}
                      {getIPStatusBadge(account.ipStatus)}
                      {getRiskLevelBadge(account.riskLevel)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">粉丝数</p>
                        <p className="font-medium text-slate-900">{account.followers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">互动率</p>
                        <p className="font-medium text-slate-900">{account.engagement}%</p>
                      </div>
                      <div>
                        <p className="text-slate-500">活跃任务</p>
                        <p className="font-medium text-slate-900">{account.taskCount}个</p>
                      </div>
                      <div>
                        <p className="text-slate-500">最后活跃</p>
                        <p className="font-medium text-slate-900 text-xs">
                          {new Date(account.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Activity className="h-4 w-4 mr-2" />
                        检查IP
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Shield className="h-4 w-4 mr-2" />
                        安全检测
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">账号</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">平台</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">国家</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">状态</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">IP状态</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">风险等级</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">粉丝</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">活跃任务</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-slate-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                              {account.username.charAt(1).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-900">{account.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{account.platform}</td>
                        <td className="px-6 py-4 text-slate-600">{account.country}</td>
                        <td className="px-6 py-4">{getStatusBadge(account.status)}</td>
                        <td className="px-6 py-4">{getIPStatusBadge(account.ipStatus)}</td>
                        <td className="px-6 py-4">{getRiskLevelBadge(account.riskLevel)}</td>
                        <td className="px-6 py-4 text-slate-600">{account.followers.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-600">{account.taskCount}个</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Activity className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AppLayout>
  );
}