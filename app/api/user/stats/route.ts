import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const userId = session.user.id

    const [enrollments, bookPurchases, completedEnrollments, bookmarks] = await Promise.all([
      prisma.enrollment.count({ where: { userId } }),
      prisma.purchase.count({ where: { userId, bookId: { not: null }, status: 'COMPLETED' } }),
      prisma.enrollment.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.bookmark.count({ where: { userId } }),
    ])

    const progressData = await prisma.progress.findMany({ where: { userId, courseId: { not: null } } })
    const totalProgress = progressData.length > 0
      ? progressData.reduce((acc, p) => acc + p.progress, 0) / progressData.length
      : 0

    return NextResponse.json({
      totalCourses: enrollments,
      totalBooks: bookPurchases,
      completedCourses: completedEnrollments,
      totalProgress: Math.round(totalProgress),
      certificates: completedEnrollments,
      bookmarks,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
