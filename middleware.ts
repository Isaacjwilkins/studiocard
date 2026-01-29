import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  
  // 1. Skip paths that should stay as they are (API routes and static files)
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') // Skips files like .jpg, .svg, .png
  ) {
    return NextResponse.next()
  }

  // 2. Check if the path has any uppercase letters
  if (url.pathname !== url.pathname.toLowerCase()) {
    // Redirect to the lowercase version (301 Permanent Redirect)
    return NextResponse.redirect(
      new URL(url.pathname.toLowerCase(), request.url),
      301
    )
  }

  return NextResponse.next()
}

// 3. This matcher ensures it runs on all routes except the ones we excluded above
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