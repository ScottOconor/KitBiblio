"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Users, Search, GraduationCap, PlayCircle } from 'lucide-react'

interface Enrollment {
  id: string
  status: string
  overallProgress: number
  createdAt: string
  user: {
    id: string
    firstName?: string
    lastName?: string
    username?: string
    email: string
    avatar?: string
  }
  course: {
    id: string
    title: string
  }
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Actif',
  COMPLETED: 'Terminé',
  PAUSED: 'En pause',
  CANCELLED: 'Annulé',
}

export default function InstructorStudentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/instructor/students')
      .then(r => r.json())
      .then(data => { setEnrollments(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase()
    const name = `${e.user.firstName || ''} ${e.user.lastName || ''} ${e.user.username || ''} ${e.user.email}`.toLowerCase()
    const course = e.course.title.toLowerCase()
    return name.includes(q) || course.includes(q)
  })

  // Group by course
  const byCourse = filtered.reduce<Record<string, Enrollment[]>>((acc, e) => {
    const key = e.course.id
    acc[key] = acc[key] || []
    acc[key].push(e)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Étudiants</h1>
          <p className="text-sm text-gray-500 mt-1">
            {enrollments.length} inscription{enrollments.length !== 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un étudiant ou cours..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Users className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Aucun étudiant pour l'instant</h2>
          <p className="text-gray-400">Publiez vos cours pour commencer à accueillir des étudiants.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byCourse).map(([courseId, courseEnrollments], i) => (
            <motion.div
              key={courseId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-purple-600" />
                    {courseEnrollments[0].course.title}
                    <Badge variant="secondary" className="ml-auto">
                      {courseEnrollments.length} étudiant{courseEnrollments.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courseEnrollments.map(enrollment => {
                      const name = enrollment.user.firstName
                        ? `${enrollment.user.firstName} ${enrollment.user.lastName || ''}`.trim()
                        : enrollment.user.username || enrollment.user.email
                      const initials = name.charAt(0).toUpperCase()

                      return (
                        <div
                          key={enrollment.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={enrollment.user.avatar} />
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                            <p className="text-xs text-gray-500 truncate">{enrollment.user.email}</p>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Progress bar */}
                            <div className="hidden sm:flex items-center gap-2 w-28">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${enrollment.overallProgress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-8">
                                {Math.round(enrollment.overallProgress)}%
                              </span>
                            </div>

                            <Badge className={`text-xs ${statusColors[enrollment.status] || 'bg-gray-100 text-gray-700'}`}>
                              {statusLabels[enrollment.status] || enrollment.status}
                            </Badge>

                            <span className="text-xs text-gray-400 hidden md:block">
                              {new Date(enrollment.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
