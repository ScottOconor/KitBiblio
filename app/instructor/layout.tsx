"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, BookOpen, PlayCircle, Users, LogOut,
  GraduationCap, Plus, BarChart2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const navLinks = [
  { href: '/instructor', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/instructor/courses', label: 'Mes Cours', icon: PlayCircle, exact: false },
  { href: '/instructor/books', label: 'Mes Livres', icon: BookOpen, exact: false },
  { href: '/instructor/students', label: 'Mes Étudiants', icon: Users, exact: false },
]

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session && !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) return null

  if (!['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès refusé</h1>
          <p className="text-gray-600 mb-4">Cet espace est réservé aux enseignants.</p>
          <Link href="/dashboard">
            <Button variant="outline">Retour au tableau de bord</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-gray-900 text-white flex flex-col min-h-screen">
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-700">
          <Link href="/instructor" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-300" />
            <div>
              <span className="text-base font-bold">Espace Enseignant</span>
              <p className="text-xs text-purple-400">BookShelf Platform</p>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-purple-800">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.avatar} />
              <AvatarFallback className="bg-purple-700 text-white">
                {(session.user.firstName || session.user.username || 'I').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{session.user.firstName || session.user.username}</p>
              <Badge className="mt-0.5 text-xs bg-purple-700 text-purple-200 hover:bg-purple-700">Enseignant</Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Quick publish */}
        <div className="px-3 py-3 border-t border-purple-800 space-y-2">
          <Link href="/instructor/courses">
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau contenu
            </Button>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart2 className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-semibold text-gray-700">Espace Enseignant</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
              Voir le site
            </Link>
            <span className="text-sm text-gray-500">{session.user.email}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
