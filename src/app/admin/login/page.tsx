"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password: senha,
      });

      if (!res?.ok) {
        throw new Error('E-mail ou senha inválidos');
      }

      // Após login, checa se é admin via API
      const userRes = await fetch('/api/admin/check');
      if (!userRes.ok) {
        throw new Error('Erro ao verificar status de admin');
      }

      const userData = await userRes.json();
      if (userData.admin) {
        router.push('/admin');
      } else {
        setErro('Acesso restrito: você não é administrador.');
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">Login Admin</h1>
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erro}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-bold shadow hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
} 