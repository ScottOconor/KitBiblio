import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLessons, createLesson } from '@/lib/db'

// GET — toutes les leçons du cours (instructeur propriétaire)
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const course = await prisma.course.findUnique({ where: { id: params.id } })
    if (!course) return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 })
    if (course.instructorId !== session.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const lessons = await getLessons(params.id, false)
    return NextResponse.json(lessons)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST — créer une leçon
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const course = await prisma.course.findUnique({ where: { id: params.id } })
    if (!course) return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 })
    if (course.instructorId !== session.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const lesson = await createLesson({
      courseId: params.id,
      title: body.title,
      description: body.description,
      content: body.content,
      videoUrl: body.videoUrl,
      fileUrl: body.fileUrl,
      duration: body.duration ? parseInt(body.duration) : 0,
      order: body.order ? parseInt(body.order) : 0,
      isFree: body.isFree ?? false,
      isPublished: body.isPublished !== false,
    })

    // Mettre à jour le compteur de leçons
    await prisma.course.update({
      where: { id: params.id },
      data: { lessonsCount: { increment: 1 } }
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la leçon' }, { status: 500 })
  }
}
