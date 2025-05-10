'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
  brand: string;
  colors: string[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Tênis Nike Air Max',
    price: 200,
    discount: 20,
    image: '/products/nike tn dusk.jpeg',
    brand: 'Nike',
    colors: ['Preto', 'Branco', 'Vermelho'],
  },
  {
    id: '2',
    name: 'Camisa Adidas',
    price: 129.99,
    discount: 15,
    image: '/products/adidas-shirt.jpg',
    brand: 'Adidas',
    colors: ['Azul', 'Preto'],
  },
  {
    id: '3',
    name: 'Bola de Futebol',
    price: 89.99,
    image: '/products/soccer-ball.jpg',
    brand: 'Nike',
    colors: ['Branco', 'Preto'],
  },
  {
    id: '4',
    name: 'Tênis Puma',
    price: 399.99,
    discount: 25,
    image: '/products/puma-shoes.jpg',
    brand: 'Puma',
    colors: ['Preto', 'Branco'],
  },
];

export function FeaturedProducts() {
  const { addItem } = useCart();

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      precoPix: product.price * 0.95, // 5% de desconto no PIX
      image: product.image,
    });
    toast.success('Produto adicionado ao carrinho!');
  };

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Produtos em Destaque</h2>
          <Link href="/produtos" className="text-red-600 hover:text-red-700 font-semibold mt-2 md:mt-0">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/produto/${product.id}`}>
                <div className="relative h-48 md:h-72">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount && (
                    <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-red-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex space-x-1 md:space-x-2">
                      {product.colors.map((color) => (
                        <div
                          key={color}
                          className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <span className="text-xs md:text-sm text-gray-500">{product.brand}</span>
                    <div className="flex items-center">
                      <span className="text-base md:text-lg font-bold text-red-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {product.discount && (
                        <span className="ml-1 md:ml-2 text-xs md:text-sm text-gray-500 line-through">
                          R$ {(product.price / (1 - product.discount / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm md:text-lg mb-2 md:mb-4 line-clamp-2">{product.name}</h3>
                </div>
              </Link>
              <div className="px-3 md:px-6 pb-3 md:pb-6">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-red-600 text-white py-2 md:py-3 rounded-lg flex items-center justify-center space-x-1 md:space-x-2 hover:bg-red-700 transition-colors text-sm md:text-base"
                >
                  <ShoppingCart size={16} className="md:w-5 md:h-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 