import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const userId = session.user.id

    const [enrollments, purchases] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: { course: { select: { id: true, title: true, thumbnail: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      prisma.purchase.findMany({
        where: { userId, bookId: { not: null }, status: 'COMPLETED' },
        include: { book: { select: { id: true, title: true, cover: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    const activity = [
      ...enrollments.map(e => ({
        id: e.id,
        type: 'course' as const,
        title: e.course.title,
        progress: e.overallProgress,
        lastAccessed: e.updatedAt.toISOString(),
        thumbnail: e.course.thumbnail,
      })),
      ...purchases.map(p => ({
        id: p.id,
        type: 'book' as const,
        title: p.book!.title,
        lastAccessed: p.createdAt.toISOString(),
        thumbnail: p.book!.cover,
      })),
    ].sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()).slice(0, 5)

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Activity error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
