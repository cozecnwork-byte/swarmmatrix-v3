"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Star,
  Download,
  Eye,
  Plus,
  Filter,
  Sparkles,
  Video,
  BookOpen,
  Image,
} from "lucide-react";

const templates = [
  {
    id: "1",
    name: "抖音爆款视频脚本",
    type: "video",
    category: "视频脚本",
    useCount: 12580,
    rating: 4.8,
    tags: ["抖音", "视频", "爆款"],
    description: "适用于知识科普、教程类视频，包含开场、内容、结尾三段式结构",
  },
  {
    id: "2",
    name: "小红书种草文案模板",
    type: "text",
    category: "图文文案",
    useCount: 8960,
    rating: 4.9,
    tags: ["小红书", "种草", "产品"],
    description: "产品种草专用模板，包含痛点、解决方案、使用体验三部分",
  },
  {
    id: "3",
    name: "B站UP主专栏模板",
    type: "article",
    category: "专栏文章",
    useCount: 5420,
    rating: 4.6,
    tags: ["B站", "专栏", "干货"],
    description: "适合深度内容分享，包含目录、正文、总结的结构化模板",
  },
  {
    id: "4",
    name: "微信公众号推广模板",
    type: "article",
    category: "图文文案",
    useCount: 7230,
    rating: 4.7,
    tags: ["微信", "公众号", "推广"],
    description: "公众号引流专用，包含关注引导、内容、CTA三部分",
  },
  {
    id: "5",
    name: "短视频封面模板",
    type: "image",
    category: "封面设计",
    useCount: 18900,
    rating: 4.5,
    tags: ["封面", "视频", "设计"],
    description: "高点击率视频封面设计模板，包含标题、人物、背景三要素",
  },
  {
    id: "6",
    name: "直播话术模板",
    type: "text",
    category: "直播脚本",
    useCount: 4150,
    rating: 4.4,
    tags: ["直播", "话术", "带货"],
    description: "直播带货话术模板，包含开场、产品介绍、促单三部分",
  },
];

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredTemplates = templates.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedType && t.type !== selectedType) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "text":
        return FileText;
      case "article":
        return BookOpen;
      case "image":
        return Image;
      default:
        return FileText;
    }
  };

  return (
    <AppLayout title="模板市场">
      <div className="space-y-6">
        {/* 头部 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">模板市场</h2>
            <p className="text-slate-500 mt-1">现成模板，一键使用，降低使用门槛</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            创建模板
          </Button>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索模板名称或标签..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: null, label: "全部" },
              { value: "video", label: "视频" },
              { value: "text", label: "文案" },
              { value: "article", label: "文章" },
              { value: "image", label: "图片" },
            ].map((filter) => (
              <Button
                key={filter.label}
                variant={selectedType === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 分类标签 */}
        <Tabs defaultValue="hot">
          <TabsList>
            <TabsTrigger value="hot">🔥 热门模板</TabsTrigger>
            <TabsTrigger value="new">✨ 最新模板</TabsTrigger>
            <TabsTrigger value="my">📁 我的模板</TabsTrigger>
          </TabsList>

          <TabsContent value="hot" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const TypeIcon = getTypeIcon(template.type);
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <TypeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription>{template.category}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {(template.useCount / 1000).toFixed(1)}K
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {template.rating}
                          </span>
                        </div>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          使用
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="text-center py-12 text-slate-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>暂无新模板</p>
            </div>
          </TabsContent>

          <TabsContent value="my">
            <div className="text-center py-12 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>您还没有创建模板</p>
              <Button variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                创建第一个模板
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
