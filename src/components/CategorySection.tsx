'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    id: 'masculino',
    name: 'Masculino',
    image: '/categories/masculino.jpg',
    description: 'Calçados e roupas masculinas',
  },
  {
    id: 'feminino',
    name: 'Feminino',
    image: '/categories/feminino.jpg',
    description: 'Calçados e roupas femininas',
  },
  {
    id: 'infantil',
    name: 'Infantil',
    image: '/categories/infantil.jpg',
    description: 'Moda infantil',
  },
  {
    id: 'esportes',
    name: 'Esportes',
    image: '/categories/esportes.jpg',
    description: 'Equipamentos esportivos',
  },
];

export function CategorySection() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Categorias em Destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.id}`}
              className="group relative h-40 md:h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">{category.name}</h3>
                <p className="text-sm md:text-base text-white/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 