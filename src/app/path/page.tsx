import type { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'tiktok:site-verification': 'tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH',
  },
};

export default function PathPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">TikTok Verification</h1>
          <p className="text-slate-600 mb-6">Verification signature for TikTok API</p>
          
          <div className="bg-slate-100 rounded-lg p-6 font-mono text-lg">
            tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH
          </div>
          
          <div className="mt-6 text-sm text-slate-500">
            <p>Verification file also available at:</p>
            <ul className="list-disc list-inside mt-2">
              <li><code className="bg-slate-100 px-1 rounded">/path/tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH.txt</code></li>
              <li><code className="bg-slate-100 px-1 rounded">/tiktokeFXuBFN997KomkFY5E5cAWphHfVGvXLH.txt</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
