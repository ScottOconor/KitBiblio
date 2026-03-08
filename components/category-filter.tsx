"use client";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: Readonly<CategoryFilterProps>) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-6 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
          selectedCategory === null
            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        Tous les livres
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-6 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
            selectedCategory === category
              ? "bg-gray-900 text-white border-gray-900 shadow-sm"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
