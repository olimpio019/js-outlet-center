import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Converter preços para número e adicionar campos necessários para a exibição
    const produtosFormatados = produtos.map(produto => ({
      id: produto.id.toString(),
      nome: produto.nome,
      preco: Number(produto.preco),
      precoPix: Number(produto.preco) * 0.9, // 10% de desconto no PIX
      imagem: produto.imagemUrl,
      descricao: produto.descricao,
      vendedor: 'Loja Oficial',
      estoque: produto.estoque,
      avaliacoes: Math.floor(Math.random() * 500), // Mock de avaliações
      nota: (Math.random() * 1 + 4).toFixed(1), // Mock de nota entre 4 e 5
      tamanhos: ['P', 'M', 'G', 'GG'], // Mock de tamanhos
      categoria: produto.categoria.nome,
    }));

    return NextResponse.json(produtosFormatados);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 