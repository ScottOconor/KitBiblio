import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLessons } from '@/lib/db'

// GET — leçons d'un cours (publiques gratuites pour tous, toutes pour inscrits/instructeur)
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Vérifier si l'utilisateur est inscrit ou est l'instructeur/admin
    let isEnrolled = false
    if (session) {
      const course = await prisma.course.findUnique({ where: { id: params.id } })
      if (course?.instructorId === session.user.id || ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
        isEnrolled = true
      } else {
        const enrollment = await prisma.enrollment.findFirst({
          where: { userId: session.user.id, courseId: params.id }
        })
        isEnrolled = !!enrollment
      }
    }

    // Inscrits/instructeurs voient tout, les autres voient seulement les leçons gratuites
    const lessons = await getLessons(params.id, false)
    const filtered = isEnrolled
      ? lessons.filter(l => l.is_published)
      : lessons.filter(l => l.is_free && l.is_published)

    return NextResponse.json({ lessons: filtered, isEnrolled })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
