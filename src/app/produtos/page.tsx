"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  precoPix: number;
  imagem: string;
  descricao: string;
  vendedor: string;
  estoque: number;
  avaliacoes: number;
  nota: string;
  tamanhos: string[];
  categoria: string;
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        const data = await response.json();
        setProdutos(data);
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente mais tarde.');
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Nossos Produtos</h1>
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para a página inicial
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <Link
            key={produto.id}
            href={`/produtos/${produto.id}`}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
              <Image
                src={produto.imagem}
                alt={produto.nome}
                width={300}
                height={300}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{produto.nome}</h2>
              
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number(produto.nota))
                          ? 'fill-current'
                          : ''
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  ({produto.avaliacoes})
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">
                  R$ {produto.preco.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  ou R$ {produto.precoPix.toFixed(2)} no PIX
                </p>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Vendido por {produto.vendedor}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 