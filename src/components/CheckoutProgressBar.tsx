import React from 'react';
import { ShoppingCart, Truck, CreditCard, CheckCircle2 } from 'lucide-react';

const steps = [
  { label: 'Carrinho', icon: <ShoppingCart className="w-5 h-5" /> },
  { label: 'Entrega', icon: <Truck className="w-5 h-5" /> },
  { label: 'Pagamento', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'Confirmação', icon: <CheckCircle2 className="w-5 h-5" /> },
];

interface Props {
  currentStep?: number; // 0 a 3
}

export default function CheckoutProgressBar({ currentStep = 0 }: Props) {
  return (
    <div className="w-full bg-white shadow-sm py-6 px-2 mb-8">
      <div className="flex items-center justify-center gap-0 md:gap-4 overflow-x-auto">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center min-w-[80px] group relative">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${idx < currentStep ? 'border-green-500 bg-gradient-to-br from-green-200 to-green-400 text-green-700 shadow-md' : ''}
                  ${idx === currentStep ? 'border-red-600 bg-red-50 text-red-600 shadow-xl scale-110 ring-2 ring-red-200 animate-pulse' : ''}
                  ${idx > currentStep ? 'border-gray-300 bg-white text-gray-400' : ''}
                `}
                style={{ boxShadow: idx === currentStep ? '0 0 12px 2px #f87171' : undefined }}
              >
                {step.icon}
              </div>
              <span className={`text-xs mt-2 font-semibold transition-colors duration-200 ${idx === currentStep ? 'text-red-700' : idx < currentStep ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</span>
              {/* Tooltip */}
              <span className="absolute left-1/2 -translate-x-1/2 top-14 z-10 opacity-0 group-hover:opacity-100 pointer-events-none bg-black text-white text-xs rounded px-2 py-1 transition-opacity duration-200 whitespace-nowrap shadow-lg">
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="relative flex-1 flex items-center mx-1 md:mx-2 min-w-[24px] h-1">
                {/* Linha de fundo */}
                <div className="absolute w-full h-1 rounded bg-gray-200" />
                {/* Linha de progresso animada */}
                <div
                  className={`absolute h-1 rounded transition-all duration-500
                    ${idx < currentStep ? 'bg-gradient-to-r from-green-400 to-green-600' : idx === currentStep ? 'bg-gradient-to-r from-red-300 to-red-500' : 'bg-gray-200'}`}
                  style={{ width: idx < currentStep ? '100%' : idx === currentStep ? '60%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 