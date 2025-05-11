"use client";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { apiPost } from "../lib/api";

interface User {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const u = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (token && u) {
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  async function login(email: string, senha: string) {
    setLoading(true);
    const result = await apiPost('/auth/login', { email, senha });
    if (result?.token && result?.usuario) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.usuario));
      setUser(result.usuario);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
