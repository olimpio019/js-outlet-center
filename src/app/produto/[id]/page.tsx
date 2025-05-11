"use client";
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProdutoSingularRedirect() {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      router.replace(`/produtos/${id}`);
    }
  }, [id, router]);

  return null;
} 