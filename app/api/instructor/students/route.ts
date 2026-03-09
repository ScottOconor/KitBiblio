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

    const enrollments = await prisma.enrollment.findMany({
      where: { course: { instructorId: session.user.id } },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            avatar: true,
          }
        },
        course: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Error fetching instructor students:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
