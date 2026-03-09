import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLesson, updateLesson, deleteLesson, getLessons } from '@/lib/db'

async function checkOwnership(lessonId: string, userId: string, role: string) {
  const lesson = await getLesson(lessonId)
  if (!lesson) return { error: 'Leçon non trouvée', status: 404 }

  const course = await prisma.course.findUnique({ where: { id: lesson.course_id } })
  if (!course) return { error: 'Cours non trouvé', status: 404 }

  if (course.instructorId !== userId && !['ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return { error: 'Accès refusé', status: 403 }
  }

  return { lesson }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { error, status } = await checkOwnership(params.id, session.user.id, session.user.role)
    if (error) return NextResponse.json({ error }, { status })

    const body = await request.json()
    const updated = await updateLesson(params.id, {
      title: body.title,
      description: body.description,
      content: body.content,
      videoUrl: body.videoUrl,
      fileUrl: body.fileUrl,
      duration: body.duration !== undefined ? parseInt(body.duration) : undefined,
      order: body.order !== undefined ? parseInt(body.order) : undefined,
      isFree: body.isFree,
      isPublished: body.isPublished,
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { lesson, error, status } = await checkOwnership(params.id, session.user.id, session.user.role)
    if (error) return NextResponse.json({ error }, { status })

    await deleteLesson(params.id)

    // Décrémenter le compteur de leçons
    await prisma.course.update({
      where: { id: lesson!.course_id },
      data: { lessonsCount: { decrement: 1 } }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
