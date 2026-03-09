"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen, PlayCircle, Users, TrendingUp, DollarSign,
  Eye, EyeOff, Plus, ArrowRight
} from 'lucide-react'

interface InstructorStats {
  totalBooks: number
  publishedBooks: number
  draftBooks: number
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalEnrollments: number
  totalPurchases: number
  totalRevenue: number
}

const statCards = (stats: InstructorStats) => [
  {
    title: 'Livres publiés',
    value: stats.publishedBooks,
    sub: `${stats.draftBooks} en brouillon`,
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    href: '/instructor/books',
  },
  {
    title: 'Cours publiés',
    value: stats.publishedCourses,
    sub: `${stats.draftCourses} en brouillon`,
    icon: PlayCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    href: '/instructor/courses',
  },
  {
    title: 'Étudiants inscrits',
    value: stats.totalEnrollments,
    sub: 'dans mes cours',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-50',
    href: '/instructor/students',
  },
  {
    title: 'Revenus totaux',
    value: `${stats.totalRevenue.toLocaleString()} XAF`,
    sub: `${stats.totalPurchases} ventes`,
    icon: TrendingUp,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    href: '/instructor',
  },
]

export default function InstructorDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<InstructorStats>({
    totalBooks: 0, publishedBooks: 0, draftBooks: 0,
    totalCourses: 0, publishedCourses: 0, draftCourses: 0,
    totalEnrollments: 0, totalPurchases: 0, totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/instructor/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Bonjour, {session?.user?.firstName || session?.user?.username} !
        </h1>
        <p className="text-gray-500">Bienvenue dans votre espace enseignant.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards(stats).map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Publish section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publier du contenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Créer un cours</p>
                    <p className="text-xs text-gray-500">Partagez votre expertise</p>
                  </div>
                </div>
                <Link href="/instructor/courses">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 gap-1">
                    <Plus className="h-3.5 w-3.5" /> Créer
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Publier un livre</p>
                    <p className="text-xs text-gray-500">Ajoutez votre ebook</p>
                  </div>
                </div>
                <Link href="/instructor/books">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1">
                    <Plus className="h-3.5 w-3.5" /> Publier
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status overview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aperçu de vos contenus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-500" /> Publiés
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{stats.publishedCourses} cours</Badge>
                    <Badge variant="secondary">{stats.publishedBooks} livres</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-gray-400" /> Brouillons
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline">{stats.draftCourses} cours</Badge>
                    <Badge variant="outline">{stats.draftBooks} livres</Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" /> Étudiants inscrits
                  </span>
                  <span className="font-bold text-purple-600">{stats.totalEnrollments}</span>
                </div>
              </div>

              <Link href="/instructor/students">
                <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                  Voir mes étudiants <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
