// Helper SQL brut via Prisma $queryRawUnsafe / $executeRawUnsafe
// Utilisé pour les modèles non-générés dans le client Prisma (Lesson, contentUrl)

import { prisma } from './prisma'

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  file_url: string | null
  duration: number
  order: number
  is_free: boolean
  is_published: boolean
  created_at: Date
  updated_at: Date
}

// Génère un CUID-like unique
function genId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 9)
  return `c${timestamp}${random}`
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export async function getLessons(courseId: string, onlyPublished = true): Promise<Lesson[]> {
  const filter = onlyPublished ? `AND is_published = true` : ''
  return prisma.$queryRawUnsafe<Lesson[]>(
    `SELECT * FROM lessons WHERE course_id = '${escStr(courseId)}' ${filter} ORDER BY "order" ASC, created_at ASC`
  )
}

export async function getLesson(id: string): Promise<Lesson | null> {
  const rows = await prisma.$queryRawUnsafe<Lesson[]>(
    `SELECT * FROM lessons WHERE id = '${escStr(id)}' LIMIT 1`
  )
  return rows[0] ?? null
}

export async function createLesson(data: {
  courseId: string
  title: string
  description?: string
  content?: string
  videoUrl?: string
  fileUrl?: string
  duration?: number
  order?: number
  isFree?: boolean
  isPublished?: boolean
}): Promise<Lesson> {
  const id = genId()
  const now = new Date().toISOString()
  const rows = await prisma.$queryRawUnsafe<Lesson[]>(`
    INSERT INTO lessons (id, course_id, title, description, content, video_url, file_url, duration, "order", is_free, is_published, created_at, updated_at)
    VALUES (
      '${id}',
      '${escStr(data.courseId)}',
      '${escStr(data.title)}',
      ${data.description ? `'${escStr(data.description)}'` : 'NULL'},
      ${data.content ? `'${escStr(data.content)}'` : 'NULL'},
      ${data.videoUrl ? `'${escStr(data.videoUrl)}'` : 'NULL'},
      ${data.fileUrl ? `'${escStr(data.fileUrl)}'` : 'NULL'},
      ${data.duration ?? 0},
      ${data.order ?? 0},
      ${data.isFree ? 'true' : 'false'},
      ${data.isPublished !== false ? 'true' : 'false'},
      '${now}',
      '${now}'
    )
    RETURNING *
  `)
  return rows[0]
}

export async function updateLesson(id: string, data: Partial<{
  title: string
  description: string
  content: string
  videoUrl: string
  fileUrl: string
  duration: number
  order: number
  isFree: boolean
  isPublished: boolean
}>): Promise<Lesson> {
  const sets: string[] = [`updated_at = '${new Date().toISOString()}'`]
  if (data.title !== undefined)       sets.push(`title = '${escStr(data.title)}'`)
  if (data.description !== undefined) sets.push(`description = ${data.description ? `'${escStr(data.description)}'` : 'NULL'}`)
  if (data.content !== undefined)     sets.push(`content = ${data.content ? `'${escStr(data.content)}'` : 'NULL'}`)
  if (data.videoUrl !== undefined)    sets.push(`video_url = ${data.videoUrl ? `'${escStr(data.videoUrl)}'` : 'NULL'}`)
  if (data.fileUrl !== undefined)     sets.push(`file_url = ${data.fileUrl ? `'${escStr(data.fileUrl)}'` : 'NULL'}`)
  if (data.duration !== undefined)    sets.push(`duration = ${data.duration}`)
  if (data.order !== undefined)       sets.push(`"order" = ${data.order}`)
  if (data.isFree !== undefined)      sets.push(`is_free = ${data.isFree}`)
  if (data.isPublished !== undefined) sets.push(`is_published = ${data.isPublished}`)

  const rows = await prisma.$queryRawUnsafe<Lesson[]>(
    `UPDATE lessons SET ${sets.join(', ')} WHERE id = '${escStr(id)}' RETURNING *`
  )
  return rows[0]
}

export async function deleteLesson(id: string): Promise<void> {
  await prisma.$executeRawUnsafe(`DELETE FROM lessons WHERE id = '${escStr(id)}'`)
}

// ─── Book contentUrl ──────────────────────────────────────────────────────────

export async function updateBookContentUrl(bookId: string, contentUrl: string | null): Promise<void> {
  const val = contentUrl ? `'${escStr(contentUrl)}'` : 'NULL'
  await prisma.$executeRawUnsafe(
    `UPDATE books SET content_url = ${val}, updated_at = NOW() WHERE id = '${escStr(bookId)}'`
  )
}

export async function getBookContentUrl(bookId: string): Promise<string | null> {
  const rows = await prisma.$queryRawUnsafe<{ content_url: string | null }[]>(
    `SELECT content_url FROM books WHERE id = '${escStr(bookId)}' LIMIT 1`
  )
  return rows[0]?.content_url ?? null
}

// ─── Utilitaire ───────────────────────────────────────────────────────────────

function escStr(s: string): string {
  return s.replace(/'/g, "''")
}
