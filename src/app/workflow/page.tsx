"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  GitBranch,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const workflows = [
  {
    id: "1",
    name: "每日引流发布流程",
    type: "daily_lead",
    status: "active",
    lastRun: "2024-01-14 09:00",
    nextRun: "2024-01-15 09:00",
    successRate: 95,
    steps: 5,
  },
  {
    id: "2",
    name: "视频自动发布",
    type: "video_publish",
    status: "active",
    lastRun: "2024-01-14 20:00",
    nextRun: "2024-01-15 20:00",
    successRate: 88,
    steps: 7,
  },
  {
    id: "3",
    name: "内容分析报告",
    type: "analysis",
    status: "paused",
    lastRun: "2024-01-12 00:00",
    nextRun: "-",
    successRate: 100,
    steps: 3,
  },
];

export default function WorkflowPage() {
  return (
    <AppLayout title="工作流管理">
      <div className="space-y-6">
        {/* 头部 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">工作流管理</h2>
            <p className="text-slate-500 mt-1">自动化工作流编排，轻松管理引流任务</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            创建工作流
          </Button>
        </div>

        {/* 工作流类型 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">每日引流</h3>
                  <p className="text-sm text-slate-500">自动化内容发布</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Workflow className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">视频发布</h3>
                  <p className="text-sm text-slate-500">多平台视频分发</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <GitBranch className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">自定义流程</h3>
                  <p className="text-sm text-slate-500">灵活配置工作流</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 工作流列表 */}
        <Card>
          <CardHeader>
            <CardTitle>我的工作流</CardTitle>
            <CardDescription>已创建的自动化工作流</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Workflow className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{workflow.name}</span>
                        <Badge
                          variant="secondary"
                          className={
                            workflow.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }
                        >
                          {workflow.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Pause className="h-3 w-3 mr-1" />
                          )}
                          {workflow.status === "active" ? "运行中" : "已暂停"}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500 mt-0.5">
                        {workflow.steps} 个步骤 · 成功率 {workflow.successRate}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-slate-600">下次执行</div>
                      <div className="text-xs text-slate-400">{workflow.nextRun}</div>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
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
      </div>
    </AppLayout>
  );
}
