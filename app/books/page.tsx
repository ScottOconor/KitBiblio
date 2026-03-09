"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { DbBookCard, DbBook } from "@/components/db-book-card"
import { ParticlesBackground } from "@/components/particles-background"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, Star, Download } from "lucide-react"

const formats = [
  { value: "all", label: "Tous les formats" },
  { value: "PDF", label: "PDF" },
  { value: "EPUB", label: "EPUB" },
  { value: "MOBI", label: "MOBI" },
  { value: "AUDIOBOOK", label: "Audiobook" },
]

export default function BooksPage() {
  const [books, setBooks] = useState<DbBook[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    Promise.all([
      fetch('/api/books?limit=100').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([booksData, catsData]) => {
      setBooks(booksData.books || [])
      setCategories(catsData || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = [...books]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.author.firstName || '').toLowerCase().includes(q)
      )
    }
    if (selectedCategory !== "all") list = list.filter(b => b.category.id === selectedCategory)
    if (selectedFormat !== "all") list = list.filter(b => b.format === selectedFormat)
    switch (sortBy) {
      case "price-low": return list.sort((a, b) => a.price - b.price)
      case "price-high": return list.sort((a, b) => b.price - a.price)
      case "rating": return list.sort((a, b) => b.rating - a.rating)
      case "popular": return list.sort((a, b) => b.downloads - a.downloads)
      default: return list
    }
  }, [books, search, selectedCategory, selectedFormat, sortBy])

  const totalDownloads = books.reduce((s, b) => s + b.downloads, 0)
  const avgRating = books.length ? (books.reduce((s, b) => s + b.rating, 0) / books.length).toFixed(1) : "0.0"

  return (
    <main className="min-h-screen bg-gray-50">
      <ParticlesBackground />
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">Bibliothèque Numérique</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Livres Numériques Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorez notre bibliothèque. Achetez ou accédez gratuitement à nos ebooks.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: BookOpen, value: `${books.length}+`, label: "Livres disponibles", color: "text-blue-600" },
              { icon: Download, value: `${Math.ceil(totalDownloads / 100) * 100}+`, label: "Téléchargements", color: "text-purple-600" },
              { icon: Star, value: avgRating, label: "Note moyenne", color: "text-yellow-500" },
            ].map(({ icon: Icon, value, label, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm">
                <Icon className={`w-7 h-7 ${color} mx-auto mb-2`} />
                <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Rechercher un livre..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger><SelectValue placeholder="Format" /></SelectTrigger>
                <SelectContent>{formats.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue placeholder="Trier par" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récent</SelectItem>
                  <SelectItem value="popular">Plus téléchargé</SelectItem>
                  <SelectItem value="rating">Mieux noté</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{filtered.length}</span> livre{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}</p>
            {(search || selectedCategory !== "all" || selectedFormat !== "all") && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedFormat("all") }} className="text-gray-500">
                Effacer les filtres
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun livre trouvé</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setSelectedCategory("all") }}>Voir tous les livres</Button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filtered.map((book, i) => (
                <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4) }}>
                  <DbBookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
