import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session
  const session = await auth()

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to login with callback URL
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (session.user.role !== 'ADMIN') {
      // Redirect non-admin users to homepage
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect account routes
  if (pathname.startsWith('/account')) {
    if (!session) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) {
    if (session) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
      if (callbackUrl) {
        return NextResponse.redirect(new URL(callbackUrl, request.url))
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/auth/:path*',
  ],
}
