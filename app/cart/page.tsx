"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Trash2, BookOpen, GraduationCap, ArrowLeft, ExternalLink } from "lucide-react"

export default function CartPage() {
  const { items, count, total, removeItem, clearCart } = useCart()

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h1>
          <p className="text-gray-500 mb-6">Explorez notre catalogue et ajoutez des livres ou cours.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/books">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Voir les livres
              </Button>
            </Link>
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <GraduationCap className="w-4 h-4 mr-2" />
                Voir les cours
              </Button>
            </Link>
          </div>
        </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Continuer mes achats
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mon Panier
            <Badge className="ml-3 bg-blue-600 text-white">{count}</Badge>
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Vider le panier
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {item.cover ? (
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    ) : item.type === "course" ? (
                      <GraduationCap className="w-7 h-7 text-purple-400" />
                    ) : (
                      <BookOpen className="w-7 h-7 text-blue-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Badge
                      variant="secondary"
                      className={`mb-2 text-xs ${item.type === "course" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {item.type === "course" ? "Cours" : "Livre"}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    {item.author && (
                      <p className="text-sm text-gray-500 mt-0.5">{item.author}</p>
                    )}
                    <p className="text-lg font-bold text-green-600 mt-2">
                      {item.price.toLocaleString()} XAF
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.id, item.type)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {item.paymentLink && (
                      <a
                        href={item.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Acheter <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{item.title}</span>
                    <span className="font-medium whitespace-nowrap">{item.price.toLocaleString()} XAF</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">{total.toLocaleString()} XAF</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mb-4">
                Chaque article sera traité individuellement via Lygos Pay
              </p>

              <div className="space-y-3">
                {items.map((item) => (
                  item.paymentLink ? (
                    <a
                      key={`${item.type}-${item.id}`}
                      href={item.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs py-2 mb-1"
                        size="sm"
                      >
                        Payer — {item.title.slice(0, 20)}{item.title.length > 20 ? "…" : ""}
                      </Button>
                    </a>
                  ) : null
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
