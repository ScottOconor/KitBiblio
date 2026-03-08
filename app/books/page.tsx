"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EbookCard from "@/components/ebook-card"
import CategoryFilter from "@/components/category-filter"
import { ParticlesBackground } from "@/components/particles-background"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SAMPLE_EBOOKS, EBOOK_CATEGORIES } from "@/lib/data"
import { Search, BookOpen, Star, TrendingUp } from "lucide-react"

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("default")

  const filtered = useMemo(() => {
    let books = SAMPLE_EBOOKS
    if (selectedCategory) books = books.filter(b => b.category === selectedCategory)
    if (searchTerm) books = books.filter(b =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (sortBy === "price-low") books = [...books].sort((a, b) => a.price - b.price)
    if (sortBy === "price-high") books = [...books].sort((a, b) => b.price - a.price)
    return books
  }, [searchTerm, selectedCategory, sortBy])

  return (
    <main className="min-h-screen">
      <ParticlesBackground />
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Bibliothèque Numérique
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Livres Numériques Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de {SAMPLE_EBOOKS.length}+ livres numériques
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: BookOpen, label: "Livres disponibles", value: `${SAMPLE_EBOOKS.length}+`, color: "text-blue-600" },
              { icon: Star, label: "Note moyenne", value: "4.9/5", color: "text-yellow-500" },
              { icon: TrendingUp, label: "Nouvelles sorties", value: "3/mois", color: "text-purple-600" },
            ].map((s, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
                <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
                <div className="text-2xl font-bold mb-1">{s.value}</div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Rechercher un livre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Par défaut</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <CategoryFilter categories={EBOOK_CATEGORIES} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 text-gray-600">
            <span className="font-semibold text-blue-600">{filtered.length}</span> livre{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </motion.div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun livre trouvé</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((book, index) => (
                <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                  <EbookCard product={book} />
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
