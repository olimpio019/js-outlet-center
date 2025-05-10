"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, CalendarCheck2, Store } from 'lucide-react';

const opcoesEntrega = [
  { id: 'normal', label: 'Normal', descricao: '2 a 3 dias úteis', valor: 'Grátis', icon: <Truck className="w-6 h-6 mr-2 text-red-600" /> },
  { id: 'agendada', label: 'Entrega Agendada', descricao: 'Escolha a data', valor: 'Grátis', icon: <CalendarCheck2 className="w-6 h-6 mr-2 text-red-600" /> },
  { id: 'retira', label: 'Retire na Loja', descricao: 'Confira a loja mais próxima', valor: 'Grátis', icon: <Store className="w-6 h-6 mr-2 text-red-600" /> },
];

export default function EntregaPage() {
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', cpf: '', cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: ''
  });
  const [entrega, setEntrega] = useState('normal');
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aqui você pode salvar os dados no contexto ou localStorage
    router.push('/checkout/pagamento');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold mb-10 text-red-700 tracking-tight">Endereço de Entrega</h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Nome Completo</label>
              <input name="nome" value={form.nome || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">E-mail</label>
              <input name="email" type="email" value={form.email || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Telefone</label>
              <input name="telefone" value={form.telefone || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">CPF</label>
              <input name="cpf" value={form.cpf || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">CEP</label>
              <input name="cep" value={form.cep || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Endereço</label>
              <input name="endereco" value={form.endereco || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Número</label>
              <input name="numero" value={form.numero || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Complemento</label>
              <input name="complemento" value={form.complemento || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Bairro</label>
              <input name="bairro" value={form.bairro || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Cidade</label>
              <input name="cidade" value={form.cidade || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Estado</label>
              <input name="estado" value={form.estado || ''} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-black" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-4 text-gray-800">Como quer receber seu pedido?</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {opcoesEntrega.map(opt => (
                <label key={opt.id} className={`flex-1 border-2 rounded-xl p-5 cursor-pointer flex flex-row items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-lg ${entrega === opt.id ? 'border-red-600 bg-red-50 scale-105 ring-2 ring-red-100' : 'border-gray-200 bg-white hover:border-red-300'}`}>
                  {opt.icon}
                  <div className="flex flex-col">
                    <span className="font-bold text-base text-gray-900">{opt.label}</span>
                    <span className="text-sm text-gray-500">{opt.descricao}</span>
                    <span className="text-xs text-gray-700 mt-1">{opt.valor}</span>
                  </div>
                  <input type="radio" name="entrega" value={opt.id} checked={entrega === opt.id} onChange={() => setEntrega(opt.id)} className="ml-auto accent-red-600" />
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-10">
            <button type="submit" className="bg-red-600 text-white px-12 py-3 rounded-xl text-lg font-extrabold shadow-lg hover:bg-red-700 hover:scale-105 transition-all duration-150">Ir para pagamento</button>
          </div>
        </form>
      </div>
    </div>
  );
} 