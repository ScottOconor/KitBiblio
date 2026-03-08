import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: { select: { id: true, username: true, firstName: true, lastName: true, avatar: true, bio: true } },
        reviews: {
          include: { user: { select: { id: true, username: true, firstName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { purchases: true, reviews: true, bookmarks: true } }
      }
    })

    if (!book) return NextResponse.json({ error: 'Livre non trouvé' }, { status: 404 })
    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
