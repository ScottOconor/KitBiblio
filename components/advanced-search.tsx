"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Slider } from "./ui/slider"
import { Search, Filter, X, Star, Clock, Users, BookOpen, GraduationCap } from "lucide-react"

interface SearchFilters {
  query: string
  category: string
  type: string
  level: string
  priceRange: number[]
  rating: number
  duration: string
  language: string
  hasCertificate: boolean
  isFree: boolean
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
}

const categories = [
  "Toutes les catégories",
  "Développement",
  "IA & Data Science", 
  "Design",
  "Marketing",
  "Business",
  "Photographie",
  "Cybersécurité",
  "Blockchain",
  "Romance",
  "Science-Fiction",
  "Développement Personnel",
  "Histoire",
  "Sciences",
  "Art",
  "Technologie"
]

const types = ["Tous les types", "Livres", "Cours"]
const levels = ["Tous les niveaux", "Débutant", "Intermédiaire", "Avancé"]
const durations = ["Toutes les durées", "< 2h", "2-5h", "5-10h", "> 10h"]
const languages = ["Toutes les langues", "Français", "Anglais", "Espagnol", "Allemand"]

export function AdvancedSearch({ onFiltersChange, initialFilters = {} }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "Toutes les catégories",
    type: "Tous les types",
    level: "Tous les niveaux",
    priceRange: [0, 500],
    rating: 0,
    duration: "Toutes les durées",
    language: "Toutes les langues",
    hasCertificate: false,
    isFree: false,
    ...initialFilters
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    onFiltersChange(filters)
    updateActiveFilters()
  }, [filters])

  const updateActiveFilters = () => {
    const active: string[] = []
    
    if (filters.category !== "Toutes les catégories") active.push(filters.category)
    if (filters.type !== "Tous les types") active.push(filters.type)
    if (filters.level !== "Tous les niveaux") active.push(filters.level)
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) active.push("Prix")
    if (filters.rating > 0) active.push(`Note ≥ ${filters.rating}`)
    if (filters.duration !== "Toutes les durées") active.push(filters.duration)
    if (filters.language !== "Toutes les langues") active.push(filters.language)
    if (filters.hasCertificate) active.push("Certificat")
    if (filters.isFree) active.push("Gratuit")
    
    setActiveFilters(active)
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "Toutes les catégories",
      type: "Tous les types",
      level: "Tous les niveaux",
      priceRange: [0, 500],
      rating: 0,
      duration: "Toutes les durées",
      language: "Toutes les langues",
      hasCertificate: false,
      isFree: false
    })
  }

  const removeFilter = (filterToRemove: string) => {
    const filterMap: { [key: string]: keyof SearchFilters } = {
      "Prix": "priceRange",
      "Certificat": "hasCertificate",
      "Gratuit": "isFree"
    }

    const key = filterMap[filterToRemove] as keyof SearchFilters
    
    if (key) {
      if (key === "priceRange") {
        updateFilter(key, [0, 500])
      } else if (key === "hasCertificate" || key === "isFree") {
        updateFilter(key, false)
      }
    } else if (categories.includes(filterToRemove)) {
      updateFilter("category", "Toutes les catégories")
    } else if (types.includes(filterToRemove)) {
      updateFilter("type", "Tous les types")
    } else if (levels.includes(filterToRemove)) {
      updateFilter("level", "Tous les niveaux")
    } else if (durations.includes(filterToRemove)) {
      updateFilter("duration", "Toutes les durées")
    } else if (languages.includes(filterToRemove)) {
      updateFilter("language", "Toutes les langues")
    } else if (filterToRemove.startsWith("Note ≥")) {
      updateFilter("rating", 0)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher des livres, cours, instructeurs..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 items-center"
          >
            <span className="text-sm text-gray-500">Filtres actifs:</span>
            {activeFilters.map((filter) => (
              <motion.div
                key={filter}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Badge variant="default" className="flex items-center gap-1">
                  {filter}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              </motion.div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-500 hover:text-red-600"
            >
              Tout effacer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {type === "Livres" && <BookOpen className="w-4 h-4" />}
                          {type === "Cours" && <GraduationCap className="w-4 h-4" />}
                          {type}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau</label>
                <Select value={filters.level} onValueChange={(value) => updateFilter("level", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Durée</label>
                <Select value={filters.duration} onValueChange={(value) => updateFilter("duration", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {duration}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Langue</label>
                <Select value={filters.language} onValueChange={(value) => updateFilter("language", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Note minimale</label>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{filters.rating}</span>
                </div>
                <Slider
                  value={[filters.rating]}
                  onValueChange={(value) => updateFilter("rating", value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fourchette de prix (€)</label>
              <div className="flex items-center gap-4">
                <span className="text-sm">{filters.priceRange[0]}€</span>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter("priceRange", value)}
                  max={500}
                  min={0}
                  step={10}
                  className="flex-1"
                />
                <span className="text-sm">{filters.priceRange[1]}€</span>
              </div>
            </div>

            {/* Additional Options */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certificate"
                  checked={filters.hasCertificate}
                  onCheckedChange={(checked) => updateFilter("hasCertificate", checked)}
                />
                <label htmlFor="certificate" className="text-sm font-medium cursor-pointer">
                  Avec certificat
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free"
                  checked={filters.isFree}
                  onCheckedChange={(checked) => updateFilter("isFree", checked)}
                />
                <label htmlFor="free" className="text-sm font-medium cursor-pointer">
                  Gratuit uniquement
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
