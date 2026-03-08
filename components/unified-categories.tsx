"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { 
  BookOpen, 
  GraduationCap, 
  Code, 
  Brain, 
  Palette, 
  TrendingUp, 
  Camera, 
  Shield, 
  Link,
  Heart,
  Rocket,
  Globe,
  Microscope,
  Brush,
  Cpu,
  Briefcase,
  Gamepad2,
  Music,
  Film,
  Dumbbell,
  Utensils,
  Plane,
  Baby,
  Users
} from "lucide-react"

interface Category {
  id: string
  name: string
  type: "book" | "course" | "both"
  icon: any
  color: string
  count: number
  description: string
  subcategories?: string[]
}

interface UnifiedCategoriesProps {
  selectedCategory?: string
  onCategorySelect?: (category: string) => void
  type?: "all" | "books" | "courses"
}

const categories: Category[] = [
  {
    id: "development",
    name: "Développement",
    type: "both",
    icon: Code,
    color: "blue",
    count: 2450,
    description: "Programmation, web, mobile, logiciel",
    subcategories: ["Web", "Mobile", "Backend", "Frontend", "DevOps"]
  },
  {
    id: "ai-data",
    name: "IA & Data Science",
    type: "both", 
    icon: Brain,
    color: "purple",
    count: 1890,
    description: "Machine learning, deep learning, analyse de données",
    subcategories: ["Machine Learning", "Deep Learning", "Data Analysis", "NLP"]
  },
  {
    id: "design",
    name: "Design",
    type: "both",
    icon: Palette,
    color: "pink",
    count: 1234,
    description: "UI/UX, graphisme, design produit",
    subcategories: ["UI/UX", "Graphisme", "Design Produit", "Motion Design"]
  },
  {
    id: "marketing",
    name: "Marketing",
    type: "both",
    icon: TrendingUp,
    color: "green",
    count: 987,
    description: "Digital marketing, SEO, social media",
    subcategories: ["SEO", "Social Media", "Content Marketing", "Email Marketing"]
  },
  {
    id: "business",
    name: "Business",
    type: "both",
    icon: Briefcase,
    color: "yellow",
    count: 1567,
    description: "Entrepreneuriat, gestion, finance",
    subcategories: ["Entrepreneuriat", "Finance", "Management", "Stratégie"]
  },
  {
    id: "photography",
    name: "Photographie",
    type: "both",
    icon: Camera,
    color: "orange",
    count: 876,
    description: "Photo numérique, retouche, composition",
    subcategories: ["Portrait", "Paysage", "Retouche", "Photo Numérique"]
  },
  {
    id: "cybersecurity",
    name: "Cybersécurité",
    type: "course",
    icon: Shield,
    color: "red",
    count: 543,
    description: "Sécurité informatique, éthique hacking",
    subcategories: ["Sécurité Réseau", "Cryptographie", "Ethical Hacking", "Sécurité Cloud"]
  },
  {
    id: "blockchain",
    name: "Blockchain",
    type: "course",
    icon: Link,
    color: "indigo",
    count: 432,
    description: "Crypto, DeFi, smart contracts",
    subcategories: ["Cryptomonnaies", "DeFi", "Smart Contracts", "Web3"]
  },
  {
    id: "romance",
    name: "Romance",
    type: "book",
    icon: Heart,
    color: "rose",
    count: 3210,
    description: "Romans d'amour, contemporain, historique",
    subcategories: ["Contemporain", "Historique", "Paranormal", "New Adult"]
  },
  {
    id: "scifi",
    name: "Science-Fiction",
    type: "book",
    icon: Rocket,
    color: "cyan",
    count: 1876,
    description: "Space opera, dystopie, cyberpunk",
    subcategories: ["Space Opera", "Dystopie", "Cyberpunk", "Hard SF"]
  },
  {
    id: "self-development",
    name: "Développement Personnel",
    type: "both",
    icon: Users,
    color: "emerald",
    count: 2341,
    description: "Productivité, bien-être, leadership",
    subcategories: ["Productivité", "Bien-être", "Leadership", "Communication"]
  },
  {
    id: "history",
    name: "Histoire",
    type: "book",
    icon: Globe,
    color: "amber",
    count: 1543,
    description: "Histoire mondiale, biographies, civilisations",
    subcategories: ["Histoire Moderne", "Antiquité", "Biographies", "Guerres"]
  },
  {
    id: "science",
    name: "Sciences",
    type: "both",
    icon: Microscope,
    color: "teal",
    count: 1298,
    description: "Physique, chimie, biologie, astronomie",
    subcategories: ["Physique", "Biologie", "Chimie", "Astronomie"]
  },
  {
    id: "art",
    name: "Art",
    type: "book",
    icon: Brush,
    color: "violet",
    count: 987,
    description: "Peinture, sculpture, histoire de l'art",
    subcategories: ["Peinture", "Sculpture", "Histoire de l'Art", "Art Moderne"]
  },
  {
    id: "technology",
    name: "Technologie",
    type: "both",
    icon: Cpu,
    color: "slate",
    count: 1654,
    description: "Innovation, gadgets, high-tech",
    subcategories: ["Innovation", "Gadgets", "IoT", "Robotique"]
  },
  {
    id: "gaming",
    name: "Gaming",
    type: "both",
    icon: Gamepad2,
    color: "lime",
    count: 765,
    description: "Game design, e-sports, streaming",
    subcategories: ["Game Design", "E-sports", "Streaming", "Game Dev"]
  },
  {
    id: "music",
    name: "Musique",
    type: "both",
    icon: Music,
    color: "fuchsia",
    count: 892,
    description: "Production, théorie, instruments",
    subcategories: ["Production", "Théorie", "Instruments", "DJ"]
  },
  {
    id: "film",
    name: "Cinéma",
    type: "both",
    icon: Film,
    color: "zinc",
    count: 643,
    description: "Réalisation, montage, scénario",
    subcategories: ["Réalisation", "Montage", "Scénario", "Critique"]
  },
  {
    id: "fitness",
    name: "Fitness & Sport",
    type: "course",
    icon: Dumbbell,
    color: "orange",
    count: 521,
    description: "Entraînement, nutrition, bien-être",
    subcategories: ["Musculation", "Cardio", "Nutrition", "Yoga"]
  },
  {
    id: "cooking",
    name: "Cuisine",
    type: "both",
    icon: Utensils,
    color: "red",
    count: 1123,
    description: "Recettes, techniques, gastronomie",
    subcategories: ["Cuisine Française", "Végétarien", "Pâtisserie", "Cuisine du Monde"]
  },
  {
    id: "travel",
    name: "Voyage",
    type: "book",
    icon: Plane,
    color: "sky",
    count: 789,
    description: "Guides, récits, tourisme",
    subcategories: ["Guides", "Récits de Voyage", "Tourisme", "Aventure"]
  },
  {
    id: "parenting",
    name: "Parenting",
    type: "book",
    icon: Baby,
    color: "pink",
    count: 456,
    description: "Éducation, développement enfant, famille",
    subcategories: ["Éducation", "Développement Enfant", "Famille", "Psychologie"]
  }
]

