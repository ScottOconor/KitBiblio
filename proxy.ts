import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Redirection depuis la homepage selon le rôle
    if (pathname === '/') {
      if (token?.role === 'ADMIN' || token?.role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      if (token?.role === 'INSTRUCTOR') {
        return NextResponse.redirect(new URL('/instructor', req.url))
      }
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Rediriger les admins vers /admin s'ils tentent d'aller sur /dashboard
    if (pathname === '/dashboard' && (token?.role === 'ADMIN' || token?.role === 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Rediriger vers /instructor si l'instructeur tente d'accéder au dashboard utilisateur
    if (pathname === '/dashboard' && token?.role === 'INSTRUCTOR') {
      return NextResponse.redirect(new URL('/instructor', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Protège tout sauf :
     * - /auth/* (connexion, inscription)
     * - /api/auth/* (NextAuth callbacks)
     * - /api/books, /api/courses, /api/categories (données publiques)
     * - Fichiers statiques (_next, images, favicon)
     */
    '/((?!auth|api/auth|api/books|api/courses|api/categories|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
}
