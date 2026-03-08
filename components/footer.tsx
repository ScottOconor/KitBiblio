"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Instagram, Twitter, BookOpen, GraduationCap, Facebook, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    BookShelf
                  </h3>
                  <div className="text-xs text-gray-400">Marketplace d'Apprentissage</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                La marketplace complète pour les livres et cours. Transformez votre avenir avec l'apprentissage numérique.
              </p>
              <div className="flex gap-3">
                <motion.a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Facebook className="w-4 h-4" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Twitter className="w-4 h-4" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Instagram className="w-4 h-4" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Youtube className="w-4 h-4" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Linkedin className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>

            {/* Explore */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-sm text-blue-400">Explorer</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/books"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-3 h-3" />
                    Livres Numériques
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <GraduationCap className="w-3 h-3" />
                    Cours en Ligne
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Catégories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bestsellers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Meilleures Ventes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new-releases"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Nouveautés
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-sm text-purple-400">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    À Propos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Presse
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-sm text-green-400">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Centre d'Aide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Mentions Légales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Conditions d'Utilisation
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-sm text-pink-400">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">
                Recevez nos dernières recommandations et offres exclusives.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800"
                />
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  S'abonner
                </button>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Bottom */}
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span>&copy; 2024</span>
              <span className="text-blue-400 font-semibold">Kairos Innovation Technologies (K.I.T)</span>
              <span>Tous droits réservés.</span>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-xs">Made with ❤️ by K.I.T</span>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Confidentialité
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Conditions
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
