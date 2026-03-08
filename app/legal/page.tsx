import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-white px-4 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mentions légales
          </h1>
        </div>
      </section>

      {/* Legal Content */}
      <div className="px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              1. Identification de l&apos;éditeur
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>
                <strong>Nom :</strong> BookShelf SARL
              </p>
              <p>
                <strong>Forme juridique :</strong> Société à Responsabilité
                Limitée
              </p>
              <p>
                <strong>Adresse :</strong> 123 Rue du Commerce, 75000 Paris,
                France
              </p>
              <p>
                <strong>Email :</strong> contact@bookshelf.fr
              </p>
              <p>
                <strong>Téléphone :</strong> +33 (0) 1 23 45 67 89
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              2. Directeur de la publication
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Le directeur de la publication est Monsieur Jean Dupont, gérant de
              la SARL BookShelf.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              3. Hébergement
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Ce site est hébergé par Vercel Inc., 440 N Barranca Avenue,
              Covina, CA 91723, États-Unis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              4. Conditions d&apos;utilisation
            </h2>
            <p className="text-gray-600 leading-relaxed">
              L&apos;utilisateur s&apos;engage à utiliser le site et les
              services de BookShelf de manière licite et conforme à la loi.
              L&apos;utilisateur ne doit pas utiliser le site pour transmettre
              des contenus offensants, discriminatoires ou illégaux.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              5. Propriété intellectuelle
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Tous les contenus du site (textes, images, logos) sont la
              propriété exclusive de BookShelf ou de ses partenaires. Toute
              reproduction sans autorisation est interdite.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              6. Limitation de responsabilité
            </h2>
            <p className="text-gray-600 leading-relaxed">
              BookShelf ne peut être tenue responsable des dommages indirects,
              de la perte de profits ou de données résultant de
              l&apos;utilisation du site ou des services.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
