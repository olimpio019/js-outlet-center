"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, QrCode } from 'lucide-react';
import { paymentService } from '../../../services/paymentService';
import { PixPaymentModal } from '../../../components/PixPaymentModal';
import { useCart } from '../../../hooks/useCart';
import { toast } from 'react-hot-toast';

export default function PagamentoPage() {
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix');
  const [cartao, setCartao] = useState({ numero: '', nome: '', validade: '', cvv: '' });
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixData, setPixData] = useState<{ paymentCode: string; amount: number; qrCodeBase64: string; qrCodeText: string } | null>(null);
  const router = useRouter();
  const { total, items } = useCart();

  const MIN_PIX_VALUE = 1.49;

  function handleCartaoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCartao({ ...cartao, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (metodo === 'pix') {
      try {
        if (total < MIN_PIX_VALUE) {
          toast.error(`O valor mínimo para pagamento PIX é R$ ${MIN_PIX_VALUE.toFixed(2)}`);
          return;
        }

        const response = await paymentService.createPixPayment({
          amount: total,
          customer: {
            name: 'Cliente', // TODO: Pegar do formulário de entrega
            email: 'cliente@email.com', // TODO: Pegar do formulário de entrega
            cpf: '12345678901', // TODO: Pegar do formulário de entrega
            phone: '9999999999',
            address: {
              street: 'Rua Genérica',
              streetNumber: '123',
              complement: 'Complemento',
              zipCode: '00000000',
              neighborhood: 'Bairro',
              city: 'Cidade',
              state: 'SP',
              country: 'br',
            },
          },
          items: items.map(item => ({
            title: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            tangible: true,
          })),
          postbackUrl: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/pix/webhook` : 'http://localhost:3000/api/pix/webhook',
          pix: {
            expiresInDays: 2,
          },
          traceable: true,
        });

        console.log('Dados do pagamento PIX:', response);

        setPixData({
          paymentCode: response.qrCodeText,
          amount: response.amount,
          qrCodeBase64: response.qrCodeBase64,
          qrCodeText: response.qrCodeText
        });
        setIsPixModalOpen(true);
      } catch (error) {
        console.error('Erro ao gerar PIX:', error);
        // A mensagem de erro já será exibida pelo toast.error no paymentService
      }
    } else {
      try {
        const response = await paymentService.createCreditCardPayment({
          amount: total,
          customer: {
            name: 'Cliente', // Você pode pegar o nome do cliente do formulário de entrega
            email: 'cliente@email.com', // Você pode pegar o email do formulário de entrega
            cpf: '12345678901', // Você pode pegar o CPF do formulário de entrega
          },
          items: items.map(item => ({
            title: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            tangible: true,
          })),
          postbackUrl: `${process.env.NEXTAUTH_URL}/api/credit-card/webhook`,
        }, {
          number: cartao.numero,
          name: cartao.nome,
          expiry: cartao.validade,
          cvv: cartao.cvv,
        });

        if (response.status === 'success') {
          router.push('/checkout/confirmacao');
        } else {
          toast.error(response.message || 'Erro ao processar pagamento com cartão');
        }
      } catch (error) {
        console.error('Erro ao processar pagamento com cartão:', error);
        // A mensagem de erro já será exibida pelo toast.error no paymentService
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-red-700">Pagamento</h1>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <h2 className="font-semibold mb-4 text-lg">Selecione a forma de pagamento:</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <label className={`flex-1 border-2 rounded-xl p-5 cursor-pointer flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-lg ${metodo === 'pix' ? 'border-red-600 bg-red-50 scale-105 ring-2 ring-red-100' : 'border-gray-200 bg-white hover:border-red-300'}`}>
              <QrCode className="w-6 h-6 text-red-600" />
              <span className="font-bold text-base text-gray-900">Pix</span>
              <input type="radio" name="metodo" value="pix" checked={metodo === 'pix'} onChange={() => setMetodo('pix')} className="ml-auto accent-red-600" />
            </label>
            <label className={`flex-1 border-2 rounded-xl p-5 cursor-pointer flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-lg ${metodo === 'cartao' ? 'border-red-600 bg-red-50 scale-105 ring-2 ring-red-100' : 'border-gray-200 bg-white hover:border-red-300'}`}>
              <CreditCard className="w-6 h-6 text-red-600" />
              <span className="font-bold text-base text-gray-900">Cartão de Crédito</span>
              <input type="radio" name="metodo" value="cartao" checked={metodo === 'cartao'} onChange={() => setMetodo('cartao')} className="ml-auto accent-red-600" />
            </label>
          </div>
          {metodo === 'pix' && total < MIN_PIX_VALUE && (
            <p className="mt-4 text-red-600 text-sm">
              O valor mínimo para pagamento PIX é R$ {MIN_PIX_VALUE.toFixed(2)}. Adicione mais itens ao carrinho ou escolha outra forma de pagamento.
            </p>
          )}
        </div>
        {metodo === 'cartao' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Número do Cartão</label>
              <input name="numero" value={cartao.numero} onChange={handleCartaoChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Nome impresso no cartão</label>
              <input name="nome" value={cartao.nome} onChange={handleCartaoChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1 text-gray-700">Validade</label>
                <input name="validade" value={cartao.validade} onChange={handleCartaoChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" placeholder="MM/AA" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1 text-gray-700">CVV</label>
                <input name="cvv" value={cartao.cvv} onChange={handleCartaoChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition" />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-10">
          <button type="submit" className="bg-red-600 text-white px-12 py-3 rounded-xl text-lg font-extrabold shadow-lg hover:bg-red-700 hover:scale-105 transition-all duration-150">Finalizar compra</button>
        </div>
      </form>

      {pixData && (
        <PixPaymentModal
          isOpen={isPixModalOpen}
          onClose={() => setIsPixModalOpen(false)}
          paymentCode={pixData.paymentCode}
          amount={pixData.amount}
          qrCodeBase64={pixData.qrCodeBase64}
          qrCodeText={pixData.qrCodeText}
        />
      )}
    </div>
  );
} 