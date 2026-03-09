"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { DbCourseCard, DbCourse } from "@/components/db-course-card"
import { ParticlesBackground } from "@/components/particles-background"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, GraduationCap, Users } from "lucide-react"

const levels = [
  { value: "all", label: "Tous les niveaux" },
  { value: "BEGINNER", label: "Débutant" },
  { value: "INTERMEDIATE", label: "Intermédiaire" },
  { value: "ADVANCED", label: "Avancé" },
  { value: "EXPERT", label: "Expert" },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<DbCourse[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  useEffect(() => {
    Promise.all([
      fetch('/api/courses?limit=100').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([coursesData, catsData]) => {
      setCourses(coursesData.courses || [])
      setCategories(catsData || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = [...courses]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.instructor.firstName || '').toLowerCase().includes(q)
      )
    }
    if (selectedCategory !== "all") {
      list = list.filter(c => c.category.id === selectedCategory)
    }
    if (selectedLevel !== "all") {
      list = list.filter(c => c.level === selectedLevel)
    }
    switch (sortBy) {
      case "price-low": return list.sort((a, b) => a.price - b.price)
      case "price-high": return list.sort((a, b) => b.price - a.price)
      case "rating": return list.sort((a, b) => b.rating - a.rating)
      case "popular": return list.sort((a, b) => b.studentsCount - a.studentsCount)
      default: return list
    }
  }, [courses, search, selectedCategory, selectedLevel, sortBy])

  const totalStudents = courses.reduce((s, c) => s + c.studentsCount, 0)
  const avgRating = courses.length
    ? (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1)
    : "0.0"

  return (
    <main className="min-h-screen bg-gray-50">
      <ParticlesBackground />

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Apprentissage en Ligne
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cours Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Apprenez des experts, suivez votre progression, obtenez des certificats.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: GraduationCap, value: `${courses.length}+`, label: "Cours disponibles", color: "text-purple-600" },
              { icon: Users, value: `${(totalStudents / 1000).toFixed(0)}k+`, label: "Étudiants", color: "text-pink-600" },
              { icon: Star, value: avgRating, label: "Note moyenne", color: "text-yellow-500" },
            ].map(({ icon: Icon, value, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm"
              >
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
          {/* Filter bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Rechercher un cours..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                <SelectContent>
                  {levels.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue placeholder="Trier par" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Plus populaire</SelectItem>
                  <SelectItem value="rating">Mieux noté</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filtered.length}</span> cours trouvé{filtered.length !== 1 ? 's' : ''}
            </p>
            {(search || selectedCategory !== "all" || selectedLevel !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedLevel("all") }}
                className="text-gray-500"
              >
                Effacer les filtres
              </Button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun cours trouvé</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedLevel("all") }}>
                Voir tous les cours
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                >
                  <DbCourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
