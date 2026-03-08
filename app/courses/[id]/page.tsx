"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SAMPLE_COURSES } from "@/lib/data"
import { ArrowLeft, Clock, Users, Star, GraduationCap, Award, PlayCircle } from "lucide-react"

export default function CourseDetailPage() {
  const params = useParams()
  const course = SAMPLE_COURSES.find(c => c.id === params.id)

  if (!course) {
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

  const discount = course.originalPrice ? Math.round((1 - course.price / course.originalPrice) * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour aux cours
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Info card */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="md:col-span-1 md:order-2">
            <div className="sticky top-8 bg-white rounded-2xl shadow-xl border p-6">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-6 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-white opacity-80" />
              </div>
              {course.originalPrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400 line-through">{course.originalPrice}€</span>
                  <Badge className="bg-red-500 text-white">-{discount}%</Badge>
                </div>
              )}
              <div className="text-3xl font-bold text-green-600 mb-6">{course.price}€</div>
              <a href={course.paymentLink || "#"} target="_blank" rel="noopener noreferrer" className="block mb-3">
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-bold text-lg">
                  S'inscrire Maintenant
                </Button>
              </a>
              <p className="text-xs text-gray-500 text-center mb-6">Garantie satisfait ou remboursé 30 jours</p>

              <div className="space-y-3 text-sm">
                {[
                  { icon: Clock, label: `${course.duration} de contenu` },
                  { icon: PlayCircle, label: `${course.lessons} leçons` },
                  { icon: Users, label: `${course.students.toLocaleString()} étudiants` },
                  { icon: Award, label: course.level },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-700">
                    <item.icon className="w-4 h-4 text-blue-600" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="md:col-span-2 md:order-1">
            <Badge className="mb-4 bg-purple-100 text-purple-700">{course.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                <span className="font-bold ml-1">{course.rating}</span>
              </div>
              <span className="text-gray-500">par <span className="font-semibold text-gray-700">{course.instructor}</span></span>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
              <h2 className="text-xl font-bold mb-4">Description du cours</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-xl font-bold mb-4">Ce que vous apprendrez</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Maîtriser les concepts fondamentaux",
                  "Projets pratiques et concrets",
                  "Techniques professionnelles",
                  "Certificat de completion",
                  "Support de l'instructeur",
                  "Accès à vie",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
