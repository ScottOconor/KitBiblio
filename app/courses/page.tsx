"use client"

import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CourseGrid } from "@/components/course-grid"
import { ParticlesBackground } from "@/components/particles-background"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star, Clock, Users } from "lucide-react"
import { useState } from "react"

const coursesData = [
  {
    id: "1",
    title: "Développement Web Complet - De Zéro à Expert",
    instructor: "Marie Dubois",
    description: "Apprenez HTML, CSS, JavaScript, React, Node.js et bien plus avec ce cours complet de développement web.",
    price: 89.99,
    originalPrice: 199.99,
    image: "/api/placeholder/400/300",
    duration: "42 heures",
    students: 15420,
    rating: 4.8,
    level: "Débutant",
    category: "Développement",
    lessons: 156
  },
  {
    id: "2",
    title: "Machine Learning & Intelligence Artificielle",
    instructor: "Dr. Jean Martin",
    description: "Maîtrisez les algorithmes de machine learning, deep learning et l'intelligence artificielle avec Python.",
    price: 129.99,
    originalPrice: 299.99,
    image: "/api/placeholder/400/300",
    duration: "58 heures",
    students: 12350,
    rating: 4.9,
    level: "Intermédiaire",
    category: "IA & Data Science",
    lessons: 234
  },
  {
    id: "3",
    title: "Design UI/UX Moderne avec Figma",
    instructor: "Sophie Laurent",
    description: "Créez des interfaces magnifiques et fonctionnelles. Apprenez les principes du design et maîtrisez Figma.",
    price: 69.99,
    originalPrice: 149.99,
    image: "/api/placeholder/400/300",
    duration: "28 heures",
    students: 8920,
    rating: 4.7,
    level: "Débutant",
    category: "Design",
    lessons: 98
  },
  {
    id: "4",
    title: "Marketing Digital Stratégie Avancée",
    instructor: "Pierre Bernard",
    description: "Développez des stratégies marketing efficaces, SEO, SEA, réseaux sociaux et analytique web.",
    price: 79.99,
    originalPrice: 179.99,
    image: "/api/placeholder/400/300",
    duration: "35 heures",
    students: 10230,
    rating: 4.6,
    level: "Intermédiaire",
    category: "Marketing",
    lessons: 127
  },
  {
    id: "5",
    title: "Blockchain et Développement Crypto",
    instructor: "Alexandre Roux",
    description: "Comprenez la blockchain, créez des smart contracts et développez des applications décentralisées.",
    price: 149.99,
    originalPrice: 349.99,
    image: "/api/placeholder/400/300",
    duration: "48 heures",
    students: 6780,
    rating: 4.8,
    level: "Avancé",
    category: "Blockchain",
    lessons: 189
  },
  {
    id: "6",
    title: "Photographie Professionnelle",
    instructor: "Claire Martin",
    description: "Maîtrisez votre appareil photo, la composition, l'éclairage et le post-traitement professionnel.",
    price: 59.99,
    originalPrice: 129.99,
    image: "/api/placeholder/400/300",
    duration: "24 heures",
    students: 14560,
    rating: 4.7,
    level: "Débutant",
    category: "Photographie",
    lessons: 87
  },
  {
    id: "7",
    title: "Business et Entrepreneuriat",
    instructor: "Thomas Petit",
    description: "Lancez votre entreprise, développez votre business model et gérez votre croissance.",
    price: 99.99,
    originalPrice: 229.99,
    image: "/api/placeholder/400/300",
    duration: "38 heures",
    students: 18920,
    rating: 4.8,
    level: "Intermédiaire",
    category: "Business",
    lessons: 143
  },
  {
    id: "8",
    title: "Cybersécurité et Ethical Hacking",
    instructor: "Dr. Robert Blanc",
    description: "Protégez les systèmes, apprenez les techniques de hacking éthique et la sécurité informatique.",
    price: 139.99,
    originalPrice: 319.99,
    image: "/api/placeholder/400/300",
    duration: "52 heures",
    students: 7890,
    rating: 4.9,
    level: "Avancé",
    category: "Cybersécurité",
    lessons: 201
  }
]

const categories = [
  "Toutes les catégories",
  "Développement",
  "IA & Data Science",
  "Design",
  "Marketing",
  "Blockchain",
  "Photographie",
  "Business",
  "Cybersécurité"
]

const levels = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories")
  const [selectedLevel, setSelectedLevel] = useState("Tous les niveaux")
  const [sortBy, setSortBy] = useState("popularity")

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Toutes les catégories" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "Tous les niveaux" || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "students":
        return b.students - a.students
      default:
        return 0
    }
  })

  const stats = {
    totalCourses: coursesData.length,
    totalStudents: coursesData.reduce((acc, course) => acc + course.students, 0),
    avgRating: (coursesData.reduce((acc, course) => acc + course.rating, 0) / coursesData.length).toFixed(1)
  }

  return (
    <div className="relative z-10">
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cours en Ligne Premium
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Apprenez des experts et maîtrisez de nouvelles compétences avec nos cours interactifs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalCourses}+</div>
              <div className="text-gray-600 dark:text-gray-400">Cours Disponibles</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{(stats.totalStudents / 1000).toFixed(0)}k+</div>
              <div className="text-gray-600 dark:text-gray-400">Étudiants Satisfaits</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-3xl font-bold text-pink-600">{stats.avgRating}</span>
              </div>
              <div className="text-gray-600 dark:text-gray-400">Note Moyenne</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Plus populaire</SelectItem>
                  <SelectItem value="rating">Mieux notés</SelectItem>
                  <SelectItem value="students">Plus d'étudiants</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <CourseGrid 
            courses={sortedCourses}
            title={`${sortedCourses.length} Cours Trouvés`}
            subtitle="Découvrez notre sélection de cours de qualité"
          />
        </div>
      </section>
    </div>
  )
}
