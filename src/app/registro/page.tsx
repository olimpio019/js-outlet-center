"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    const res = await fetch('/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      setErro(data.error);
      return;
    }
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center text-red-700 mb-2">Criar uma conta</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} required className="border rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-red-500 outline-none" />
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="border rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-red-500 outline-none" />
          <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required className="border rounded-lg px-4 py-3 text-black focus:ring-2 focus:ring-red-500 outline-none" />
          <button type="submit" disabled={loading} className="bg-red-600 text-white py-3 rounded-lg font-bold shadow hover:bg-red-700 transition disabled:opacity-60">Cadastrar</button>
        </form>
        {erro && <div className="text-red-600 text-sm text-center">{erro}</div>}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <button onClick={() => signIn('google')} className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 font-bold hover:bg-gray-100 transition">
          <FcGoogle size={22} /> Cadastrar com Google
        </button>
        <p className="text-center text-sm text-gray-600 mt-2">
          Já tem conta? <a href="/login" className="text-red-600 hover:underline font-bold">Entrar</a>
        </p>
      </div>
    </div>
  );
} 