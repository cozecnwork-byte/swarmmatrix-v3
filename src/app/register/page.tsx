'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 as Spinner, Github, Chrome as Google, Globe } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (!formData.agreeTerms) {
      toast.error('请同意服务条款和隐私政策');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 集成真实的Supabase Auth注册
      // 模拟注册
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.name && formData.email && formData.password) {
        toast.success('注册成功！请登录');
        router.push('/login');
      } else {
        toast.error('请填写完整信息');
      }
    } catch (error) {
      toast.error('注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">创建账户</CardTitle>
          <CardDescription className="text-center">
            开始使用GlobalLeadGen矩阵引流平台
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                type="text"
                placeholder="请输入您的姓名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少6个字符"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreeTerms: checked as boolean })
                }
                disabled={isLoading}
              />
              <Label
                htmlFor="agreeTerms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                我同意{' '}
                <a href="/terms" className="text-blue-600 hover:underline">服务条款</a>
                {' '}和{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">隐私政策</a>
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  注册中...
                </>
              ) : (
                '创建账户'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            已有账户？{' '}
            <Button variant="link" className="px-0" onClick={() => router.push('/login')}>
              立即登录
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">或者</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" type="button">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <Google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
