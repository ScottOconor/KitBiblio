import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function getCourseAndCheckOwner(id: string, userId: string) {
  const course = await prisma.course.findUnique({ where: { id } })
  if (!course) return { error: 'Cours non trouvé', status: 404 }
  if (course.instructorId !== userId) return { error: 'Accès refusé', status: 403 }
  return { course }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { course, error, status } = await getCourseAndCheckOwner(params.id, session.user.id)
    if (error) return NextResponse.json({ error }, { status })

    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { error, status } = await getCourseAndCheckOwner(params.id, session.user.id)
    if (error) return NextResponse.json({ error }, { status })

    const body = await request.json()
    const updated = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.shortDesc !== undefined && { shortDesc: body.shortDesc }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.language !== undefined && { language: body.language }),
        ...(body.level !== undefined && { level: body.level.toUpperCase() }),
        ...(body.duration !== undefined && { duration: parseInt(body.duration) }),
        ...(body.lessonsCount !== undefined && { lessonsCount: parseInt(body.lessonsCount) }),
        ...(body.hasCertificate !== undefined && { hasCertificate: body.hasCertificate }),
        ...(body.paymentLink !== undefined && { paymentLink: body.paymentLink || null }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.isFree !== undefined && { isFree: body.isFree }),
        ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail || null }),
      }
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { error, status } = await getCourseAndCheckOwner(params.id, session.user.id)
    if (error) return NextResponse.json({ error }, { status })

    await prisma.course.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
