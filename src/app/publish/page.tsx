"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Rocket,
  Youtube,
  Instagram,
  Video,
  BookOpen,
  MessageCircle,
  Globe,
  Clock,
  Languages,
  Zap,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

const platforms = [
  { id: "douyin", name: "抖音", icon: Video, color: "#000000" },
  { id: "xiaohongshu", name: "小红书", icon: BookOpen, color: "#FF2442" },
  { id: "bilibili", name: "B站", icon: Youtube, color: "#00A1D6" },
  { id: "weixin", name: "微信公众号", icon: MessageCircle, color: "#07C160" },
  { id: "weibo", name: "微博", icon: Globe, color: "#E6162D" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F" },
];

type PublishResult = {
  platform: string;
  success: boolean;
  message: string;
  publishedUrl?: string;
};

type PublishSummary = {
  total: number;
  success: number;
  failed: number;
};

export default function PublishPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["douyin", "xiaohongshu"]);
  const [translate, setTranslate] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<PublishResult[] | null>(null);
  const [publishSummary, setPublishSummary] = useState<PublishSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handlePublish = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;

    setPublishing(true);
    setError(null);
    setPublishResults(null);
    setPublishSummary(null);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || undefined,
          content,
          platforms: selectedPlatforms,
          translate,
          scheduledTime: scheduledTime || undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || '发布失败');
        return;
      }

      setPublishResults(data.data.results);
      setPublishSummary(data.data.summary);

    } catch (err) {
      setError('发布服务异常，请稍后重试');
      console.error('Publish error:', err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AppLayout title="一键发布">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：内容编辑 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-green-500" />
                内容发布
              </CardTitle>
              <CardDescription>编写内容，一键发布到多个平台</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">标题</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入内容标题..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">内容</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="输入要发布的内容..."
                  className="mt-1.5 min-h-[200px]"
                />
                <div className="flex justify-between mt-1.5 text-xs text-slate-500">
                  <span>支持Markdown格式</span>
                  <span>{content.length} 字符</span>
                </div>
              </div>

              {/* 平台选择 */}
              <div>
                <label className="text-sm font-medium text-slate-700">选择发布平台</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.id);
                    return (
                      <div
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: platform.color + "20" }}
                        >
                          <platform.icon
                            className="h-4 w-4"
                            style={{ color: platform.color }}
                          />
                        </div>
                        <span className="font-medium text-sm">{platform.name}</span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-blue-500 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 高级选项 */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">高级选项</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="translate"
                      checked={translate}
                      onCheckedChange={(v) => setTranslate(v === true)}
                    />
                    <label
                      htmlFor="translate"
                      className="text-sm text-slate-600 flex items-center gap-2"
                    >
                      <Languages className="h-4 w-4" />
                      自动翻译为英文
                    </label>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <label className="text-sm text-slate-600">定时发布</label>
                    </div>
                    <Input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* 发布按钮 */}
              <Button
                className="w-full h-11"
                size="lg"
                onClick={handlePublish}
                disabled={publishing || !content.trim() || selectedPlatforms.length === 0}
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    发布中...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5 mr-2" />
                    一键发布到 {selectedPlatforms.length} 个平台
                  </>
                )}
              </Button>

              {/* 错误信息 */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">发布失败</span>
                  </div>
                  <div className="mt-2 text-sm text-red-600">{error}</div>
                </div>
              )}

              {/* 发布结果 */}
              {publishResults && publishSummary && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${publishSummary.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className={`flex items-center gap-2 ${publishSummary.failed === 0 ? 'text-green-700' : 'text-yellow-700'}`}>
                      {publishSummary.failed === 0 ? <CheckCircle className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                      <span className="font-medium">发布完成</span>
                    </div>
                    <div className={`mt-2 text-sm ${publishSummary.failed === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                      总计: {publishSummary.total} 个平台 · 
                      成功: <span className="font-semibold text-green-700">{publishSummary.success}</span> · 
                      失败: <span className="font-semibold text-red-600">{publishSummary.failed}</span>
                    </div>
                  </div>

                  {/* 详细结果 */}
                  <div className="space-y-2">
                    {publishResults.map((result, index) => {
                      const platformConfig = platforms.find(p => p.id === result.platform);
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            result.success 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {platformConfig && (
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: platformConfig.color + "20" }}
                              >
                                <platformConfig.icon
                                  className="h-4 w-4"
                                  style={{ color: platformConfig.color }}
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {platformConfig?.name || result.platform}
                              </div>
                              <div className={`text-xs ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                                {result.message}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            {result.publishedUrl && (
                              <a
                                href={result.publishedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：快速模板 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                快速模板
              </CardTitle>
              <CardDescription>点击直接使用</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  name: "产品种草模板",
                  content: "【产品名】真的太好用了！\n\n1️⃣ 优点一\n2️⃣ 优点二\n3️⃣ 优点三\n\n强烈推荐！",
                },
                {
                  name: "干货分享模板",
                  content: "今天分享一个超实用的技巧！\n\n📌 核心要点：\n- 要点1\n- 要点2\n- 要点3\n\n记得收藏！",
                },
                {
                  name: "活动推广模板",
                  content: "🎉 限时活动来啦！\n\n活动时间：\n活动内容：\n参与方式：\n\n错过等一年！",
                },
              ].map((template) => (
                <button
                  key={template.name}
                  onClick={() => setContent(template.content)}
                  className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {template.content}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* 发布提示 */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Rocket className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">小白提示</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    选择平台后，系统会自动适配各平台的格式要求，无需手动调整
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
