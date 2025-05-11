"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../hooks/useAuth";
import { CartProvider } from "../hooks/useCart";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 