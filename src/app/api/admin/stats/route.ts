import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar todas as estatísticas em paralelo
    const [
      totalProdutos,
      totalUsuarios,
      totalPedidos,
      receitaTotal,
      pedidosPendentes,
      produtosBaixoEstoque
    ] = await Promise.all([
      prisma.produto.count(),
      prisma.usuario.count(),
      prisma.pedido.count(),
      prisma.pedido.aggregate({
        where: { status: 'PAGO' },
        _sum: { total: true }
      }),
      prisma.pedido.count({
        where: { status: 'PENDENTE' }
      }),
      prisma.produto.count({
        where: { estoque: { lt: 5 } }
      })
    ]);

    return NextResponse.json({
      totalProdutos,
      totalUsuarios,
      totalPedidos,
      receitaTotal: receitaTotal._sum.total || 0,
      pedidosPendentes,
      produtosBaixoEstoque
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 