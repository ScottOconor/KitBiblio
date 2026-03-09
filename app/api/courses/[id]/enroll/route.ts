import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET — vérifie si l'utilisateur connecté est inscrit
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ enrolled: false })

    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, courseId: params.id }
    })

    return NextResponse.json({ enrolled: !!enrollment, enrollment })
  } catch {
    return NextResponse.json({ enrolled: false })
  }
}

// POST — inscription gratuite (ou marquer comme inscrit après paiement)
export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Connexion requise' }, { status: 401 })
    }

    // Vérifier le cours
    const course = await prisma.course.findUnique({ where: { id: params.id } })
    if (!course) {
      return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 })
    }
    if (!course.isPublished) {
      return NextResponse.json({ error: 'Ce cours n\'est pas encore disponible' }, { status: 403 })
    }

    // Déjà inscrit ?
    const existing = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, courseId: params.id }
    })
    if (existing) {
      return NextResponse.json({ enrolled: true, enrollment: existing })
    }

    // Cours payant → vérification (pour l'instant, on accepte tout – le vrai check serait via webhook Lygos)
    // Pour les cours gratuits, inscription directe
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: params.id,
        status: 'ACTIVE',
        overallProgress: 0,
      }
    })

    // Incrémenter le compteur d'étudiants
    await prisma.course.update({
      where: { id: params.id },
      data: { studentsCount: { increment: 1 } }
    })

    return NextResponse.json({ enrolled: true, enrollment }, { status: 201 })
  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 })
  }
}
