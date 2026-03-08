import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const updateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().min(3).optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true, email: true, username: true, firstName: true, lastName: true,
        avatar: true, bio: true, role: true, isVerified: true, createdAt: true,
        _count: { select: { enrollments: true, purchases: true, reviews: true } }
      }
    })

    if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const data = updateSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (data.firstName !== undefined) updateData.firstName = data.firstName
    if (data.lastName !== undefined) updateData.lastName = data.lastName
    if (data.username !== undefined) updateData.username = data.username
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.avatar !== undefined) updateData.avatar = data.avatar

    if (data.newPassword && data.currentPassword) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
      const valid = await bcrypt.compare(data.currentPassword, user.password)
      if (!valid) return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 })
      updateData.password = await bcrypt.hash(data.newPassword, 12)
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, email: true, username: true, firstName: true, lastName: true, avatar: true, bio: true, role: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
