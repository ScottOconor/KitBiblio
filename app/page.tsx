"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import { Hero3D } from "@/components/hero-3d";
import { ParticlesBackground } from "@/components/particles-background";
import CategoryFilter from "@/components/category-filter";
import ProductGrid from "@/components/product-grid";
import { CourseGrid } from "@/components/course-grid";
import Footer from "@/components/footer";
import { EBOOK_CATEGORIES, SAMPLE_EBOOKS, SAMPLE_COURSES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, GraduationCap, Star, Users } from "lucide-react";
import Link from "next/link";


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? SAMPLE_EBOOKS.filter((book) => book.category === selectedCategory)
    : SAMPLE_EBOOKS.slice(0, 8);

  return (
    <main className="min-h-screen bg-white">
      <ParticlesBackground />
      <Header />
      <Hero3D />

      {/* Stats Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: BookOpen, label: "Livres Numériques", value: "10,000+", color: "blue" },
              { icon: GraduationCap, label: "Cours Expert", value: "500+", color: "purple" },
              { icon: Users, label: "Étudiants Actifs", value: "50,000+", color: "pink" },
              { icon: Star, label: "Note Moyenne", value: "4.8/5", color: "yellow" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-600`} />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Cours en Vedette
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transformez Votre Carrière
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Apprenez des experts et maîtrisez les compétences les plus demandées
            </p>
          </motion.div>

          <CourseGrid
            courses={SAMPLE_COURSES.slice(0, 4)}
            title="Cours Populaires"
            subtitle="Découvrez nos formations les plus appréciées"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/courses">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full">
                Voir Tous les Cours
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
              Bibliothèque Numérique
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Livres Numériques Premium
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Découvrez notre sélection de livres numériques soigneusement choisis
            </p>
          </motion.div>

          <CategoryFilter
            categories={EBOOK_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <ProductGrid products={filteredProducts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à Commencer Votre Voyage d'Apprentissage?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'étudiants et transformez votre avenir avec nos cours et livres premium.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full">
                Commencer Gratuitement
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full">
                Explorer la Plateforme
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
