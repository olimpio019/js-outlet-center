"use client";
import CheckoutProgressBar from '../../components/CheckoutProgressBar';
import CheckoutSummary from '../../components/CheckoutSummary';
import { usePathname } from 'next/navigation';

const stepMap: Record<string, number> = {
  '/checkout': 0,
  '/checkout/entrega': 1,
  '/checkout/pagamento': 2,
  '/checkout/confirmacao': 3,
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStep = stepMap[pathname] ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutProgressBar currentStep={currentStep} />
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {children}
        </div>
        <div className="lg:col-span-1">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
} 