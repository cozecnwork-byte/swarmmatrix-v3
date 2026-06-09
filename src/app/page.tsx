'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Target, Shield, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [redirecting, setRedirecting] = useState(false);

  // 3秒后自动重定向到dashboard
  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirecting(true);
      window.location.href = '/dashboard';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 rounded-full">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">GlobalLeadGen v3</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            全球智能引流平台
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            基于9层智能体架构，助力品牌快速拓展全球市场
          </p>
          
          <Button 
            size="lg" 
            onClick={() => {
              setRedirecting(true);
              window.location.href = '/dashboard';
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {redirecting ? (
              <>进入平台中...</>
            ) : (
              <>
                立即开始
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              AI智能优化
            </h3>
            <p className="text-slate-600">
              一键优化引流策略，AI智能匹配最佳平台组合和内容方案
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              多平台矩阵
            </h3>
            <p className="text-slate-600">
              支持TikTok、Instagram、YouTube、小红书、B站等主流平台
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              安全合规
            </h3>
            <p className="text-slate-600">
              符合各平台规范，支持IP管理和风险控制
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="text-center py-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a 
              href="/terms" 
              target="_blank"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Terms of Service
            </a>
            <a 
              href="/privacy" 
              target="_blank"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </a>
          </div>
          
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} GlobalLeadGen v3. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
