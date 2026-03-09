"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail, Instagram, Twitter, BookOpen, GraduationCap,
  Facebook, Youtube, Linkedin, Shield, Users, BarChart2
} from "lucide-react";
import { useSession } from "next-auth/react";

// ── USER Footer (full) ──────────────────────────────────────────────────────────
function UserFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    BookShelf
                  </h3>
                  <div className="text-xs text-gray-400">Marketplace d'Apprentissage</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                La marketplace complète pour les livres et cours. Transformez votre avenir avec l'apprentissage numérique.
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, color: "hover:bg-blue-600" },
                  { Icon: Twitter, color: "hover:bg-blue-400" },
                  { Icon: Instagram, color: "hover:bg-pink-600" },
                  { Icon: Youtube, color: "hover:bg-red-600" },
                  { Icon: Linkedin, color: "hover:bg-blue-700" },
                ].map(({ Icon, color }, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center ${color} transition-colors`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Explorer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-sm text-blue-400">Explorer</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { href: "/books", label: "Livres Numériques", Icon: BookOpen },
                  { href: "/courses", label: "Cours en Ligne", Icon: GraduationCap },
                  { href: "/categories", label: "Catégories" },
                  { href: "/books", label: "Meilleures Ventes" },
                  { href: "/books", label: "Nouveautés" },
                ].map(({ href, label, Icon }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      {Icon && <Icon className="w-3 h-3" />}
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Entreprise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-sm text-purple-400">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { href: "/about", label: "À Propos" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
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
                {[
                  { href: "/faq", label: "FAQ" },
                  { href: "/help", label: "Centre d'Aide" },
                  { href: "/legal", label: "Mentions Légales" },
                  { href: "/privacy", label: "Confidentialité" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
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
                  className="w-full px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
                />
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  S'abonner
                </button>
              </div>
            </motion.div>
          </div>

          <div className="border-t border-gray-700 my-8" />

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
                <Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
                <Link href="/legal" className="hover:text-white transition-colors">Conditions</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

// ── INSTRUCTOR Footer ───────────────────────────────────────────────────────────
function InstructorFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">BookShelf</h3>
                  <div className="text-xs text-purple-400">Espace Enseignant</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Partagez votre savoir, transformez des vies. Publiez vos cours et livres en toute simplicité.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Ressources */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-purple-400">Ressources Enseignant</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { href: "/instructor", label: "Mon Tableau de bord" },
                  { href: "/instructor/courses", label: "Mes Cours" },
                  { href: "/instructor/books", label: "Mes Livres" },
                  { href: "/instructor/students", label: "Mes Étudiants" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-purple-300 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Catalogue + Support */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-pink-400">Catalogue & Support</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { href: "/books", label: "Tous les Livres" },
                  { href: "/courses", label: "Tous les Cours" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/help", label: "Centre d'Aide" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <span>&copy; 2024</span>
              <span className="text-purple-400 font-semibold">Kairos Innovation Technologies (K.I.T)</span>
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
              <Link href="/legal" className="hover:text-white transition-colors">Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── ADMIN Footer (minimal) ──────────────────────────────────────────────────────
function AdminFooter() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-3 mb-3 md:mb-0">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-semibold">BookShelf Admin</span>
          <span>&mdash; Kairos Innovation Technologies (K.I.T)</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
            <BarChart2 className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <Link href="/admin/users" className="hover:text-white transition-colors flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Utilisateurs
          </Link>
          <span>&copy; 2024 K.I.T</span>
        </div>
      </div>
    </footer>
  );
}

// ── Main export — dispatches by role ────────────────────────────────────────────
export default function Footer() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return <AdminFooter />;
  }

  if (role === "INSTRUCTOR") {
    return <InstructorFooter />;
  }

  return <UserFooter />;
}
