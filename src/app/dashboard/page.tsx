"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  ListTodo,
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  Heart,
  Share2,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  tasks: { total: number; running: number; completed: number };
  accounts: { total: number; healthy: number; warning: number; error: number };
  leads: { total: number; views: number; clicks: number; likes: number; shares: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    tasks: { total: 0, running: 0, completed: 0 },
    accounts: { total: 0, healthy: 0, warning: 0, error: 0 },
    leads: { total: 0, views: 0, clicks: 0, likes: 0, shares: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setStats({
        tasks: { total: 156, running: 3, completed: 148 },
        accounts: { total: 12, healthy: 9, warning: 2, error: 1 },
        leads: { total: 2340, views: 156000, clicks: 12340, likes: 3200, shares: 890 },
      });
      setLoading(false);
    }, 500);
  }, []);

  const quickActions = [
    {
      name: "AI创建向导",
      description: "一键创建引流任务",
      icon: Wand2,
      href: "/ai-wizard",
      color: "bg-blue-500",
    },
    {
      name: "任务中心",
      description: "查看所有发布任务",
      icon: ListTodo,
      href: "/tasks",
      color: "bg-green-500",
    },
    {
      name: "账号矩阵",
      description: "管理平台账号",
      icon: Users,
      href: "/accounts",
      color: "bg-purple-500",
    },
    {
      name: "系统设置",
      description: "配置平台",
      icon: LayoutDashboard,
      href: "/settings",
      color: "bg-orange-500",
    },
  ];

  const recentTasks = [
    { name: "美妆产品全球推广", status: "running", progress: 65 },
    { name: "数码产品东南亚引流", status: "completed", progress: 100 },
    { name: "健康产品欧美推广", status: "paused", progress: 30 },
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">欢迎使用 GlobalLeadGen v3</h2>
              <p className="mt-3 text-blue-100 text-lg">
                专为新手小白设计的矩阵引流平台，零代码操作，智能引导
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/ai-wizard">
                  <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Zap className="h-5 w-5 mr-2" />
                    快速开始
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    查看任务
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center">
                <Wand2 className="w-20 h-20 text-white/80" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              智能体任务
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{stats.tasks.total}</div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {stats.tasks.running} 运行中
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {stats.tasks.completed} 已完成
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              账号矩阵
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{stats.accounts.total}</div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {stats.accounts.healthy} 健康
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {stats.accounts.warning} 警告
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              引流内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{stats.leads.total.toLocaleString()}</div>
            <div className="mt-3 text-sm text-slate-500">
              总曝光 {(stats.leads.views / 1000).toFixed(0)}K · 点击 {(stats.leads.clicks / 1000).toFixed(1)}K
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              互动数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{stats.leads.likes.toLocaleString()}</div>
            <div className="mt-3 text-sm text-slate-500">
              点赞 {(stats.leads.likes / 1000).toFixed(1)}K · 分享 {stats.leads.shares}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link href={action.href} key={action.name}>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-slate-900">{action.name}</h3>
                    <p className="text-slate-500 mt-1">{action.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 h-8 px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent"
                    >
                      开始使用
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 最近任务 & 数据统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近任务 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>最近任务</span>
              <Link href="/tasks">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.name}</span>
                      {task.status === "running" && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Clock className="h-3 w-3 mr-1" />
                          运行中
                        </Badge>
                      )}
                      {task.status === "completed" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          已完成
                        </Badge>
                      )}
                      {task.status === "paused" && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          已暂停
                        </Badge>
                      )}
                    </div>
                    <Progress value={task.progress} className="h-2 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 数据统计 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              引流数据概览
            </CardTitle>
            <CardDescription>实时数据统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-5 bg-slate-50 rounded-xl">
                <Eye className="h-7 w-7 mx-auto text-slate-400 mb-3" />
                <div className="text-3xl font-bold text-slate-900">156K</div>
                <div className="text-slate-500">总曝光</div>
              </div>
              <div className="text-center p-5 bg-slate-50 rounded-xl">
                <MousePointer className="h-7 w-7 mx-auto text-slate-400 mb-3" />
                <div className="text-3xl font-bold text-blue-600">12.3K</div>
                <div className="text-slate-500">总点击</div>
              </div>
              <div className="text-center p-5 bg-slate-50 rounded-xl">
                <Heart className="h-7 w-7 mx-auto text-slate-400 mb-3" />
                <div className="text-3xl font-bold text-red-500">3.2K</div>
                <div className="text-slate-500">总点赞</div>
              </div>
              <div className="text-center p-5 bg-slate-50 rounded-xl">
                <Share2 className="h-7 w-7 mx-auto text-slate-400 mb-3" />
                <div className="text-3xl font-bold text-purple-600">890</div>
                <div className="text-slate-500">总分享</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
