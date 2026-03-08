import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const existing = await prisma.course.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 })
    }

    const body = await request.json()
    const {
      title,
      description,
      shortDesc,
      price,
      originalPrice,
      categoryId,
      language,
      level,
      duration,
      lessonsCount,
      hasCertificate,
      paymentLink,
      isPublished,
      isFree,
      thumbnail
    } = body

    const slug = title && title !== existing.title ? generateSlug(title) : existing.slug

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        slug,
        ...(description !== undefined && { description }),
        ...(shortDesc !== undefined && { shortDesc: shortDesc || null }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
        ...(categoryId !== undefined && { categoryId }),
        ...(language !== undefined && { language }),
        ...(level !== undefined && { level: level.toUpperCase() }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(lessonsCount !== undefined && { lessonsCount: parseInt(lessonsCount) }),
        ...(hasCertificate !== undefined && { hasCertificate }),
        ...(paymentLink !== undefined && { paymentLink: paymentLink || null }),
        ...(isPublished !== undefined && { isPublished }),
        ...(isFree !== undefined && { isFree }),
        ...(thumbnail !== undefined && { thumbnail: thumbnail || null }),
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du cours' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const existing = await prisma.course.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 })
    }

    await prisma.course.delete({ where: { id } })

    return NextResponse.json({ message: 'Cours supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression du cours' }, { status: 500 })
  }
}
