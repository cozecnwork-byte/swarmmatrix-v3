"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Heart,
  Share2,
  Users,
  Target,
  Globe,
  Calendar,
  Download,
} from "lucide-react";

const platformData = [
  { name: "抖音", views: 68000, clicks: 5200, likes: 1800, shares: 450, color: "#000000" },
  { name: "小红书", views: 45000, clicks: 3800, likes: 1200, shares: 280, color: "#FF2442" },
  { name: "B站", views: 28000, clicks: 2100, likes: 680, shares: 150, color: "#00A1D6" },
  { name: "微博", views: 15000, clicks: 1200, likes: 420, shares: 100, color: "#E6162D" },
];

const trendData = [
  { date: "12/01", views: 12000, clicks: 980 },
  { date: "12/02", views: 15000, clicks: 1200 },
  { date: "12/03", views: 18000, clicks: 1450 },
  { date: "12/04", views: 14000, clicks: 1100 },
  { date: "12/05", views: 22000, clicks: 1800 },
  { date: "12/06", views: 28000, clicks: 2200 },
  { date: "12/07", views: 35000, clicks: 2800 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const totalViews = platformData.reduce((sum, p) => sum + p.views, 0);
  const totalClicks = platformData.reduce((sum, p) => sum + p.clicks, 0);
  const totalLikes = platformData.reduce((sum, p) => sum + p.likes, 0);
  const totalShares = platformData.reduce((sum, p) => sum + p.shares, 0);

  return (
    <AppLayout title="数据看板">
      <div className="space-y-6">
        {/* 时间筛选 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-400" />
            <span className="text-sm text-slate-600">数据周期：</span>
            {(["7d", "30d", "90d"] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(p)}
              >
                {p === "7d" ? "近7天" : p === "30d" ? "近30天" : "近90天"}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">总曝光量</p>
                  <p className="text-2xl font-bold mt-1">{(totalViews / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +23.5%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">总点击量</p>
                  <p className="text-2xl font-bold mt-1">{(totalClicks / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18.2%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MousePointer className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">总互动量</p>
                  <p className="text-2xl font-bold mt-1">{((totalLikes + totalShares) / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.8%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">点击转化率</p>
                  <p className="text-2xl font-bold mt-1">{((totalClicks / totalViews) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -2.1%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 趋势图 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                曝光趋势
              </CardTitle>
              <CardDescription>过去7天的数据变化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-2">
                {trendData.map((item, i) => {
                  const height = (item.views / 35000) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-slate-500 mt-2">{item.date}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-slate-600">曝光量</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-slate-600">点击量</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 平台分布 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                平台分布
              </CardTitle>
              <CardDescription>各平台引流效果对比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform) => {
                  const percentage = (platform.views / totalViews) * 100;
                  return (
                    <div key={platform.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{platform.name}</span>
                        <span className="text-slate-500">
                          {(platform.views / 1000).toFixed(0)}K ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: platform.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 详细数据表格 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              详细数据
            </CardTitle>
            <CardDescription>各平台引流数据明细</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">平台</th>
                    <th className="text-right py-3 px-2 font-medium">曝光</th>
                    <th className="text-right py-3 px-2 font-medium">点击</th>
                    <th className="text-right py-3 px-2 font-medium">点赞</th>
                    <th className="text-right py-3 px-2 font-medium">分享</th>
                    <th className="text-right py-3 px-2 font-medium">点击率</th>
                  </tr>
                </thead>
                <tbody>
                  {platformData.map((platform) => (
                    <tr key={platform.name} className="border-b last:border-0">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: platform.color }}
                          />
                          <span className="font-medium">{platform.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2">{platform.views.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">{platform.clicks.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">{platform.likes.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">{platform.shares.toLocaleString()}</td>
                      <td className="text-right py-3 px-2">
                        <Badge variant="secondary">
                          {((platform.clicks / platform.views) * 100).toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
