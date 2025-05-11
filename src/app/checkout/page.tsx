'use client';

import { useCart } from '../../hooks/useCart';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { paymentService } from '../../services/paymentService';
import { PixPaymentModal } from '../../components/PixPaymentModal';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, removeFromCart, updateQuantity } = useCart();
  const [cep, setCep] = useState('');
  const [cupom, setCupom] = useState('');
  const [frete, setFrete] = useState<number | null>(null);
  const [desconto, setDesconto] = useState<number>(0);
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
        <p className="text-gray-600 mb-6">Adicione produtos ao carrinho antes de finalizar a compra.</p>
        <a href="/" className="text-red-600 hover:text-red-700 font-medium">
          Voltar para a loja
        </a>
      </div>
    );
  }

  const handleCalcularFrete = () => {
    // Simulação de cálculo de frete
    setFrete(cep ? 19.90 : null);
  };

  const handleCupom = () => {
    // Simulação de cupom
    if (cupom.toLowerCase() === 'desconto10') setDesconto(10);
    else setDesconto(0);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Carrinho</h1>
      <div className="space-y-6 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-6 bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-lg transition-all">
            <Image src={item.image} alt={item.name} width={90} height={90} className="rounded-lg border" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base truncate mb-1">{item.name}</div>
              {/* Se quiser mostrar variações, adicione aqui */}
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-l bg-gray-100 border border-gray-300 text-lg hover:bg-gray-200 transition disabled:opacity-50" disabled={item.quantity <= 1}><Minus size={18} /></button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-r bg-gray-100 border border-gray-300 text-lg hover:bg-gray-200 transition"><Plus size={18} /></button>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-800 min-w-[90px] text-right">R$ {(item.price * item.quantity).toFixed(2)}</div>
            <button onClick={() => removeFromCart(item.id)} className="ml-4 p-2 rounded-full hover:bg-red-50 text-red-500 transition" title="Remover"><Trash2 size={20} /></button>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Calcule o frete</h2>
        <div className="flex gap-2 max-w-md">
          <input type="text" placeholder="Digite seu CEP" value={cep} onChange={e => setCep(e.target.value)} className="border border-gray-300 rounded-l px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none flex-1" />
          <button onClick={handleCalcularFrete} className="bg-red-600 text-white px-6 py-2 rounded-r font-semibold hover:bg-red-700 transition">Calcular</button>
        </div>
        {frete !== null && <div className="text-sm mt-2 text-gray-700">Frete: <span className="font-semibold">R$ {frete.toFixed(2)}</span></div>}
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Cupom de desconto</h2>
        <div className="flex gap-2 max-w-md">
          <input type="text" placeholder="Digite o cupom" value={cupom} onChange={e => setCupom(e.target.value)} className="border border-gray-300 rounded-l px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none flex-1" />
          <button onClick={handleCupom} className="bg-gray-400 text-white px-6 py-2 rounded-r font-semibold hover:bg-gray-500 transition">Adicionar</button>
        </div>
        {desconto > 0 && <div className="text-sm mt-2 text-green-600">Cupom aplicado: <span className="font-semibold">-R$ {desconto.toFixed(2)}</span></div>}
      </div>
      <div className="flex justify-end mt-10">
        <button onClick={() => router.push('/checkout/entrega')} className="bg-red-600 text-white px-10 py-3 rounded-lg text-lg font-bold shadow hover:bg-red-700 transition">Continuar</button>
      </div>
    </div>
  );
} 