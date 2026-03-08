"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Les Meilleurs Livres de 2024",
    excerpt: "Découvrez notre sélection des meilleurs e-books de l'année.",
    content: `
      <p>Cette année a été particulièrement riche en publications exceptionnelles. Parmi nos coups de cœur, on retrouve des œuvres qui marqueront durablement le paysage littéraire.</p>
      
      <p><strong>Notre top 5 :</strong></p>
      <ul>
        <li>"L'Horizon des Possibles" - Une fresque historique captivante</li>
        <li>"Code et Conscience" - Réflexions sur la technologie moderne</li>
        <li>"Les Saisons Oubliées" - Un roman poétique sur la mémoire</li>
        <li>"Réseaux et Libertés" - Essai percutant sur notre relation au numérique</li>
        <li>"L'Art de la Simplicité" - Guide pratique pour une vie épurée</li>
      </ul>
      
      <p>Chacun de ces ouvrages apporte une perspective unique et une qualité d'écriture remarquable.</p>
    `,
    date: "15 novembre 2024",
    author: "Sophie Martin",
    category: "Recommandations",
  },
  {
    id: 2,
    title: "Comment Bien Lire un E-Book",
    excerpt:
      "Conseils pratiques pour optimiser votre expérience de lecture numérique.",
    content: `
      <p>La lecture numérique offre de nombreux avantages, mais nécessite quelques ajustements par rapport au papier.</p>
      
      <p><strong>Nos conseils :</strong></p>
      
      <p><strong>• Ajustez la luminosité</strong> : Évitez la fatigue oculaire en adaptant l'éclairage de votre écran</p>
      <p><strong>• Utilisez les marque-pages</strong> : Profitez des fonctionnalités de votre application de lecture</p>
      <p><strong>• Personnalisez la typographie</strong> : Choisissez une police et une taille confortables</p>
      <p><strong>• Faites des pauses</strong> : La règle des 20-20-20 (20 minutes, regarder à 20 pieds pendant 20 secondes)</p>
      <p><strong>• Explorez les dictionnaires intégrés</strong> : Un clic pour définir les mots inconnus</p>
      
      <p>Avec ces astuces, votre expérience de lecture numérique deviendra encore plus agréable.</p>
    `,
    date: "10 novembre 2024",
    author: "Pierre Leclerc",
    category: "Guides",
  },
  {
    id: 3,
    title: "Tendances de la Littérature Numérique",
    excerpt: "Les évolutions majeures du secteur des e-books en 2024.",
    content: `
      <p>Le marché du livre numérique continue d'évoluer rapidement. Voici les tendances qui marquent 2024 :</p>
      
      <p><strong>Croissance des formats interactifs</strong> : Les e-books enrichis avec du contenu multimédia gagnent en popularité.</p>
      
      <p><strong>Accessibilité améliorée</strong> : De plus en plus d'éditeurs intègrent des fonctionnalités d'accessibilité (lecture audio, contrastes adaptés).</p>
      
      <p><strong>Lecture sociale</strong> : Les plateformes permettant de partager ses notes et surlignages avec d'autres lecteurs se développent.</p>
      
      <p><strong>Souscriptions illimitées</strong> : Les modèles d'abonnement type "Netflix du livre" continuent leur expansion.</p>
      
      <p>Ces évolutions rendent la lecture numérique toujours plus attractive et adaptée à nos modes de vie modernes.</p>
    `,
    date: "5 novembre 2024",
    author: "Marie Dupont",
    category: "Actualités",
  },
  {
    id: 4,
    title: "Interview avec un Auteur de Science-Fiction",
    excerpt: "Rencontre exclusive avec l'auteur de 'Voyage aux Étoiles'.",
    content: `
      <p>Nous avons rencontré Jean Martin, auteur du best-seller "Voyage aux Étoiles", pour discuter de son processus créatif.</p>
      
      <p><strong>Question :</strong> D'où vous est venue l'inspiration pour "Voyage aux Étoiles" ?</p>
      
      <p><strong>Jean Martin :</strong> "L'idée m'est venue lors d'une nuit d'observation des étoiles. Je me suis demandé ce que serait l'exploration spatiale si nous avions des technologies radicalement différentes. Le livre explore cette question à travers les yeux de personnages profondément humains."</p>
      
      <p><strong>Question :</strong> Quel est votre conseil pour les auteurs en herbe ?</p>
      
      <p><strong>Jean Martin :</strong> "Lisez énormément, écrivez régulièrement, et surtout, n'abandonnez pas. Chaque auteur publié a connu des refus et des doutes. La persévérance est la clé."</p>
      
      <p>Une interview passionnante qui nous plonge dans l'univers créatif d'un auteur talentueux.</p>
    `,
    date: "1 novembre 2024",
    author: "Jean Martin",
    category: "Interviews",
  },
];

export default function BlogPage() {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const togglePost = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-white px-4 py-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre blog
          </h1>
          <p className="text-gray-600 text-lg">
            Articles, conseils et actualités du monde des e-books
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <div className="px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    par {post.author}
                  </span>

                  <button
                    onClick={() => togglePost(post.id)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    {expandedPost === post.id ? (
                      <>
                        Réduire
                        <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Lire l&apos;article
                        <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedPost === post.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div
                      className="text-gray-600 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <button
                      onClick={() => togglePost(post.id)}
                      className="mt-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                    >
                      Réduire l&apos;article
                      <ChevronUp size={16} />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
