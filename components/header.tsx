"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Menu, X, BookOpen, GraduationCap, Search,
  User, LogIn, LogOut, Settings, Shield, Plus, LayoutDashboard,
  Users, BookMarked, ChevronDown
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { useCart } from "@/contexts/cart-context";

// ── Navigation per role ────────────────────────────────────────────────────────
const publicNav = [
  { name: "Accueil", href: "/" },
  { name: "Livres", href: "/books" },
  { name: "Cours", href: "/courses" },
  { name: "Catégories", href: "/categories" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const instructorNav = [
  { name: "Accueil", href: "/" },
  { name: "Catalogue Livres", href: "/books" },
  { name: "Catalogue Cours", href: "/courses" },
];

const adminNav = [
  { name: "Accueil", href: "/" },
  { name: "Livres", href: "/books" },
  { name: "Cours", href: "/courses" },
];

// ── Logo shared ─────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <motion.div
        className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
      >
        <BookOpen className="w-5 h-5 text-white" />
      </motion.div>
      <div className="hidden sm:block">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          BookShelf
        </span>
        <div className="text-xs text-gray-500">Marketplace d'Apprentissage</div>
      </div>
    </Link>
  );
}

// ── USER Header ─────────────────────────────────────────────────────────────────
function UserHeader({ session, status }: { session: any; status: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { count } = useCart();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {publicNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder="Rechercher..."
                    className="w-64"
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    autoFocus
                  />
                </motion.div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)}>
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {count}
                  </span>
                )}
              </Button>
            </Link>

            {/* User menu */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.avatar} />
                      <AvatarFallback>
                        {(session.user.firstName || session.user.username || session.user.email || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="p-2">
                    <p className="font-medium text-sm">{session.user.firstName || session.user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    <Badge className="mt-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">Membre</Badge>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard"><User className="mr-2 h-4 w-4" />Mon tableau de bord</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cart"><ShoppingCart className="mr-2 h-4 w-4" />Mon panier {count > 0 && `(${count})`}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Paramètres</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />Connexion
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3"
          >
            <Input placeholder="Rechercher..." className="w-full mb-3" />
            {publicNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name === "Livres" && <BookOpen className="w-4 h-4" />}
                {item.name === "Cours" && <GraduationCap className="w-4 h-4" />}
                {item.name}
              </Link>
            ))}
            {!session && (
              <div className="pt-3 border-t border-gray-200 flex gap-2">
                <Link href="/auth/signin" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Connexion</Button>
                </Link>
                <Link href="/auth/signup" className="flex-1">
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">S'inscrire</Button>
                </Link>
              </div>
            )}
          </motion.nav>
        )}
      </div>
    </header>
  );
}

// ── INSTRUCTOR Header ───────────────────────────────────────────────────────────
function InstructorHeader({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-purple-200">
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with instructor badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                BookShelf
              </span>
              <div className="text-xs text-purple-500 font-semibold">Espace Enseignant</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {instructorNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 text-sm font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Mon Espace dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors">
                  Mon Espace <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/instructor"><LayoutDashboard className="mr-2 h-4 w-4 text-purple-600" />Tableau de bord</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instructor/courses"><GraduationCap className="mr-2 h-4 w-4 text-purple-600" />Mes Cours</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instructor/books"><BookOpen className="mr-2 h-4 w-4 text-purple-600" />Mes Livres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instructor/students"><Users className="mr-2 h-4 w-4 text-purple-600" />Mes Étudiants</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-3">
            {/* Publish button */}
            <Link href="/instructor/courses">
              <Button
                size="sm"
                className="hidden md:flex bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Publier
              </Button>
            </Link>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.avatar} />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {(session.user.firstName || session.user.username || session.user.email || "I").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="p-2">
                  <p className="font-medium text-sm">{session.user.firstName || session.user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  <Badge className="mt-1 text-xs bg-purple-100 text-purple-700 hover:bg-purple-100">Enseignant</Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/instructor"><LayoutDashboard className="mr-2 h-4 w-4" />Mon tableau de bord</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instructor/courses"><GraduationCap className="mr-2 h-4 w-4" />Mes Cours</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instructor/books"><BookOpen className="mr-2 h-4 w-4" />Mes Livres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instructor/students"><Users className="mr-2 h-4 w-4" />Mes Étudiants</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile toggle */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="lg:hidden mt-4 pb-4 border-t border-purple-100 pt-4 space-y-2"
          >
            {instructorNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm text-gray-700 hover:text-purple-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-purple-100 pt-3 mt-3 space-y-2">
              <Link href="/instructor" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-purple-700 font-semibold">Mon Tableau de bord</Link>
              <Link href="/instructor/courses" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-purple-700">Mes Cours</Link>
              <Link href="/instructor/books" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-purple-700">Mes Livres</Link>
              <Link href="/instructor/students" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-purple-700">Mes Étudiants</Link>
            </div>
            <Link href="/instructor/courses" className="block mt-2">
              <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="w-4 h-4 mr-2" />Publier un contenu
              </Button>
            </Link>
          </motion.nav>
        )}
      </div>
    </header>
  );
}

// ── ADMIN Header ────────────────────────────────────────────────────────────────
function AdminHeader({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-blue-300">
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                BookShelf
              </span>
              <div className="text-xs text-blue-600 font-semibold">Administration</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {adminNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-700 text-sm font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Admin panel button */}
            <Link href="/admin">
              <Button
                size="sm"
                className="hidden md:flex bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Panel Admin
              </Button>
            </Link>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {(session.user.firstName || session.user.username || session.user.email || "A").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="p-2">
                  <p className="font-medium text-sm">{session.user.firstName || session.user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  <Badge className="mt-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {session.user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4 text-blue-700" />Dashboard Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/books"><BookOpen className="mr-2 h-4 w-4" />Gestion Livres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/courses"><GraduationCap className="mr-2 h-4 w-4" />Gestion Cours</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users"><Users className="mr-2 h-4 w-4" />Gestion Utilisateurs</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile toggle */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="lg:hidden mt-4 pb-4 border-t border-blue-100 pt-4 space-y-2"
          >
            {adminNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm text-gray-700 hover:text-blue-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/admin" className="block mt-3">
              <Button size="sm" className="w-full bg-gradient-to-r from-blue-700 to-indigo-700">
                <LayoutDashboard className="w-4 h-4 mr-2" />Panel Admin
              </Button>
            </Link>
          </motion.nav>
        )}
      </div>
    </header>
  );
}

// ── Main export — dispatches by role ─────────────────────────────────────────────
export default function Header() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return <AdminHeader session={session} />;
  }

  if (role === "INSTRUCTOR") {
    return <InstructorHeader session={session} />;
  }

  return <UserHeader session={session} status={status} />;
}
