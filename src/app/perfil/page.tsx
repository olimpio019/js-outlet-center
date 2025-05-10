"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => setIsAdmin(!!data.admin));
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 items-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-3xl font-bold text-red-600 mb-4">
          {session.user?.name?.[0]}
        </div>
        <h1 className="text-2xl font-bold text-red-700 mb-2">Olá, {session.user?.name || 'Usuário'}!</h1>
        <div className="text-gray-700 text-center">{session.user?.email}</div>
        <div className="flex flex-col gap-4 w-full">
          {isAdmin && (
            <Link href="/admin" className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition text-center">
              Acessar painel admin
            </Link>
          )}
          <Link
            href="/api/auth/signout"
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 