import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const [users, books, courses, purchases, enrollments] = await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.course.count(),
      prisma.purchase.findMany({ where: { status: 'COMPLETED' }, select: { amount: true } }),
      prisma.enrollment.count(),
    ])

    const totalRevenue = purchases.reduce((acc, p) => acc + p.amount, 0)

    return NextResponse.json({ users, books, courses, totalRevenue, enrollments, purchases: purchases.length })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
