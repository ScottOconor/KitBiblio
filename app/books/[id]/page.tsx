"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SAMPLE_EBOOKS } from "@/lib/data"
import { ShoppingCart, Star, ArrowLeft, BookOpen, FileText, Globe, Award } from "lucide-react"

export default function BookDetailPage() {
  const params = useParams()
  const book = SAMPLE_EBOOKS.find(b => b.id === params.id)

  if (!book) {
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/books" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour aux livres
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Cover */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="md:col-span-1">
            <div className="sticky top-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-6">
                <Image src={book.coverUrl || "/placeholder.svg?height=400&width=280"} alt={book.title} fill className="object-cover" />
              </div>
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                <span className="text-gray-600 text-sm ml-2">5.0 (128 avis)</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {book.price >= 100 ? `${book.price.toLocaleString()} XAF` : `${book.price.toFixed(2)} €`}
                </div>
                <a href={book.paymentLink} target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-bold text-lg mb-3">
                    <ShoppingCart className="w-5 h-5 mr-2" /> Acheter Maintenant
                  </Button>
                </a>
                <p className="text-xs text-gray-500">Livraison digitale instantanée</p>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="md:col-span-2">
            <Badge className="mb-4 bg-blue-100 text-blue-700">{book.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{book.title}</h1>
            <p className="text-gray-600 mb-6">par <span className="font-semibold text-gray-800">{book.author}</span></p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: BookOpen, label: "Format", value: "PDF/EPUB" },
                { icon: Globe, label: "Langue", value: "Français" },
                { icon: FileText, label: "Livraison", value: "Instantanée" },
                { icon: Award, label: "Qualité", value: "Premium" },
              ].map((info, i) => (
                <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border">
                  <info.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-500">{info.label}</div>
                  <div className="font-semibold text-sm">{info.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold mb-4">Ce que vous obtenez</h2>
              <ul className="space-y-3">
                {["Accès à vie au contenu", "Téléchargement immédiat", "Compatible tous appareils", "Support qualité K.I.T"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
