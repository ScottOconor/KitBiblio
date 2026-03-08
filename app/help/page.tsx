import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { Download, CreditCard, AlertCircle } from "lucide-react";

const HELP_CATEGORIES = [
  {
    icon: Download,
    title: "Téléchargement",
    description: "Aide concernant le téléchargement de vos e-books",
    topics: [
      "Comment télécharger mon e-book ?",
      "Problèmes de téléchargement",
      "Formats disponibles",
    ],
  },
  {
    icon: CreditCard,
    title: "Paiement",
    description: "Questions sur les paiements et la facturation",
    topics: [
      "Moyens de paiement acceptés",
      "Factures et reçus",
      "Problèmes de paiement",
    ],
  },
  {
    icon: AlertCircle,
    title: "Compte",
    description: "Gestion de votre compte et profil",
    topics: [
      "Créer un compte",
      "Réinitialiser mot de passe",
      "Modifier mes données",
    ],
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-white px-4 py-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Centre d&lsquo;aide
          </h1>
          <p className="text-gray-600 text-lg">
            Nous sommes là pour vous aider
          </p>
        </div>
      </section>

      {/* Help Content */}
      <div className="px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid md:grid-cols-3 gap-6">
            {HELP_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.title}
                  className="space-y-4 p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent size={28} className="text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.topics.map((topic) => (
                      <li key={topic}>
                        <a
                          href="#"
                          className="text-gray-700 hover:text-gray-900 text-sm transition-colors"
                        >
                          • {topic}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Vous n&apos;avez pas trouvé la réponse ?
            </h3>
            <p className="text-gray-600 mb-6">
              Contactez notre équipe de support, nous vous répondrons dans les
              24 heures.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
