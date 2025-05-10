"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { createContext, useContext } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  precoPix: number;
  image: string;
  size?: string;
  quantity: number;
}

interface CartStore {
  items: Product[];
  addItem: (data: Omit<Product, 'quantity'>) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (data: Omit<Product, 'quantity'>) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast('Item já está no carrinho');
        }

        const newItems = [...get().items, { ...data, quantity: 1 }];
        set({ 
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
        toast.success('Item adicionado ao carrinho');
      },
      removeItem: (id: string) => {
        const newItems = get().items.filter((item) => item.id !== id);
        set({ 
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
        toast.success('Item removido do carrinho');
      },
      removeAll: () => set({ items: [], total: 0 }),
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        const updatedItems = currentItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        set({ 
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

const CartContext = createContext<CartStore | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCartStore();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 