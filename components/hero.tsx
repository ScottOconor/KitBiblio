"use client";

export default function Hero() {
  return (
    <section className="bg-white px-4 py-20 border-b border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Votre bibliothèque
          <br />
          <span className="text-gray-600">numérique</span>
        </h1>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Des e-books de qualité, accessibles instantanément. Lecture
          simplifiée, contenu exceptionnel.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#products"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Découvrir les livres
          </a>
          <a
            href="/about"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            En savoir plus
          </a>
        </div>
      </div>
    </section>
  );
}
