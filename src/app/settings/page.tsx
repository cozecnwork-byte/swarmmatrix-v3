"use client";

import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Key,
  Globe,
  Bell,
  Shield,
  Database,
  Zap,
  HelpCircle,
  BookOpen,
  Video,
  MessageCircle,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout title="系统设置">
      <div className="space-y-6">
        {/* 平台账号配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              平台账号管理
            </CardTitle>
            <CardDescription>连接您的各大平台账号</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "抖音", status: "connected", color: "#000000" },
                { name: "小红书", status: "connected", color: "#FF2442" },
                { name: "B站", status: "pending", color: "#00A1D6" },
                { name: "微信公众号", status: "disconnected", color: "#07C160" },
              ].map((platform) => (
                <div
                  key={platform.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: platform.color + "20" }}
                    >
                      <Globe className="h-5 w-5" style={{ color: platform.color }} />
                    </div>
                    <div>
                      <div className="font-medium">{platform.name}</div>
                      <div className="text-xs text-slate-500">
                        {platform.status === "connected"
                          ? "已连接"
                          : platform.status === "pending"
                          ? "待验证"
                          : "未连接"}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={platform.status === "connected" ? "outline" : "default"}
                    size="sm"
                  >
                    {platform.status === "connected"
                      ? "管理"
                      : platform.status === "pending"
                      ? "验证"
                      : "连接"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 环境配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              环境配置
            </CardTitle>
            <CardDescription>通过.env文件配置，零代码操作</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">API密钥</label>
              <Input
                type="password"
                className="mt-1.5"
                placeholder="输入您的API密钥..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">默认发布时间</label>
              <Input className="mt-1.5" type="time" defaultValue="20:00" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">自动优化内容</span>
              </div>
              <Badge variant="secondary">已启用</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 通知设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知设置
            </CardTitle>
            <CardDescription>智能预警与系统通知</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "任务完成通知", enabled: true },
                { name: "账号异常预警", enabled: true },
                { name: "IP风险提醒", enabled: true },
                { name: "效果异常预警", enabled: false },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <span className="text-sm">{item.name}</span>
                  <Badge variant={item.enabled ? "default" : "secondary"}>
                    {item.enabled ? "已开启" : "已关闭"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 帮助资源 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              帮助与支持
            </CardTitle>
            <CardDescription>详细的文档与培训资源</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors text-left">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <div>
                  <div className="font-medium">用户手册</div>
                  <div className="text-xs text-slate-500">详细操作指南</div>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors text-left">
                <Video className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium">视频教程</div>
                  <div className="text-xs text-slate-500">直观功能演示</div>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors text-left">
                <MessageCircle className="h-6 w-6 text-green-500" />
                <div>
                  <div className="font-medium">在线客服</div>
                  <div className="text-xs text-slate-500">实时问题解答</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
