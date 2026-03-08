import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-white px-4 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Politique de confidentialité
          </h1>
        </div>
      </section>

      {/* Privacy Content */}
      <div className="px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              1. Collecte des données
            </h2>
            <p className="text-gray-600 leading-relaxed">
              BookShelf collecte uniquement les données personnelles nécessaires
              pour vous fournir nos services :
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-3">
                <span className="text-gray-900 font-semibold">•</span>
                Nom et adresse email
              </li>
              <li className="flex gap-3">
                <span className="text-gray-900 font-semibold">•</span>
                Informations de paiement (gérées sécurisement par Lygos)
              </li>
              <li className="flex gap-3">
                <span className="text-gray-900 font-semibold">•</span>
                Historique de vos achats
              </li>
              <li className="flex gap-3">
                <span className="text-gray-900 font-semibold">•</span>
                Préférences de lecture
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              2. Utilisation des données
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Vos données sont utilisées pour : vous fournir les services
              demandés, gérer votre compte, traiter vos commandes, et vous
              envoyer des informations relatives à nos services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              3. Sécurité des données
            </h2>
            <p className="text-gray-600 leading-relaxed">
              BookShelf met en place des mesures de sécurité appropriées pour
              protéger vos données personnelles contre l&apos;accès non
              autorisé, la modification ou la suppression.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              4. Droits de l&apos;utilisateur
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Conformément à la RGPD, vous avez le droit d&apos;accéder, de
              corriger ou de supprimer vos données personnelles. Pour exercer
              ces droits, veuillez nous contacter à contact@bookshelf.fr
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Notre site utilise des cookies pour améliorer votre expérience.
              Vous pouvez les désactiver via les paramètres de votre navigateur.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              6. Modifications de la politique
            </h2>
            <p className="text-gray-600 leading-relaxed">
              BookShelf se réserve le droit de modifier cette politique de
              confidentialité. Les modifications seront publiées sur cette page.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
