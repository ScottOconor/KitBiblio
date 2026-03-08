// =====================
// CATÉGORIES LIVRES
// =====================
export const EBOOK_CATEGORIES = [
  "Développement Personnel",
  "Romance",
  "Science-Fiction",
  "Essai",
  "Jeunesse",
  "Suspense",
  "Fantasy",
  "Histoire",
  "Santé & Bien-être",
  "Business & Finance",
  "Spiritualité",
  "Développement",
];

// =====================
// CATÉGORIES COURS
// =====================
export const COURSE_CATEGORIES = [
  "Développement Web",
  "IA & Data Science",
  "Design",
  "Marketing Digital",
  "Business",
  "Finance",
  "Photographie",
  "Musique",
];

// =====================
// LIVRES (EBOOKS)
// =====================
export const SAMPLE_EBOOKS = [
  {
    id: "1",
    title: "MIRACLE MORNING",
    author: "HAL ELROD",
    category: "Développement Personnel",
    price: 1500,
    coverUrl: "/Miracle_Morning.png",
    description:
      "Quel que soit le stade où vous vous trouvez dans votre vie. Que vous soyez au sommet de votre art ou face à des difficultés, je suis persuadé que nous souhaitons avoir une vie meilleure et nous améliorer.",
    paymentLink:
      "https://pay.lygosapp.com/link/0c838daa-78c3-4649-bfab-f509fc87eb69",
  },
  {
    id: "2",
    title: "Voyage aux Étoiles",
    author: "Jean Martin",
    category: "Science-Fiction",
    price: 12.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Une aventure épique à travers l'univers où chaque page révèle de nouveaux mondes fascinants.",
    paymentLink: "https://payment.example.com/book/2",
  },
  {
    id: "3",
    title: "ATTEINDRE L'EXCELLENCE",
    author: "ROBERT GREENE",
    category: "Développement Personnel",
    price: 2500,
    coverUrl: "/atteindre.jpg",
    description:
      "Maîtrisez les fondamentaux du développement de soi avec des stratégies pratiques et concrètes pour atteindre votre plein potentiel.",
    paymentLink:
      "https://pay.lygosapp.com/link/5de67adb-becb-4885-a573-d6f458219e04",
  },
  {
    id: "4",
    title: "Philosophie du Bonheur Contemporain",
    author: "Claire Bernard",
    category: "Essai",
    price: 14.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Réflexions profondes sur le sens de la vie et les clés du bien-être dans notre société moderne.",
    paymentLink: "https://payment.example.com/book/4",
  },
  {
    id: "5",
    title: "AIMEZ VOTRE SEXUALITÉ",
    author: "ALLAN TREVOR",
    category: "Santé & Bien-être",
    price: 1800,
    coverUrl: "/aimer.jpg",
    description:
      "Intelligence Sexuelle Et Intelligence Émotionnelle Pour Profiter De Votre Sexualité",
    paymentLink:
      "https://pay.lygosapp.com/link/f7465b20-8408-47af-bb85-a20045f54266",
  },
  {
    id: "6",
    title: "Minuit dans les Montagnes Maudites",
    author: "Laurent Noir",
    category: "Suspense",
    price: 11.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Un suspense haletant dans les Alpes où chaque recoin cache un secret mortel.",
    paymentLink: "https://payment.example.com/book/6",
  },
  {
    id: "7",
    title: "Un Cœur Brisé, Une Âme Guérie",
    author: "Isabelle Rousseau",
    category: "Romance",
    price: 10.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Une romance déchirante qui explore la rédemption et la puissance de l'amour véritable.",
    paymentLink: "https://payment.example.com/book/7",
  },
  {
    id: "8",
    title: "L'Avenir de l'IA : Révolution ou Évolution ?",
    author: "David Tech",
    category: "Développement",
    price: 19.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Comprendre l'intelligence artificielle aujourd'hui et son impact sur notre futur proche.",
    paymentLink: "https://payment.example.com/book/8",
  },
  {
    id: "9",
    title: "Les Mondes Parallèles : Au-delà du Réel",
    author: "Marc Astronome",
    category: "Science-Fiction",
    price: 13.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Explorez des univers alternatifs fascinants où les lois de la physique sont réinventées.",
    paymentLink: "https://payment.example.com/book/9",
  },
  {
    id: "10",
    title: "Énigme du Château Hanté",
    author: "Pierre Mystère",
    category: "Suspense",
    price: 11.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Un mystère ancestral à résoudre entre les murs d'un château chargé d'histoire et de secrets.",
    paymentLink: "https://payment.example.com/book/10",
  },
  {
    id: "11",
    title: "Le Royaume des Dragons Oubliés",
    author: "Élise Fantasy",
    category: "Fantasy",
    price: 15.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Plongez dans un monde médiéval fantastique où magie et dragons règnent en maîtres.",
    paymentLink: "https://payment.example.com/book/11",
  },
  {
    id: "12",
    title: "Histoire de France : Les Grandes Batailles",
    author: "Philippe Historien",
    category: "Histoire",
    price: 16.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Revivez les moments clés qui ont façonné la France à travers des récits historiques captivants.",
    paymentLink: "https://payment.example.com/book/12",
  },
  {
    id: "13",
    title: "L'Art de la Méditation",
    author: "Maître Zhou",
    category: "Spiritualité",
    price: 9.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Guide pratique pour intégrer la méditation dans votre quotidien et atteindre la paix intérieure.",
    paymentLink: "https://payment.example.com/book/13",
  },
  {
    id: "14",
    title: "Millionnaire Avant 30 Ans",
    author: "Alex Fortuna",
    category: "Business & Finance",
    price: 22.99,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Les stratégies concrètes utilisées par de jeunes entrepreneurs pour bâtir leur richesse.",
    paymentLink: "https://payment.example.com/book/14",
  },
];

