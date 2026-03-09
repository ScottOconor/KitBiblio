"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, PlayCircle,
  Users, Clock, BookOpen, GraduationCap, ListVideo
} from 'lucide-react'

interface Course {
  id: string
  title: string
  price: number
  isPublished: boolean
  isFree: boolean
  level: string
  duration: number
  lessonsCount: number
  thumbnail?: string
  category: { id: string; name: string }
  _count: { enrollments: number; purchases: number; reviews: number }
  createdAt: string
}

interface Category {
  id: string
  name: string
}

const levelLabels: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
}

const levelColors: Record<string, string> = {
  BEGINNER: 'bg-green-100 text-green-700',
  INTERMEDIATE: 'bg-blue-100 text-blue-700',
  ADVANCED: 'bg-orange-100 text-orange-700',
  EXPERT: 'bg-red-100 text-red-700',
}

const emptyForm = {
  title: '', description: '', shortDesc: '', price: '', originalPrice: '',
  categoryId: '', language: 'fr', level: 'BEGINNER', duration: '',
  lessonsCount: '', hasCertificate: false, paymentLink: '', isPublished: false, isFree: false, thumbnail: ''
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [coursesRes, catsRes] = await Promise.all([
      fetch('/api/instructor/courses'),
      fetch('/api/categories'),
    ])
    if (coursesRes.ok) setCourses(await coursesRes.json())
    if (catsRes.ok) setCategories(await catsRes.json())
    setLoading(false)
  }

  const openNew = () => {
    setEditCourse(null)
    setForm({ ...emptyForm })
    setOpenDialog(true)
  }

  const openEdit = (course: Course) => {
    setEditCourse(course)
    setForm({
      title: course.title,
      description: '',
      shortDesc: '',
      price: String(course.price),
      originalPrice: '',
      categoryId: course.category.id,
      language: 'fr',
      level: course.level,
      duration: String(course.duration),
      lessonsCount: String(course.lessonsCount),
      hasCertificate: false,
      paymentLink: '',
      isPublished: course.isPublished,
      isFree: course.isFree,
      thumbnail: course.thumbnail || '',
    })
    setOpenDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editCourse
        ? `/api/instructor/courses/${editCourse.id}`
        : '/api/instructor/courses'
      const method = editCourse ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setOpenDialog(false)
        fetchData()
      }
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (course: Course) => {
    const res = await fetch(`/api/instructor/courses/${course.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !course.isPublished }),
    })
    if (res.ok) fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce cours ?')) return
    await fetch(`/api/instructor/courses/${id}`, { method: 'DELETE' })
    fetchData()
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Mes Cours</h1>
          <p className="text-sm text-gray-500 mt-1">{courses.length} cours au total</p>
        </div>
        <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
          <Plus className="h-4 w-4" /> Nouveau cours
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <GraduationCap className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Aucun cours pour l'instant</h2>
          <p className="text-gray-400 mb-6">Créez votre premier cours et commencez à partager votre savoir.</p>
          <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
            <Plus className="h-4 w-4" /> Créer mon premier cours
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <PlayCircle className="w-10 h-10 text-white opacity-70" />
                  )}
                  {/* Published badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className={course.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                      {course.isPublished ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`text-xs ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
                      {levelLabels[course.level] || course.level}
                    </Badge>
                    <span className="text-sm font-bold text-green-600">
                      {course.isFree ? 'Gratuit' : `${course.price.toLocaleString()} XAF`}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{course.category.name}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course._count.enrollments}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.lessonsCount} leçons</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}h</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/instructor/courses/${course.id}/lessons`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full gap-1 text-xs text-purple-700 border-purple-200 hover:bg-purple-50">
                        <ListVideo className="h-3.5 w-3.5" /> Leçons
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(course)}
                      className="flex-1 gap-1 text-xs"
                    >
                      {course.isPublished ? (
                        <><EyeOff className="h-3.5 w-3.5" /> Dépublier</>
                      ) : (
                        <><Eye className="h-3.5 w-3.5" /> Publier</>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(course)} className="px-2">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(course.id)} className="px-2 text-red-500 hover:text-red-700">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editCourse ? 'Modifier le cours' : 'Nouveau cours'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Titre *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Titre du cours" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Description complète"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Résumé court</label>
              <Input value={form.shortDesc} onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))} placeholder="Résumé en une ligne" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Prix (XAF) *</label>
              <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Prix original (XAF)</label>
              <Input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Catégorie *</label>
              <Select value={form.categoryId} onValueChange={v => setForm(f => ({ ...f, categoryId: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Niveau</label>
              <Select value={form.level} onValueChange={v => setForm(f => ({ ...f, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Débutant</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermédiaire</SelectItem>
                  <SelectItem value="ADVANCED">Avancé</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Durée (heures)</label>
              <Input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre de leçons</label>
              <Input type="number" value={form.lessonsCount} onChange={e => setForm(f => ({ ...f, lessonsCount: e.target.value }))} placeholder="0" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Lien de paiement</label>
              <Input value={form.paymentLink} onChange={e => setForm(f => ({ ...f, paymentLink: e.target.value }))} placeholder="https://pay.lygosapp.com/..." />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">URL Miniature</label>
              <Input value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="cp-published" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="cp-published" className="text-sm">Publier immédiatement</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="cp-free" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="cp-free" className="text-sm">Cours gratuit</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="cp-cert" checked={form.hasCertificate} onChange={e => setForm(f => ({ ...f, hasCertificate: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="cp-cert" className="text-sm">Avec certificat</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 bg-purple-600 hover:bg-purple-700">
              {saving ? 'Enregistrement...' : editCourse ? 'Mettre à jour' : 'Créer le cours'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
