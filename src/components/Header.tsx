'use client';

import Link from 'next/link';
import { User, Search, Menu } from 'lucide-react';
import { Cart } from './Cart';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center w-10 h-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block py-4`}>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
              <Menu size={20} />
              <span>Categorias</span>
            </button>
            <Link href="/masculino" className="text-gray-600 hover:text-red-600">Masculino</Link>
            <Link href="/feminino" className="text-gray-600 hover:text-red-600">Feminino</Link>
            <Link href="/infantil" className="text-gray-600 hover:text-red-600">Infantil</Link>
            <Link href="/esportes" className="text-gray-600 hover:text-red-600">Esportes</Link>
            <Link href="/marcas" className="text-gray-600 hover:text-red-600">Marcas</Link>
            <Link href="/ofertas" className="text-red-600 font-bold">Ofertas</Link>
          </div>
        </nav>
      </div>
    </header>
  );
} 