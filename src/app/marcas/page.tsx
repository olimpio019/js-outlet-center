'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const marcas = [
  {
    id: 'nike',
    nome: 'Nike',
    logo: '/brands/nike.png',
    descricao: 'Calçados e roupas esportivas de alta performance'
  },
  {
    id: 'adidas',
    nome: 'Adidas',
    logo: '/brands/adidas.png',
    descricao: 'Equipamentos esportivos e moda casual'
  },
  {
    id: 'puma',
    nome: 'Puma',
    logo: '/brands/puma.png',
    descricao: 'Calçados e vestuário esportivo'
  },
  {
    id: 'mizuno',
    nome: 'Mizuno',
    logo: '/brands/mizuno.png',
    descricao: 'Equipamentos para corrida e tênis'
  },
  {
    id: 'asics',
    nome: 'Asics',
    logo: '/brands/asics.png',
    descricao: 'Calçados para corrida e esportes'
  },
  {
    id: 'new-balance',
    nome: 'New Balance',
    logo: '/brands/new-balance.png',
    descricao: 'Tênis e roupas esportivas'
  }
];

export default function MarcasPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nossas Marcas</h1>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar para a página inicial</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {marcas.map((marca) => (
            <div
              key={marca.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="relative h-32 mb-4">
                <Image
                  src={marca.logo}
                  alt={marca.nome}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{marca.nome}</h2>
              <p className="text-gray-600 mb-4">{marca.descricao}</p>
              <Link
                href={`/produtos?marca=${marca.id}`}
                className="inline-block text-red-600 hover:text-red-700 font-medium"
              >
                Ver produtos →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 