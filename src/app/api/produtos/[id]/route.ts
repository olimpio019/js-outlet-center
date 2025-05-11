import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID do produto inválido' },
        { status: 400 }
      );
    }

    const produto = await prisma.produto.findUnique({
      where: {
        id: id,
      },
      include: {
        categoria: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Converter preços para número e adicionar campos necessários para a exibição
    const produtoFormatado = {
      id: produto.id.toString(),
      name: produto.nome,
      price: Number(produto.preco),
      precoPix: Number(produto.preco) * 0.9, // 10% de desconto no PIX
      image: produto.imagemUrl,
      description: produto.descricao,
      seller: 'Loja Oficial',
      sizes: ['P', 'M', 'G', 'GG'], // Mock de tamanhos
      categoria: produto.categoria,
    };

    return NextResponse.json(produtoFormatado);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 