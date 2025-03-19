import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Refresh the session if needed
    await supabase.auth.getSession()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/forgot-password']
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

    // If user is not signed in and trying to access a protected route
    if (!session && !isPublicRoute) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access auth routes
    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    
    // On critical errors, redirect to login
    if (error instanceof Error && error.message.includes('Invalid Refresh Token')) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(redirectUrl)
    }

    return res
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
} 