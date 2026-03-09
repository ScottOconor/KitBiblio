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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: session.user.id },
      select: {
        id: true,
        title: true,
        price: true,
        isPublished: true,
        isFree: true,
        level: true,
        duration: true,
        lessonsCount: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, purchases: true, reviews: true } },
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching instructor courses:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title, description, shortDesc, price, originalPrice,
      categoryId, language, level, duration, lessonsCount,
      hasCertificate, paymentLink, isPublished, isFree, thumbnail
    } = body

    if (!title || !description || !categoryId) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const baseSlug = generateSlug(title)
    const existing = await prisma.course.findFirst({ where: { slug: { startsWith: baseSlug } } })
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDesc: shortDesc || null,
        price: parseFloat(price) || 0,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        categoryId,
        language: language || 'fr',
        level: level ? level.toUpperCase() : 'BEGINNER',
        duration: duration ? parseInt(duration) : 0,
        lessonsCount: lessonsCount ? parseInt(lessonsCount) : 0,
        hasCertificate: hasCertificate ?? false,
        paymentLink: paymentLink || null,
        isPublished: isPublished ?? false,
        isFree: isFree ?? false,
        thumbnail: thumbnail || null,
        instructorId: session.user.id
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating instructor course:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du cours' }, { status: 500 })
  }
}
