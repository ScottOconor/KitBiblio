"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Download, ShoppingBag
} from 'lucide-react'

interface Book {
  id: string
  title: string
  price: number
  isPublished: boolean
  isFree: boolean
  downloads: number
  cover?: string
  category: { id: string; name: string }
  _count: { purchases: number; reviews: number }
  createdAt: string
}

interface Category { id: string; name: string }

const emptyForm = {
  title: '', description: '', shortDesc: '', price: '', originalPrice: '',
  categoryId: '', language: 'fr', pages: '', format: 'PDF', isbn: '',
  publisher: '', paymentLink: '', isPublished: false, isFree: false, cover: ''
}

export default function InstructorBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editBook, setEditBook] = useState<Book | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const [booksRes, catsRes] = await Promise.all([
      fetch('/api/instructor/books'),
      fetch('/api/categories'),
    ])
    if (booksRes.ok) setBooks(await booksRes.json())
    if (catsRes.ok) setCategories(await catsRes.json())
    setLoading(false)
  }

  const openNew = () => {
    setEditBook(null)
    setForm({ ...emptyForm })
    setOpenDialog(true)
  }

  const openEdit = (book: Book) => {
    setEditBook(book)
    setForm({
      title: book.title, description: '', shortDesc: '', price: String(book.price),
      originalPrice: '', categoryId: book.category.id, language: 'fr', pages: '',
      format: 'PDF', isbn: '', publisher: '', paymentLink: '',
      isPublished: book.isPublished, isFree: book.isFree, cover: book.cover || ''
    })
    setOpenDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editBook ? `/api/instructor/books/${editBook.id}` : '/api/instructor/books'
      const method = editBook ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setOpenDialog(false); fetchData() }
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (book: Book) => {
    const res = await fetch(`/api/instructor/books/${book.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !book.isPublished }),
    })
    if (res.ok) fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce livre ?')) return
    await fetch(`/api/instructor/books/${id}`, { method: 'DELETE' })
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Livres</h1>
          <p className="text-sm text-gray-500 mt-1">{books.length} livre{books.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" /> Nouveau livre
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Aucun livre pour l'instant</h2>
          <p className="text-gray-400 mb-6">Publiez votre premier ebook et commencez à vendre.</p>
          <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" /> Publier mon premier livre
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Cover */}
                <div className="h-36 bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center relative">
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-white opacity-70" />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={book.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                      {book.isPublished ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">{book.category.name}</Badge>
                    <span className="text-sm font-bold text-green-600">
                      {book.isFree ? 'Gratuit' : `${book.price.toLocaleString()} XAF`}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2">{book.title}</h3>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="h-3.5 w-3.5" />{book._count.purchases} ventes
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />{book.downloads} téléch.
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => togglePublish(book)} className="flex-1 gap-1 text-xs">
                      {book.isPublished ? (
                        <><EyeOff className="h-3.5 w-3.5" /> Dépublier</>
                      ) : (
                        <><Eye className="h-3.5 w-3.5" /> Publier</>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(book)} className="px-2">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(book.id)} className="px-2 text-red-500 hover:text-red-700">
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
            <DialogTitle>{editBook ? 'Modifier le livre' : 'Nouveau livre'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Titre *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Titre du livre" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Description complète"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Résumé court</label>
              <Input value={form.shortDesc} onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))} placeholder="Résumé bref" />
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
              <label className="text-sm font-medium mb-1 block">Format</label>
              <Select value={form.format} onValueChange={v => setForm(f => ({ ...f, format: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="EPUB">EPUB</SelectItem>
                  <SelectItem value="MOBI">MOBI</SelectItem>
                  <SelectItem value="AUDIOBOOK">Audiobook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre de pages</label>
              <Input type="number" value={form.pages} onChange={e => setForm(f => ({ ...f, pages: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Éditeur</label>
              <Input value={form.publisher} onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))} placeholder="Auto-édité" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Lien de paiement</label>
              <Input value={form.paymentLink} onChange={e => setForm(f => ({ ...f, paymentLink: e.target.value }))} placeholder="https://pay.lygosapp.com/..." />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">URL Couverture</label>
              <Input value={form.cover} onChange={e => setForm(f => ({ ...f, cover: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="bp-published" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="bp-published" className="text-sm">Publier immédiatement</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="bp-free" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="bp-free" className="text-sm">Livre gratuit</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {saving ? 'Enregistrement...' : editBook ? 'Mettre à jour' : 'Publier le livre'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
