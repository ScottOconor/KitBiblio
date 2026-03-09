"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, PlayCircle, FileText, CheckCircle, Lock, ChevronRight,
  BookOpen, Clock, Menu, X
} from "lucide-react"

interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  file_url: string | null
  duration: number
  order: number
  is_free: boolean
  is_published: boolean
}

interface Course {
  id: string
  title: string
  thumbnail?: string
  lessonsCount: number
  duration: number
}

export default function CourseLearnPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/courses/${params.id}/learn`)
      return
    }
    if (status !== "authenticated") return

    const courseId = params.id as string

    Promise.all([
      fetch(`/api/courses/${courseId}`).then(r => r.json()),
      fetch(`/api/courses/${courseId}/enroll`).then(r => r.json()),
      fetch(`/api/courses/${courseId}/lessons`).then(r => r.json()),
    ]).then(([courseData, enrollData, lessonsData]) => {
      setCourse(courseData)
      setIsEnrolled(enrollData.enrolled)
      setLessons(lessonsData.lessons || [])
      if (lessonsData.lessons?.length > 0) {
        setSelectedLesson(lessonsData.lessons[0])
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id, status, router])

  const progress = lessons.length > 0
    ? Math.round((completed.size / lessons.length) * 100)
    : 0

  const toggleComplete = (lessonId: string) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(lessonId)) next.delete(lessonId)
      else next.add(lessonId)
      return next
    })
  }

  if (loading || status === "loading") {
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

  if (!course) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <BookOpen className="w-16 h-16 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-700">Cours non trouvé</h1>
          <Link href="/courses"><Button>Retour aux cours</Button></Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link
            href={`/courses/${params.id}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour au cours</span>
          </Link>
        </div>

        <h1 className="text-white font-semibold text-sm sm:text-base truncate max-w-xs sm:max-w-md">
          {course.title}
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-gray-400 text-xs">{progress}%</span>
          </div>
          {!isEnrolled && (
            <Badge className="bg-yellow-500 text-white text-xs">Aperçu gratuit</Badge>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — lesson list */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0"
            >
              <div className="p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-3 font-semibold">
                  Contenu du cours ({lessons.length} leçons)
                </p>

                <div className="space-y-1">
                  {lessons.map((lesson, i) => {
                    const isActive = selectedLesson?.id === lesson.id
                    const isDone = completed.has(lesson.id)
                    const isLocked = !isEnrolled && !lesson.is_free

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && setSelectedLesson(lesson)}
                        disabled={isLocked}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-start gap-3 group ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : isLocked
                            ? "opacity-40 cursor-not-allowed text-gray-400"
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-gray-500" />
                          ) : isDone ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : lesson.video_url ? (
                            <PlayCircle className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight truncate">
                            {i + 1}. {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {lesson.duration > 0 && (
                              <span className="text-xs opacity-60 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {lesson.duration}min
                              </span>
                            )}
                            {lesson.is_free && !isEnrolled && (
                              <Badge className="bg-green-700 text-green-100 text-xs py-0 px-1.5">Gratuit</Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {!isEnrolled && (
                  <div className="mt-4 p-3 bg-purple-900/50 rounded-lg border border-purple-700">
                    <p className="text-purple-300 text-xs mb-2">
                      Inscrivez-vous pour accéder à tout le contenu
                    </p>
                    <Link href={`/courses/${params.id}`}>
                      <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-xs">
                        Voir le cours
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {selectedLesson ? (
            <div className="max-w-4xl mx-auto p-6">
              {/* Video */}
              {selectedLesson.video_url && (
                <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
                  {selectedLesson.video_url.includes("youtube.com") || selectedLesson.video_url.includes("youtu.be") ? (
                    <iframe
                      src={selectedLesson.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video src={selectedLesson.video_url} controls className="w-full h-full" />
                  )}
                </div>
              )}

              {/* Lesson header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedLesson.title}</h2>
                  {selectedLesson.description && (
                    <p className="text-gray-400">{selectedLesson.description}</p>
                  )}
                </div>
                <Button
                  onClick={() => toggleComplete(selectedLesson.id)}
                  size="sm"
                  variant={completed.has(selectedLesson.id) ? "default" : "outline"}
                  className={
                    completed.has(selectedLesson.id)
                      ? "bg-green-600 hover:bg-green-700 text-white border-0 gap-2"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700 gap-2"
                  }
                >
                  <CheckCircle className="w-4 h-4" />
                  {completed.has(selectedLesson.id) ? "Terminé" : "Marquer comme terminé"}
                </Button>
              </div>

              {/* Lesson content */}
              {selectedLesson.content && (
                <div className="bg-gray-800 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3">Contenu</h3>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedLesson.content}
                  </div>
                </div>
              )}

              {/* PDF / File */}
              {selectedLesson.file_url && (
                <div className="bg-gray-800 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" /> Fichier PDF
                  </h3>
                  <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-900 mb-3">
                    <iframe
                      src={selectedLesson.file_url}
                      className="w-full h-full"
                      title={selectedLesson.title}
                    />
                  </div>
                  <a
                    href={selectedLesson.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Ouvrir dans un nouvel onglet <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-6">
                {(() => {
                  const idx = lessons.findIndex(l => l.id === selectedLesson.id)
                  const prev = lessons[idx - 1]
                  const next = lessons[idx + 1]
                  return (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => prev && setSelectedLesson(prev)}
                        disabled={!prev}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
                      </Button>
                      <span className="text-gray-500 text-sm">
                        {lessons.findIndex(l => l.id === selectedLesson.id) + 1} / {lessons.length}
                      </span>
                      <Button
                        onClick={() => {
                          if (next) {
                            if (!isEnrolled && !next.is_free) return
                            setSelectedLesson(next)
                          }
                        }}
                        disabled={!next || (!isEnrolled && next && !next.is_free)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Suivant <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  )
                })()}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <PlayCircle className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-400 mb-2">Sélectionnez une leçon</h2>
              <p className="text-gray-600">Choisissez une leçon dans la liste à gauche pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
