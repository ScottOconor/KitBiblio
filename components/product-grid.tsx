"use client";

import EbookCard from "./ebook-card";

interface Product {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  coverUrl: string;
  description: string;
  paymentLink: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: Readonly<ProductGridProps>) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Aucun livre trouvé dans cette catégorie.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <EbookCard key={product.id} product={product} />
      ))}
    </div>
  );
}
