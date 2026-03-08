"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne l'achat sur BookShelf ?",
    answer:
      "C'est simple ! Parcourez notre catalogue, sélectionnez un livre, cliquez sur 'Acheter', effectuez le paiement via Lygos, et vous recevrez un lien de téléchargement immédiatement.",
  },
  {
    question: "Quels formats sont supportés ?",
    answer:
      "Nos e-books sont disponibles en format EPUB et PDF, compatibles avec tous les appareils : liseuses, tablettes, ordinateurs et smartphones.",
  },
  {
    question: "Puis-je télécharger mes achats plusieurs fois ?",
    answer:
      "Oui ! Une fois acheté, vous pouvez télécharger votre e-book autant de fois que vous le souhaitez depuis votre compte.",
  },
  {
    question: "Quelle est votre politique de remboursement ?",
    answer:
      "Si vous avez des problèmes avec votre achat, veuillez nous contacter dans les 7 jours. Nous offrons un remboursement complet si vous ne pouvez pas accéder à votre livre.",
  },
  {
    question: "Comment sont traitées mes données personnelles ?",
    answer:
      "Nous prenons votre confidentialité très au sérieux. Consultez notre politique de confidentialité pour plus de détails sur comment nous protégeons vos données.",
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer:
      "Non. Le prix affiché est le prix final. Aucun frais supplémentaire ne sera ajouté au moment du paiement.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-white px-4 py-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-gray-600 text-lg">
            Trouvez les réponses à vos questions
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-left pr-4">
                  {item.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-gray-600 transition shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
