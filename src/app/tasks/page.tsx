"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PlayCircle, 
  Eye, 
  MoreHorizontal,
  Globe,
  Users,
  Calendar,
  Wand2,
  ListTodo
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

// 模拟任务数据
const mockTasks = [
  {
    id: 'task-001',
    name: '美妆产品全球推广',
    status: 'running',
    progress: 65,
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    countries: ['美国', '英国', '法国', '德国'],
    accounts: 12,
    startTime: '2026-06-09 10:30:00',
    estimatedEnd: '2026-06-10 10:30:00',
    impressions: 125000,
    clicks: 3200,
    conversions: 156
  },
  {
    id: 'task-002',
    name: '数码产品东南亚引流',
    status: 'completed',
    progress: 100,
    platforms: ['Facebook', 'Instagram', 'TikTok'],
    countries: ['印度尼西亚', '马来西亚', '泰国', '新加坡'],
    accounts: 8,
    startTime: '2026-06-05 08:00:00',
    endTime: '2026-06-08 08:00:00',
    impressions: 320000,
    clicks: 8500,
    conversions: 432
  },
  {
    id: 'task-003',
    name: '健康产品欧美推广',
    status: 'paused',
    progress: 30,
    platforms: ['YouTube', 'Twitter', 'LinkedIn'],
    countries: ['美国', '加拿大', '英国', '德国'],
    accounts: 10,
    startTime: '2026-06-07 14:00:00',
    impressions: 45000,
    clicks: 1100,
    conversions: 45
  },
  {
    id: 'task-004',
    name: '时尚品牌日韩推广',
    status: 'pending',
    progress: 0,
    platforms: ['TikTok', 'Instagram', 'Twitter'],
    countries: ['日本', '韩国'],
    accounts: 6,
    scheduledTime: '2026-06-10 09:00:00'
  }
];

const statusConfig = {
  running: { label: '运行中', variant: 'default' as const, icon: PlayCircle, color: 'text-blue-600' },
  completed: { label: '已完成', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
  paused: { label: '已暂停', variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
  pending: { label: '待开始', variant: 'outline' as const, icon: Clock, color: 'text-slate-500' },
  failed: { label: '失败', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
};

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">任务中心</h1>
          <p className="text-slate-500 mt-1">管理和查看所有引流任务</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Wand2 className="h-4 w-4 mr-2" />
          创建新任务
        </Button>
      </div>

      {/* 任务统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">运行中</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'running').length}
                </p>
              </div>
              <PlayCircle className="h-8 w-8 text-blue-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">已完成</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">待开始</p>
                <p className="text-2xl font-bold text-slate-600">
                  {tasks.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-slate-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">总任务</p>
                <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
              </div>
              <ListTodo className="h-8 w-8 text-slate-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const statusInfo = statusConfig[task.status as keyof typeof statusConfig];
          return (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{task.name}</CardTitle>
                      {getStatusBadge(task.status)}
                    </div>
                    <CardDescription className="mt-2">
                      任务ID: {task.id}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      {task.status === 'running' && (
                        <DropdownMenuItem>
                          <Clock className="h-4 w-4 mr-2" />
                          暂停任务
                        </DropdownMenuItem>
                      )}
                      {task.status === 'paused' && (
                        <DropdownMenuItem>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          继续任务
                        </DropdownMenuItem>
                      )}
                      {task.status === 'pending' && (
                        <DropdownMenuItem>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          立即开始
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 进度条 */}
                  {task.progress > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">任务进度</span>
                        <span className="font-medium text-slate-900">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 任务详情 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">平台: </span>
                      <span className="font-medium">{task.platforms.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">国家: </span>
                      <span className="font-medium">{task.countries.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">账号: </span>
                      <span className="font-medium">{task.accounts}个</span>
                    </div>
                  </div>

                  {/* 时间信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {task.startTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">开始时间: </span>
                        <span className="font-medium">{task.startTime}</span>
                      </div>
                    )}
                    {task.endTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-slate-600">结束时间: </span>
                        <span className="font-medium">{task.endTime}</span>
                      </div>
                    )}
                    {task.estimatedEnd && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">预计结束: </span>
                        <span className="font-medium">{task.estimatedEnd}</span>
                      </div>
                    )}
                    {task.scheduledTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">计划时间: </span>
                        <span className="font-medium">{task.scheduledTime}</span>
                      </div>
                    )}
                  </div>

                  {/* 数据统计（运行中和已完成的任务显示） */}
                  {(task.status === 'running' || task.status === 'completed') && task.impressions && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">{task.impressions.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">曝光量</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{task.clicks.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">点击量</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{task.conversions}</p>
                        <p className="text-sm text-slate-500">转化数</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}