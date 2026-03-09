"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff,
  PlayCircle, FileText, BookOpen, Clock, Lock, Unlock
} from 'lucide-react'

interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  file_url: string | null
  duration: number
  order: number
  is_free: boolean
  is_published: boolean
}

interface Course {
  id: string
  title: string
  lessonsCount: number
}

const emptyForm = {
  title: '',
  description: '',
  content: '',
  videoUrl: '',
  fileUrl: '',
  duration: '',
  order: '',
  isFree: false,
  isPublished: true,
}

export default function InstructorLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editLesson, setEditLesson] = useState<Lesson | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    setLoading(true)
    const [courseRes, lessonsRes] = await Promise.all([
      fetch(`/api/instructor/courses/${courseId}`),
      fetch(`/api/instructor/courses/${courseId}/lessons`),
    ])
    if (!courseRes.ok) { router.push('/instructor/courses'); return }
    setCourse(await courseRes.json())
    if (lessonsRes.ok) setLessons(await lessonsRes.json())
    setLoading(false)
  }

  const openNew = () => {
    setEditLesson(null)
    setForm({ ...emptyForm, order: String(lessons.length + 1) })
    setOpenDialog(true)
  }

  const openEdit = (lesson: Lesson) => {
    setEditLesson(lesson)
    setForm({
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      videoUrl: lesson.video_url || '',
      fileUrl: lesson.file_url || '',
      duration: String(lesson.duration),
      order: String(lesson.order),
      isFree: lesson.is_free,
      isPublished: lesson.is_published,
    })
    setOpenDialog(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const url = editLesson
        ? `/api/instructor/lessons/${editLesson.id}`
        : `/api/instructor/courses/${courseId}/lessons`
      const method = editLesson ? 'PATCH' : 'POST'

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

  const togglePublish = async (lesson: Lesson) => {
    await fetch(`/api/instructor/lessons/${lesson.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !lesson.is_published }),
    })
    fetchData()
  }

  const toggleFree = async (lesson: Lesson) => {
    await fetch(`/api/instructor/lessons/${lesson.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFree: !lesson.is_free }),
    })
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette leçon ?')) return
    await fetch(`/api/instructor/lessons/${id}`, { method: 'DELETE' })
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/instructor/courses">
          <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
            <ArrowLeft className="h-4 w-4" /> Mes cours
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leçons</h1>
          {course && (
            <p className="text-sm text-gray-500 mt-1 max-w-xl truncate">
              {course.title} — {lessons.length} leçon{lessons.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
          <Plus className="h-4 w-4" /> Nouvelle leçon
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Aucune leçon pour l'instant</h2>
          <p className="text-gray-400 mb-6">
            Ajoutez votre première leçon avec du texte, une vidéo ou un PDF.
          </p>
          <Button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 gap-2">
            <Plus className="h-4 w-4" /> Ajouter une leçon
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className={`transition-shadow hover:shadow-md ${!lesson.is_published ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Order badge */}
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>

                    {/* Type icon */}
                    <div className="flex-shrink-0">
                      {lesson.video_url ? (
                        <PlayCircle className="w-5 h-5 text-purple-500" />
                      ) : lesson.file_url ? (
                        <FileText className="w-5 h-5 text-blue-500" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</h3>
                        {lesson.is_free && (
                          <Badge className="bg-green-100 text-green-700 text-xs py-0">Aperçu gratuit</Badge>
                        )}
                        <Badge className={`text-xs py-0 ${lesson.is_published ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          {lesson.is_published ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </div>
                      {lesson.description && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{lesson.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {lesson.video_url && <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> Vidéo</span>}
                        {lesson.file_url && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>}
                        {lesson.content && <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Texte</span>}
                        {lesson.duration > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration}min</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFree(lesson)}
                        title={lesson.is_free ? 'Retirer de l\'aperçu gratuit' : 'Mettre en aperçu gratuit'}
                        className="px-2 text-gray-500 hover:text-green-600"
                      >
                        {lesson.is_free ? <Unlock className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePublish(lesson)}
                        className="px-2 text-gray-500"
                      >
                        {lesson.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(lesson)}
                        className="px-2 text-gray-500 hover:text-purple-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(lesson.id)}
                        className="px-2 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dialog — Ajouter / Modifier une leçon */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editLesson ? 'Modifier la leçon' : 'Nouvelle leçon'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Titre */}
            <div>
              <label className="text-sm font-medium mb-1 block">Titre *</label>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex : Introduction à JavaScript"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-1 block">Description courte</label>
              <Input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brève description de la leçon"
              />
            </div>

            {/* Contenu texte */}
            <div>
              <label className="text-sm font-medium mb-1 block">Contenu texte</label>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={6}
                placeholder="Rédigez le contenu de la leçon ici..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* URL Vidéo */}
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-purple-500" /> URL Vidéo (YouTube ou directe)
              </label>
              <Input
                value={form.videoUrl}
                onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=... ou https://..."
              />
            </div>

            {/* URL PDF */}
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> URL PDF / Fichier
              </label>
              <Input
                value={form.fileUrl}
                onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))}
                placeholder="https://... (lien direct vers un PDF)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Durée */}
              <div>
                <label className="text-sm font-medium mb-1 block">Durée (minutes)</label>
                <Input
                  type="number"
                  value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  placeholder="0"
                />
              </div>

              {/* Ordre */}
              <div>
                <label className="text-sm font-medium mb-1 block">Ordre</label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                  placeholder="1"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFree}
                  onChange={e => setForm(f => ({ ...f, isFree: e.target.checked }))}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm">Aperçu gratuit (visible sans inscription)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                  className="w-4 h-4 accent-purple-600"
                />
                <span className="text-sm">Publier</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {saving ? 'Enregistrement...' : editLesson ? 'Mettre à jour' : 'Ajouter la leçon'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
