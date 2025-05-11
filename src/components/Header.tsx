'use client';

import Link from 'next/link';
import { User, Search } from 'lucide-react';
import { Cart } from './Cart';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl md:text-2xl font-bold text-red-600">
              JS Outlet Center
            </Link>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-64 md:w-96 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/perfil" className="p-2 rounded-full hover:bg-gray-100 transition" title="Perfil">
                <User size={20} className="text-red-600" />
              </Link>
              <Cart />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4">
          <div className="flex items-center space-x-6">
            <Link href="/produtos" className="text-gray-600 hover:text-red-600">Produtos</Link>
            <Link href="/marcas" className="text-gray-600 hover:text-red-600">Marcas</Link>
            <Link href="/ofertas" className="text-red-600 font-bold">Ofertas</Link>
          </div>
        </nav>
      </div>
    </header>
  );
} 