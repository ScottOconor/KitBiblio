"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Clock, Users, Star, PlayCircle, ShoppingCart,
  CheckCircle, Zap, BookOpen, Award, Lock
} from "lucide-react"

export interface DbCourse {
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
  isFree: boolean
  hasCertificate: boolean
  paymentLink?: string
  category: { id: string; name: string }
  instructor: {
    id: string
    firstName?: string
    lastName?: string
    username?: string
  }
}

const levelColors: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-blue-100 text-blue-700",
  ADVANCED: "bg-orange-100 text-orange-700",
  EXPERT: "bg-red-100 text-red-700",
}

const levelLabels: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
  EXPERT: "Expert",
}

interface DbCourseCardProps {
  course: DbCourse
  onEnrolled?: (courseId: string) => void
}

export function DbCourseCard({ course, onEnrolled }: DbCourseCardProps) {
  const { data: session } = useSession()
  const { addItem, isInCart } = useCart()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  const inCart = isInCart(course.id, "course")
  const instructorName = course.instructor.firstName
    ? `${course.instructor.firstName} ${course.instructor.lastName || ""}`.trim()
    : course.instructor.username || "Instructeur"

  const discount = course.originalPrice
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: course.id,
      type: "course",
      title: course.title,
      price: course.price,
      paymentLink: course.paymentLink,
    })
  }

  const handleEnrollFree = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session) {
      router.push('/auth/signin')
      return
    }
    setEnrolling(true)
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, { method: 'POST' })
      if (res.ok) {
        onEnrolled?.(course.id)
        router.push(`/courses/${course.id}/learn`)
      }
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
        {/* Thumbnail */}
        <Link href={`/courses/${course.id}`} className="block relative">
          <div className="relative h-44 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
            {course.thumbnail ? (
              <motion.img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <PlayCircle className="w-14 h-14 text-white opacity-60" />
            )}
            {/* Overlay hover */}
            <motion.div
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                Voir le cours
              </span>
            </motion.div>
            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              <Badge className={`text-xs ${levelColors[course.level] || "bg-gray-100 text-gray-700"}`}>
                {levelLabels[course.level] || course.level}
              </Badge>
            </div>
            {course.isFree && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-500 text-white text-xs">Gratuit</Badge>
              </div>
            )}
            {discount > 0 && !course.isFree && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-red-500 text-white text-xs">-{discount}%</Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <Badge variant="outline" className="w-fit text-xs mb-2">{course.category.name}</Badge>

          <Link href={`/courses/${course.id}`}>
            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-purple-600 transition-colors">
              {course.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mb-2">par {instructorName}</p>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">{course.shortDesc || course.description}</p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              {course.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />{course.studentsCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{course.duration}h
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />{course.lessonsCount}
            </span>
          </div>

          {course.hasCertificate && (
            <div className="flex items-center gap-1 text-xs text-yellow-600 mb-3">
              <Award className="w-3.5 h-3.5" /> Certificat inclus
            </div>
          )}

          {/* Price + Action */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              {course.isFree ? (
                <span className="text-xl font-bold text-green-600">Gratuit</span>
              ) : (
                <div>
                  {course.originalPrice && (
                    <span className="text-xs text-gray-400 line-through mr-1">
                      {course.originalPrice.toLocaleString()} XAF
                    </span>
                  )}
                  <span className="text-xl font-bold text-gray-900">
                    {course.price.toLocaleString()} XAF
                  </span>
                </div>
              )}
            </div>

            {course.isFree ? (
              <Button
                onClick={handleEnrollFree}
                disabled={enrolling}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold gap-2"
                size="sm"
              >
                {enrolling ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />Inscription...</>
                ) : (
                  <><Zap className="w-3.5 h-3.5" />S'inscrire gratuitement</>
                )}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  size="sm"
                  className={`flex-1 gap-1.5 font-semibold ${
                    inCart
                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  }`}
                >
                  {inCart ? (
                    <><CheckCircle className="w-3.5 h-3.5" />Dans le panier</>
                  ) : (
                    <><ShoppingCart className="w-3.5 h-3.5" />Ajouter au panier</>
                  )}
                </Button>
                {inCart && (
                  <Link href="/cart">
                    <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                      Valider
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
