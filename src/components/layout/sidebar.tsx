"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Bot,
  Workflow,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  Rocket,
  HelpCircle,
  Menu,
  X,
  Zap,
  Wand2,
  Sparkles,
  MessageSquare,
} from "lucide-react";

const navigation = [
  {
    name: "仪表盘",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "系统概览与快速操作",
  },
  {
    name: "AI创建向导",
    href: "/ai-wizard",
    icon: Wand2,
    description: "7步智能创建引流项目",
  },
  {
    name: "智能优化",
    href: "/smart-optimize",
    icon: Sparkles,
    description: "AI自动规划和优化方案",
  },
  {
    name: "AI助手",
    href: "/ai-assistant",
    icon: MessageSquare,
    description: "实时AI客服与帮助",
  },
  {
    name: "智能体",
    href: "/agent",
    icon: Bot,
    description: "AI智能体任务管理",
  },
  {
    name: "工作流",
    href: "/workflow",
    icon: Workflow,
    description: "自动化工作流编排",
  },
  {
    name: "一键发布",
    href: "/publish",
    icon: Rocket,
    description: "快速发布到多平台",
  },
  {
    name: "模板市场",
    href: "/templates",
    icon: FileText,
    description: "引流模板与文案",
  },
  {
    name: "定时任务",
    href: "/schedule",
    icon: Calendar,
    description: "定时执行与自动化",
  },
  {
    name: "数据看板",
    href: "/analytics",
    icon: BarChart3,
    description: "引流效果分析",
  },
  {
    name: "系统设置",
    href: "/settings",
    icon: Settings,
    description: "平台配置与账号",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">GlobalLeadGen</h1>
              <p className="text-xs text-slate-500">v3 矩阵引流平台</p>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-slate-400 truncate">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-slate-200">
            <Link
              href="/help"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50"
            >
              <HelpCircle className="h-4 w-4" />
              帮助与教程
            </Link>
            <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">小白模式已启用</p>
              <p className="text-xs text-blue-500">智能引导，零代码操作</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
