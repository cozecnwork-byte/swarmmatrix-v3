import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('tiktokuw1C2TsZxLB4OgGOmDcq7hGAZLyD4jhJ', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
