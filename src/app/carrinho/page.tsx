"use client";
import { useCart } from '../../hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function CarrinhoPage() {
  const { items, total, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-6">Adicione produtos ao seu carrinho para continuar comprando</p>
            <Link 
              href="/produtos"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar para produtos</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Lista de produtos */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Seu Carrinho</h1>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border-b border-gray-100 last:border-0">
                    <div className="w-24 h-24 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-red-600 font-bold">R$ {item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Remover</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumo do pedido */}
          <div className="md:w-96">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-red-600">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Finalizar Compra
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 