import { NextRequest, NextResponse } from 'next/server'
import { getBookContentUrl } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contentUrl = await getBookContentUrl(params.id)
    return NextResponse.json({ contentUrl })
  } catch {
    return NextResponse.json({ contentUrl: null })
  }
}
