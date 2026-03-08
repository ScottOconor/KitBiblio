import postgres from 'postgres'
import { createHash } from 'crypto'

// Connexion directe PostgreSQL
const sql = postgres({
  host: '/var/run/postgresql',
  database: 'bookshelf_db',
  username: 'automate',
})

// Hash password simple (bcrypt pas disponible en ESM natif, on simule)
// On va utiliser le hash précalculé de 'admin2024' avec bcrypt
// $2a$12$... = bcrypt('admin2024', 12) et bcrypt('user2024', 12)
const ADMIN_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm'  // "password"
const USER_HASH  = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm'  // "password"

// On va générer les vrais hash via bcryptjs CommonJS
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bcrypt = require('/home/automate/Téléchargements/BookShelf-main/node_modules/bcryptjs/index.js')

// Simple CUID-like ID
let counter = 0
function cuid() {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `c${ts}${(++counter).toString(36)}${rand}`
}

async function main() {
  console.log('🌱 Début du seed...\n')

  const adminHash = bcrypt.hashSync('admin2024', 12)
  const userHash  = bcrypt.hashSync('user2024', 12)

  // ── CATEGORIES ──
  const categories = [
    { name: 'Développement Personnel', slug: 'developpement-personnel', icon: '🚀', color: '#3B82F6', type: 'books', sortOrder: 1 },
    { name: 'Santé & Bien-être', slug: 'sante-bien-etre', icon: '💪', color: '#10B981', type: 'books', sortOrder: 2 },
    { name: 'Business & Finance', slug: 'business-finance', icon: '💰', color: '#F59E0B', type: 'books', sortOrder: 3 },
    { name: 'Spiritualité', slug: 'spiritualite', icon: '🙏', color: '#8B5CF6', type: 'books', sortOrder: 4 },
    { name: 'Romance', slug: 'romance', icon: '❤️', color: '#EC4899', type: 'books', sortOrder: 5 },
    { name: 'Science-Fiction', slug: 'science-fiction', icon: '🚀', color: '#06B6D4', type: 'books', sortOrder: 6 },
    { name: 'Suspense', slug: 'suspense', icon: '🔍', color: '#6B7280', type: 'books', sortOrder: 7 },
    { name: 'Fantasy', slug: 'fantasy', icon: '🐉', color: '#7C3AED', type: 'books', sortOrder: 8 },
    { name: 'Histoire', slug: 'histoire', icon: '📜', color: '#92400E', type: 'books', sortOrder: 9 },
    { name: 'Développement Web', slug: 'developpement-web', icon: '💻', color: '#3B82F6', type: 'courses', sortOrder: 10 },
    { name: 'IA & Data Science', slug: 'ia-data-science', icon: '🤖', color: '#8B5CF6', type: 'courses', sortOrder: 11 },
    { name: 'Design', slug: 'design', icon: '🎨', color: '#EC4899', type: 'courses', sortOrder: 12 },
    { name: 'Marketing Digital', slug: 'marketing-digital', icon: '📱', color: '#F59E0B', type: 'courses', sortOrder: 13 },
    { name: 'Business', slug: 'business', icon: '📊', color: '#10B981', type: 'courses', sortOrder: 14 },
    { name: 'Finance', slug: 'finance', icon: '💵', color: '#F97316', type: 'courses', sortOrder: 15 },
    { name: 'Cybersécurité', slug: 'cybersecurite', icon: '🔐', color: '#EF4444', type: 'courses', sortOrder: 17 },
  ]

  const catMap = {}
  for (const cat of categories) {
    const now = new Date().toISOString()
    const id = cuid()
    await sql`
      INSERT INTO categories (id, name, slug, icon, color, type, "isActive", "sortOrder", "createdAt", "updatedAt")
      VALUES (${id}, ${cat.name}, ${cat.slug}, ${cat.icon}, ${cat.color}, ${cat.type}, true, ${cat.sortOrder}, ${now}, ${now})
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id, slug
    `
    const [row] = await sql`SELECT id FROM categories WHERE slug = ${cat.slug}`
    catMap[cat.slug] = row.id
    process.stdout.write(`  ✅ ${cat.name}\n`)
  }

  // ── USERS ──
  const now = new Date().toISOString()
  const adminId = cuid()
  await sql`
    INSERT INTO users (id, email, username, password, "firstName", "lastName", role, "isActive", "isVerified", "createdAt", "updatedAt")
    VALUES (${adminId}, 'admin@bookshelf.kit', 'admin_kit', ${adminHash}, 'Admin', 'K.I.T', 'ADMIN', true, true, ${now}, ${now})
    ON CONFLICT (email) DO UPDATE SET "updatedAt" = EXCLUDED."updatedAt"
    RETURNING id
  `
  const [adminRow] = await sql`SELECT id FROM users WHERE email = 'admin@bookshelf.kit'`
  const adminDbId = adminRow.id

  const inst1Id = cuid()
  await sql`
    INSERT INTO users (id, email, username, password, "firstName", "lastName", role, "isActive", "isVerified", "createdAt", "updatedAt")
    VALUES (${inst1Id}, 'marie@bookshelf.kit', 'marie_dubois', ${userHash}, 'Marie', 'Dubois', 'INSTRUCTOR', true, true, ${now}, ${now})
    ON CONFLICT (email) DO UPDATE SET "updatedAt" = EXCLUDED."updatedAt"
  `
  const [inst1Row] = await sql`SELECT id FROM users WHERE email = 'marie@bookshelf.kit'`
  const inst1DbId = inst1Row.id

  const inst2Id = cuid()
  await sql`
    INSERT INTO users (id, email, username, password, "firstName", "lastName", role, "isActive", "isVerified", "createdAt", "updatedAt")
    VALUES (${inst2Id}, 'jean@bookshelf.kit', 'dr_jean_martin', ${userHash}, 'Jean', 'Martin', 'INSTRUCTOR', true, true, ${now}, ${now})
    ON CONFLICT (email) DO UPDATE SET "updatedAt" = EXCLUDED."updatedAt"
  `
  const [inst2Row] = await sql`SELECT id FROM users WHERE email = 'jean@bookshelf.kit'`
  const inst2DbId = inst2Row.id

  const userId = cuid()
  await sql`
    INSERT INTO users (id, email, username, password, "firstName", "lastName", role, "isActive", "isVerified", "createdAt", "updatedAt")
    VALUES (${userId}, 'user@bookshelf.kit', 'testuser', ${userHash}, 'Test', 'User', 'USER', true, false, ${now}, ${now})
    ON CONFLICT (email) DO UPDATE SET "updatedAt" = EXCLUDED."updatedAt"
  `
  const [userRow] = await sql`SELECT id FROM users WHERE email = 'user@bookshelf.kit'`
  const userDbId = userRow.id
  console.log('  ✅ Utilisateurs créés\n')

  // ── BOOKS ──
  const books = [
    { title: 'MIRACLE MORNING', slug: 'miracle-morning', desc: 'Quel que soit le stade où vous vous trouvez dans votre vie, je suis persuadé que nous souhaitons avoir une vie meilleure et nous améliorer.', shortDesc: 'La méthode révolutionnaire pour transformer votre matin.', cover: '/Miracle_Morning.png', price: 1500, currency: 'XAF', format: 'PDF', catSlug: 'developpement-personnel', paymentLink: 'https://pay.lygosapp.com/link/0c838daa-78c3-4649-bfab-f509fc87eb69', rating: 4.9, downloads: 1250 },
    { title: "ATTEINDRE L'EXCELLENCE", slug: 'atteindre-excellence', desc: 'Maîtrisez les fondamentaux du développement de soi avec des stratégies pratiques et concrètes.', shortDesc: 'Stratégies concrètes pour atteindre l\'excellence.', cover: '/atteindre.jpg', price: 2500, currency: 'XAF', format: 'PDF', catSlug: 'developpement-personnel', paymentLink: 'https://pay.lygosapp.com/link/5de67adb-becb-4885-a573-d6f458219e04', rating: 4.8, downloads: 980 },
    { title: 'AIMEZ VOTRE SEXUALITÉ', slug: 'aimez-votre-sexualite', desc: 'Intelligence Sexuelle Et Intelligence Émotionnelle Pour Profiter De Votre Sexualité.', shortDesc: 'Guide pour une sexualité épanouie et intelligente.', cover: '/aimer.jpg', price: 1800, currency: 'XAF', format: 'PDF', catSlug: 'sante-bien-etre', paymentLink: 'https://pay.lygosapp.com/link/f7465b20-8408-47af-bb85-a20045f54266', rating: 4.7, downloads: 760 },
    { title: 'Voyage aux Étoiles', slug: 'voyage-aux-etoiles', desc: 'Une aventure épique à travers l\'univers où chaque page révèle de nouveaux mondes fascinants.', shortDesc: 'SF épique dans les étoiles.', price: 12.99, currency: 'EUR', format: 'EPUB', catSlug: 'science-fiction', paymentLink: 'https://payment.example.com/book/2', rating: 4.5, downloads: 320 },
    { title: 'Philosophie du Bonheur Contemporain', slug: 'philosophie-bonheur', desc: 'Réflexions profondes sur le sens de la vie et les clés du bien-être dans notre société moderne.', shortDesc: 'Méditations sur le bonheur à l\'ère moderne.', price: 14.99, currency: 'EUR', format: 'EPUB', catSlug: 'spiritualite', paymentLink: 'https://payment.example.com/book/4', rating: 4.6, downloads: 440 },
    { title: 'Millionnaire Avant 30 Ans', slug: 'millionnaire-avant-30', desc: 'Les stratégies concrètes utilisées par de jeunes entrepreneurs pour bâtir leur richesse.', shortDesc: 'Guide pratique pour construire sa richesse tôt.', price: 22.99, currency: 'EUR', format: 'PDF', catSlug: 'business-finance', paymentLink: 'https://payment.example.com/book/14', rating: 4.8, downloads: 890 },
    { title: 'Le Royaume des Dragons Oubliés', slug: 'royaume-dragons', desc: 'Plongez dans un monde médiéval fantastique où magie et dragons règnent en maîtres.', shortDesc: 'Fantasy épique avec dragons et magie.', price: 15.99, currency: 'EUR', format: 'EPUB', catSlug: 'fantasy', paymentLink: 'https://payment.example.com/book/11', rating: 4.7, downloads: 560 },
    { title: 'Minuit dans les Montagnes Maudites', slug: 'minuit-montagnes', desc: 'Un suspense haletant dans les Alpes où chaque recoin cache un secret mortel.', shortDesc: 'Thriller glaçant dans les Alpes.', price: 11.99, currency: 'EUR', format: 'EPUB', catSlug: 'suspense', paymentLink: 'https://payment.example.com/book/6', rating: 4.5, downloads: 380 },
    { title: "Un Cœur Brisé, Une Âme Guérie", slug: 'coeur-brise-ame-guerie', desc: 'Une romance déchirante qui explore la rédemption et la puissance de l\'amour véritable.', shortDesc: 'Romance touchante sur l\'amour et la guérison.', price: 10.99, currency: 'EUR', format: 'EPUB', catSlug: 'romance', paymentLink: 'https://payment.example.com/book/7', rating: 4.6, downloads: 410 },
    { title: "Histoire de France : Les Grandes Batailles", slug: 'histoire-france-batailles', desc: 'Revivez les moments clés qui ont façonné la France à travers des récits historiques captivants.', shortDesc: 'Les batailles qui ont façonné la France.', price: 16.99, currency: 'EUR', format: 'PDF', catSlug: 'histoire', paymentLink: 'https://payment.example.com/book/12', rating: 4.7, downloads: 620 },
  ]

  for (const b of books) {
    const id = cuid()
    const ts = new Date().toISOString()
    await sql`
      INSERT INTO books (id, title, slug, description, "shortDesc", cover, price, currency, format, "categoryId", "authorId", "paymentLink", rating, downloads, "isPublished", "createdAt", "updatedAt")
      VALUES (${id}, ${b.title}, ${b.slug}, ${b.desc}, ${b.shortDesc}, ${b.cover || null}, ${b.price}, ${b.currency}, ${b.format}::"BookFormat", ${catMap[b.catSlug]}, ${adminDbId}, ${b.paymentLink}, ${b.rating}, ${b.downloads}, true, ${ts}, ${ts})
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    `
    console.log(`  📚 ${b.title}`)
  }

  // ── COURSES ──
  const courses = [
    { title: 'Développement Web Complet', slug: 'developpement-web-complet', desc: 'Apprenez HTML, CSS, JavaScript, React et Node.js de zéro à expert. Projets pratiques inclus.', shortDesc: 'De zéro à expert en développement web.', price: 89.99, origPrice: 199.99, level: 'BEGINNER', duration: 2520, lessons: 156, students: 15420, rating: 4.8, cert: true, catSlug: 'developpement-web', instrId: inst1DbId, paymentLink: 'https://payment.example.com/course/1' },
    { title: 'Machine Learning & Intelligence Artificielle', slug: 'machine-learning-ia', desc: 'Maîtrisez les algorithmes de machine learning et deep learning avec Python et TensorFlow.', shortDesc: 'ML et IA avec Python.', price: 129.99, origPrice: 299.99, level: 'INTERMEDIATE', duration: 3480, lessons: 234, students: 12350, rating: 4.9, cert: true, catSlug: 'ia-data-science', instrId: inst2DbId, paymentLink: 'https://payment.example.com/course/2' },
    { title: 'Design UI/UX Moderne avec Figma', slug: 'design-uiux-figma', desc: 'Créez des interfaces magnifiques et intuitives. Maîtrisez Figma et les principes UX.', shortDesc: 'Maîtrisez le design moderne avec Figma.', price: 69.99, origPrice: 149.99, level: 'BEGINNER', duration: 1680, lessons: 98, students: 8920, rating: 4.7, cert: true, catSlug: 'design', instrId: inst1DbId, paymentLink: 'https://payment.example.com/course/3' },
    { title: 'Marketing Digital & Réseaux Sociaux', slug: 'marketing-digital-reseaux', desc: 'Développez des stratégies marketing efficaces. SEO, réseaux sociaux et analytics.', shortDesc: 'Stratégies marketing modernes.', price: 79.99, origPrice: 179.99, level: 'INTERMEDIATE', duration: 2100, lessons: 127, students: 10230, rating: 4.6, cert: true, catSlug: 'marketing-digital', instrId: inst1DbId, paymentLink: 'https://payment.example.com/course/4' },
    { title: 'Python pour Débutants', slug: 'python-debutants', desc: 'Apprenez Python, le langage de programmation le plus demandé. Projets pratiques.', shortDesc: 'Python de zéro à maîtrise.', price: 59.99, origPrice: 129.99, level: 'BEGINNER', duration: 1800, lessons: 112, students: 18500, rating: 4.9, cert: true, catSlug: 'developpement-web', instrId: inst2DbId, paymentLink: 'https://payment.example.com/course/5' },
    { title: 'Finance Personnelle & Investissement', slug: 'finance-personnelle', desc: 'Gérez votre argent intelligemment. Investissement, bourse, immobilier et patrimoine.', shortDesc: 'Gérez et faites fructifier votre argent.', price: 99.99, origPrice: 219.99, level: 'BEGINNER', duration: 1440, lessons: 89, students: 7640, rating: 4.8, cert: true, catSlug: 'finance', instrId: inst2DbId, paymentLink: 'https://payment.example.com/course/6' },
    { title: 'Cybersécurité & Ethical Hacking', slug: 'cybersecurite-hacking', desc: 'Protégez les systèmes informatiques. Hacking éthique, pentest et sécurité des réseaux.', shortDesc: 'Sécurité informatique et ethical hacking.', price: 139.99, origPrice: 319.99, level: 'ADVANCED', duration: 3120, lessons: 201, students: 7890, rating: 4.9, cert: true, catSlug: 'cybersecurite', instrId: inst2DbId, paymentLink: 'https://payment.example.com/course/7' },
    { title: 'Business & Entrepreneuriat', slug: 'business-entrepreneuriat', desc: 'Lancez et développez votre entreprise. Business model, financement et management.', shortDesc: 'De l\'idée à l\'entreprise qui réussit.', price: 99.99, origPrice: 229.99, level: 'INTERMEDIATE', duration: 2280, lessons: 143, students: 18920, rating: 4.8, cert: true, catSlug: 'business', instrId: inst1DbId, paymentLink: 'https://payment.example.com/course/8' },
  ]

  for (const c of courses) {
    const id = cuid()
    const ts = new Date().toISOString()
    await sql`
      INSERT INTO courses (id, title, slug, description, "shortDesc", price, "originalPrice", level, duration, "lessonsCount", "studentsCount", rating, "hasCertificate", "categoryId", "instructorId", "paymentLink", "isPublished", "createdAt", "updatedAt")
      VALUES (${id}, ${c.title}, ${c.slug}, ${c.desc}, ${c.shortDesc}, ${c.price}, ${c.origPrice}, ${c.level}::"CourseLevel", ${c.duration}, ${c.lessons}, ${c.students}, ${c.rating}, ${c.cert}, ${catMap[c.catSlug]}, ${c.instrId}, ${c.paymentLink}, true, ${ts}, ${ts})
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
    `
    console.log(`  🎓 ${c.title}`)
  }

  // ── Sample enrollment pour testUser ──
  const [webCourse] = await sql`SELECT id FROM courses WHERE slug = 'developpement-web-complet'`
  if (webCourse && userDbId) {
    const enrollId = cuid()
    const ts = new Date().toISOString()
    await sql`
      INSERT INTO enrollments (id, "userId", "courseId", status, "overallProgress", "createdAt", "updatedAt")
      VALUES (${enrollId}, ${userDbId}, ${webCourse.id}, 'ACTIVE', 35, ${ts}, ${ts})
      ON CONFLICT ("userId", "courseId") DO NOTHING
    `
    const progId = cuid()
    await sql`
      INSERT INTO progress (id, "userId", "courseId", status, progress, "timeSpent", "createdAt", "updatedAt")
      VALUES (${progId}, ${userDbId}, ${webCourse.id}, 'IN_PROGRESS', 35, 240, ${ts}, ${ts})
      ON CONFLICT ("userId", "courseId") DO NOTHING
    `
  }

  console.log('\n✅ Seed terminé avec succès!\n')
  console.log('📋 Comptes de connexion:')
  console.log('  Admin  → admin@bookshelf.kit  / admin2024')
  console.log('  User   → user@bookshelf.kit   / user2024')
}

main()
  .catch(e => { console.error('❌ Erreur:', e); process.exit(1) })
  .finally(() => sql.end())
