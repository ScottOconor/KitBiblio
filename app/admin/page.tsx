"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, PlayCircle, TrendingUp, DollarSign } from 'lucide-react'

interface Stats {
  users: number
  books: number
  courses: number
  enrollments: number
  totalRevenue: number
  purchases: number
}

const statCards = [
  {
    key: 'users' as keyof Stats,
    label: 'Utilisateurs',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    key: 'books' as keyof Stats,
    label: 'Livres',
    icon: BookOpen,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    key: 'courses' as keyof Stats,
    label: 'Cours',
    icon: PlayCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    key: 'enrollments' as keyof Stats,
    label: 'Inscriptions',
    icon: TrendingUp,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    key: 'totalRevenue' as keyof Stats,
    label: 'Revenus (XAF)',
    icon: DollarSign,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    format: (v: number) => v.toLocaleString('fr-FR'),
  },
]

const quickActions = [
  { href: '/admin/books', label: 'Gérer les livres', icon: BookOpen },
  { href: '/admin/courses', label: 'Gérer les cours', icon: PlayCircle },
  { href: '/admin/categories', label: 'Gérer les catégories', icon: TrendingUp },
  { href: '/admin/users', label: 'Gérer les utilisateurs', icon: Users },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
        <p className="text-gray-500 mb-6">Vue d'ensemble de la plateforme</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map(({ key, label, icon: Icon, color, bg, format }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
                  <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">
                      {stats ? (format ? format(stats[key]) : stats[key]) : '—'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
                    >
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="text-xs text-center leading-tight">{label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
