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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const existing = await prisma.book.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Livre non trouvé' }, { status: 404 })
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

    // Regenerate slug only if title changed
    const slug = title && title !== existing.title ? generateSlug(title) : existing.slug

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        slug,
        ...(description !== undefined && { description }),
        ...(shortDesc !== undefined && { shortDesc: shortDesc || null }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
        ...(categoryId !== undefined && { categoryId }),
        ...(language !== undefined && { language }),
        ...(pages !== undefined && { pages: pages ? parseInt(pages) : null }),
        ...(format !== undefined && { format: format.toUpperCase() }),
        ...(isbn !== undefined && { isbn: isbn || null }),
        ...(publisher !== undefined && { publisher: publisher || null }),
        ...(paymentLink !== undefined && { paymentLink: paymentLink || null }),
        ...(isPublished !== undefined && { isPublished }),
        ...(isFree !== undefined && { isFree }),
        ...(cover !== undefined && { cover: cover || null }),
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du livre' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const existing = await prisma.book.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Livre non trouvé' }, { status: 404 })
    }

    await prisma.book.delete({ where: { id } })

    return NextResponse.json({ message: 'Livre supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression du livre' }, { status: 500 })
  }
}
