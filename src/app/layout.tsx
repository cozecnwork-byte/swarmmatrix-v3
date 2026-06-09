import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GlobalLeadGen v3 | 矩阵引流平台',
    template: '%s | GlobalLeadGen',
  },
  description:
    'GlobalLeadGen v3 矩阵引流平台 - 专为新手小白设计的智能引流系统，基于9层智能体架构与5层企业级平台架构，零代码操作，一键发布。',
  keywords: [
    'GlobalLeadGen',
    '矩阵引流',
    '智能体',
    'AI引流',
    '多平台发布',
    '自动化营销',
    '内容发布',
    '数据分析',
  ],
  authors: [{ name: 'GlobalLeadGen Team' }],
  generator: 'GlobalLeadGen v3',
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: 'GlobalLeadGen v3 | 智能矩阵引流平台',
    description:
      '专为新手小白设计的矩阵引流平台，基于9层智能体架构，零代码操作，一键发布到多平台。',
    siteName: 'GlobalLeadGen',
    locale: 'zh_CN',
    type: 'website',
    // images: [
    //   {
    //     url: '',
    //     width: 1200,
    //     height: 630,
    //     alt: '扣子编程 - 你的 AI 工程师',
    //   },
    // ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Coze Code | Your AI Engineer is Here',
  //   description:
  //     'Build and deploy full-stack applications through AI conversation. No env setup, just flow.',
  //   // images: [''],
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
