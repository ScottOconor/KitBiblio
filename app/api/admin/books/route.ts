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
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        isPublished: true,
        isFree: true,
        downloads: true,
        createdAt: true,
        category: {
          select: { id: true, name: true }
        },
        author: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching admin books:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
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
      pages,
      format,
      isbn,
      publisher,
      paymentLink,
      isPublished,
      isFree,
      cover
    } = body

    const slug = generateSlug(title)

    const book = await prisma.book.create({
      data: {
        title,
        slug,
        description,
        shortDesc: shortDesc || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        categoryId,
        language: language || 'fr',
        pages: pages ? parseInt(pages) : null,
        format: format ? format.toUpperCase() : 'PDF',
        isbn: isbn || null,
        publisher: publisher || null,
        paymentLink: paymentLink || null,
        isPublished: isPublished ?? false,
        isFree: isFree ?? false,
        cover: cover || null,
        authorId: session.user.id
      }
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du livre' }, { status: 500 })
  }
}
