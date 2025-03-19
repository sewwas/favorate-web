import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Create a response to modify
    const res = NextResponse.next()

    // Create a Supabase client with the request and response
    const supabase = createMiddlewareClient({ req: request, res })

    // Refresh the session if needed
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protect all routes except login
    if (!session && request.nextUrl.pathname !== '/login') {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect logged-in users away from login page
    if (session && request.nextUrl.pathname === '/login') {
      const redirectUrl = new URL('/', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Get user's role if session exists
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      // Admin-only routes
      if (request.nextUrl.pathname.startsWith('/items') || 
          request.nextUrl.pathname.startsWith('/meal-sets')) {
        if (profile?.role !== 'admin') {
          const redirectUrl = new URL('/', request.url)
          return NextResponse.redirect(redirectUrl)
        }
      }
    }

    return res
  } catch (e) {
    // If there's an error, redirect to login
    console.error('Auth error:', e)
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
} 