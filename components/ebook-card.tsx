"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { useState, useRef } from "react";

interface EbookCardProps {
  product: {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl: string;
    description: string;
    paymentLink: string;
    category?: string;
  };
}

export default function EbookCard({ product }: Readonly<EbookCardProps>) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const formatPrice = (price: number) => {
    if (price >= 100) return `${price.toLocaleString()} XAF`;
    return `${price.toFixed(2)} €`;
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="relative group cursor-pointer"
    >
      <div
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md"
        style={{
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(99,102,241,0.1)"
            : "0 4px 6px -1px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Cover Image */}
        <Link href={`/books/${product.id}`} className="block relative h-56 bg-gray-100 overflow-hidden">
          <Image
            src={product.coverUrl || "/placeholder.svg?height=224&width=150"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full"
            >
              <Eye className="w-3 h-3" />
              Voir le livre
            </motion.div>
          </motion.div>
          {/* Category badge */}
          {product.category && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {product.category}
            </div>
          )}
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        {/* Content */}
        <div className="p-4">
          {/* Rating stars */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-500 ml-1">5.0</span>
          </div>

          <div className="flex justify-between items-start mb-2 gap-2">
            <Link href={`/books/${product.id}`}>
              <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-tight">
                {product.title}
              </h3>
            </Link>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-2 font-medium">par {product.author}</p>

          <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Action Button */}
          <motion.a
            href={product.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={15} />
            Acheter maintenant
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
