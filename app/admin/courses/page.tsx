"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Course {
  id: string
  title: string
  price: number
  isPublished: boolean
  isFree: boolean
  level: string
  duration: number
  lessonsCount: number
  createdAt: string
  category: { id: string; name: string }
  instructor: { id: string; firstName: string | null; lastName: string | null }
}

interface Category {
  id: string
  name: string
}

const emptyForm = {
  title: '',
  description: '',
  shortDesc: '',
  price: '',
  originalPrice: '',
  categoryId: '',
  language: 'fr',
  level: 'BEGINNER',
  duration: '',
  lessonsCount: '',
  paymentLink: '',
  thumbnail: '',
  hasCertificate: false,
  isFree: false,
  isPublished: false,
}

type FormState = typeof emptyForm

const levelLabels: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/courses')
      if (res.ok) setCourses(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?type=courses')
      if (res.ok) setCategories(await res.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCourses()
    fetchCategories()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditingId(course.id)
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
      paymentLink: '',
      thumbnail: '',
      hasCertificate: false,
      isFree: course.isFree,
      isPublished: course.isPublished,
    })
    setError(null)
    setDialogOpen(true)
  }

  const openDelete = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.description || !form.price || !form.categoryId) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la sauvegarde')
        return
      }
      setDialogOpen(false)
      await fetchCourses()
    } catch (e) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await fetch(`/api/admin/courses/${deletingId}`, { method: 'DELETE' })
      setDeleteDialogOpen(false)
      setDeletingId(null)
      await fetchCourses()
    } catch (e) {
      console.error(e)
    }
  }

  const setField = (key: keyof FormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cours</h1>
          <p className="text-gray-500 text-sm">{courses.length} cours au total</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un cours
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Titre</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Catégorie</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Instructeur</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Prix</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Niveau</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      Aucun cours trouvé
                    </td>
                  </tr>
                ) : (
                  courses.map(course => (
                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{course.title}</td>
                      <td className="px-4 py-3 text-gray-600">{course.category.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {[course.instructor.firstName, course.instructor.lastName].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {course.isFree ? (
                          <span className="text-green-600 font-medium">Gratuit</span>
                        ) : (
                          <span>{course.price.toLocaleString('fr-FR')} XAF</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{levelLabels[course.level] || course.level}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                          {course.isPublished ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(course)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDelete(course.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier le cours' : 'Ajouter un cours'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={e => setField('title', e.target.value)}
                placeholder="Titre du cours"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                placeholder="Description complète"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="shortDesc">Description courte</Label>
              <Input
                id="shortDesc"
                value={form.shortDesc}
                onChange={e => setField('shortDesc', e.target.value)}
                placeholder="Résumé court"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix (XAF) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={e => setField('price', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Prix original</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={form.originalPrice}
                  onChange={e => setField('originalPrice', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="categoryId">Catégorie *</Label>
              <Select value={form.categoryId} onValueChange={v => setField('categoryId', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Langue</Label>
                <Input
                  id="language"
                  value={form.language}
                  onChange={e => setField('language', e.target.value)}
                  placeholder="fr"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="level">Niveau</Label>
                <Select value={form.level} onValueChange={v => setField('level', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Débutant</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermédiaire</SelectItem>
                    <SelectItem value="ADVANCED">Avancé</SelectItem>
                    <SelectItem value="EXPERT">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Durée (heures)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={form.duration}
                  onChange={e => setField('duration', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lessonsCount">Nombre de leçons</Label>
                <Input
                  id="lessonsCount"
                  type="number"
                  value={form.lessonsCount}
                  onChange={e => setField('lessonsCount', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paymentLink">Lien paiement</Label>
              <Input
                id="paymentLink"
                value={form.paymentLink}
                onChange={e => setField('paymentLink', e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="thumbnail">URL miniature</Label>
              <Input
                id="thumbnail"
                value={form.thumbnail}
                onChange={e => setField('thumbnail', e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hasCertificate"
                  checked={form.hasCertificate}
                  onCheckedChange={v => setField('hasCertificate', Boolean(v))}
                />
                <Label htmlFor="hasCertificate" className="cursor-pointer">Certificat</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isFree"
                  checked={form.isFree}
                  onCheckedChange={v => setField('isFree', Boolean(v))}
                />
                <Label htmlFor="isFree" className="cursor-pointer">Gratuit</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isPublished"
                  checked={form.isPublished}
                  onCheckedChange={v => setField('isPublished', Boolean(v))}
                />
                <Label htmlFor="isPublished" className="cursor-pointer">Publié</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce cours ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le cours sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
