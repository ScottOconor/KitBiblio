"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductGrid from "@/components/product-grid";
import CategoryFilter from "@/components/category-filter";
import { EBOOK_CATEGORIES, SAMPLE_EBOOKS } from "@/lib/data";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? SAMPLE_EBOOKS.filter((book) => book.category === selectedCategory)
    : SAMPLE_EBOOKS;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-white px-4 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Toutes les catégories
          </h1>
          <p className="text-gray-600 text-lg">
            Explorez notre collection complète de livres numériques
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <CategoryFilter
            categories={EBOOK_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ProductGrid products={filteredProducts} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
