import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl

  // 1. Skip paths that should stay as they are (API routes and static files)
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Check if the path has any uppercase letters
  // (We do this BEFORE Supabase to save resources on redirects)
  if (url.pathname !== url.pathname.toLowerCase()) {
    return NextResponse.redirect(
      new URL(url.pathname.toLowerCase(), request.url),
      301
    )
  }

  // 3. Refresh Supabase Session
  // This reads/writes cookies to keep the user logged in
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}