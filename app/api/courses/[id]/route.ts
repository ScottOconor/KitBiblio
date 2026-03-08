import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        instructor: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true, bio: true } },
        reviews: {
          include: { user: { select: { id: true, username: true, firstName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { enrollments: true, reviews: true, bookmarks: true } }
      }
    })

    if (!course) return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 })
    return NextResponse.json(course)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
