import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // ──────────────────────────────
  // CATEGORIES
  // ──────────────────────────────
  const categoriesData = [
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
    { name: 'Photographie', slug: 'photographie', icon: '📷', color: '#6B7280', type: 'courses', sortOrder: 16 },
    { name: 'Cybersécurité', slug: 'cybersecurite', icon: '🔐', color: '#EF4444', type: 'courses', sortOrder: 17 },
  ]

  const categories: Record<string, string> = {}
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categories[cat.slug] = created.id
    console.log(`  ✅ Catégorie: ${cat.name}`)
  }

  // ──────────────────────────────
  // USERS
  // ──────────────────────────────
  const adminPassword = await bcrypt.hash('admin2024', 12)
  const userPassword = await bcrypt.hash('user2024', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookshelf.kit' },
    update: {},
    create: {
      email: 'admin@bookshelf.kit',
      username: 'admin_kit',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'K.I.T',
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
      bio: 'Administrateur de la plateforme BookShelf K.I.T',
    },
  })
  console.log(`  ✅ Admin: ${admin.email}`)

  const instructor1 = await prisma.user.upsert({
    where: { email: 'marie@bookshelf.kit' },
    update: {},
    create: {
      email: 'marie@bookshelf.kit',
      username: 'marie_dubois',
      password: userPassword,
      firstName: 'Marie',
      lastName: 'Dubois',
      role: 'INSTRUCTOR',
      isActive: true,
      isVerified: true,
      bio: 'Experte en développement web avec 10 ans d\'expérience.',
    },
  })

  const instructor2 = await prisma.user.upsert({
    where: { email: 'jean@bookshelf.kit' },
    update: {},
    create: {
      email: 'jean@bookshelf.kit',
      username: 'dr_jean_martin',
      password: userPassword,
      firstName: 'Jean',
      lastName: 'Martin',
      role: 'INSTRUCTOR',
      isActive: true,
      isVerified: true,
      bio: 'Docteur en IA et Machine Learning, chercheur et formateur.',
    },
  })

  const testUser = await prisma.user.upsert({
    where: { email: 'user@bookshelf.kit' },
    update: {},
    create: {
      email: 'user@bookshelf.kit',
      username: 'testuser',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isActive: true,
      isVerified: false,
    },
  })
  console.log(`  ✅ Utilisateurs créés`)

  // ──────────────────────────────
  // BOOKS
  // ──────────────────────────────
  const booksData = [
    {
      title: 'MIRACLE MORNING',
      slug: 'miracle-morning',
      description: 'Quel que soit le stade où vous vous trouvez dans votre vie. Que vous soyez au sommet de votre art ou face à des difficultés, je suis persuadé que nous souhaitons avoir une vie meilleure et nous améliorer.',
      shortDesc: 'La méthode révolutionnaire pour transformer votre matin et votre vie.',
      cover: '/Miracle_Morning.png',
      price: 1500,
      currency: 'XAF',
      format: 'PDF' as const,
      categorySlug: 'developpement-personnel',
      paymentLink: 'https://pay.lygosapp.com/link/0c838daa-78c3-4649-bfab-f509fc87eb69',
      rating: 4.9,
      downloads: 1250,
    },
    {
      title: 'ATTEINDRE L\'EXCELLENCE',
      slug: 'atteindre-excellence',
      description: 'Maîtrisez les fondamentaux du développement de soi avec des stratégies pratiques et concrètes pour atteindre votre plein potentiel.',
      shortDesc: 'Stratégies concrètes pour atteindre l\'excellence dans tous les domaines.',
      cover: '/atteindre.jpg',
      price: 2500,
      currency: 'XAF',
      format: 'PDF' as const,
      categorySlug: 'developpement-personnel',
      paymentLink: 'https://pay.lygosapp.com/link/5de67adb-becb-4885-a573-d6f458219e04',
      rating: 4.8,
      downloads: 980,
    },
    {
      title: 'AIMEZ VOTRE SEXUALITÉ',
      slug: 'aimez-votre-sexualite',
      description: 'Intelligence Sexuelle Et Intelligence Émotionnelle Pour Profiter De Votre Sexualité.',
      shortDesc: 'Guide complet pour une sexualité épanouie et intelligente.',
      cover: '/aimer.jpg',
      price: 1800,
      currency: 'XAF',
      format: 'PDF' as const,
      categorySlug: 'sante-bien-etre',
      paymentLink: 'https://pay.lygosapp.com/link/f7465b20-8408-47af-bb85-a20045f54266',
      rating: 4.7,
      downloads: 760,
    },
    {
      title: 'Voyage aux Étoiles',
      slug: 'voyage-aux-etoiles',
      description: 'Une aventure épique à travers l\'univers où chaque page révèle de nouveaux mondes fascinants.',
      shortDesc: 'SF épique dans les étoiles.',
      price: 12.99,
      currency: 'EUR',
      format: 'EPUB' as const,
      categorySlug: 'science-fiction',
      paymentLink: 'https://payment.example.com/book/voyage-etoiles',
      rating: 4.5,
      downloads: 320,
    },
    {
      title: 'Philosophie du Bonheur Contemporain',
      slug: 'philosophie-bonheur-contemporain',
      description: 'Réflexions profondes sur le sens de la vie et les clés du bien-être dans notre société moderne.',
      shortDesc: 'Méditations sur le bonheur à l\'ère moderne.',
      price: 14.99,
      currency: 'EUR',
      format: 'EPUB' as const,
      categorySlug: 'spiritualite',
      paymentLink: 'https://payment.example.com/book/philosophie-bonheur',
      rating: 4.6,
      downloads: 440,
    },
    {
      title: 'Millionnaire Avant 30 Ans',
      slug: 'millionnaire-avant-30-ans',
      description: 'Les stratégies concrètes utilisées par de jeunes entrepreneurs pour bâtir leur richesse.',
      shortDesc: 'Guide pratique pour construire sa richesse tôt.',
      price: 22.99,
      currency: 'EUR',
      format: 'PDF' as const,
      categorySlug: 'business-finance',
      paymentLink: 'https://payment.example.com/book/millionnaire-30',
      rating: 4.8,
      downloads: 890,
    },
    {
      title: 'Le Royaume des Dragons Oubliés',
      slug: 'royaume-dragons-oublies',
      description: 'Plongez dans un monde médiéval fantastique où magie et dragons règnent en maîtres.',
      shortDesc: 'Fantasy épique avec dragons et magie.',
      price: 15.99,
      currency: 'EUR',
      format: 'EPUB' as const,
      categorySlug: 'fantasy',
      paymentLink: 'https://payment.example.com/book/dragons-oublies',
      rating: 4.7,
      downloads: 560,
    },
    {
      title: 'Minuit dans les Montagnes Maudites',
      slug: 'minuit-montagnes-maudites',
      description: 'Un suspense haletant dans les Alpes où chaque recoin cache un secret mortel.',
      shortDesc: 'Thriller glaçant dans les Alpes.',
      price: 11.99,
      currency: 'EUR',
      format: 'EPUB' as const,
      categorySlug: 'suspense',
      paymentLink: 'https://payment.example.com/book/montagnes-maudites',
      rating: 4.5,
      downloads: 380,
    },
  ]

  const createdBooks: Record<string, string> = {}
  for (const b of booksData) {
    const { categorySlug, ...bookData } = b
    const book = await prisma.book.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        ...bookData,
        isPublished: true,
        categoryId: categories[categorySlug],
        authorId: admin.id,
      },
    })
    createdBooks[b.slug] = book.id
    console.log(`  📚 Livre: ${b.title}`)
  }

  // ──────────────────────────────
  // COURSES
  // ──────────────────────────────
  const coursesData = [
    {
      title: 'Développement Web Complet',
      slug: 'developpement-web-complet',
      description: 'Apprenez HTML, CSS, JavaScript, React et Node.js de zéro à expert. Projets pratiques inclus.',
      shortDesc: 'De zéro à expert en développement web moderne.',
      price: 89.99,
      originalPrice: 199.99,
      currency: 'EUR',
      level: 'BEGINNER' as const,
      duration: 2520,
      lessonsCount: 156,
      studentsCount: 15420,
      rating: 4.8,
      hasCertificate: true,
      categorySlug: 'developpement-web',
      instructorId: instructor1.id,
      paymentLink: 'https://payment.example.com/course/dev-web',
    },
    {
      title: 'Machine Learning & Intelligence Artificielle',
      slug: 'machine-learning-ia',
      description: 'Maîtrisez les algorithmes de machine learning, deep learning et l\'IA avec Python et TensorFlow.',
      shortDesc: 'ML et IA avec Python - du théorique au pratique.',
      price: 129.99,
      originalPrice: 299.99,
      currency: 'EUR',
      level: 'INTERMEDIATE' as const,
      duration: 3480,
      lessonsCount: 234,
      studentsCount: 12350,
      rating: 4.9,
      hasCertificate: true,
      categorySlug: 'ia-data-science',
      instructorId: instructor2.id,
      paymentLink: 'https://payment.example.com/course/ml-ia',
    },
    {
      title: 'Design UI/UX Moderne avec Figma',
      slug: 'design-uiux-figma',
      description: 'Créez des interfaces magnifiques et intuitives. Maîtrisez Figma, les principes UX et le design thinking.',
      shortDesc: 'Maîtrisez le design moderne avec Figma.',
      price: 69.99,
      originalPrice: 149.99,
      currency: 'EUR',
      level: 'BEGINNER' as const,
      duration: 1680,
      lessonsCount: 98,
      studentsCount: 8920,
      rating: 4.7,
      hasCertificate: true,
      categorySlug: 'design',
      instructorId: instructor1.id,
      paymentLink: 'https://payment.example.com/course/design-uiux',
    },
    {
      title: 'Marketing Digital & Réseaux Sociaux',
      slug: 'marketing-digital-reseaux',
      description: 'Développez des stratégies marketing efficaces. SEO, publicité payante, réseaux sociaux et analytics.',
      shortDesc: 'Stratégies marketing modernes et réseaux sociaux.',
      price: 79.99,
      originalPrice: 179.99,
      currency: 'EUR',
      level: 'INTERMEDIATE' as const,
      duration: 2100,
      lessonsCount: 127,
      studentsCount: 10230,
      rating: 4.6,
      hasCertificate: true,
      categorySlug: 'marketing-digital',
      instructorId: instructor1.id,
      paymentLink: 'https://payment.example.com/course/marketing',
    },
    {
      title: 'Python pour Débutants',
      slug: 'python-debutants',
      description: 'Apprenez Python, le langage de programmation le plus demandé. Projets pratiques et applications réelles.',
      shortDesc: 'Python de zéro à maîtrise.',
      price: 59.99,
      originalPrice: 129.99,
      currency: 'EUR',
      level: 'BEGINNER' as const,
      duration: 1800,
      lessonsCount: 112,
      studentsCount: 18500,
      rating: 4.9,
      hasCertificate: true,
      categorySlug: 'developpement-web',
      instructorId: instructor2.id,
      paymentLink: 'https://payment.example.com/course/python',
    },
    {
      title: 'Finance Personnelle & Investissement',
      slug: 'finance-personnelle-investissement',
      description: 'Gérez votre argent intelligemment. Investissement, bourse, immobilier et construction de patrimoine.',
      shortDesc: 'Gérez et faites fructifier votre argent.',
      price: 99.99,
      originalPrice: 219.99,
      currency: 'EUR',
      level: 'BEGINNER' as const,
      duration: 1440,
      lessonsCount: 89,
      studentsCount: 7640,
      rating: 4.8,
      hasCertificate: true,
      categorySlug: 'finance',
      instructorId: instructor2.id,
      paymentLink: 'https://payment.example.com/course/finance',
    },
    {
      title: 'Cybersécurité & Ethical Hacking',
      slug: 'cybersecurite-ethical-hacking',
      description: 'Protégez les systèmes informatiques. Hacking éthique, pentest et sécurité des réseaux.',
      shortDesc: 'Sécurité informatique et ethical hacking.',
      price: 139.99,
      originalPrice: 319.99,
      currency: 'EUR',
      level: 'ADVANCED' as const,
      duration: 3120,
      lessonsCount: 201,
      studentsCount: 7890,
      rating: 4.9,
      hasCertificate: true,
      categorySlug: 'cybersecurite',
      instructorId: instructor2.id,
      paymentLink: 'https://payment.example.com/course/cyber',
    },
    {
      title: 'Business & Entrepreneuriat',
      slug: 'business-entrepreneuriat',
      description: 'Lancez et développez votre entreprise. Business model, levée de fonds, croissance et management.',
      shortDesc: 'De l\'idée à l\'entreprise qui réussit.',
      price: 99.99,
      originalPrice: 229.99,
      currency: 'EUR',
      level: 'INTERMEDIATE' as const,
      duration: 2280,
      lessonsCount: 143,
      studentsCount: 18920,
      rating: 4.8,
      hasCertificate: true,
      categorySlug: 'business',
      instructorId: instructor1.id,
      paymentLink: 'https://payment.example.com/course/business',
    },
  ]

  for (const c of coursesData) {
    const { categorySlug, instructorId, ...courseData } = c
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        ...courseData,
        isPublished: true,
        categoryId: categories[categorySlug],
        instructorId,
      },
    })
    console.log(`  🎓 Cours: ${c.title}`)
  }

  // ──────────────────────────────
  // SAMPLE PURCHASES (testUser)
  // ──────────────────────────────
  const miracleBook = await prisma.book.findUnique({ where: { slug: 'miracle-morning' } })
  if (miracleBook) {
    await prisma.purchase.upsert({
      where: { id: 'seed-purchase-1' },
      update: {},
      create: {
        id: 'seed-purchase-1',
        userId: testUser.id,
        bookId: miracleBook.id,
        amount: 1500,
        currency: 'XAF',
        status: 'COMPLETED',
        paymentMethod: 'lygos',
      },
    })
  }

  const webCourse = await prisma.course.findUnique({ where: { slug: 'developpement-web-complet' } })
  if (webCourse) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: testUser.id, courseId: webCourse.id } },
      update: {},
      create: {
        userId: testUser.id,
        courseId: webCourse.id,
        status: 'ACTIVE',
        overallProgress: 35,
      },
    })
    await prisma.progress.upsert({
      where: { userId_courseId: { userId: testUser.id, courseId: webCourse.id } },
      update: {},
      create: {
        userId: testUser.id,
        courseId: webCourse.id,
        status: 'IN_PROGRESS',
        progress: 35,
        timeSpent: 240,
      },
    })
  }

  console.log('\n✅ Seed terminé avec succès!')
  console.log('\n📋 Comptes de connexion:')
  console.log('  Admin  → admin@bookshelf.kit   / admin2024')
  console.log('  User   → user@bookshelf.kit    / user2024')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
