import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const authToken = req.cookies.tokenCookie;
  const path = new URL(req.url || (req.headers.get('referer') as string))
    .pathname;

  if (
    !authToken &&
    !['/api/auth/signin', '/api/auth/callback'].includes(path)
  ) {
    return new Response('Request Prohibited', { status: 403 });
  }

  return NextResponse.next();
}
