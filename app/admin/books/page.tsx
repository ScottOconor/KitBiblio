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

interface Book {
  id: string
  title: string
  price: number
  isPublished: boolean
  isFree: boolean
  downloads: number
  createdAt: string
  category: { id: string; name: string }
  author: { id: string; firstName: string | null; lastName: string | null }
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
  pages: '',
  format: 'PDF',
  isbn: '',
  publisher: '',
  paymentLink: '',
  cover: '',
  isFree: false,
  isPublished: false,
}

type FormState = typeof emptyForm

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/books')
      if (res.ok) setBooks(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?type=books')
      if (res.ok) setCategories(await res.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  const openEdit = (book: Book) => {
    setEditingId(book.id)
    setForm({
      title: book.title,
      description: '',
      shortDesc: '',
      price: String(book.price),
      originalPrice: '',
      categoryId: book.category.id,
      language: 'fr',
      pages: '',
      format: 'PDF',
      isbn: '',
      publisher: '',
      paymentLink: '',
      cover: '',
      isFree: book.isFree,
      isPublished: book.isPublished,
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
      const url = editingId ? `/api/admin/books/${editingId}` : '/api/admin/books'
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
      await fetchBooks()
    } catch (e) {
      setError('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await fetch(`/api/admin/books/${deletingId}`, { method: 'DELETE' })
      setDeleteDialogOpen(false)
      setDeletingId(null)
      await fetchBooks()
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
          <h1 className="text-2xl font-bold text-gray-900">Livres</h1>
          <p className="text-gray-500 text-sm">{books.length} livre(s) au total</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un livre
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
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Auteur</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Prix</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Téléchargements</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      Aucun livre trouvé
                    </td>
                  </tr>
                ) : (
                  books.map(book => (
                    <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{book.title}</td>
                      <td className="px-4 py-3 text-gray-600">{book.category.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {[book.author.firstName, book.author.lastName].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {book.isFree ? (
                          <span className="text-green-600 font-medium">Gratuit</span>
                        ) : (
                          <span>{book.price.toLocaleString('fr-FR')} XAF</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={book.isPublished ? 'default' : 'secondary'}>
                          {book.isPublished ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{book.downloads}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(book)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDelete(book.id)}
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
            <DialogTitle>{editingId ? 'Modifier le livre' : 'Ajouter un livre'}</DialogTitle>
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
                placeholder="Titre du livre"
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
                <Label htmlFor="pages">Nombre de pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={form.pages}
                  onChange={e => setField('pages', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={form.format} onValueChange={v => setField('format', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="EPUB">EPUB</SelectItem>
                  <SelectItem value="MOBI">MOBI</SelectItem>
                  <SelectItem value="AUDIOBOOK">AUDIOBOOK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={form.isbn}
                  onChange={e => setField('isbn', e.target.value)}
                  placeholder="ISBN"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="publisher">Éditeur</Label>
                <Input
                  id="publisher"
                  value={form.publisher}
                  onChange={e => setField('publisher', e.target.value)}
                  placeholder="Éditeur"
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
              <Label htmlFor="cover">URL couverture</Label>
              <Input
                id="cover"
                value={form.cover}
                onChange={e => setField('cover', e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-6">
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
            <AlertDialogTitle>Supprimer ce livre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le livre sera définitivement supprimé.
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