const colorClasses = {
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  pink: "bg-pink-100 text-pink-800 border-pink-200",
  green: "bg-green-100 text-green-800 border-green-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  red: "bg-red-100 text-red-800 border-red-200",
  indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
  rose: "bg-rose-100 text-rose-800 border-rose-200",
  cyan: "bg-cyan-100 text-cyan-800 border-cyan-200",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  teal: "bg-teal-100 text-teal-800 border-teal-200",
  violet: "bg-violet-100 text-violet-800 border-violet-200",
  slate: "bg-slate-100 text-slate-800 border-slate-200",
  lime: "bg-lime-100 text-lime-800 border-lime-200",
  fuchsia: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  zinc: "bg-zinc-100 text-zinc-800 border-zinc-200",
  sky: "bg-sky-100 text-sky-800 border-sky-200"
}

const iconColorClasses = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  green: "text-green-600",
  yellow: "text-yellow-600",
  orange: "text-orange-600",
  red: "text-red-600",
  indigo: "text-indigo-600",
  rose: "text-rose-600",
  cyan: "text-cyan-600",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  teal: "text-teal-600",
  violet: "text-violet-600",
  slate: "text-slate-600",
  lime: "text-lime-600",
  fuchsia: "text-fuchsia-600",
  zinc: "text-zinc-600",
  sky: "text-sky-600"
}

export function UnifiedCategories({ selectedCategory, onCategorySelect, type = "all" }: UnifiedCategoriesProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [showSubcategories, setShowSubcategories] = useState<string | null>(null)

  const filteredCategories = type === "all" 
    ? categories 
    : categories.filter(cat => cat.type === type || cat.type === "both")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Explorer par Catégorie
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Découvrez nos livres et cours organisés par catégories pour trouver exactement ce que vous cherchez
        </p>
      </div>

      {/* Type Filter */}
      {type === "all" && (
        <div className="flex justify-center gap-4">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => onCategorySelect?.("all")}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <GraduationCap className="w-4 h-4" />
            Tout
          </Button>
          <Button
            variant={selectedCategory === "books" ? "default" : "outline"}
            onClick={() => onCategorySelect?.("books")}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Livres uniquement
          </Button>
          <Button
            variant={selectedCategory === "courses" ? "default" : "outline"}
            onClick={() => onCategorySelect?.("courses")}
            className="flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Cours uniquement
          </Button>
        </div>
      )}

      {/* Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredCategories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id
          const isHovered = hoveredCategory === category.id

          return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 shadow-xl' 
                    : 'shadow-lg hover:shadow-xl'
                }`}
                onClick={() => onCategorySelect?.(category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                      <Icon className={`w-6 h-6 ${iconColorClasses[category.color as keyof typeof iconColorClasses]}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {category.type === "both" ? "Livres & Cours" : category.type === "book" ? "Livres" : "Cours"}
                      </Badge>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>

                  {/* Subcategories */}
                  {category.subcategories && (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowSubcategories(showSubcategories === category.id ? null : category.id)
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                      >
                        {showSubcategories === category.id ? "Masquer" : "Afficher"} les sous-catégories
                      </Button>
                      
                      {showSubcategories === category.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1"
                        >
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <div
                              key={sub}
                              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              • {sub}
                            </div>
                          ))}
                          {category.subcategories.length > 3 && (
                            <div className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                              +{category.subcategories.length - 3} autres...
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 rounded-lg pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}20 0%, transparent 100%)`,
                    }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Popular Categories */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6 text-center">Catégories Populaires</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories
            .sort((a, b) => b.count - a.count)
            .slice(0, 8)
            .map((category) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="outline"
                    className={`px-4 py-2 cursor-pointer flex items-center gap-2 ${colorClasses[category.color as keyof typeof colorClasses]}`}
                    onClick={() => onCategorySelect?.(category.id)}
                  >
                    <Icon className={`w-3 h-3 ${iconColorClasses[category.color as keyof typeof iconColorClasses]}`} />
                    {category.name}
                    <span className="text-xs opacity-70">({category.count})</span>
                  </Badge>
                </motion.div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
