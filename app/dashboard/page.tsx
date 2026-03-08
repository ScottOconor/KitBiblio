"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  PlayCircle, 
  Star, 
  Clock, 
  Users, 
  TrendingUp,
  Award,
  Download,
  Heart,
  Settings,
  Plus
} from 'lucide-react'

interface DashboardStats {
  totalCourses: number
  totalBooks: number
  completedCourses: number
  totalProgress: number
  certificates: number
  bookmarks: number
}

interface RecentActivity {
  id: string
  type: 'course' | 'book'
  title: string
  progress?: number
  lastAccessed: string
  thumbnail?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalBooks: 0,
    completedCourses: 0,
    totalProgress: 0,
    certificates: 0,
    bookmarks: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats and recent activity
      const [statsResponse, activityResponse] = await Promise.all([
        fetch('/api/user/stats'),
        fetch('/api/user/activity')
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setRecentActivity(activityData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenue, {session.user.firstName || session.user.username}! 👋
            </h1>
            <p className="text-gray-600">
              Voici votre tableau de bord d'apprentissage
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cours Inscrits</CardTitle>
                  <PlayCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedCourses} terminés
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Livres Achetés</CardTitle>
                  <BookOpen className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBooks}</div>
                  <p className="text-xs text-muted-foreground">
                    Dans votre bibliothèque
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progression Totale</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(stats.totalProgress)}%</div>
                  <Progress value={stats.totalProgress} className="mt-2" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificats</CardTitle>
                  <Award className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.certificates}</div>
                  <p className="text-xs text-muted-foreground">
                    Certificats obtenus
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>
                  Reprenez là où vous vous êtes arrêté
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Vous n'avez pas encore d'activité
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link href="/courses">
                        <Button>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Explorer les cours
                        </Button>
                      </Link>
                      <Link href="/books">
                        <Button variant="outline">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Explorer les livres
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          {activity.type === 'course' ? (
                            <PlayCircle className="w-8 h-8 text-blue-600" />
                          ) : (
                            <BookOpen className="w-8 h-8 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-sm text-gray-500">
                            Dernier accès: {new Date(activity.lastAccessed).toLocaleDateString()}
                          </p>
                          {activity.progress && (
                            <div className="mt-2">
                              <Progress value={activity.progress} className="h-2" />
                              <p className="text-xs text-gray-500 mt-1">
                                {Math.round(activity.progress)}% complété
                              </p>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          Continuer
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>
                  Accédez rapidement à vos fonctionnalités préférées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/courses">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <PlayCircle className="w-6 h-6 mb-2" />
                      <span className="text-sm">Cours</span>
                    </Button>
                  </Link>
                  <Link href="/books">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <BookOpen className="w-6 h-6 mb-2" />
                      <span className="text-sm">Livres</span>
                    </Button>
                  </Link>
                  <Link href="/bookmarks">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Heart className="w-6 h-6 mb-2" />
                      <span className="text-sm">Favoris</span>
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Settings className="w-6 h-6 mb-2" />
                      <span className="text-sm">Paramètres</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
