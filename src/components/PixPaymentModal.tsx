'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentCode: string;
  amount: number;
  qrCodeBase64: string;
  qrCodeText: string;
}

export function PixPaymentModal({
  isOpen,
  onClose,
  paymentCode,
  amount,
  qrCodeBase64,
  qrCodeText,
}: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(paymentCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pagamento via PIX</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-600 mb-2">Valor a pagar:</p>
          <p className="text-2xl font-bold text-red-600">
            R$ {Number(amount).toFixed(2)}
          </p>
          <div className="mt-4">
            {qrCodeBase64 ? (
              <Image
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code PIX"
                width={200}
                height={200}
                className="mx-auto"
              />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <p className="text-gray-500">Carregando QR Code...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Escaneie o QR Code acima ou copie o código PIX abaixo
          </p>

          <div className="relative">
            <div className="w-full p-3 pr-10 border rounded-lg text-sm bg-gray-50 break-all">
              {qrCodeText || 'Carregando código PIX...'}
            </div>
            <button
              onClick={handleCopyCode}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={!qrCodeText}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Após o pagamento, aguarde a confirmação automática. O processo pode levar alguns minutos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 