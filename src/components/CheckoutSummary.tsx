import { useCart } from '../hooks/useCart';
import Image from 'next/image';

export default function CheckoutSummary() {
  const { items, total } = useCart();

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
      <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
      <div className="space-y-4 mb-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 border-b pb-2 last:border-b-0">
            <Image src={item.image} alt={item.name} width={48} height={48} className="rounded" />
            <div className="flex-1">
              <div className="font-medium text-sm">{item.name}</div>
              <div className="text-xs text-gray-500">Qtd: {item.quantity}</div>
            </div>
            <div className="font-semibold text-sm">R$ {(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Subtotal</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>
      {/* Adicione descontos e frete se necessário */}
      <div className="flex justify-between text-base font-bold mt-2">
        <span>Total</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
} 