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
  ArrowLeft, BookOpen, Star, Download, Globe, Award,
  ShoppingCart, CheckCircle, BookMarked
} from "lucide-react"

interface Book {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  format: string
  language: string
  pages?: number
  rating: number
  reviewsCount: number
  downloads: number
  isPublished: boolean
  isFree: boolean
  cover?: string
  paymentLink?: string
  contentUrl?: string
  category: { id: string; name: string }
  author: {
    id: string
    firstName?: string
    lastName?: string
    username?: string
    avatar?: string
  }
  _count: { purchases: number; reviews: number }
}

export default function BookDetailPage() {
  const params = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const { addItem, isInCart } = useCart()

  useEffect(() => {
    fetch(`/api/books/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error("not found")
        return r.json()
      })
      .then(data => { setBook(data); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [params.id])

  if (loading) {
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

  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0

  const inCart = isInCart(book.id, "book")
  const authorName = book.author.firstName
    ? `${book.author.firstName} ${book.author.lastName || ""}`.trim()
    : book.author.username || "Auteur"

  const handleAddToCart = () => {
    addItem({
      id: book.id,
      type: "book",
      title: book.title,
      price: book.price,
      paymentLink: book.paymentLink,
      cover: book.cover,
      author: authorName,
    })
  }

  const handleFreeAccess = () => {
    setEnrolling(true)
    window.location.href = `/books/${book.id}/read`
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/books" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour aux livres
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sticky card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1 md:order-2"
          >
            <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Cover */}
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                {book.cover ? (
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookMarked className="w-16 h-16 text-white opacity-70" />
                )}
              </div>

              <div className="p-6">
                {book.originalPrice && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 line-through text-sm">
                      {book.originalPrice.toLocaleString()} XAF
                    </span>
                    <Badge className="bg-red-500 text-white text-xs">-{discount}%</Badge>
                  </div>
                )}
                <div className="text-3xl font-bold text-green-600 mb-5">
                  {book.isFree ? "Gratuit" : `${book.price.toLocaleString()} XAF`}
                </div>

                {/* Panier pour livres payants */}
                {!book.isFree && (
                  <Button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    variant={inCart ? "outline" : "default"}
                    size="lg"
                    className={`w-full mb-3 gap-2 font-semibold ${
                      inCart
                        ? "border-green-500 text-green-600"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    }`}
                  >
                    {inCart ? (
                      <><CheckCircle className="w-4 h-4" /> Dans le panier</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Ajouter au panier</>
                    )}
                  </Button>
                )}

                {/* Lien de paiement direct */}
                {!book.isFree && book.paymentLink && (
                  <a href={book.paymentLink} target="_blank" rel="noopener noreferrer" className="block mb-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold"
                    >
                      Acheter Maintenant
                    </Button>
                  </a>
                )}

                {/* Accès gratuit */}
                {book.isFree && (
                  <Button
                    size="lg"
                    onClick={handleFreeAccess}
                    disabled={enrolling}
                    className="w-full mb-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    {enrolling ? "Chargement..." : "Lire gratuitement"}
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center mb-5">
                  Livraison digitale instantanée
                </p>

                {/* Meta */}
                <div className="space-y-3 text-sm border-t pt-4">
                  {[
                    { icon: BookOpen, label: `Format : ${book.format}` },
                    { icon: Globe, label: `Langue : ${book.language === "fr" ? "Français" : book.language}` },
                    { icon: Download, label: `${book.downloads.toLocaleString()} téléchargements` },
                    { icon: Award, label: "Qualité Premium K.I.T" },
                    ...(book.pages ? [{ icon: BookMarked, label: `${book.pages} pages` }] : []),
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <item.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
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
            {/* Category + format */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge className="bg-blue-100 text-blue-700">{book.category.name}</Badge>
              <Badge className="bg-gray-100 text-gray-700">{book.format}</Badge>
              {book.isFree && <Badge className="bg-green-100 text-green-700">Gratuit</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{book.title}</h1>
            <p className="text-gray-600 mb-5">
              par <span className="font-semibold text-gray-800">{authorName}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="font-bold">{book.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({book.reviewsCount} avis)</span>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold mb-3">À propos de ce livre</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{book.description}</p>
            </div>

            {/* Ce que vous obtenez */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 mb-6">
              <h2 className="text-xl font-bold mb-4">Ce que vous obtenez</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Accès à vie au contenu",
                  "Téléchargement immédiat",
                  "Compatible tous appareils",
                  `Format ${book.format}`,
                  "Support qualité K.I.T",
                  book.isFree ? "100% gratuit" : "Garantie satisfait ou remboursé",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auteur */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">L'auteur</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{authorName}</p>
                  <p className="text-sm text-gray-500">Auteur certifié K.I.T</p>
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