// =====================
// COURS (COURSES)
// =====================
export const SAMPLE_COURSES = [
  {
    id: "1",
    title: "Développement Web Complet",
    instructor: "Marie Dubois",
    description: "Apprenez HTML, CSS, JavaScript, React et Node.js de zéro à expert",
    price: 89.99,
    originalPrice: 199.99,
    image: "/api/placeholder/400/300",
    duration: "42 heures",
    students: 15420,
    rating: 4.8,
    level: "Débutant",
    category: "Développement Web",
    lessons: 156,
    paymentLink: "https://payment.example.com/course/1",
  },
  {
    id: "2",
    title: "Machine Learning & IA",
    instructor: "Dr. Jean Martin",
    description: "Maîtrisez les algorithmes de machine learning et deep learning avec Python",
    price: 129.99,
    originalPrice: 299.99,
    image: "/api/placeholder/400/300",
    duration: "58 heures",
    students: 12350,
    rating: 4.9,
    level: "Intermédiaire",
    category: "IA & Data Science",
    lessons: 234,
    paymentLink: "https://payment.example.com/course/2",
  },
  {
    id: "3",
    title: "Design UI/UX Moderne",
    instructor: "Sophie Laurent",
    description: "Créez des interfaces magnifiques et intuitives avec Figma et les principes UX",
    price: 69.99,
    originalPrice: 149.99,
    image: "/api/placeholder/400/300",
    duration: "28 heures",
    students: 8920,
    rating: 4.7,
    level: "Débutant",
    category: "Design",
    lessons: 98,
    paymentLink: "https://payment.example.com/course/3",
  },
  {
    id: "4",
    title: "Marketing Digital & Réseaux Sociaux",
    instructor: "Pierre Bernard",
    description: "Développez des stratégies marketing efficaces et boostez votre présence en ligne",
    price: 79.99,
    originalPrice: 179.99,
    image: "/api/placeholder/400/300",
    duration: "35 heures",
    students: 10230,
    rating: 4.6,
    level: "Intermédiaire",
    category: "Marketing Digital",
    lessons: 127,
    paymentLink: "https://payment.example.com/course/4",
  },
  {
    id: "5",
    title: "Python pour Débutants",
    instructor: "Lucas Morel",
    description: "Apprenez Python, le langage le plus demandé, avec des projets pratiques",
    price: 59.99,
    originalPrice: 129.99,
    image: "/api/placeholder/400/300",
    duration: "30 heures",
    students: 18500,
    rating: 4.9,
    level: "Débutant",
    category: "Développement Web",
    lessons: 112,
    paymentLink: "https://payment.example.com/course/5",
  },
  {
    id: "6",
    title: "Finance Personnelle & Investissement",
    instructor: "Emma Finance",
    description: "Gérez votre argent, investissez intelligemment et construisez votre patrimoine",
    price: 99.99,
    originalPrice: 219.99,
    image: "/api/placeholder/400/300",
    duration: "24 heures",
    students: 7640,
    rating: 4.8,
    level: "Débutant",
    category: "Finance",
    lessons: 89,
    paymentLink: "https://payment.example.com/course/6",
  },
];
