"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Mail, Lock, User, BookOpen, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    username: '', firstName: '', lastName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
      } else {
        setSuccess('Compte créé avec succès !')
        setTimeout(() => router.push('/auth/signin'), 2000)
      }
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-950 py-8">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -50, 30, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 40, 0], y: [0, 40, -30, 0], scale: [1, 0.85, 1.1, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 20, 0], y: [0, 20, -50, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-pink-600/10 blur-3xl"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating dots */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/15"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              left: `${8 + (i * 6.5) % 84}%`,
              top: `${12 + (i * 11) % 76}%`,
            }}
            animate={{ y: [-8, 8, -8], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 2.5 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 mb-3">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">BookShelf</h1>
          <p className="text-gray-500 text-xs mt-0.5">K.I.T — Kairos Innovation Technologies</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl"
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">Créer un compte</h2>
            <p className="text-gray-400 text-sm mt-1">Rejoignez des milliers d'apprenants</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 py-2">
                  <AlertDescription className="text-red-300 text-sm">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Alert className="border-green-500/50 bg-green-500/10 py-2">
                  <AlertDescription className="text-green-300 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> {success}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Nom / Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Prénom</label>
                <Input
                  name="firstName"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500 h-9 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Nom</label>
                <Input
                  name="lastName"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500 h-9 text-sm"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">Nom d'utilisateur</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                <Input
                  name="username"
                  placeholder="jdupont"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500 h-9 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                <Input
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500 h-9 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500 h-9 text-sm"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">Confirmer le mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500 h-9 text-sm"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-10 rounded-xl shadow-lg shadow-purple-500/20 mt-1"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Création...</>
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm">
            <span className="text-gray-500">Déjà un compte ?</span>{' '}
            <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Se connecter
            </Link>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 text-xs mt-5"
        >
          © 2024 K.I.T — Kairos Innovation Technologies
        </motion.p>
      </div>
    </div>
  )
}
