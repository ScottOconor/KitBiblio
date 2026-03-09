import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function getBookAndCheckOwner(id: string, userId: string) {
  const book = await prisma.book.findUnique({ where: { id } })
  if (!book) return { error: 'Livre non trouvé', status: 404 }
  if (book.authorId !== userId) return { error: 'Accès refusé', status: 403 }
  return { book }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { book, error, status } = await getBookAndCheckOwner(params.id, session.user.id)
    if (error) return NextResponse.json({ error }, { status })

    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { error, status } = await getBookAndCheckOwner(params.id, session.user.id)
    if (error) return NextResponse.json({ error }, { status })

    const body = await request.json()
    const updated = await prisma.book.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.shortDesc !== undefined && { shortDesc: body.shortDesc }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.language !== undefined && { language: body.language }),
        ...(body.pages !== undefined && { pages: body.pages ? parseInt(body.pages) : null }),
        ...(body.format !== undefined && { format: body.format.toUpperCase() }),
        ...(body.isbn !== undefined && { isbn: body.isbn || null }),
        ...(body.publisher !== undefined && { publisher: body.publisher || null }),
        ...(body.paymentLink !== undefined && { paymentLink: body.paymentLink || null }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.isFree !== undefined && { isFree: body.isFree }),
        ...(body.cover !== undefined && { cover: body.cover || null }),
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { error, status } = await getBookAndCheckOwner(params.id, session.user.id)
    if (error) return NextResponse.json({ error }, { status })

    await prisma.book.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
