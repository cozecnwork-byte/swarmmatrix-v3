"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Plus,
  Clock,
  Play,
  Pause,
  Trash2,
  Edit,
  Zap,
  Bot,
  Rocket,
  RefreshCw,
} from "lucide-react";

const scheduleTypes = [
  { value: "once", label: "单次执行" },
  { value: "interval", label: "间隔执行" },
  { value: "cron", label: "定时执行" },
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([
    {
      id: "1",
      name: "每日引流内容发布",
      type: "cron",
      workflow: "一键发布",
      nextRun: "2024-01-15 09:00",
      isActive: true,
      lastRun: "2024-01-14 09:00",
    },
    {
      id: "2",
      name: "抖音视频定时推送",
      type: "cron",
      workflow: "视频发布",
      nextRun: "2024-01-15 20:00",
      isActive: true,
      lastRun: "2024-01-14 20:00",
    },
    {
      id: "3",
      name: "小红书内容同步",
      type: "interval",
      workflow: "内容同步",
      nextRun: "2024-01-15 12:00",
      isActive: false,
      lastRun: "2024-01-13 12:00",
    },
  ]);

  const toggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <AppLayout title="定时任务">
      <div className="space-y-6">
        {/* 头部 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">定时任务</h2>
            <p className="text-slate-500 mt-1">设置自动执行时间，无需每日手动操作</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            创建定时任务
          </Button>
        </div>

        {/* 快速创建 */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-yellow-500" />
              快速创建
            </CardTitle>
            <CardDescription>常用定时任务模板</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "每日引流发布", icon: Rocket, time: "每天 09:00" },
                { name: "视频定时推送", icon: Bot, time: "每天 20:00" },
                { name: "内容同步检查", icon: RefreshCw, time: "每 6 小时" },
              ].map((item) => (
                <button
                  key={item.name}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 任务列表 */}
        <Card>
          <CardHeader>
            <CardTitle>任务列表</CardTitle>
            <CardDescription>已创建的定时任务</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{schedule.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {schedule.type === "cron"
                            ? "定时执行"
                            : schedule.type === "interval"
                            ? "间隔执行"
                            : "单次执行"}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500 mt-0.5">
                        工作流: {schedule.workflow}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-slate-600">
                        下次执行: {schedule.nextRun}
                      </div>
                      <div className="text-xs text-slate-400">
                        上次: {schedule.lastRun}
                      </div>
                    </div>

                    <Switch
                      checked={schedule.isActive}
                      onCheckedChange={() => toggleSchedule(schedule.id)}
                    />

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 创建任务表单 */}
        <Card>
          <CardHeader>
            <CardTitle>创建新任务</CardTitle>
            <CardDescription>设置定时执行计划</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">任务名称</label>
                <Input className="mt-1.5" placeholder="输入任务名称" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">执行类型</label>
                <select className="mt-1.5 w-full h-9 rounded-md border border-slate-200 px-3 text-sm">
                  {scheduleTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">执行时间</label>
                <Input type="datetime-local" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">关联工作流</label>
                <select className="mt-1.5 w-full h-9 rounded-md border border-slate-200 px-3 text-sm">
                  <option>一键发布</option>
                  <option>视频发布</option>
                  <option>内容同步</option>
                </select>
              </div>
            </div>
            <Button className="mt-4">
              <Clock className="h-4 w-4 mr-2" />
              创建任务
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
