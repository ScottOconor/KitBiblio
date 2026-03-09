import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const instructorId = session.user.id

    const [
      totalBooks,
      publishedBooks,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalPurchasesData,
    ] = await Promise.all([
      prisma.book.count({ where: { authorId: instructorId } }),
      prisma.book.count({ where: { authorId: instructorId, isPublished: true } }),
      prisma.course.count({ where: { instructorId } }),
      prisma.course.count({ where: { instructorId, isPublished: true } }),
      prisma.enrollment.count({
        where: { course: { instructorId } }
      }),
      prisma.purchase.findMany({
        where: {
          OR: [
            { course: { instructorId } },
            { book: { authorId: instructorId } },
          ],
          status: 'COMPLETED'
        },
        select: { amount: true }
      }),
    ])

    const totalRevenue = totalPurchasesData.reduce((sum, p) => sum + p.amount, 0)
    const totalPurchases = totalPurchasesData.length

    return NextResponse.json({
      totalBooks,
      publishedBooks,
      draftBooks: totalBooks - publishedBooks,
      totalCourses,
      publishedCourses,
      draftCourses: totalCourses - publishedCourses,
      totalEnrollments,
      totalPurchases,
      totalRevenue,
    })
  } catch (error) {
    console.error('Error fetching instructor stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
