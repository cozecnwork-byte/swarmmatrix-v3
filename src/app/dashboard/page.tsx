"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Rocket,
  FileText,
  Calendar,
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
} from "lucide-react";

interface DashboardStats {
  tasks: { total: number; running: number; completed: number };
  leads: { total: number; views: number; clicks: number };
  templates: number;
  schedules: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    tasks: { total: 0, running: 0, completed: 0 },
    leads: { total: 0, views: 0, clicks: 0 },
    templates: 0,
    schedules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setStats({
        tasks: { total: 156, running: 3, completed: 148 },
        leads: { total: 2340, views: 156000, clicks: 12340 },
        templates: 45,
        schedules: 12,
      });
      setLoading(false);
    }, 500);
  }, []);

  const quickActions = [
    {
      name: "创建智能体任务",
      description: "让AI帮你完成引流任务",
      icon: Bot,
      href: "/agent",
      color: "bg-blue-500",
    },
    {
      name: "一键发布内容",
      description: "快速发布到多个平台",
      icon: Rocket,
      href: "/publish",
      color: "bg-green-500",
    },
    {
      name: "选择模板",
      description: "使用现成的引流模板",
      icon: FileText,
      href: "/templates",
      color: "bg-purple-500",
    },
    {
      name: "设置定时任务",
      description: "自动化执行计划",
      icon: Calendar,
      href: "/schedule",
      color: "bg-orange-500",
    },
  ];

  return (
    <AppLayout title="仪表盘">
      <div className="space-y-6">
        {/* 欢迎横幅 */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">欢迎使用 GlobalLeadGen v3</h2>
                <p className="mt-2 text-blue-100">
                  专为新手小白设计的矩阵引流平台，零代码操作，智能引导
                </p>
                <div className="mt-4 flex gap-3">
                  <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Zap className="h-4 w-4 mr-2" />
                    快速开始
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    观看教程
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <Bot className="w-16 h-16 text-white/80" />
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
                <Bot className="h-4 w-4" />
                智能体任务
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.tasks.total}</div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
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
                <TrendingUp className="h-4 w-4" />
                引流内容
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.leads.total.toLocaleString()}</div>
              <div className="mt-2 text-sm text-slate-500">
                总曝光 {(stats.leads.views / 1000).toFixed(0)}K · 点击 {(stats.leads.clicks / 1000).toFixed(1)}K
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                可用模板
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.templates}</div>
              <div className="mt-2 text-sm text-slate-500">
                包含文案、视频、图文模板
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                定时任务
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.schedules}</div>
              <div className="mt-2 text-sm text-slate-500">
                自动化引流计划
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.name}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{action.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 px-2 text-blue-600 hover:text-blue-700"
                    >
                      开始使用
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 最近任务 & 系统状态 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近任务 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>最近任务</span>
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "抖音视频引流", status: "running", progress: 65 },
                  { name: "小红书图文发布", status: "completed", progress: 100 },
                  { name: "B站专栏推广", status: "pending", progress: 0 },
                  { name: "微信公众号引流", status: "failed", progress: 30 },
                ].map((task) => (
                  <div
                    key={task.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{task.name}</span>
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
                        {task.status === "pending" && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                            等待中
                          </Badge>
                        )}
                        {task.status === "failed" && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            失败
                          </Badge>
                        )}
                      </div>
                      <Progress value={task.progress} className="h-1.5 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 系统状态 */}
          <Card>
            <CardHeader>
              <CardTitle>系统状态</CardTitle>
              <CardDescription>一键检测系统运行状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "智能体引擎", status: "normal", value: "运行正常" },
                  { name: "数据库连接", status: "normal", value: "连接稳定" },
                  { name: "API服务", status: "normal", value: "响应正常" },
                  { name: "定时调度器", status: "warning", value: "负载较高" },
                  { name: "存储服务", status: "normal", value: "空间充足" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.value}</span>
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.status === "normal"
                            ? "bg-green-500"
                            : item.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Zap className="h-4 w-4 mr-2" />
                健康检查
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 引流效果概览 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              引流效果概览
            </CardTitle>
            <CardDescription>过去7天的引流数据统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Eye className="h-6 w-6 mx-auto text-slate-400 mb-2" />
                <div className="text-2xl font-bold text-slate-900">156K</div>
                <div className="text-sm text-slate-500">总曝光</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <MousePointer className="h-6 w-6 mx-auto text-slate-400 mb-2" />
                <div className="text-2xl font-bold text-slate-900">12.3K</div>
                <div className="text-sm text-slate-500">总点击</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Heart className="h-6 w-6 mx-auto text-slate-400 mb-2" />
                <div className="text-2xl font-bold text-slate-900">3.2K</div>
                <div className="text-sm text-slate-500">总点赞</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Share2 className="h-6 w-6 mx-auto text-slate-400 mb-2" />
                <div className="text-2xl font-bold text-slate-900">890</div>
                <div className="text-sm text-slate-500">总分享</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
