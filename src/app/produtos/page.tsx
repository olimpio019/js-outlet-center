import { Suspense } from "react";
import { ProdutosList } from "../../components/ProdutosList";

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando produtos...</div>}>
      <ProdutosList />
    </Suspense>
  );
} 