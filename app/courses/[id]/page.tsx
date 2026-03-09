"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import {
  ArrowLeft, Clock, Users, Star, GraduationCap, Award,
  PlayCircle, ShoppingCart, CheckCircle, BookOpen
} from "lucide-react"

const levelLabels: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
  EXPERT: "Expert",
}

const levelColors: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-blue-100 text-blue-700",
  ADVANCED: "bg-orange-100 text-orange-700",
  EXPERT: "bg-red-100 text-red-700",
}

interface Course {
  id: string
  title: string
  description: string
  shortDesc?: string
  thumbnail?: string
  price: number
  originalPrice?: number
  currency: string
  level: string
  duration: number
  lessonsCount: number
  studentsCount: number
  rating: number
  reviewsCount: number
  isPublished: boolean
  isFree: boolean
  hasCertificate: boolean
  paymentLink?: string
  category: { id: string; name: string }
  instructor: {
    id: string
    firstName?: string
    lastName?: string
    username?: string
    avatar?: string
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const { addItem, isInCart } = useCart()

  useEffect(() => {
    Promise.all([
      fetch(`/api/courses/${params.id}`).then(r => {
        if (!r.ok) throw new Error("not found")
        return r.json()
      }),
      fetch(`/api/courses/${params.id}/enroll`).then(r => r.ok ? r.json() : { enrolled: false }),
    ]).then(([courseData, enrollData]) => {
      setCourse(courseData)
      setIsEnrolled(enrollData.enrolled)
      setLoading(false)
    }).catch(() => { setNotFound(true); setLoading(false) })
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
        <Footer />
      </main>
    )
  }

  if (notFound || !course) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <GraduationCap className="w-16 h-16 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-700">Cours non trouvé</h1>
          <Link href="/courses"><Button>Retour aux cours</Button></Link>
        </div>
        <Footer />
      </main>
    )
  }

  const discount = course.originalPrice
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0

  const inCart = isInCart(course.id, "course")
  const instructorName = course.instructor.firstName
    ? `${course.instructor.firstName} ${course.instructor.lastName || ""}`.trim()
    : course.instructor.username || "Instructeur"

  const handleAddToCart = () => {
    addItem({
      id: course.id,
      type: "course",
      title: course.title,
      price: course.price,
      paymentLink: course.paymentLink,
    })
  }

  const handleFreeEnroll = async () => {
    setEnrolling(true)
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, { method: 'POST' })
      if (res.ok) {
        setIsEnrolled(true)
        window.location.href = `/courses/${course.id}/learn`
      }
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/courses" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour aux cours
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sticky info card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1 md:order-2"
          >
            <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <PlayCircle className="w-16 h-16 text-white opacity-80" />
                )}
              </div>

              <div className="p-6">
                {course.originalPrice && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 line-through text-sm">
                      {course.originalPrice.toLocaleString()} XAF
                    </span>
                    <Badge className="bg-red-500 text-white text-xs">-{discount}%</Badge>
                  </div>
                )}
                <div className="text-3xl font-bold text-green-600 mb-5">
                  {course.isFree ? "Gratuit" : `${course.price.toLocaleString()} XAF`}
                </div>

                {/* Cart button */}
                {!course.isFree && (
                  <Button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    variant={inCart ? "outline" : "default"}
                    size="lg"
                    className={`w-full mb-3 gap-2 font-semibold ${
                      inCart
                        ? "border-green-500 text-green-600"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    }`}
                  >
                    {inCart ? (
                      <><CheckCircle className="w-4 h-4" /> Dans le panier</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Ajouter au panier</>
                    )}
                  </Button>
                )}

                {/* Direct payment */}
                {course.paymentLink && (
                  <a href={course.paymentLink} target="_blank" rel="noopener noreferrer" className="block mb-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
                    >
                      S'inscrire Maintenant
                    </Button>
                  </a>
                )}

                {/* Accès si déjà inscrit */}
                {isEnrolled && (
                  <Link href={`/courses/${course.id}/learn`} className="block mb-3">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold gap-2"
                    >
                      <PlayCircle className="w-4 h-4" /> Continuer le cours
                    </Button>
                  </Link>
                )}

                {/* Inscription gratuite */}
                {course.isFree && !isEnrolled && (
                  <Button
                    size="lg"
                    onClick={handleFreeEnroll}
                    disabled={enrolling}
                    className="w-full mb-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
                  >
                    {enrolling ? "Inscription..." : "S'inscrire gratuitement"}
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center mb-5">Garantie satisfait ou remboursé 30 jours</p>

                {/* Meta */}
                <div className="space-y-3 text-sm border-t pt-4">
                  {[
                    { icon: Clock, label: `${course.duration}h de contenu` },
                    { icon: PlayCircle, label: `${course.lessonsCount} leçons` },
                    { icon: Users, label: `${course.studentsCount.toLocaleString()} étudiants` },
                    { icon: Award, label: levelLabels[course.level] || course.level },
                    ...(course.hasCertificate ? [{ icon: BookOpen, label: "Certificat inclus" }] : []),
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <item.icon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 md:order-1"
          >
            {/* Category + level */}
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-purple-100 text-purple-700">{course.category.name}</Badge>
              <Badge className={levelColors[course.level] || "bg-gray-100 text-gray-700"}>
                {levelLabels[course.level] || course.level}
              </Badge>
              {course.hasCertificate && (
                <Badge className="bg-yellow-100 text-yellow-700">Certifiant</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{course.title}</h1>

            {course.shortDesc && (
              <p className="text-lg text-gray-600 mb-4">{course.shortDesc}</p>
            )}

            {/* Rating + instructor */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="font-bold ml-1">{course.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-1">({course.reviewsCount} avis)</span>
              </div>
              <span className="text-gray-500">
                par <span className="font-semibold text-gray-700">{instructorName}</span>
              </span>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold mb-3">À propos de ce cours</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.description}</p>
            </div>

            {/* What you'll learn */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 mb-6">
              <h2 className="text-xl font-bold mb-4">Ce que vous apprendrez</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Maîtriser les concepts fondamentaux",
                  "Projets pratiques et concrets",
                  "Techniques professionnelles avancées",
                  course.hasCertificate ? "Certificat de complétion" : "Support illimité de l'instructeur",
                  "Accès à vie au contenu",
                  `${course.lessonsCount} leçons structurées`,
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">L'instructeur</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  {instructorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{instructorName}</p>
                  <p className="text-sm text-gray-500">Instructeur certifié</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
