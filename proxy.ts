import { NextResponse, type NextRequest } from 'next/server';

import { matchHoneypot } from '@/lib/honeypots';

export function proxy(request: NextRequest) {
  const honeypot = matchHoneypot(request.nextUrl.pathname);
  if (honeypot) {
    // A probe-path match describes the request, not the identity of its sender.
    // Cloudflare Workers Logs collects this structured console event.
    console.info({
      event: 'honeypot_hit',
      ...honeypot,
      method: request.method,
    });
  }

  // The regular 404 renders the same useful HTML for people and crawlers.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|brand/|fonts/).*)'],
};
