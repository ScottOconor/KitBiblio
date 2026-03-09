"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "./ui/badge"
import { ShoppingCart, Star, BookOpen, Eye, CheckCircle, Download, Zap } from "lucide-react"
import { Button } from "./ui/button"

export interface DbBook {
  id: string
  title: string
  description: string
  shortDesc?: string
  cover?: string
  price: number
  originalPrice?: number
  currency: string
  language: string
  pages?: number
  format: string
  isFree: boolean
  contentUrl?: string
  paymentLink?: string
  rating: number
  reviewsCount: number
  downloads: number
  category: { id: string; name: string }
  author: {
    id: string
    firstName?: string
    lastName?: string
    username?: string
  }
}

interface DbBookCardProps {
  book: DbBook
}

export function DbBookCard({ book }: DbBookCardProps) {
  const { addItem, isInCart } = useCart()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useState<HTMLDivElement | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })

  const authorName = book.author.firstName
    ? `${book.author.firstName} ${book.author.lastName || ""}`.trim()
    : book.author.username || "Auteur"

  const discount = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0

  const inCart = isInCart(book.id, "book")

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0); y.set(0); setIsHovered(false)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: book.id,
      type: "book",
      title: book.title,
      price: book.price,
      cover: book.cover,
      author: authorName,
      paymentLink: book.paymentLink,
    })
  }

  const handleFreeAccess = (e: React.MouseEvent) => {
    e.preventDefault()
    if (book.contentUrl) {
      window.open(book.contentUrl, '_blank')
    } else {
      router.push(`/books/${book.id}/read`)
    }
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative group cursor-pointer"
    >
      <div
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col"
        style={{
          boxShadow: isHovered
            ? "0 20px 40px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(139,92,246,0.1)"
            : "0 4px 6px -1px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Cover */}
        <Link href={`/books/${book.id}`} className="block relative h-52 bg-gray-100 overflow-hidden flex-shrink-0">
          {book.cover ? (
            <motion.img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.06 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-14 h-14 text-white opacity-60" />
            </div>
          )}

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <span className="text-white text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
              <Eye className="w-3 h-3" /> Voir le livre
            </span>
          </motion.div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              {book.category.name}
            </Badge>
          </div>
          {book.isFree && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500 text-white text-xs">Gratuit</Badge>
            </div>
          )}
          {discount > 0 && !book.isFree && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500 text-white text-xs">-{discount}%</Badge>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
            ))}
            <span className="text-xs text-gray-500 ml-1">{book.rating.toFixed(1)}</span>
          </div>

          <Link href={`/books/${book.id}`}>
            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mb-2">par {authorName}</p>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {book.shortDesc || book.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>{book.format}</span>
            {book.pages && <span>{book.pages} pages</span>}
            <span className="flex items-center gap-1"><Download className="w-3 h-3" />{book.downloads}</span>
          </div>

          {/* Price + Action */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              {book.isFree ? (
                <span className="text-lg font-bold text-green-600">Gratuit</span>
              ) : (
                <div>
                  {book.originalPrice && (
                    <span className="text-xs text-gray-400 line-through mr-1">
                      {book.originalPrice.toLocaleString()} XAF
                    </span>
                  )}
                  <span className="text-lg font-bold text-blue-600">
                    {book.price.toLocaleString()} XAF
                  </span>
                </div>
              )}
            </div>

            {book.isFree ? (
              <Button
                onClick={handleFreeAccess}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold gap-2"
                size="sm"
              >
                <Zap className="w-3.5 h-3.5" />
                {book.contentUrl ? "Lire gratuitement" : "Accéder maintenant"}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  size="sm"
                  className={`flex-1 gap-1.5 font-semibold ${
                    inCart
                      ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
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
