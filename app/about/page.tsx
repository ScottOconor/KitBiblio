import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-white px-4 py-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            À propos de BookShelf
          </h1>
          <p className="text-gray-600 text-lg">
            Notre mission et notre histoire
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Notre Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              BookShelf est née d&apos;une passion simple : rendre les livres
              accessibles à tous. Nous croyons que chacun mérite d&apos;avoir
              accès à des lectures de qualité, peu importe son lieu de résidence
              ou ses contraintes de temps.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Notre Engagement
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous nous engageons à offrir une collection curatée des meilleurs
              e-books, avec des paiements sécurisés et une livraison
              instantanée. Chaque livre est sélectionné pour sa qualité et son
              intérêt pour nos lecteurs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Pourquoi nous choisir ?
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="text-gray-900 font-bold">•</span>
                <span>Collection diverse et régulièrement mise à jour</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-900 font-bold">•</span>
                <span>Paiements 100% sécurisés via Lygos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-900 font-bold">•</span>
                <span>Accès instantané à vos e-books</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-900 font-bold">•</span>
                <span>Support client réactif et à l&apos;écoute</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-900 font-bold">•</span>
                <span>Formats compatibles avec tous les appareils</span>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
