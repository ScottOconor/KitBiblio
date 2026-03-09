"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, FileText, ExternalLink, Download } from "lucide-react"

interface Book {
  id: string
  title: string
  description: string
  isFree: boolean
  isPublished: boolean
  contentUrl?: string | null
  author: { firstName?: string; lastName?: string; username?: string }
  cover?: string
}

export default function BookReadPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [book, setBook] = useState<Book | null>(null)
  const [contentUrl, setContentUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    const bookId = params.id as string

    Promise.all([
      fetch(`/api/books/${bookId}`).then(r => {
        if (!r.ok) throw new Error("not found")
        return r.json()
      }),
      fetch(`/api/books/${bookId}/content`).then(r => r.ok ? r.json() : { contentUrl: null }),
    ]).then(([bookData, contentData]) => {
      setBook(bookData)
      setContentUrl(contentData.contentUrl || bookData.contentUrl || null)

      // Si le livre est payant et l'utilisateur n'est pas connecté → redirect
      if (!bookData.isFree && !session) {
        router.push(`/auth/signin?callbackUrl=/books/${bookId}/read`)
      }

      setLoading(false)
    }).catch(() => {
      setNotFound(true)
      setLoading(false)
    })
  }, [params.id, session, status, router])

  if (loading || status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
        <Footer />
      </main>
    )
  }

  if (notFound || !book) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <BookOpen className="w-16 h-16 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-700">Livre non trouvé</h1>
          <Link href="/books"><Button>Retour aux livres</Button></Link>
        </div>
        <Footer />
      </main>
    )
  }

  const authorName = book.author?.firstName
    ? `${book.author.firstName} ${book.author.lastName || ""}`.trim()
    : book.author?.username || "Auteur"

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Link
          href={`/books/${params.id}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour au livre</span>
        </Link>

        <div className="text-center">
          <h1 className="text-white font-semibold text-sm sm:text-base truncate max-w-xs sm:max-w-md">
            {book.title}
          </h1>
          <p className="text-gray-500 text-xs">{authorName}</p>
        </div>

        {contentUrl && (
          <a
            href={contentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Ouvrir</span>
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-900">
        {contentUrl ? (
          <div className="h-full min-h-[calc(100vh-120px)]">
            {contentUrl.endsWith(".pdf") || contentUrl.includes("/pdf") || contentUrl.includes("drive.google") ? (
              <iframe
                src={contentUrl}
                className="w-full h-full"
                style={{ minHeight: "calc(100vh - 120px)" }}
                title={book.title}
              />
            ) : contentUrl.includes("youtube.com") || contentUrl.includes("youtu.be") ? (
              <div className="flex items-center justify-center h-full p-8">
                <div className="w-full max-w-4xl aspect-video">
                  <iframe
                    src={contentUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                    className="w-full h-full rounded-xl"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <FileText className="w-16 h-16 text-blue-400 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">{book.title}</h2>
                <p className="text-gray-400 mb-6 max-w-md">
                  Ce contenu est disponible en téléchargement direct.
                </p>
                <a href={contentUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Download className="w-4 h-4" />
                    Télécharger le livre
                  </Button>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">Contenu non disponible</h2>
            <p className="text-gray-600 mb-6">
              Le contenu de ce livre n'a pas encore été ajouté par l'auteur.
            </p>
            <p className="text-gray-700 text-sm max-w-md leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
            <Link href={`/books/${params.id}`} className="mt-6">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour au livre
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
